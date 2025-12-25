module.exports = {

"[project]/src/components/TextEditor/TextEditor.jsx [app-ssr] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__ }) => (() => {
"use strict";

__turbopack_esm__({
    "default": ()=>__TURBOPACK__default__export__
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/server/future/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$aws$2d$s3$2f$dist$2f$react$2d$aws$2d$s3$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/react-aws-s3/dist/react-aws-s3.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uid$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/uid/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$quill$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/react-quill/lib/index.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$quill$2d$image$2d$resize$2d$module$2d$react$2f$image$2d$resize$2e$min$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/quill-image-resize-module-react/image-resize.min.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/server/future/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$until$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/src/until/index.js [app-ssr] (ecmascript)");
"__TURBOPACK__ecmascript__hoisting__location__";
"use client";
;
;
;
;
;
;
;
;
;
__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$quill$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Quill"].register("modules/imageResize", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$quill$2d$image$2d$resize$2d$module$2d$react$2f$image$2d$resize$2e$min$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]);
var Size = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$quill$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Quill"].import("attributors/style/size");
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
    "24px"
];
__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$quill$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Quill"].register(Size, true);
function TextEditor(props) {
    // console.log(quillRef, "quillRef");
    const QID = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uid$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["uid"])();
    const ReactS3Client = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$aws$2d$s3$2f$dist$2f$react$2d$aws$2d$s3$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"](__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$until$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["config"]);
    const newFileName = QID;
    const ImageUpload = (formData)=>{
        var url = ReactS3Client.uploadFile(formData, newFileName).then((data)=>{
            return data.location;
        });
        return url;
    };
    const hideImage = ()=>{
        quillRef.current.setOptions({
            showImageOptions: false
        });
    };
    const imageHandler = (e)=>{
        const editor = quillRef.current.getEditor();
        console.log(editor, "editor");
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/*");
        input.click();
        input.onchange = async ()=>{
            const file = input.files[0];
            if (/^image\//.test(file.type)) {
                // console.log(file);
                const res = await ImageUpload(input.files[0]); // upload data into server or aws or cloudinary
                // console.log(res, "res");
                editor.insertEmbed(editor.getSelection(), "image", res);
            }
        };
    };
    const modules = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>({
            // uploader: {
            //   // insertImageAsBase64URI: imageHandler,
            //   url: "none",
            // },
            toolbar: {
                container: [
                    [
                        {
                            header: [
                                1,
                                2,
                                3,
                                4,
                                5,
                                6,
                                false
                            ]
                        }
                    ],
                    [
                        "bold",
                        "italic",
                        "underline",
                        "strike"
                    ],
                    [
                        {
                            size: Size.whitelist
                        }
                    ],
                    [
                        {
                            list: "ordered"
                        },
                        {
                            list: "bullet"
                        },
                        {
                            indent: "-1"
                        },
                        {
                            indent: "+1"
                        }
                    ],
                    [
                        "link"
                    ],
                    [
                        {
                            color: []
                        },
                        {
                            background: []
                        }
                    ],
                    [
                        {
                            font: []
                        }
                    ],
                    [
                        {
                            align: []
                        }
                    ]
                ],
                handlers: {
                    image: imageHandler
                }
            },
            imageResize: {
                parchment: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$quill$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Quill"].import("parchment"),
                modules: [
                    "Resize",
                    "DisplaySize"
                ]
            }
        }), []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$future$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$quill$2f$lib$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
            theme: "snow",
            className: `textarea-control border-0 p-0  ${props.disabled ? "hideTopBar" : "shadow"}`,
            style: {
                color: "black"
            },
            ref: props.ref,
            modules: modules,
            value: props.value,
            onBlur: props.onBlur,
            onChange: (content, delta, source, editor)=>{
                props.formik.setFieldValue(props.name, content);
            },
            readOnly: props.disabled && props.disabled
        }, void 0, false, {
            fileName: "[project]/src/components/TextEditor/TextEditor.jsx",
            lineNumber: 104,
            columnNumber: 7
        }, this)
    }, void 0, false);
}
const __TURBOPACK__default__export__ = TextEditor;

})()),

};

//# sourceMappingURL=src_components_TextEditor_TextEditor_jsx_a18173._.js.map