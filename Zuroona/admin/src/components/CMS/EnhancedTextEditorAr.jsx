"use client";
import { useMemo, useRef, memo, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import S3 from "react-aws-s3";
import { uid } from "uid";
import { config } from "@/until";
import { Icon } from "@iconify/react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import "../TextEditor/style.css";
import ImageResize from "quill-image-resize-module-react";

Quill.register("modules/imageResize", ImageResize);

var Size = Quill.import("attributors/style/size");
Size.whitelist = [
  "10px", "11px", "12px", "13px", "14px", "16px", "18px", "20px", "22px", "24px", "28px", "32px", "36px", "48px"
];
Quill.register(Size, true);

const EnhancedTextEditorAr = memo(function EnhancedTextEditorAr(props) {
  const quillRef = useRef(null);
  const [mode, setMode] = useState("visual"); // "visual" or "code"
  const [showPreview, setShowPreview] = useState(false);
  const [htmlCode, setHtmlCode] = useState("");

  const QID = uid();
  const ReactS3Client = new S3(config);
  const newFileName = QID;

  useEffect(() => {
    if (props.value) {
      setHtmlCode(props.value);
    }
  }, [props.value]);

  const ImageUpload = (formData) => {
    var url = ReactS3Client.uploadFile(formData, newFileName).then((data) => {
      return data.location;
    });
    return url;
  };

  const imageHandler = (e) => {
    const editor = quillRef.current.getEditor();
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (/^image\//.test(file.type)) {
        const res = await ImageUpload(input.files[0]);
        editor.insertEmbed(editor.getSelection(), "image", res);
      }
    };
  };

  const handleModeChange = (newMode) => {
    if (newMode === "code" && mode === "visual") {
      // Switch to code mode - get HTML from Quill
      const editor = quillRef.current?.getEditor();
      if (editor) {
        const html = editor.root.innerHTML;
        setHtmlCode(html);
      }
    } else if (newMode === "visual" && mode === "code") {
      // Switch to visual mode - set HTML to Quill
      props.formik.setFieldValue(props.name, htmlCode);
    }
    setMode(newMode);
    setShowPreview(false);
  };

  const handleCodeChange = (e) => {
    const newCode = e.target.value;
    setHtmlCode(newCode);
    props.formik.setFieldValue(props.name, newCode);
  };

  const togglePreview = () => {
    if (mode === "code") {
      // Update formik value before preview
      props.formik.setFieldValue(props.name, htmlCode);
    }
    setShowPreview(!showPreview);
  };

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          [{ font: [] }],
          [{ size: Size.whitelist }],
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
      imageResize: {
        parchment: Quill.import("parchment"),
        modules: ["Resize", "DisplaySize", "Toolbar"],
      },
      clipboard: {
        matchVisual: false,
      },
    }),
    []
  );

  const formats = [
    "header", "font", "size",
    "bold", "italic", "underline", "strike", "blockquote",
    "list", "bullet", "indent",
    "script",
    "color", "background",
    "align",
    "link", "image", "video",
    "code-block"
  ];

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
            <Icon icon="lucide:type" className="inline mr-1" />
            Visual
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
            <Icon icon="lucide:code" className="inline mr-1" />
            HTML Code
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
            <Icon icon={showPreview ? "lucide:edit" : "lucide:eye"} className="inline mr-1" />
            {showPreview ? "Edit" : "Preview"}
          </button>
        </div>
        <div className="text-xs text-gray-500">
          {mode === "visual" ? "Visual Editor (Arabic)" : "HTML Code Editor (Arabic)"}
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
            onChange={(content_ar, delta, source, editor) => {
              props.formik.setFieldValue(props.name, content_ar);
            }}
            readOnly={props.disabled && props.disabled}
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

