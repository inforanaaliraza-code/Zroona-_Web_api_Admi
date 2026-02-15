"use client";
import { useMemo, useRef, useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import S3 from "react-aws-s3";
import { uid } from "uid";
import { config } from "@/until";
import "react-quill/dist/quill.snow.css";
import "./style.css";

// Dynamic import ReactQuill to prevent findDOMNode error in React 19
const ReactQuill = dynamic(
  () => import("react-quill"),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-[200px] bg-gray-50 flex items-center justify-center text-gray-400">
        Loading editor...
      </div>
    ),
  }
);

// Store Quill class outside component to avoid re-initialization issues
let quillInitialized = false;

const initQuillModules = async () => {
  if (typeof window === "undefined" || quillInitialized) return;
  
  try {
    const quillModule = await import("react-quill");
    const QuillClass = quillModule.Quill || quillModule.default?.Quill;
    
    if (QuillClass) {
      // Register ImageResize
      try {
        const imageResizeModule = await import("quill-image-resize-module-react");
        QuillClass.register("modules/imageResize", imageResizeModule.default);
      } catch (e) {
        console.warn("ImageResize not available");
      }
      
      // Register custom sizes
      const SizeAttr = QuillClass.import("attributors/style/size");
      SizeAttr.whitelist = [
        "10px", "11px", "12px", "13px", "14px", "16px",
        "18px", "20px", "22px", "24px",
      ];
      QuillClass.register(SizeAttr, true);
      
      quillInitialized = true;
    }
  } catch (e) {
    console.error("Error initializing Quill:", e);
  }
};

function TextEditorAr(props) {
  const quillRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  const QID = useRef(uid()).current;
  const ReactS3Client = useRef(new S3(config)).current;

  // Initialize Quill modules on client side only
  useEffect(() => {
    initQuillModules().then(() => setIsReady(true));
  }, []);

  const ImageUpload = useCallback((formData) => {
    return ReactS3Client.uploadFile(formData, QID).then((data) => data.location);
  }, [ReactS3Client, QID]);

  const imageHandler = useCallback(() => {
    if (!quillRef.current) return;
    const editor = quillRef.current.getEditor();
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (/^image\//.test(file.type)) {
        const res = await ImageUpload(file);
        editor.insertEmbed(editor.getSelection(), "image", res);
      }
    };
  }, [ImageUpload]);

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ size: ["10px", "11px", "12px", "13px", "14px", "16px", "18px", "20px", "22px", "24px"] }],
          [
            { list: "ordered" },
            { list: "bullet" },
            { indent: "-1" },
            { indent: "+1" },
          ],
          ["link"],
          [{ color: [] }, { background: [] }],
          [{ font: [] }],
          [{ align: [] }],
        ],
        handlers: {
          image: imageHandler,
        },
      },
    }),
    [imageHandler]
  );

  if (!isReady) {
    return (
      <div className="min-h-[200px] bg-gray-50 flex items-center justify-center text-gray-400">
        Loading editor...
      </div>
    );
  }

  return (
    <ReactQuill
      theme="snow"
      className={`textarea-control border-0 p-0 ${
        props.disabled ? "hideTopBar" : "shadow"
      }`}
      style={{ color: "black" }}
      ref={quillRef}
      modules={modules}
      value={props.value}
      onBlur={props.onBlur}
      onChange={(content_ar) => {
        props.formik.setFieldValue(props.name, content_ar);
      }}
      readOnly={props.disabled}
    />
  );
}

export default TextEditorAr;
