(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["static/chunks/src_0bcd31._.js", {

"[project]/src/until/index.js [app-client] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, k: __turbopack_refresh__ }) => (() => {
"use strict";

__turbopack_esm__({
    "BASE_API_URL": ()=>BASE_API_URL,
    "FiveSlideSettings": ()=>FiveSlideSettings,
    "FourSlideSettings": ()=>FourSlideSettings,
    "SingleSlideSettings": ()=>SingleSlideSettings,
    "TOKEN_NAME": ()=>TOKEN_NAME,
    "ThreeSlideSettings": ()=>ThreeSlideSettings,
    "TwoSlideSettings": ()=>TwoSlideSettings,
    "config": ()=>config,
    "mapApiKey": ()=>mapApiKey,
    "menuGroups": ()=>menuGroups
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
"__TURBOPACK__ecmascript__hoisting__location__";
const mapApiKey = "gersgfeshhtbg";
const config = {
    bucketName: "appsinvo-staging-ys",
    region: "us-west-1",
    accessKeyId: "AKIAVMOPKAV4RPMGAK5M",
    secretAccessKey: "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",
    s3Url: "https://s3.us-west-1.amazonaws.com/appsinvo-staging-ys",
    dirName: "Zuroona"
};
const BASE_API_URL = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_API_BASE || (("TURBOPACK compile-time truthy", 1) ? "http://localhost:3434/api/admin/" : ("TURBOPACK unreachable", undefined));
const TOKEN_NAME = "ZuroonaToken";
const ThreeSlideSettings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    initialSlide: 1,
    className: "settings",
    responsive: [
        {
            breakpoint: 1024,
            settings: {
                slidesToShow: 3,
                slidesToScroll: 1,
                infinite: true,
                dots: true
            }
        },
        {
            breakpoint: 991,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 1,
                initialSlide: 1
            }
        },
        {
            breakpoint: 768,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 1,
                initialSlide: 1
            }
        },
        {
            breakpoint: 590,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                initialSlide: 1,
                arrows: false
            }
        },
        {
            breakpoint: 575,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                initialSlide: 1,
                arrows: false
            }
        },
        {
            breakpoint: 400,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                initialSlide: 1,
                arrows: false
            }
        }
    ]
};
const TwoSlideSettings = {
    dots: false,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    slidesToShow: 2,
    slidesToScroll: 1,
    initialSlide: 0,
    className: "Carouselsettings",
    responsive: [
        {
            breakpoint: 1024,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 1,
                infinite: true,
                dots: true
            }
        },
        {
            breakpoint: 991,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 1,
                initialSlide: 1
            }
        },
        {
            breakpoint: 768,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 1,
                initialSlide: 1
            }
        },
        {
            breakpoint: 590,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                initialSlide: 1,
                arrows: false
            }
        },
        {
            breakpoint: 575,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                initialSlide: 1,
                arrows: false
            }
        },
        {
            breakpoint: 400,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                initialSlide: 1,
                arrows: false
            }
        }
    ]
};
const FourSlideSettings = {
    dots: true,
    infinite: true,
    autoplay: false,
    autoplaySpeed: 5000,
    arrows: true,
    slidesToShow: 4,
    slidesToScroll: 2,
    initialSlide: 0,
    className: "FourSlideSettings",
    responsive: [
        {
            breakpoint: 1024,
            settings: {
                slidesToShow: 4,
                slidesToScroll: 1,
                infinite: true,
                dots: true
            }
        },
        {
            breakpoint: 991,
            settings: {
                slidesToShow: 3,
                slidesToScroll: 1,
                initialSlide: 1
            }
        },
        {
            breakpoint: 768,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 1,
                initialSlide: 1
            }
        },
        {
            breakpoint: 590,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 1,
                initialSlide: 1,
                arrows: false
            }
        },
        {
            breakpoint: 575,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 1,
                initialSlide: 1,
                arrows: false
            }
        },
        {
            breakpoint: 450,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                initialSlide: 1,
                arrows: false
            }
        }
    ]
};
const SingleSlideSettings = {
    dots: true,
    infinite: false,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: 0,
    className: "Carouselsettings",
    responsive: [
        {
            breakpoint: 1024,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                infinite: false,
                dots: true
            }
        },
        {
            breakpoint: 991,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                initialSlide: 1
            }
        },
        {
            breakpoint: 768,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                initialSlide: 1
            }
        },
        {
            breakpoint: 590,
            settings: {
                slidesToShow: 1,
                arrows: false
            }
        },
        {
            breakpoint: 575,
            settings: {
                slidesToShow: 1,
                arrows: false
            }
        },
        {
            breakpoint: 400,
            settings: {
                slidesToShow: 1,
                arrows: false
            }
        }
    ]
};
const FiveSlideSettings = {
    dots: false,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: true,
    slidesToShow: 5,
    slidesToScroll: 5,
    initialSlide: 1,
    className: "FiveSlideSettings",
    responsive: [
        {
            breakpoint: 1024,
            settings: {
                slidesToShow: 5,
                slidesToScroll: 1,
                infinite: true,
                dots: true
            }
        },
        {
            breakpoint: 991,
            settings: {
                slidesToShow: 4,
                slidesToScroll: 1,
                initialSlide: 1
            }
        },
        {
            breakpoint: 768,
            settings: {
                slidesToShow: 3,
                slidesToScroll: 1,
                initialSlide: 1
            }
        },
        {
            breakpoint: 590,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 1,
                initialSlide: 1,
                arrows: false
            }
        },
        {
            breakpoint: 575,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 1,
                initialSlide: 1,
                arrows: false
            }
        },
        {
            breakpoint: 450,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                initialSlide: 1,
                arrows: false
            }
        }
    ]
};
const menuGroups = [
    {
        menuItems: [
            {
                icon: "/assets/images/menu/event-org.png",
                label: "Manage Hosts",
                translationKey: "sidebar.manageHosts",
                route: "/organizer"
            },
            {
                icon: "/assets/images/menu/user.png",
                label: "Guests Management",
                translationKey: "sidebar.guestsManagement",
                route: "/user"
            },
            {
                icon: "/assets/images/menu/event.png",
                label: "Manage Events",
                translationKey: "sidebar.manageEvents",
                route: "/events"
            },
            {
                icon: "/assets/images/menu/cms.png",
                label: "Manage CMS",
                translationKey: "sidebar.manageCMS",
                route: "/cms"
            },
            {
                icon: "/assets/images/menu/settings-line.png",
                hoverIcon: "/assets/images/menu/settings-line.png",
                label: "Settings",
                translationKey: "sidebar.settings",
                route: "/setting"
            },
            {
                icon: "/assets/images/menu/user.png",
                label: "Admin Management",
                translationKey: "sidebar.adminManagement",
                route: "/admin-management"
            },
            {
                icon: "/assets/images/menu/wallet.png",
                label: "Wallet",
                translationKey: "sidebar.wallet",
                route: "/wallet"
            },
            {
                icon: "/assets/images/menu/withdrawal.png",
                label: "Host Withdrawal Requests",
                translationKey: "sidebar.hostWithdrawalRequests",
                route: "/withdrawal-requests"
            },
            {
                icon: "/assets/images/menu/wallet.png",
                label: "Guest Invoices",
                translationKey: "sidebar.guestInvoices",
                route: "/guest-invoices"
            }
        ]
    }
];

})()),
"[project]/src/components/CMS/EnhancedTextEditor.jsx [app-client] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, k: __turbopack_refresh__ }) => (() => {
"use strict";

__turbopack_esm__({
    "default": ()=>__TURBOPACK__default__export__
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/shared/lib/app-dynamic.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$aws$2d$s3$2f$dist$2f$react$2d$aws$2d$s3$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/react-aws-s3/dist/react-aws-s3.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uid$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/uid/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$until$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/src/until/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$iconify$2f$react$2f$dist$2f$iconify$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/@iconify/react/dist/iconify.js [app-client] (ecmascript)");
"__TURBOPACK__ecmascript__hoisting__location__";
;
var _s = __turbopack_refresh__.signature();
"use client";
;
;
;
;
;
;
// Dynamically import ReactQuill to reduce initial bundle
const ReactQuill = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(()=>__turbopack_require__("[project]/node_modules/react-quill/lib/index.js [app-client] (ecmascript, async loader)")(__turbopack_import__), {
    loadableGenerated: {
        modules: [
            "src/components/CMS/EnhancedTextEditor.jsx -> " + "react-quill"
        ]
    },
    ssr: false,
    loading: ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "h-32 bg-gray-100 rounded animate-pulse"
        }, void 0, false, {
            fileName: "[project]/src/components/CMS/EnhancedTextEditor.jsx",
            lineNumber: 12,
            columnNumber: 18
        }, this)
});
_c = ReactQuill;
;
;
// Lazy register Quill modules
let quillInitialized = false;
let QuillInstance = null;
let SizeInstance = null;
const initializeQuill = async ()=>{
    if (typeof window !== "undefined" && !quillInitialized) {
        const [{ Quill }, ImageResize] = await Promise.all([
            __turbopack_require__("[project]/node_modules/react-quill/lib/index.js [app-client] (ecmascript, async loader)")(__turbopack_import__).then((mod)=>({
                    Quill: mod.Quill || mod.default?.Quill
                })),
            __turbopack_require__("[project]/node_modules/quill-image-resize-module-react/image-resize.min.js [app-client] (ecmascript, async loader)")(__turbopack_import__)
        ]);
        if (Quill) {
            QuillInstance = Quill;
            Quill.register("modules/imageResize", ImageResize.default || ImageResize);
            SizeInstance = Quill.import("attributors/style/size");
            SizeInstance.whitelist = [
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
                "28px",
                "32px",
                "36px",
                "48px"
            ];
            Quill.register(SizeInstance, true);
            quillInitialized = true;
        }
    }
};
const EnhancedTextEditor = /*#__PURE__*/ _s((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["memo"])(_c1 = _s(function EnhancedTextEditor(props) {
    _s();
    const quillRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [quillReady, setQuillReady] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [mode, setMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("visual"); // "visual" or "code"
    const [showPreview, setShowPreview] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [htmlCode, setHtmlCode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const QID = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])(()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$uid$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["uid"])(), []);
    const ReactS3Client = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])(()=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$aws$2d$s3$2f$dist$2f$react$2d$aws$2d$s3$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"](__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$until$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["config"]), []);
    const newFileName = QID;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        initializeQuill().then(()=>setQuillReady(true));
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (props.value) {
            setHtmlCode(props.value);
        }
    }, [
        props.value
    ]);
    const ImageUpload = (formData)=>{
        var url = ReactS3Client.uploadFile(formData, newFileName).then((data)=>{
            return data.location;
        });
        return url;
    };
    const imageHandler = (e)=>{
        const editor = quillRef.current.getEditor();
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/*");
        input.click();
        input.onchange = async ()=>{
            const file = input.files[0];
            if (/^image\//.test(file.type)) {
                const res = await ImageUpload(input.files[0]);
                editor.insertEmbed(editor.getSelection(), "image", res);
            }
        };
    };
    const handleModeChange = (newMode)=>{
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
    const handleCodeChange = (e)=>{
        const newCode = e.target.value;
        setHtmlCode(newCode);
        props.formik.setFieldValue(props.name, newCode);
    };
    const togglePreview = ()=>{
        if (mode === "code") {
            // Update formik value before preview
            props.formik.setFieldValue(props.name, htmlCode);
        }
        setShowPreview(!showPreview);
    };
    const modules = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])(()=>({
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
                        {
                            font: []
                        }
                    ],
                    [
                        {
                            size: SizeInstance?.whitelist || [
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
                                "28px",
                                "32px",
                                "36px",
                                "48px"
                            ]
                        }
                    ],
                    [
                        "bold",
                        "italic",
                        "underline",
                        "strike",
                        "blockquote"
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
                        {
                            script: "sub"
                        },
                        {
                            script: "super"
                        }
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
                            align: []
                        }
                    ],
                    [
                        "link",
                        "image",
                        "video"
                    ],
                    [
                        "clean"
                    ]
                ],
                handlers: {
                    image: imageHandler
                }
            },
            imageResize: {
                parchment: QuillInstance?.import("parchment"),
                modules: [
                    "Resize",
                    "DisplaySize",
                    "Toolbar"
                ]
            },
            clipboard: {
                matchVisual: false
            }
        }), []);
    const formats = [
        "header",
        "font",
        "size",
        "bold",
        "italic",
        "underline",
        "strike",
        "blockquote",
        "list",
        "bullet",
        "indent",
        "script",
        "color",
        "background",
        "align",
        "link",
        "image",
        "video",
        "code-block"
    ];
    if (!quillReady) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "h-32 bg-gray-100 rounded animate-pulse"
        }, void 0, false, {
            fileName: "[project]/src/components/CMS/EnhancedTextEditor.jsx",
            lineNumber: 160,
            columnNumber: 12
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "w-full border border-gray-300 rounded-lg overflow-hidden bg-white",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between bg-gray-50 border-b border-gray-300 px-4 py-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>handleModeChange("visual"),
                                className: `px-4 py-2 rounded-md text-sm font-medium transition-all ${mode === "visual" ? "bg-[#a3cc69] text-white shadow-md" : "bg-white text-gray-700 hover:bg-gray-100"}`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$iconify$2f$react$2f$dist$2f$iconify$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Icon"], {
                                        icon: "lucide:type",
                                        className: "inline mr-1"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/CMS/EnhancedTextEditor.jsx",
                                        lineNumber: 177,
                                        columnNumber: 13
                                    }, this),
                                    "Visual"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/CMS/EnhancedTextEditor.jsx",
                                lineNumber: 168,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>handleModeChange("code"),
                                className: `px-4 py-2 rounded-md text-sm font-medium transition-all ${mode === "code" ? "bg-[#a3cc69] text-white shadow-md" : "bg-white text-gray-700 hover:bg-gray-100"}`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$iconify$2f$react$2f$dist$2f$iconify$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Icon"], {
                                        icon: "lucide:code",
                                        className: "inline mr-1"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/CMS/EnhancedTextEditor.jsx",
                                        lineNumber: 189,
                                        columnNumber: 13
                                    }, this),
                                    "HTML Code"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/CMS/EnhancedTextEditor.jsx",
                                lineNumber: 180,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: togglePreview,
                                className: `px-4 py-2 rounded-md text-sm font-medium transition-all ${showPreview ? "bg-[#a797cc] text-white shadow-md" : "bg-white text-gray-700 hover:bg-gray-100"}`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$iconify$2f$react$2f$dist$2f$iconify$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Icon"], {
                                        icon: showPreview ? "lucide:edit" : "lucide:eye",
                                        className: "inline mr-1"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/CMS/EnhancedTextEditor.jsx",
                                        lineNumber: 201,
                                        columnNumber: 13
                                    }, this),
                                    showPreview ? "Edit" : "Preview"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/CMS/EnhancedTextEditor.jsx",
                                lineNumber: 192,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/CMS/EnhancedTextEditor.jsx",
                        lineNumber: 167,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-xs text-gray-500",
                        children: mode === "visual" ? "Visual Editor" : "HTML Code Editor"
                    }, void 0, false, {
                        fileName: "[project]/src/components/CMS/EnhancedTextEditor.jsx",
                        lineNumber: 205,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/CMS/EnhancedTextEditor.jsx",
                lineNumber: 166,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative",
                children: showPreview ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "min-h-[400px] p-6 bg-white overflow-auto",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "prose prose-lg max-w-none cms-preview-content",
                        dangerouslySetInnerHTML: {
                            __html: mode === "code" ? htmlCode : props.value || ""
                        },
                        style: {
                            fontFamily: "inherit"
                        }
                    }, void 0, false, {
                        fileName: "[project]/src/components/CMS/EnhancedTextEditor.jsx",
                        lineNumber: 214,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/CMS/EnhancedTextEditor.jsx",
                    lineNumber: 213,
                    columnNumber: 11
                }, this) : mode === "code" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "relative",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                            value: htmlCode,
                            onChange: handleCodeChange,
                            onBlur: props.onBlur,
                            className: "w-full min-h-[400px] p-4 font-mono text-sm border-0 focus:outline-none focus:ring-0 resize-none",
                            placeholder: "Enter HTML code here...",
                            style: {
                                fontFamily: "'Courier New', monospace",
                                lineHeight: "1.6"
                            }
                        }, void 0, false, {
                            fileName: "[project]/src/components/CMS/EnhancedTextEditor.jsx",
                            lineNumber: 226,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "absolute bottom-2 right-2 text-xs text-gray-400 bg-white px-2 py-1 rounded",
                            children: [
                                htmlCode.length,
                                " characters"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/CMS/EnhancedTextEditor.jsx",
                            lineNumber: 237,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/CMS/EnhancedTextEditor.jsx",
                    lineNumber: 225,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ReactQuill, {
                    theme: "snow",
                    className: `textarea-control border-0 p-0 ${props.disabled ? "hideTopBar" : "shadow"}`,
                    style: {
                        color: "black"
                    },
                    ref: quillRef,
                    modules: modules,
                    formats: formats,
                    value: props.value,
                    onBlur: props.onBlur,
                    onChange: (content, delta, source, editor)=>{
                        props.formik.setFieldValue(props.name, content);
                    },
                    readOnly: props.disabled && props.disabled
                }, void 0, false, {
                    fileName: "[project]/src/components/CMS/EnhancedTextEditor.jsx",
                    lineNumber: 242,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/CMS/EnhancedTextEditor.jsx",
                lineNumber: 211,
                columnNumber: 7
            }, this),
            mode === "code" && !showPreview && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-blue-50 border-t border-blue-200 px-4 py-2 text-xs text-blue-700",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$iconify$2f$react$2f$dist$2f$iconify$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Icon"], {
                        icon: "lucide:info",
                        className: "inline mr-1"
                    }, void 0, false, {
                        fileName: "[project]/src/components/CMS/EnhancedTextEditor.jsx",
                        lineNumber: 264,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                        children: "HTML Code Mode:"
                    }, void 0, false, {
                        fileName: "[project]/src/components/CMS/EnhancedTextEditor.jsx",
                        lineNumber: 265,
                        columnNumber: 11
                    }, this),
                    " Edit HTML directly. Changes are saved automatically."
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/CMS/EnhancedTextEditor.jsx",
                lineNumber: 263,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/CMS/EnhancedTextEditor.jsx",
        lineNumber: 164,
        columnNumber: 5
    }, this);
}, "yfMwrviZSgIFXWrSPKGjJXzqFLo=")), "yfMwrviZSgIFXWrSPKGjJXzqFLo=");
_c2 = EnhancedTextEditor;
EnhancedTextEditor.displayName = 'EnhancedTextEditor';
const __TURBOPACK__default__export__ = EnhancedTextEditor;
var _c, _c1, _c2;
__turbopack_refresh__.register(_c, "ReactQuill");
__turbopack_refresh__.register(_c1, "EnhancedTextEditor$memo");
__turbopack_refresh__.register(_c2, "EnhancedTextEditor");

})()),
}]);

//# sourceMappingURL=src_0bcd31._.js.map