"use client";
import { useMemo, useRef, memo, useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import S3 from "react-aws-s3";
import { uid } from "uid";
import { config } from "@/until";
import { Icon } from "@iconify/react";
import { useTranslation } from "react-i18next";
import "react-quill/dist/quill.snow.css";
import "../TextEditor/style.css";

// Dynamic import ReactQuill to prevent findDOMNode error in React 19
const ReactQuill = dynamic(
  () => import("react-quill"),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-[400px] bg-gray-50 flex items-center justify-center text-gray-400">
        Loading editor...
      </div>
    ),
  }
);

// Store Quill class outside component to avoid re-initialization issues
let QuillClass = null;
let quillInitialized = false;

const initQuillModules = async () => {
  if (typeof window === "undefined" || quillInitialized) return;
  
  try {
    const quillModule = await import("react-quill");
    QuillClass = quillModule.Quill || quillModule.default?.Quill;
    
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
        "18px", "20px", "22px", "24px", "28px", "32px", "36px", "48px"
      ];
      QuillClass.register(SizeAttr, true);
      
      quillInitialized = true;
    }
  } catch (e) {
    console.error("Error initializing Quill:", e);
  }
};

const EnhancedTextEditorAr = memo(function EnhancedTextEditorAr(props) {
  const { t } = useTranslation();
  const quillRef = useRef(null);
  const [mode, setMode] = useState("visual");
  const [showPreview, setShowPreview] = useState(false);
  const [htmlCode, setHtmlCode] = useState("");
  const [isReady, setIsReady] = useState(false);

  const QID = useRef(uid()).current;
  const ReactS3Client = useRef(new S3(config)).current;

  // Initialize Quill modules on client side only
  useEffect(() => {
    initQuillModules().then(() => setIsReady(true));
  }, []);

  useEffect(() => {
    if (props.value) {
      setHtmlCode(props.value);
    }
  }, [props.value]);

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

  const handleModeChange = useCallback((newMode) => {
    if (newMode === "code" && mode === "visual") {
      const editor = quillRef.current?.getEditor();
      if (editor) {
        const html = editor.root.innerHTML;
        setHtmlCode(html);
      }
    } else if (newMode === "visual" && mode === "code") {
      props.formik.setFieldValue(props.name, htmlCode);
    }
    setMode(newMode);
    setShowPreview(false);
  }, [mode, htmlCode, props.formik, props.name]);

  const handleCodeChange = useCallback((e) => {
    const newCode = e.target.value;
    setHtmlCode(newCode);
    props.formik.setFieldValue(props.name, newCode);
  }, [props.formik, props.name]);

  const togglePreview = useCallback(() => {
    if (mode === "code") {
      props.formik.setFieldValue(props.name, htmlCode);
    }
    setShowPreview(prev => !prev);
  }, [mode, htmlCode, props.formik, props.name]);

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          [{ font: [] }],
          [{ size: ["10px", "11px", "12px", "13px", "14px", "16px", "18px", "20px", "22px", "24px", "28px", "32px", "36px", "48px"] }],
          ["bold", "italic", "underline", "strike", "blockquote"],
          [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
          [{ script: "sub" }, { script: "super" }],
          [{ color: [] }, { background: [] }],
          [{ align: [] }],
          ["link", "image", "video"],
          ["clean"],
        ],
        handlers: {
          image: imageHandler,
        },
      },
      clipboard: {
        matchVisual: false,
      },
    }),
    [imageHandler]
  );

  const formats = useMemo(() => [
    "header", "font", "size",
    "bold", "italic", "underline", "strike", "blockquote",
    "list", "bullet", "indent",
    "script",
    "color", "background",
    "align",
    "link", "image", "video",
    "code-block"
  ], []);

  return (
    <div className="w-full border border-gray-300 rounded-lg overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="flex items-center justify-between bg-gray-50 border-b border-gray-300 px-4 py-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleModeChange("visual")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              mode === "visual"
                ? "bg-[#a3cc69] text-white shadow-md"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Icon icon="lucide:type" className="inline ml-1" />
            {t("cms.visual")}
          </button>
          <button
            type="button"
            onClick={() => handleModeChange("code")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              mode === "code"
                ? "bg-[#a3cc69] text-white shadow-md"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Icon icon="lucide:code" className="inline ml-1" />
            {t("cms.htmlCode")}
          </button>
          <button
            type="button"
            onClick={togglePreview}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              showPreview
                ? "bg-[#a797cc] text-white shadow-md"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Icon icon={showPreview ? "lucide:edit" : "lucide:eye"} className="inline ml-1" />
            {showPreview ? t("cms.edit") : t("cms.preview")}
          </button>
        </div>
        <div className="text-xs text-gray-500">
          {mode === "visual" ? t("cms.visualEditor") : t("cms.codeEditor")}
        </div>
      </div>

      {/* Editor Content */}
      <div className="relative">
        {showPreview ? (
          <div className="min-h-[400px] p-6 bg-white overflow-auto" dir="rtl">
            <div
              className="prose prose-lg max-w-none cms-preview-content"
              dangerouslySetInnerHTML={{
                __html: mode === "code" ? htmlCode : props.value || "",
              }}
              style={{
                fontFamily: "inherit",
                direction: "rtl",
                textAlign: "right",
              }}
            />
          </div>
        ) : mode === "code" ? (
          <div className="relative">
            <textarea
              value={htmlCode}
              onChange={handleCodeChange}
              onBlur={props.onBlur}
              className="w-full min-h-[400px] p-4 font-mono text-sm border-0 focus:outline-none focus:ring-0 resize-none"
              placeholder="Enter HTML code here..."
              dir="rtl"
              style={{
                fontFamily: "'Courier New', monospace",
                lineHeight: "1.6",
                direction: "rtl",
                textAlign: "right",
              }}
            />
            <div className="absolute bottom-2 right-2 text-xs text-gray-400 bg-white px-2 py-1 rounded">
              {htmlCode.length} characters
            </div>
          </div>
        ) : !isReady ? (
          <div className="min-h-[400px] bg-gray-50 flex items-center justify-center text-gray-400">
            Loading editor...
          </div>
        ) : (
          <ReactQuill
            theme="snow"
            className={`textarea-control border-0 p-0 ${
              props.disabled ? "hideTopBar" : "shadow"
            }`}
            style={{ color: "black" }}
            ref={quillRef}
            modules={modules}
            formats={formats}
            value={props.value}
            onBlur={props.onBlur}
            onChange={(content_ar) => {
              props.formik.setFieldValue(props.name, content_ar);
            }}
            readOnly={props.disabled}
          />
        )}
      </div>

      {/* Help Text */}
      {mode === "code" && !showPreview && (
        <div className="bg-blue-50 border-t border-blue-200 px-4 py-2 text-xs text-blue-700" dir="rtl">
          <Icon icon="lucide:info" className="inline mr-1" />
          <strong>وضع كود HTML:</strong> قم بتحرير HTML مباشرة. يتم حفظ التغييرات تلقائياً.
        </div>
      )}
    </div>
  );
});

EnhancedTextEditorAr.displayName = 'EnhancedTextEditorAr';

export default EnhancedTextEditorAr;
