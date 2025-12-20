"use client";
import S3 from "react-aws-s3";
import { uid } from "uid";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./style.css";
import ImageResize from "quill-image-resize-module-react";
import { useMemo, useRef } from "react";
import { config } from "@/until";

Quill.register("modules/imageResize", ImageResize);

var Size = Quill.import("attributors/style/size");
Size.whitelist = [
  "10px",
  "11px",
  "12px",
  "13px",
  "14px",
  "16px",
  "18px",
  "20px",
  "22px",
  "24px",
];
Quill.register(Size, true);

function TextEditorAr(props) {
  // console.log(quillRef, "quillRef");

  const QID = uid();

  const ReactS3Client = new S3(config);

  const newFileName = QID;

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
          [{ size: Size.whitelist }],
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
        parchment: Quill.import("parchment"),
        modules: ["Resize", "DisplaySize"],
      },
    }),
    []
  );

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
        onChange={(content_ar, delta, source, editor) => {
          props.formik.setFieldValue(props.name, content_ar);
        }}
        readOnly={props.disabled && props.disabled}
      />
    </>
  );
}
export default TextEditorAr;
