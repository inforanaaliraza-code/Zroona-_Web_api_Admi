"use client";
import { useMemo, useRef, memo, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import S3 from "react-aws-s3";
import { uid } from "uid";
import { config } from "@/until";

// Dynamically import ReactQuill to reduce initial bundle
const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
  loading: () => <div className="h-32 bg-gray-100 rounded animate-pulse" />
});

// Import CSS normally (Next.js handles CSS imports)
import "react-quill/dist/quill.snow.css";
import "./style.css";

// Lazy register Quill modules
let quillInitialized = false;
let QuillInstance = null;
let SizeInstance = null;

const initializeQuill = async () => {
  if (typeof window !== "undefined" && !quillInitialized) {
    const [{ Quill }, ImageResize] = await Promise.all([
      import("react-quill").then(mod => ({ Quill: mod.Quill || mod.default?.Quill })),
      import("quill-image-resize-module-react")
    ]);
    
    if (Quill) {
      QuillInstance = Quill;
      Quill.register("modules/imageResize", ImageResize.default || ImageResize);
      
      SizeInstance = Quill.import("attributors/style/size");
      SizeInstance.whitelist = ["10px", "11px", "12px", "13px", "14px", "16px", "18px", "20px", "22px", "24px"];
      Quill.register(SizeInstance, true);
      
      quillInitialized = true;
    }
  }
};

const TextEditor = memo(function TextEditor(props) {
  const quillRef = useRef(null);
  const [quillReady, setQuillReady] = useState(false);
  const QID = useMemo(() => uid(), []);
  
  const ReactS3Client = useMemo(() => new S3(config), []);
  const newFileName = QID;

  useEffect(() => {
    initializeQuill().then(() => setQuillReady(true));
  }, []);

  const ImageUpload = (formData) => {
    var url = ReactS3Client.uploadFile(formData, newFileName).then((data) => {
      return data.location;
    });
    return url;
  };

  const hideImage = () => {
    quillRef.current.setOptions({ showImageOptions: false });
  };

  const imageHandler = (e) => {
    const editor = quillRef.current.getEditor();
    console.log(editor, "editor");
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (/^image\//.test(file.type)) {
        // console.log(file);

        const res = await ImageUpload(input.files[0]); // upload data into server or aws or cloudinary

        // console.log(res, "res");
        editor.insertEmbed(editor.getSelection(), "image", res);
      }
    };
  };
  const modules = useMemo(
    () => ({
      // uploader: {
      //   // insertImageAsBase64URI: imageHandler,
      //   url: "none",
      // },
      toolbar: {
        container: [
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ size: SizeInstance?.whitelist || ["10px", "11px", "12px", "13px", "14px", "16px", "18px", "20px", "22px", "24px"] }],
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
      imageResize: {
        parchment: QuillInstance?.import("parchment"),
        modules: ["Resize", "DisplaySize"],
      },
    }),
    []
  );

  if (!quillReady) {
    return <div className="h-32 bg-gray-100 rounded animate-pulse" />;
  }

  return (
    <>
      <ReactQuill
        theme="snow"
        className={`textarea-control border-0 p-0  ${
          props.disabled ? "hideTopBar" : "shadow"
        }`}
        style={{ color: "black" }}
        ref={props.ref}
        modules={modules}
        value={props.value}
        onBlur={props.onBlur}
        onChange={(content, delta, source, editor) => {
          props.formik.setFieldValue(props.name, content);
        }}
        readOnly={props.disabled && props.disabled}
      />
    </>
  );
});

TextEditor.displayName = 'TextEditor';

export default TextEditor;
