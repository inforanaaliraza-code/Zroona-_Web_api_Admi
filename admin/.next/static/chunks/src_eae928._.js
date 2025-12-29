(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["static/chunks/src_eae928._.js", {

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
                route: "/organizer"
            },
            {
                icon: "/assets/images/menu/user.png",
                label: "Guests Management",
                route: "/user"
            },
            {
                icon: "/assets/images/menu/event.png",
                label: "Manage Events",
                route: "/events"
            },
            {
                icon: "/assets/images/menu/cms.png",
                label: "Manage CMS",
                route: "/cms"
            },
            {
                icon: "/assets/images/menu/settings-line.png",
                hoverIcon: "/assets/images/menu/settings-line.png",
                label: "Settings",
                route: "/setting"
            },
            {
                icon: "/assets/images/menu/user.png",
                label: "Admin Management",
                route: "/admin-management"
            },
            {
                icon: "/assets/images/menu/wallet.png",
                label: "Wallet",
                route: "/wallet"
            },
            {
                icon: "/assets/images/menu/withdrawal.png",
                label: "Host Withdrawal Requests",
                route: "/withdrawal-requests"
            },
            {
                icon: "/assets/images/menu/wallet.png",
                label: "Guest Invoices",
                route: "/guest-invoices"
            }
        ]
    }
];

})()),
"[project]/src/api/index.js [app-client] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, k: __turbopack_refresh__ }) => (() => {
"use strict";

__turbopack_esm__({
    "DeleteParams": ()=>DeleteParams,
    "deleteData": ()=>deleteData,
    "deleteDataURLIncodedWithToken": ()=>deleteDataURLIncodedWithToken,
    "deleteforUrl": ()=>deleteforUrl,
    "getData": ()=>getData,
    "getDataAndDownload": ()=>getDataAndDownload,
    "getDataNoToken": ()=>getDataNoToken,
    "getDataStringify": ()=>getDataStringify,
    "getDataforUrl": ()=>getDataforUrl,
    "getDataforUrlParams": ()=>getDataforUrlParams,
    "patchDataURLIncoded": ()=>patchDataURLIncoded,
    "patchFormData": ()=>patchFormData,
    "patchRawData": ()=>patchRawData,
    "patchRawDataWithURLMulti": ()=>patchRawDataWithURLMulti,
    "patchforUrl": ()=>patchforUrl,
    "postDataURLIncoded": ()=>postDataURLIncoded,
    "postDataURLIncodedWithToken": ()=>postDataURLIncodedWithToken,
    "postFormData": ()=>postFormData,
    "postFormDataNoToken": ()=>postFormDataNoToken,
    "postRawData": ()=>postRawData,
    "postRawDataforURL": ()=>postRawDataforURL,
    "putData": ()=>putData,
    "putFormData": ()=>putFormData,
    "putFormDataURLIncoded": ()=>putFormDataURLIncoded,
    "putFormDataURLIncodedWithToken": ()=>putFormDataURLIncodedWithToken,
    "putRawData": ()=>putRawData,
    "putRawDataForURL": ()=>putRawDataForURL
});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$until$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/src/until/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/axios/lib/axios.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$js$2d$cookie$2f$dist$2f$js$2e$cookie$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/js-cookie/dist/js.cookie.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$react$2d$toastify$2e$esm$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/react-toastify/dist/react-toastify.esm.mjs [app-client] (ecmascript)");
"__TURBOPACK__ecmascript__hoisting__location__";
;
;
;
;
var querystring = __turbopack_require__("[project]/node_modules/next/dist/compiled/querystring-es3/index.js [app-client] (ecmascript)");
// normalize axios error so callers don't crash when error.response is undefined
const normalizeAxiosError = (error)=>{
    const fallback = {
        status: 0,
        message: error?.response?.data?.message || error?.message || "Something went wrong"
    };
    return error?.response?.data || fallback;
};
const postFormDataNoToken = async (url = "", data = {})=>{
    try {
        const formData = new FormData();
        for(let key in data){
            formData.append(key, data[key]);
        }
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$until$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BASE_API_URL"] + url, formData);
        return response.data;
    } catch (error) {
        // toast.error(error.message);
        // toast.error(error.response.data);
        return error.response.data;
    }
};
const postFormData = async (url = "", data = {})=>{
    try {
        const token = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$js$2d$cookie$2f$dist$2f$js$2e$cookie$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$until$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TOKEN_NAME"]);
        const formData = new FormData();
        for(let key in data){
            formData.append(key, data[key]);
        }
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$until$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BASE_API_URL"] + url, formData, {
            headers: {
                Authorization: token ? token : ""
            }
        });
        return response.data;
    } catch (error) {
        // toast.error(error.message);
        // toast.error(error.response.data);
        return error.response.data;
    }
};
const patchFormData = async (url = "", data = {})=>{
    try {
        const token = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$js$2d$cookie$2f$dist$2f$js$2e$cookie$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$until$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TOKEN_NAME"]);
        const formData = new URLSearchParams();
        for(let key in data){
            formData.append(key, data[key]);
        }
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].patch(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$until$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BASE_API_URL"] + url, formData, {
            headers: {
                Authorization: token ? token : ""
            }
        });
        return response.data;
    } catch (error) {
        // toast.error(error.message);
        // toast.error(error.response.data);
        return error.response.data;
    }
};
const patchRawData = async (url = "", data = {})=>{
    try {
        const token = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$js$2d$cookie$2f$dist$2f$js$2e$cookie$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$until$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TOKEN_NAME"]);
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].patch(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$until$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BASE_API_URL"] + url, data, {
            headers: {
                Authorization: token
            }
        });
        return response.data;
    } catch (error) {
        // toast.error(error.response.data);
        return error.response.data;
    }
};
const postRawData = async (url = "", data = {})=>{
    try {
        const token = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$js$2d$cookie$2f$dist$2f$js$2e$cookie$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$until$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TOKEN_NAME"]);
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$until$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BASE_API_URL"] + url, data, {
            headers: {
                Authorization: token ? token : ""
            }
        });
        return response.data;
    } catch (error) {
        return normalizeAxiosError(error);
    }
};
const postRawDataforURL = async (url = "", id, data = {})=>{
    try {
        const token = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$js$2d$cookie$2f$dist$2f$js$2e$cookie$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$until$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TOKEN_NAME"]);
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$until$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BASE_API_URL"] + url + `/${id}`, data, {
            headers: {
                Authorization: token ? token : ""
            }
        });
        return response.data;
    } catch (error) {
        // toast.error(error.message);
        // toast.error(error.response.data);
        return error.response.data;
    }
};
const getDataNoToken = async (url = "", data = {})=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$until$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BASE_API_URL"] + url, {
            params: data
        });
        return response.data;
    } catch (error) {
        // toast.error(error.response.data);
        return error.response.data;
    }
};
const getDataforUrl = async (url = "", data = "")=>{
    try {
        const token = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$js$2d$cookie$2f$dist$2f$js$2e$cookie$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$until$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TOKEN_NAME"]);
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$until$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BASE_API_URL"] + url + `/${data?.id}`, {
            headers: {
                Authorization: token ? token : ""
            }
        });
        return response.data;
    } catch (error) {
        // toast.error(error.response.data);
        return error.response.data;
    }
};
const getDataforUrlParams = async (url, id, prams)=>{
    try {
        const token = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$js$2d$cookie$2f$dist$2f$js$2e$cookie$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$until$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TOKEN_NAME"]);
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$until$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BASE_API_URL"] + url + `/${id}`, {
            params: prams,
            headers: {
                Authorization: token ? token : ""
            }
        });
        return response.data;
    } catch (error) {
        // toast.error(error.response.data);
        return error.response.data;
    }
};
const patchRawDataWithURLMulti = async (url, data = {})=>{
    try {
        const token = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$js$2d$cookie$2f$dist$2f$js$2e$cookie$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$until$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TOKEN_NAME"]);
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].patch(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$until$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BASE_API_URL"] + url, data, {
            headers: {
                token: token
            }
        });
        return response.data;
    } catch (error) {
        // toast.error(error.response.data);
        return error.response.data;
    }
};
const getData = async (url = "", data = {})=>{
    try {
        const token = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$js$2d$cookie$2f$dist$2f$js$2e$cookie$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$until$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TOKEN_NAME"]);
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$until$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BASE_API_URL"] + url, {
            params: data,
            headers: {
                Authorization: token ? token : ""
            }
        });
        return response.data;
    } catch (error) {
        // toast.error(error.response.data);
        if (error.response) {
            return error.response.data;
        } else if (error.request) {
            // Network error - server not reachable
            return {
                status: 0,
                code: 500,
                message: "Network error: Unable to reach server",
                error: "Network error"
            };
        } else {
            // Request setup error
            return {
                status: 0,
                code: 500,
                message: error.message || "An error occurred",
                error: error.message
            };
        }
    }
};
const getDataStringify = async (url = "", data = {})=>{
    try {
        const token = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$js$2d$cookie$2f$dist$2f$js$2e$cookie$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$until$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TOKEN_NAME"]);
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$until$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BASE_API_URL"] + url, {
            params: data,
            headers: {
                Authorization: token ? token : ""
            }
        });
        return response.data;
    } catch (error) {
        // toast.error(error.response.data);
        return error.response.data;
    }
};
const postDataURLIncoded = async (url = "", data = {})=>{
    try {
        //const token = await Cookies.get(TOKEN_NAME);
        const formData = new URLSearchParams();
        for(let key in data){
            formData.append(key, data[key]);
        }
        //console.log(data);
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$until$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BASE_API_URL"] + url, querystring.stringify(data), {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });
        //console.log(response);
        return response.data;
    } catch (error) {
        // toast.error(error.response.data);
        return error.response.data;
    }
};
const postDataURLIncodedWithToken = async (url = "", data = {})=>{
    try {
        const token = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$js$2d$cookie$2f$dist$2f$js$2e$cookie$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$until$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TOKEN_NAME"]);
        const formData = new URLSearchParams();
        for(let key in data){
            formData.append(key, data[key]);
        }
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$until$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BASE_API_URL"] + url, querystring.stringify(data), {
            headers: {
                token: token,
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });
        //console.log(response);
        return response.data;
    } catch (error) {
        // toast.error(error.response.data);
        return error.response.data;
    }
};
const patchDataURLIncoded = async (url = "", data = {})=>{
    try {
        const token = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$js$2d$cookie$2f$dist$2f$js$2e$cookie$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$until$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TOKEN_NAME"]);
        const formData = new URLSearchParams();
        for(let key in data){
            formData.append(key, data[key]);
        }
        //console.log(data);
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].patch(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$until$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BASE_API_URL"] + url, querystring.stringify(data), {
            headers: {
                token: token,
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });
        //console.log(response);
        return response.data;
    } catch (error) {
        // toast.error(error.response.data);
        return error.response.data;
    }
};
const patchforUrl = async (url = "", data = "")=>{
    try {
        const token = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$js$2d$cookie$2f$dist$2f$js$2e$cookie$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$until$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TOKEN_NAME"]);
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].patch(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$until$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BASE_API_URL"] + url + `/${data?.id}`, null, {
            headers: {
                Authorization: token ? token : ""
            }
        });
        return response.data;
    } catch (error) {
        // toast.error(error.response.data);
        return error.response.data;
    }
};
const putFormData = async (url = "", data = {})=>{
    try {
        const token = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$js$2d$cookie$2f$dist$2f$js$2e$cookie$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$until$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TOKEN_NAME"]);
        const formData = new FormData();
        for(let key in data){
            formData.append(key, data[key]);
        }
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].put(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$until$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BASE_API_URL"] + url, formData, {
            headers: {
                Authorization: token ? token : ""
            }
        });
        return response.data;
    } catch (error) {
        // toast.error(error.response.data);
        return error.response.data;
    }
};
const putFormDataURLIncoded = async (url = "", data = {})=>{
    try {
        const formData = new FormData();
        for(let key in data){
            formData.append(key, data[key]);
        }
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].put(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$until$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BASE_API_URL"] + url, querystring.stringify(data), {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });
        return response.data;
    } catch (error) {
        // toast.error(error.response.data);
        return error.response.data;
    }
};
const putFormDataURLIncodedWithToken = async (url = "", data = {})=>{
    try {
        const token = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$js$2d$cookie$2f$dist$2f$js$2e$cookie$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$until$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TOKEN_NAME"]);
        const formData = new FormData();
        for(let key in data){
            formData.append(key, data[key]);
        }
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].put(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$until$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BASE_API_URL"] + url, querystring.stringify(data), {
            headers: {
                token: token,
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });
        return response.data;
    } catch (error) {
        // toast.error(error.response.data);
        return error.response.data;
    }
};
const putRawData = async (url = "", data = {})=>{
    try {
        const token = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$js$2d$cookie$2f$dist$2f$js$2e$cookie$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$until$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TOKEN_NAME"]);
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].put(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$until$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BASE_API_URL"] + url, data, {
            headers: {
                Authorization: token
            }
        });
        return response.data;
    } catch (error) {
        // toast.error(error.response.data);
        return error.response.data;
    }
};
const putRawDataForURL = async (url = "", id, data = {})=>{
    try {
        const token = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$js$2d$cookie$2f$dist$2f$js$2e$cookie$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$until$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TOKEN_NAME"]);
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].put(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$until$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BASE_API_URL"] + url + `/${id}`, data, {
            headers: {
                token: token
            }
        });
        return response.data;
    } catch (error) {
        // toast.error(error.response.data);
        return error.response.data;
    }
};
const putData = async (url, id, body)=>{
    try {
        const token = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$js$2d$cookie$2f$dist$2f$js$2e$cookie$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$until$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TOKEN_NAME"]);
        // let data = body;
        // const dataz = new URLSearchParams();
        // for (const key in body) {
        //   dataz.append(key, body[key]);
        // }
        let config = {
            method: "put",
            url: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$until$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BASE_API_URL"] + url + `/${id}`,
            headers: {
                "Content-Type": "application/json",
                token: token
            },
            data: body
        };
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].request(config).then((response)=>{
            return response.data;
        });
    } catch (error) {
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$react$2d$toastify$2e$esm$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(error?.response?.data?.message || error?.message);
    }
};
const deleteDataURLIncodedWithToken = async (url = "", data = {})=>{
    try {
        const token = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$js$2d$cookie$2f$dist$2f$js$2e$cookie$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$until$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TOKEN_NAME"]);
        // const formData = new FormData();
        // for (let key in data) {
        //   formData.append(key, data[key]);
        // }
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].delete(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$until$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BASE_API_URL"] + url, {
            headers: {
                token: token,
                "Content-Type": "application/x-www-form-urlencoded"
            },
            data: querystring.stringify(data)
        });
        return response.data;
    } catch (error) {
        // toast.error(error.response.data);
        return error.response.data;
    }
};
const deleteData = async (url = "", data = {})=>{
    try {
        const token = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$js$2d$cookie$2f$dist$2f$js$2e$cookie$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$until$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TOKEN_NAME"]);
        const formData = new FormData();
        for(let key in data){
            formData.append(key, data[key]);
        }
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].delete(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$until$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BASE_API_URL"] + url, {
            headers: {
                token: token
            },
            data: formData
        });
        return response.data;
    } catch (error) {
        // toast.error(error.response.data);
        return error.response.data;
    }
};
const deleteforUrl = async (url = "", data = "")=>{
    try {
        const token = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$js$2d$cookie$2f$dist$2f$js$2e$cookie$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$until$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TOKEN_NAME"]);
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].delete(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$until$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BASE_API_URL"] + url + `/${data?.id}`, {
            headers: {
                Authorization: token ? token : ""
            }
        });
        return response.data;
    } catch (error) {
        // toast.error(error.response.data);
        return error.response.data;
    }
};
const DeleteParams = async (url = "", data = {})=>{
    try {
        const token = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$js$2d$cookie$2f$dist$2f$js$2e$cookie$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$until$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TOKEN_NAME"]);
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].delete(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$until$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BASE_API_URL"] + url, {
            params: data,
            headers: {
                Authorization: token ? token : ""
            }
        });
        return response.data;
    } catch (error) {
        // toast.error(error.response.data);
        return error.response.data;
    }
};
_c = DeleteParams;
const getDataAndDownload = async (url = "", data = {})=>{
    try {
        //const token = await Cookies.get(TOKEN_NAME);
        const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])({
            url: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$until$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BASE_API_URL"] + url,
            method: "GET",
            responseType: "blob",
            params: data
        });
        return response.data;
    } catch (error) {
        // toast.error(error.response.data);
        return error.response.data;
    }
};
var _c;
__turbopack_refresh__.register(_c, "DeleteParams");

})()),
"[project]/src/api/organizer/apis.js [app-client] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, k: __turbopack_refresh__ }) => (() => {
"use strict";

__turbopack_esm__({
    "ActiveInActiveOrganizerApi": ()=>ActiveInActiveOrganizerApi,
    "ChangeStatusOrganizerApi": ()=>ChangeStatusOrganizerApi,
    "DeleteOrganizerApi": ()=>DeleteOrganizerApi,
    "GetAllOrganizerApi": ()=>GetAllOrganizerApi,
    "OrganizerDetailApi": ()=>OrganizerDetailApi
});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/src/api/index.js [app-client] (ecmascript)");
"__TURBOPACK__ecmascript__hoisting__location__";
;
const GetAllOrganizerApi = async (payload)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getData"])("organizer/list", payload).then((data)=>{
        return data;
    });
};
_c = GetAllOrganizerApi;
const OrganizerDetailApi = async (payload)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getData"])("organizer/detail", payload).then((data)=>{
        return data;
    });
};
_c1 = OrganizerDetailApi;
const DeleteOrganizerApi = async (payload)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DeleteParams"])("organizer/delete", payload).then((data)=>{
        return data;
    });
};
_c2 = DeleteOrganizerApi;
const ChangeStatusOrganizerApi = async (payload)=>{
    // Map frontend status: 1=Pending, 2=Approved, 3=Rejected
    // Backend: 1=Pending, 2=Approved, 3=Rejected
    const backendPayload = {
        userId: payload.userId || payload.id,
        is_approved: payload.is_approved || payload.status,
        rejection_reason: payload.rejection_reason || payload.reason
    };
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["putRawData"])("changeStatus", backendPayload).then((data)=>{
        return data;
    });
};
_c3 = ChangeStatusOrganizerApi;
const ActiveInActiveOrganizerApi = async (payload)=>{
    // Support both isActive and isSuspended
    const apiPayload = {
        id: payload.id,
        ...payload.isActive !== undefined && {
            isActive: payload.isActive
        },
        ...payload.isSuspended !== undefined && {
            isSuspended: payload.isSuspended
        }
    };
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["patchRawData"])("changeOrganizerStatus", apiPayload).then((data)=>{
        return data;
    });
};
_c4 = ActiveInActiveOrganizerApi;
var _c, _c1, _c2, _c3, _c4;
__turbopack_refresh__.register(_c, "GetAllOrganizerApi");
__turbopack_refresh__.register(_c1, "OrganizerDetailApi");
__turbopack_refresh__.register(_c2, "DeleteOrganizerApi");
__turbopack_refresh__.register(_c3, "ChangeStatusOrganizerApi");
__turbopack_refresh__.register(_c4, "ActiveInActiveOrganizerApi");

})()),
"[project]/src/api/user/apis.js [app-client] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, k: __turbopack_refresh__ }) => (() => {
"use strict";

__turbopack_esm__({
    "ActiveInActiveUserApi": ()=>ActiveInActiveUserApi,
    "DeleteUserApi": ()=>DeleteUserApi,
    "GetAllUserApi": ()=>GetAllUserApi,
    "UpdateUserApi": ()=>UpdateUserApi,
    "UserDetailApi": ()=>UserDetailApi
});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/src/api/index.js [app-client] (ecmascript)");
"__TURBOPACK__ecmascript__hoisting__location__";
;
const GetAllUserApi = async (payload)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getData"])("user/list", payload).then((data)=>{
        return data;
    });
};
_c = GetAllUserApi;
const UserDetailApi = async (payload)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getData"])("user/detail", payload).then((data)=>{
        return data;
    });
};
_c1 = UserDetailApi;
const DeleteUserApi = async (payload)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DeleteParams"])("user/delete", payload).then((data)=>{
        return data;
    });
};
_c2 = DeleteUserApi;
const ActiveInActiveUserApi = async (payload)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["patchRawData"])("user/changeStatus", payload).then((data)=>{
        return data;
    });
};
_c3 = ActiveInActiveUserApi;
const UpdateUserApi = async (payload)=>{
    return putRawData("user/update", payload).then((data)=>{
        return data;
    });
};
_c4 = UpdateUserApi;
var _c, _c1, _c2, _c3, _c4;
__turbopack_refresh__.register(_c, "GetAllUserApi");
__turbopack_refresh__.register(_c1, "UserDetailApi");
__turbopack_refresh__.register(_c2, "DeleteUserApi");
__turbopack_refresh__.register(_c3, "ActiveInActiveUserApi");
__turbopack_refresh__.register(_c4, "UpdateUserApi");

})()),
"[project]/src/api/events/apis.js [app-client] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, k: __turbopack_refresh__ }) => (() => {
"use strict";

__turbopack_esm__({
    "ActiveInActiveEventsApi": ()=>ActiveInActiveEventsApi,
    "ChangeEventStatusApi": ()=>ChangeEventStatusApi,
    "DeleteEventsApi": ()=>DeleteEventsApi,
    "EventsDetailApi": ()=>EventsDetailApi,
    "GetAllEventsApi": ()=>GetAllEventsApi
});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/src/api/index.js [app-client] (ecmascript)");
"__TURBOPACK__ecmascript__hoisting__location__";
;
const GetAllEventsApi = async (payload)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getData"])("eventList", payload).then((data)=>{
        return data;
    });
};
_c = GetAllEventsApi;
const EventsDetailApi = async (payload)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getData"])("event/detail", payload).then((data)=>{
        return data;
    });
};
_c1 = EventsDetailApi;
const DeleteEventsApi = async (payload)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DeleteParams"])("events/delete", payload).then((data)=>{
        return data;
    });
};
_c2 = DeleteEventsApi;
const ActiveInActiveEventsApi = async (payload)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["patchRawData"])("changeStatus", payload).then((data)=>{
        return data;
    });
};
_c3 = ActiveInActiveEventsApi;
const ChangeEventStatusApi = async (payload)=>{
    // Map frontend status to backend status
    // Frontend: 1=Pending, 2=Upcoming/Approved, 3=Completed, 4=Rejected
    // Backend: 0=Pending, 1=Approved, 2=Rejected
    const backendPayload = {
        eventId: payload.eventId,
        status: payload.status,
        rejectionReason: payload.reason || payload.rejectionReason
    };
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["putRawData"])("event/changeStatus", backendPayload).then((data)=>{
        return data;
    });
};
_c4 = ChangeEventStatusApi;
var _c, _c1, _c2, _c3, _c4;
__turbopack_refresh__.register(_c, "GetAllEventsApi");
__turbopack_refresh__.register(_c1, "EventsDetailApi");
__turbopack_refresh__.register(_c2, "DeleteEventsApi");
__turbopack_refresh__.register(_c3, "ActiveInActiveEventsApi");
__turbopack_refresh__.register(_c4, "ChangeEventStatusApi");

})()),
"[project]/src/api/setting.js [app-client] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, k: __turbopack_refresh__ }) => (() => {
"use strict";

__turbopack_esm__({
    "ActiveInActiveBlogApi": ()=>ActiveInActiveBlogApi,
    "ActiveInActiveMediaApi": ()=>ActiveInActiveMediaApi,
    "AddBlogApi": ()=>AddBlogApi,
    "AddEditBiotechPartnerApi": ()=>AddEditBiotechPartnerApi,
    "AddEditCMSApi": ()=>AddEditCMSApi,
    "AddMediaApi": ()=>AddMediaApi,
    "BiotechPartnerDetailApi": ()=>BiotechPartnerDetailApi,
    "BlogDetailApi": ()=>BlogDetailApi,
    "CMSDetailApi": ()=>CMSDetailApi,
    "DeleteBlogApi": ()=>DeleteBlogApi,
    "DeleteMediaApi": ()=>DeleteMediaApi,
    "DeleteRequestQuoteApi": ()=>DeleteRequestQuoteApi,
    "EditBlogApi": ()=>EditBlogApi,
    "EditMediaApi": ()=>EditMediaApi,
    "GetAllApplyNowEnueryApi": ()=>GetAllApplyNowEnueryApi,
    "GetAllBlogApi": ()=>GetAllBlogApi,
    "GetAllContactEnueryApi": ()=>GetAllContactEnueryApi,
    "GetAllLeaveReplyApi": ()=>GetAllLeaveReplyApi,
    "GetAllMediaApi": ()=>GetAllMediaApi,
    "GetCareerApplicationDetailApi": ()=>GetCareerApplicationDetailApi,
    "GetCareerApplicationsApi": ()=>GetCareerApplicationsApi,
    "GetRefundDetailApi": ()=>GetRefundDetailApi,
    "GetRefundListApi": ()=>GetRefundListApi,
    "LoginApi": ()=>LoginApi,
    "MediaDetailApi": ()=>MediaDetailApi,
    "OTPVerificationApi": ()=>OTPVerificationApi,
    "UpdateCareerApplicationStatusApi": ()=>UpdateCareerApplicationStatusApi,
    "UpdateRefundStatusApi": ()=>UpdateRefundStatusApi,
    "UploadFileApi": ()=>UploadFileApi,
    "changePasswordApi": ()=>changePasswordApi,
    "forgotPasswordApi": ()=>forgotPasswordApi,
    "logoutApi": ()=>logoutApi,
    "resetPasswordApi": ()=>resetPasswordApi
});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/src/api/index.js [app-client] (ecmascript)");
"__TURBOPACK__ecmascript__hoisting__location__";
;
const LoginApi = async (payload)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["postRawData"])("login", payload).then((data)=>{
        return data;
    });
};
_c = LoginApi;
const forgotPasswordApi = async (payload)=>{
    // For SMS OTP, use mobile_number instead of email
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["postRawData"])("forgot-password", {
        mobile_number: payload.mobile_number || payload.phone_number,
        phone_number: payload.mobile_number || payload.phone_number
    }).then((data)=>{
        return data;
    });
};
const OTPVerificationApi = async (payload)=>{
    // Support both sms_otp and email_otp for backward compatibility
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["postRawData"])("verify-otp", {
        sms_otp: payload.sms_otp || payload.email_otp,
        email_otp: payload.sms_otp || payload.email_otp
    }).then((data)=>{
        return data;
    });
};
_c1 = OTPVerificationApi;
const resetPasswordApi = async (payload)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["postRawData"])("admin/resetPassword", payload).then((data)=>{
        return data;
    });
};
const changePasswordApi = async (payload)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["postRawData"])("change-password", payload).then((data)=>{
        return data;
    });
};
const logoutApi = async (payload)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["postRawData"])("logout", payload).then((data)=>{
        return data;
    });
};
const UploadFileApi = async (payload)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["postFormData"])("user/uploadFile", payload).then((data)=>{
        return data;
    });
};
_c2 = UploadFileApi;
const AddEditBiotechPartnerApi = async (payload)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["postRawData"])("biotech-energy-partner/add", payload).then((data)=>{
        return data;
    });
};
_c3 = AddEditBiotechPartnerApi;
const BiotechPartnerDetailApi = async (payload)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getData"])("biotech-energy-partner/detail", payload).then((data)=>{
        return data;
    });
};
_c4 = BiotechPartnerDetailApi;
const GetAllMediaApi = async (payload)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getData"])("media/list", payload).then((data)=>{
        return data;
    });
};
_c5 = GetAllMediaApi;
const MediaDetailApi = async (payload)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getData"])("media/detail", payload).then((data)=>{
        return data;
    });
};
_c6 = MediaDetailApi;
const AddMediaApi = async (payload)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["postRawData"])("media/add", payload).then((data)=>{
        return data;
    });
};
_c7 = AddMediaApi;
const EditMediaApi = async (payload)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["putRawData"])("media/update", payload).then((data)=>{
        return data;
    });
};
_c8 = EditMediaApi;
const DeleteMediaApi = async (payload)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DeleteParams"])("media/delete", payload).then((data)=>{
        return data;
    });
};
_c9 = DeleteMediaApi;
const ActiveInActiveMediaApi = async (payload)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["patchRawData"])("media/status/change", payload).then((data)=>{
        return data;
    });
};
_c10 = ActiveInActiveMediaApi;
const GetAllBlogApi = async (payload)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getData"])("blog/list", payload).then((data)=>{
        return data;
    });
};
_c11 = GetAllBlogApi;
const BlogDetailApi = async (payload)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getData"])("blog/detail", payload).then((data)=>{
        return data;
    });
};
_c12 = BlogDetailApi;
const AddBlogApi = async (payload)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["postRawData"])("blog/add", payload).then((data)=>{
        return data;
    });
};
_c13 = AddBlogApi;
const EditBlogApi = async (payload)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["putRawData"])("blog/update", payload).then((data)=>{
        return data;
    });
};
_c14 = EditBlogApi;
const DeleteBlogApi = async (payload)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DeleteParams"])("blog/delete", payload).then((data)=>{
        return data;
    });
};
_c15 = DeleteBlogApi;
const ActiveInActiveBlogApi = async (payload)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["patchRawData"])("blog/status/change", payload).then((data)=>{
        return data;
    });
};
_c16 = ActiveInActiveBlogApi;
const GetAllContactEnueryApi = async (payload)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getData"])("user-contact/list", payload).then((data)=>{
        return data;
    });
};
_c17 = GetAllContactEnueryApi;
const GetAllApplyNowEnueryApi = async (payload)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getData"])("career-apply/list", payload).then((data)=>{
        return data;
    });
};
_c18 = GetAllApplyNowEnueryApi;
const DeleteRequestQuoteApi = async (payload)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DeleteParams"])("request-quote/delete", payload).then((data)=>{
        return data;
    });
};
_c19 = DeleteRequestQuoteApi;
const AddEditCMSApi = async (payload)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["putRawData"])("cms/update", payload).then((data)=>{
        return data;
    });
};
_c20 = AddEditCMSApi;
const CMSDetailApi = async (payload)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getData"])("cms/detail", payload).then((data)=>{
        return data;
    });
};
_c21 = CMSDetailApi;
const GetAllLeaveReplyApi = async (payload)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getData"])("reply/list", payload).then((data)=>{
        return data;
    });
};
_c22 = GetAllLeaveReplyApi;
const GetRefundListApi = async (payload)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getData"])("admin/refund/list", payload).then((data)=>{
        return data;
    });
};
_c23 = GetRefundListApi;
const GetRefundDetailApi = async (payload)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getData"])("admin/refund/detail", payload).then((data)=>{
        return data;
    });
};
_c24 = GetRefundDetailApi;
const UpdateRefundStatusApi = async (payload)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["putRawData"])("admin/refund/update-status", payload).then((data)=>{
        return data;
    });
};
_c25 = UpdateRefundStatusApi;
const GetCareerApplicationsApi = async (payload)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getData"])("admin/career/applications", payload).then((data)=>{
        return data;
    });
};
_c26 = GetCareerApplicationsApi;
const GetCareerApplicationDetailApi = async (payload)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getData"])("admin/career/application/detail", payload).then((data)=>{
        return data;
    });
};
_c27 = GetCareerApplicationDetailApi;
const UpdateCareerApplicationStatusApi = async (payload)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["putRawData"])("admin/career/application/update-status", payload).then((data)=>{
        return data;
    });
};
_c28 = UpdateCareerApplicationStatusApi;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9, _c10, _c11, _c12, _c13, _c14, _c15, _c16, _c17, _c18, _c19, _c20, _c21, _c22, _c23, _c24, _c25, _c26, _c27, _c28;
__turbopack_refresh__.register(_c, "LoginApi");
__turbopack_refresh__.register(_c1, "OTPVerificationApi");
__turbopack_refresh__.register(_c2, "UploadFileApi");
__turbopack_refresh__.register(_c3, "AddEditBiotechPartnerApi");
__turbopack_refresh__.register(_c4, "BiotechPartnerDetailApi");
__turbopack_refresh__.register(_c5, "GetAllMediaApi");
__turbopack_refresh__.register(_c6, "MediaDetailApi");
__turbopack_refresh__.register(_c7, "AddMediaApi");
__turbopack_refresh__.register(_c8, "EditMediaApi");
__turbopack_refresh__.register(_c9, "DeleteMediaApi");
__turbopack_refresh__.register(_c10, "ActiveInActiveMediaApi");
__turbopack_refresh__.register(_c11, "GetAllBlogApi");
__turbopack_refresh__.register(_c12, "BlogDetailApi");
__turbopack_refresh__.register(_c13, "AddBlogApi");
__turbopack_refresh__.register(_c14, "EditBlogApi");
__turbopack_refresh__.register(_c15, "DeleteBlogApi");
__turbopack_refresh__.register(_c16, "ActiveInActiveBlogApi");
__turbopack_refresh__.register(_c17, "GetAllContactEnueryApi");
__turbopack_refresh__.register(_c18, "GetAllApplyNowEnueryApi");
__turbopack_refresh__.register(_c19, "DeleteRequestQuoteApi");
__turbopack_refresh__.register(_c20, "AddEditCMSApi");
__turbopack_refresh__.register(_c21, "CMSDetailApi");
__turbopack_refresh__.register(_c22, "GetAllLeaveReplyApi");
__turbopack_refresh__.register(_c23, "GetRefundListApi");
__turbopack_refresh__.register(_c24, "GetRefundDetailApi");
__turbopack_refresh__.register(_c25, "UpdateRefundStatusApi");
__turbopack_refresh__.register(_c26, "GetCareerApplicationsApi");
__turbopack_refresh__.register(_c27, "GetCareerApplicationDetailApi");
__turbopack_refresh__.register(_c28, "UpdateCareerApplicationStatusApi");

})()),
"[project]/src/api/store/store.js [app-client] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, k: __turbopack_refresh__ }) => (() => {
"use strict";

__turbopack_esm__({
    "useDataStore": ()=>useDataStore
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$organizer$2f$apis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/src/api/organizer/apis.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$user$2f$apis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/src/api/user/apis.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$events$2f$apis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/src/api/events/apis.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$setting$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/src/api/setting.js [app-client] (ecmascript)");
"__TURBOPACK__ecmascript__hoisting__location__";
"use client";
;
;
;
;
;
const useDataStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])((set)=>({
        GetAllOrganizer: {},
        fetchGetAllOrganizer: async (data)=>{
            const res = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$organizer$2f$apis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GetAllOrganizerApi"])(data);
            set({
                GetAllOrganizer: await res
            });
            console.log(res);
        },
        OrganizerDetail: {},
        fetchOrganizerDetail: async (data)=>{
            const res = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$organizer$2f$apis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["OrganizerDetailApi"])(data);
            set({
                OrganizerDetail: await res?.data
            });
        },
        GetAllUser: {},
        fetchGetAllUser: async (data)=>{
            const res = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$user$2f$apis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GetAllUserApi"])(data);
            set({
                GetAllUser: await res
            });
            console.log(res);
        },
        UserDetail: {},
        fetchUserDetail: async (data)=>{
            const res = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$user$2f$apis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UserDetailApi"])(data);
            set({
                UserDetail: await res?.data
            });
        },
        GetAllEvents: {},
        fetchGetAllEvents: async (data)=>{
            const res = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$events$2f$apis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GetAllEventsApi"])(data);
            set({
                GetAllEvents: await res
            });
            console.log(res);
        },
        EventsDetail: {},
        fetchEventsDetail: async (data)=>{
            const res = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$events$2f$apis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EventsDetailApi"])(data);
            console.log("[STORE] EventsDetailApi response:", res);
            console.log("[STORE] Setting EventsDetail to:", res?.data);
            set({
                EventsDetail: res?.data || {}
            });
            return res;
        },
        CMSDetail: {},
        fetchCMSDetail: async (data)=>{
            const res = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$setting$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CMSDetailApi"])(data);
            set({
                CMSDetail: await res?.data
            });
        }
    }));

})()),
"[project]/src/components/Sidebar/SidebarItem.jsx [app-client] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, k: __turbopack_refresh__ }) => (() => {
"use strict";

__turbopack_esm__({
    "default": ()=>__TURBOPACK__default__export__
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/image.js [app-client] (ecmascript)");
"__TURBOPACK__ecmascript__hoisting__location__";
;
var _s = __turbopack_refresh__.signature();
;
;
;
;
const SidebarItem = ({ item, pageName, setPageName, index = 0 })=>{
    _s();
    const [isHovered, setIsHovered] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isMobile, setIsMobile] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const handleClick = ()=>{
        const updatedPageName = pageName !== item.label.toLowerCase() ? item.label.toLowerCase() : "";
        setPageName(updatedPageName);
    };
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const isActive = (item)=>{
        if (pathname.startsWith(item.route)) return true;
        if (item.children) {
            return item.children.some((child)=>isActive(child));
        }
        return false;
    };
    const isItemActive = isActive(item);
    // Check if the screen width is mobile
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const handleResize = ()=>{
            setIsMobile(window.innerWidth < 768);
        };
        // Initial check
        handleResize();
        // Add event listener
        window.addEventListener("resize", handleResize);
        // Cleanup event listener
        return ()=>window.removeEventListener("resize", handleResize);
    }, []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
        className: "animate-fade-in w-full list-none",
        style: {
            animationDelay: `${index * 0.05}s`,
            animationFillMode: 'both'
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            href: item.route,
            onClick: handleClick,
            onMouseEnter: ()=>!isMobile && setIsHovered(true),
            onMouseLeave: ()=>!isMobile && setIsHovered(false),
            className: `
          group relative flex items-center gap-3 rounded-xl py-2.5 px-3 font-medium text-white text-sm
          transition-all duration-300 ease-in-out w-full min-w-0
          ${isItemActive ? "bg-white/30 shadow-lg shadow-white/20 backdrop-blur-sm" : "bg-white/0 hover:bg-white/20"}
          ${!isMobile ? "hover:shadow-lg hover:shadow-white/20 hover:backdrop-blur-sm hover:scale-[1.01]" : ""}
          ${isItemActive ? "scale-[1.01]" : ""}
        `,
            children: [
                isItemActive && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-brand-green to-brand-gray-green-2 rounded-r-full animate-scale-in"
                }, void 0, false, {
                    fileName: "[project]/src/components/Sidebar/SidebarItem.jsx",
                    lineNumber: 69,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: `
            absolute inset-0 rounded-xl bg-gradient-to-r from-white/0 via-white/10 to-white/0
            opacity-0 transition-opacity duration-300
            ${isHovered || isItemActive ? "opacity-100" : ""}
          `
                }, void 0, false, {
                    fileName: "[project]/src/components/Sidebar/SidebarItem.jsx",
                    lineNumber: 73,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: `
          relative z-10 transition-all duration-300 flex-shrink-0
          ${isItemActive ? "scale-105" : "group-hover:scale-105"}
          ${isHovered || isItemActive ? "brightness-110" : ""}
        `,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        src: item.icon,
                        alt: item.label,
                        width: 20,
                        height: 20,
                        className: "transition-transform duration-300"
                    }, void 0, false, {
                        fileName: "[project]/src/components/Sidebar/SidebarItem.jsx",
                        lineNumber: 87,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/Sidebar/SidebarItem.jsx",
                    lineNumber: 82,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: `
          relative z-10 transition-all duration-300 flex-1 text-left leading-tight
          ${isItemActive ? "font-semibold" : "font-medium"}
        `,
                    children: item.label
                }, void 0, false, {
                    fileName: "[project]/src/components/Sidebar/SidebarItem.jsx",
                    lineNumber: 97,
                    columnNumber: 9
                }, this),
                isHovered && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "absolute inset-0 rounded-xl shimmer opacity-30"
                }, void 0, false, {
                    fileName: "[project]/src/components/Sidebar/SidebarItem.jsx",
                    lineNumber: 106,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/Sidebar/SidebarItem.jsx",
            lineNumber: 51,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/Sidebar/SidebarItem.jsx",
        lineNumber: 47,
        columnNumber: 5
    }, this);
};
_s(SidebarItem, "x+n+rv9YvEIUxjm91kKJ+YNn9ZQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"]
    ];
});
_c = SidebarItem;
const __TURBOPACK__default__export__ = SidebarItem;
var _c;
__turbopack_refresh__.register(_c, "SidebarItem");

})()),
"[project]/src/components/Header/ClickOutside.jsx [app-client] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, k: __turbopack_refresh__ }) => (() => {
"use strict";

__turbopack_esm__({
    "default": ()=>__TURBOPACK__default__export__
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
"__TURBOPACK__ecmascript__hoisting__location__";
;
var _s = __turbopack_refresh__.signature();
;
const ClickOutside = ({ children, exceptionRef, onClick, className })=>{
    _s();
    const wrapperRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const handleClickListener = (event)=>{
            let clickedInside = false;
            if (exceptionRef) {
                clickedInside = wrapperRef.current && wrapperRef.current.contains(event.target) || exceptionRef.current && exceptionRef.current === event.target || exceptionRef.current && exceptionRef.current.contains(event.target);
            } else {
                clickedInside = wrapperRef.current && wrapperRef.current.contains(event.target);
            }
            if (!clickedInside) onClick();
        };
        document.addEventListener("mousedown", handleClickListener);
        return ()=>{
            document.removeEventListener("mousedown", handleClickListener);
        };
    }, [
        exceptionRef,
        onClick
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: wrapperRef,
        className: className || "",
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/Header/ClickOutside.jsx",
        lineNumber: 31,
        columnNumber: 5
    }, this);
};
_s(ClickOutside, "S9hay92VXuy3YMd6nM+XEC/Dmxc=");
_c = ClickOutside;
const __TURBOPACK__default__export__ = ClickOutside;
var _c;
__turbopack_refresh__.register(_c, "ClickOutside");

})()),
"[project]/src/components/hooks/useLocalStorage.jsx [app-client] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, k: __turbopack_refresh__ }) => (() => {
"use strict";

__turbopack_esm__({
    "default": ()=>__TURBOPACK__default__export__
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
"__TURBOPACK__ecmascript__hoisting__location__";
var _s = __turbopack_refresh__.signature();
"use client";
;
function useLocalStorage(key, initialValue) {
    _s();
    // State to store our value
    // Pass initial state function to useState so logic is only executed once
    const [storedValue, setStoredValue] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(()=>{
        try {
            // Get from local storage by key
            if (typeof window !== "undefined") {
                // browser code
                const item = window.localStorage.getItem(key);
                // Parse stored json or if none return initialValue
                return item ? JSON.parse(item) : initialValue;
            }
        } catch (error) {
            // If error also return initialValue
            console.log(error);
            return initialValue;
        }
    });
    // useEffect to update local storage when the state changes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        try {
            // Allow value to be a function so we have same API as useState
            const valueToStore = typeof storedValue === "function" ? storedValue(storedValue) : storedValue;
            // Save state
            if (typeof window !== "undefined") {
                // browser code
                window.localStorage.setItem(key, JSON.stringify(valueToStore));
            }
        } catch (error) {
            // A more advanced implementation would handle the error case
            console.log(error);
        }
    }, [
        key,
        storedValue
    ]);
    return [
        storedValue,
        setStoredValue
    ];
}
_s(useLocalStorage, "E4FYgWHiGR6T2hKNHeDxqQf/QGU=");
const __TURBOPACK__default__export__ = useLocalStorage;

})()),
"[project]/src/components/Sidebar/index.jsx [app-client] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, k: __turbopack_refresh__ }) => (() => {
"use strict";

__turbopack_esm__({
    "default": ()=>__TURBOPACK__default__export__
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOutIcon$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/log-out.js [app-client] (ecmascript) <export default as LogOutIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Sidebar$2f$SidebarItem$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/src/components/Sidebar/SidebarItem.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Header$2f$ClickOutside$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/src/components/Header/ClickOutside.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$hooks$2f$useLocalStorage$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/src/components/hooks/useLocalStorage.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$until$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/src/until/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$js$2d$cookie$2f$dist$2f$js$2e$cookie$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/js-cookie/dist/js.cookie.mjs [app-client] (ecmascript)");
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
;
;
;
;
const Sidebar = ({ sidebarOpen, setSidebarOpen })=>{
    _s();
    const [pageName, setPageName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$hooks$2f$useLocalStorage$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("selectedMenu", "dashboard");
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Header$2f$ClickOutside$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
        onClick: ()=>setSidebarOpen(false),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
            className: `fixed left-0 top-0 z-[9999] flex h-screen w-[320px] flex-col bg-gradient-to-br from-brand-gray-purple-2 via-brand-pastel-gray-purple-1 to-brand-gray-purple-3 shadow-2xl duration-300 ease-in-out lg:translate-x-0 overflow-y-auto ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`,
            style: {
                background: "linear-gradient(135deg, #a797cc 0%, #b0a0df 50%, #a08ec8 100%)"
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5 pointer-events-none"
                }, void 0, false, {
                    fileName: "[project]/src/components/Sidebar/index.jsx",
                    lineNumber: 28,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-center mt-6 mb-4 px-5 relative z-10 animate-fade-in flex-shrink-0",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: "/",
                        className: "group relative",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute inset-0 bg-white/20 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100"
                            }, void 0, false, {
                                fileName: "[project]/src/components/Sidebar/index.jsx",
                                lineNumber: 33,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                width: 140,
                                height: 45,
                                src: "/assets/images/main-logo.png",
                                alt: "Zuroona Logo",
                                className: "object-contain relative z-10 transform group-hover:scale-105 transition-transform duration-300 w-auto h-auto max-h-[50px]"
                            }, void 0, false, {
                                fileName: "[project]/src/components/Sidebar/index.jsx",
                                lineNumber: 34,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/Sidebar/index.jsx",
                        lineNumber: 32,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/Sidebar/index.jsx",
                    lineNumber: 31,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col flex-grow relative z-10 w-full px-5 min-w-0",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                        className: "py-2 w-full scroll-smooth",
                        style: {
                            scrollbarWidth: "thin"
                        },
                        children: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$until$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["menuGroups"].map((group, groupIndex)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "animate-fade-in w-full",
                                style: {
                                    animationDelay: `${groupIndex * 0.1}s`
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                    className: "mb-2 flex flex-col gap-2 w-full",
                                    children: group.menuItems.map((menuItem, menuIndex)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Sidebar$2f$SidebarItem$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            item: menuItem,
                                            pageName: pageName,
                                            setPageName: setPageName,
                                            index: menuIndex
                                        }, menuIndex, false, {
                                            fileName: "[project]/src/components/Sidebar/index.jsx",
                                            lineNumber: 58,
                                            columnNumber: 21
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/src/components/Sidebar/index.jsx",
                                    lineNumber: 56,
                                    columnNumber: 17
                                }, this)
                            }, groupIndex, false, {
                                fileName: "[project]/src/components/Sidebar/index.jsx",
                                lineNumber: 51,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/components/Sidebar/index.jsx",
                        lineNumber: 46,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/Sidebar/index.jsx",
                    lineNumber: 45,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mt-auto px-5 py-4 relative z-10 border-t border-white/20 flex-shrink-0",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-center",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-xs text-white/80 font-medium text-center",
                            children: "© 2024 All Rights Reserved"
                        }, void 0, false, {
                            fileName: "[project]/src/components/Sidebar/index.jsx",
                            lineNumber: 75,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/Sidebar/index.jsx",
                        lineNumber: 74,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/Sidebar/index.jsx",
                    lineNumber: 73,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/Sidebar/index.jsx",
            lineNumber: 19,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/Sidebar/index.jsx",
        lineNumber: 18,
        columnNumber: 5
    }, this);
};
_s(Sidebar, "ovyRBlmxW6EOKjEShFY25lSAh/g=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$hooks$2f$useLocalStorage$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
    ];
});
_c = Sidebar;
const __TURBOPACK__default__export__ = Sidebar;
var _c;
__turbopack_refresh__.register(_c, "Sidebar");

})()),
"[project]/src/api/admin/apis.js [app-client] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, k: __turbopack_refresh__ }) => (() => {
"use strict";

__turbopack_esm__({
    "CreateAdminApi": ()=>CreateAdminApi,
    "DeleteAdminApi": ()=>DeleteAdminApi,
    "GetAdminDetailApi": ()=>GetAdminDetailApi,
    "GetAdminNotificationsApi": ()=>GetAdminNotificationsApi,
    "GetAllAdminsApi": ()=>GetAllAdminsApi,
    "GetCurrentAdminApi": ()=>GetCurrentAdminApi,
    "GetGuestInvoicesApi": ()=>GetGuestInvoicesApi,
    "GetInvoiceStatsApi": ()=>GetInvoiceStatsApi,
    "GetWalletDetailsApi": ()=>GetWalletDetailsApi,
    "GetWalletStatsApi": ()=>GetWalletStatsApi,
    "GetWithdrawalRequestsApi": ()=>GetWithdrawalRequestsApi,
    "GetWithdrawalStatsApi": ()=>GetWithdrawalStatsApi,
    "UpdateAdminApi": ()=>UpdateAdminApi,
    "UpdateWithdrawalRequestApi": ()=>UpdateWithdrawalRequestApi
});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/src/api/index.js [app-client] (ecmascript)");
"__TURBOPACK__ecmascript__hoisting__location__";
;
const GetAllAdminsApi = async (payload)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getData"])("admin/list", payload).then((data)=>{
        return data;
    });
};
_c = GetAllAdminsApi;
const GetAdminDetailApi = async (payload)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getData"])("admin/detail", payload).then((data)=>{
        return data;
    });
};
_c1 = GetAdminDetailApi;
const CreateAdminApi = async (payload)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["postRawData"])("admin/create", payload).then((data)=>{
        return data;
    });
};
_c2 = CreateAdminApi;
const UpdateAdminApi = async (payload)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["putRawData"])("admin/update", payload).then((data)=>{
        return data;
    });
};
_c3 = UpdateAdminApi;
const DeleteAdminApi = async (payload)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DeleteParams"])("admin/delete", payload).then((data)=>{
        return data;
    });
};
_c4 = DeleteAdminApi;
const GetCurrentAdminApi = async ()=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getData"])("admin/current", {}).then((data)=>{
        return data;
    });
};
_c5 = GetCurrentAdminApi;
const GetAdminNotificationsApi = async (payload)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getData"])("admin/notifications", payload).then((data)=>{
        return data;
    });
};
_c6 = GetAdminNotificationsApi;
const GetWalletStatsApi = async ()=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getData"])("wallet/stats").then((data)=>{
        return data;
    });
};
_c7 = GetWalletStatsApi;
const GetWalletDetailsApi = async ()=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getData"])("wallet/details", {}).then((data)=>{
        return data;
    });
};
_c8 = GetWalletDetailsApi;
const GetWithdrawalRequestsApi = async (payload)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getData"])("admin/organizer/withdrawalList", payload).then((data)=>{
        return data;
    });
};
_c9 = GetWithdrawalRequestsApi;
const UpdateWithdrawalRequestApi = async (payload)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["putRawData"])("admin/withdrawalStatus", payload).then((data)=>{
        return data;
    });
};
_c10 = UpdateWithdrawalRequestApi;
const GetWithdrawalStatsApi = async ()=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getData"])("admin/organizer/withdrawalStats").then((data)=>{
        return data;
    });
};
_c11 = GetWithdrawalStatsApi;
const GetInvoiceStatsApi = async ()=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getData"])("bookings/invoices/stats").then((data)=>{
        return data;
    });
};
_c12 = GetInvoiceStatsApi;
const GetGuestInvoicesApi = async (payload)=>{
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getData"])("bookings/invoices", payload).then((data)=>{
        return data;
    });
};
_c13 = GetGuestInvoicesApi;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9, _c10, _c11, _c12, _c13;
__turbopack_refresh__.register(_c, "GetAllAdminsApi");
__turbopack_refresh__.register(_c1, "GetAdminDetailApi");
__turbopack_refresh__.register(_c2, "CreateAdminApi");
__turbopack_refresh__.register(_c3, "UpdateAdminApi");
__turbopack_refresh__.register(_c4, "DeleteAdminApi");
__turbopack_refresh__.register(_c5, "GetCurrentAdminApi");
__turbopack_refresh__.register(_c6, "GetAdminNotificationsApi");
__turbopack_refresh__.register(_c7, "GetWalletStatsApi");
__turbopack_refresh__.register(_c8, "GetWalletDetailsApi");
__turbopack_refresh__.register(_c9, "GetWithdrawalRequestsApi");
__turbopack_refresh__.register(_c10, "UpdateWithdrawalRequestApi");
__turbopack_refresh__.register(_c11, "GetWithdrawalStatsApi");
__turbopack_refresh__.register(_c12, "GetInvoiceStatsApi");
__turbopack_refresh__.register(_c13, "GetGuestInvoicesApi");

})()),
"[project]/src/components/Header/DropdownUser.jsx [app-client] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, k: __turbopack_refresh__ }) => (() => {
"use strict";

__turbopack_esm__({
    "default": ()=>__TURBOPACK__default__export__
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Header$2f$ClickOutside$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/src/components/Header/ClickOutside.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$js$2d$cookie$2f$dist$2f$js$2e$cookie$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/js-cookie/dist/js.cookie.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$until$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/src/until/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$admin$2f$apis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/src/api/admin/apis.js [app-client] (ecmascript)");
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
;
const DropdownUser = ()=>{
    _s();
    const [dropdownOpen, setDropdownOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [adminData, setAdminData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const fetchAdminData = async ()=>{
            try {
                const res = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$admin$2f$apis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GetCurrentAdminApi"])();
                if (res?.status === 1 || res?.code === 200) {
                    const admin = res?.data || res;
                    setAdminData({
                        admin_name: `${admin.firstName || ''} ${admin.lastName || ''}`.trim() || "Admin",
                        profile_image: admin.image || "/assets/images/home/Profile.png"
                    });
                }
            } catch (error) {
                console.error("Error fetching admin data:", error);
                setAdminData({
                    admin_name: "Admin",
                    profile_image: "/assets/images/home/Profile.png"
                });
            }
        };
        fetchAdminData();
    }, []);
    const getGreeting = ()=>{
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 18) return "Good Afternoon";
        return "Good Evening";
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Header$2f$ClickOutside$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
        onClick: ()=>setDropdownOpen(false),
        className: "relative",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            onClick: ()=>setDropdownOpen(!dropdownOpen),
            className: "flex items-center gap-x-2 sm:gap-x-3 group hover:bg-white/50 rounded-xl px-2 py-1.5 transition-all duration-300",
            href: "#",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "text-right",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "block text-[0.600rem] sm:text-xs font-medium text-gray-600 group-hover:text-brand-pastel-gray-purple-1 transition-colors duration-300",
                            children: getGreeting()
                        }, void 0, false, {
                            fileName: "[project]/src/components/Header/DropdownUser.jsx",
                            lineNumber: 51,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "text-sm sm:text-lg leading-5 font-semibold text-gray-800 group-hover:text-brand-gray-purple-2 transition-colors duration-300",
                            children: adminData?.admin_name || "Admin"
                        }, void 0, false, {
                            fileName: "[project]/src/components/Header/DropdownUser.jsx",
                            lineNumber: 54,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/Header/DropdownUser.jsx",
                    lineNumber: 50,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "h-10 w-10 sm:h-12 sm:w-12 rounded-full border-2 border-brand-pastel-gray-purple-1/30 overflow-hidden shadow-md group-hover:shadow-lg group-hover:border-brand-pastel-gray-purple-1 transition-all duration-300 group-hover:scale-105",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        width: 120,
                        height: 120,
                        src: adminData?.profile_image || "/assets/images/home/Profile.png",
                        alt: "Admin",
                        className: "w-full h-auto object-cover"
                    }, void 0, false, {
                        fileName: "[project]/src/components/Header/DropdownUser.jsx",
                        lineNumber: 59,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/Header/DropdownUser.jsx",
                    lineNumber: 58,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/Header/DropdownUser.jsx",
            lineNumber: 45,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/Header/DropdownUser.jsx",
        lineNumber: 44,
        columnNumber: 5
    }, this);
};
_s(DropdownUser, "Zc6INI6PfW16FihvgmYu096hOCo=");
_c = DropdownUser;
const __TURBOPACK__default__export__ = DropdownUser;
var _c;
__turbopack_refresh__.register(_c, "DropdownUser");

})()),
"[project]/src/components/ui/PageTitle.jsx [app-client] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, k: __turbopack_refresh__ }) => (() => {
"use strict";

__turbopack_esm__({
    "default": ()=>PageTitle
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/link.js [app-client] (ecmascript)");
"__TURBOPACK__ecmascript__hoisting__location__";
;
var _s = __turbopack_refresh__.signature();
;
;
;
function PageTitle({ title, breadcrumbs = [], className }) {
    _s();
    const [isNotificationsOpen, setIsNotificationsOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const toggleNotifications = ()=>{
        setIsNotificationsOpen(!isNotificationsOpen);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
        className: `w-full sm:w-auto flex items-center text-gray-700 rounded-lg px-3 sm:px-5 lg:px-0 ${className}`,
        "aria-label": "Breadcrumb",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ol", {
            className: "inline-flex items-center gap-2",
            children: breadcrumbs.map((item, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                    className: "inline-flex items-center animate-fade-in",
                    style: {
                        animationDelay: `${index * 0.1}s`
                    },
                    children: [
                        index > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            className: "w-4 h-4 sm:w-5 sm:h-5 text-brand-pastel-gray-purple-1 mx-2 transition-colors duration-300",
                            fill: "currentColor",
                            viewBox: "0 0 20 20",
                            xmlns: "http://www.w3.org/2000/svg",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                d: "M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                            }, void 0, false, {
                                fileName: "[project]/src/components/ui/PageTitle.jsx",
                                lineNumber: 19,
                                columnNumber: 33
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/ui/PageTitle.jsx",
                            lineNumber: 18,
                            columnNumber: 29
                        }, this),
                        item.isCurrent ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-xs lg:text-sm text-gray-800 font-semibold bg-gradient-to-r from-brand-pastel-gray-purple-1 to-brand-gray-purple-2 bg-clip-text text-transparent",
                            children: item.label
                        }, void 0, false, {
                            fileName: "[project]/src/components/ui/PageTitle.jsx",
                            lineNumber: 23,
                            columnNumber: 29
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: item.href,
                            className: "text-brand-pastel-gray-purple-1 hover:text-brand-gray-purple-2 font-semibold inline-flex items-center text-xs lg:text-sm transition-colors duration-300 hover:underline",
                            children: item.label
                        }, void 0, false, {
                            fileName: "[project]/src/components/ui/PageTitle.jsx",
                            lineNumber: 27,
                            columnNumber: 29
                        }, this)
                    ]
                }, index, true, {
                    fileName: "[project]/src/components/ui/PageTitle.jsx",
                    lineNumber: 16,
                    columnNumber: 21
                }, this))
        }, void 0, false, {
            fileName: "[project]/src/components/ui/PageTitle.jsx",
            lineNumber: 14,
            columnNumber: 13
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/ui/PageTitle.jsx",
        lineNumber: 13,
        columnNumber: 9
    }, this);
}
_s(PageTitle, "/k95G8PujjEpIR22HUwrg6kbXiQ=");
_c = PageTitle;
var _c;
__turbopack_refresh__.register(_c, "PageTitle");

})()),
"[project]/src/components/ui/Searchbar.jsx [app-client] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, k: __turbopack_refresh__ }) => (() => {
"use strict";

// Searchbar.js
__turbopack_esm__({
    "default": ()=>__TURBOPACK__default__export__
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
"__TURBOPACK__ecmascript__hoisting__location__";
;
;
;
const SearchBar = ({ search, setSearch, setPage })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex gap-x-3",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center border-2 border-brand-pastel-gray-purple-1/30 bg-white/90 backdrop-blur-sm rounded-xl overflow-hidden w-[250px] sm:w-[300px] shadow-md hover:shadow-lg hover:border-brand-pastel-gray-purple-1/50 transition-all duration-300 focus-within:border-brand-pastel-gray-purple-1 focus-within:shadow-lg",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        src: "/assets/images/home/search.png",
                        height: 20,
                        width: 20,
                        alt: "Search",
                        className: "ml-3 opacity-60"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/Searchbar.jsx",
                        lineNumber: 10,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "text",
                        value: search,
                        onChange: (e)=>{
                            setSearch(e.target.value);
                            setPage(1); // Reset to first page on search
                        },
                        placeholder: "Search by Organizer name/ID..",
                        className: "w-full p-2.5 outline-none text-sm text-gray-800 placeholder:text-gray-400 placeholder:text-xs bg-transparent"
                    }, void 0, false, {
                        fileName: "[project]/src/components/ui/Searchbar.jsx",
                        lineNumber: 11,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ui/Searchbar.jsx",
                lineNumber: 9,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                className: "py-2.5 px-6 rounded-xl bg-gradient-to-r from-brand-pastel-gray-purple-1 to-brand-gray-purple-2 hover:from-brand-gray-purple-2 hover:to-brand-pastel-gray-purple-1 text-white text-sm font-semibold capitalize shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95",
                children: "search"
            }, void 0, false, {
                fileName: "[project]/src/components/ui/Searchbar.jsx",
                lineNumber: 22,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/Searchbar.jsx",
        lineNumber: 8,
        columnNumber: 5
    }, this);
};
_c = SearchBar;
const __TURBOPACK__default__export__ = SearchBar;
var _c;
__turbopack_refresh__.register(_c, "SearchBar");

})()),
"[project]/src/components/Header/NotificationBell.jsx [app-client] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, k: __turbopack_refresh__ }) => (() => {
"use strict";

__turbopack_esm__({
    "default": ()=>__TURBOPACK__default__export__
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Header$2f$ClickOutside$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/src/components/Header/ClickOutside.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$admin$2f$apis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/src/api/admin/apis.js [app-client] (ecmascript)");
"__TURBOPACK__ecmascript__hoisting__location__";
;
var _s = __turbopack_refresh__.signature();
"use client";
;
;
;
;
const NotificationBell = ()=>{
    _s();
    const [notifications, setNotifications] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [unreadCount, setUnreadCount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [showDropdown, setShowDropdown] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        fetchNotifications();
        // Poll for new notifications every 30 seconds
        const interval = setInterval(fetchNotifications, 30000);
        return ()=>clearInterval(interval);
    }, []);
    const fetchNotifications = async ()=>{
        try {
            const res = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$admin$2f$apis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GetAdminNotificationsApi"])({
                page: 1,
                limit: 20
            });
            if (res?.status === 1 || res?.code === 200) {
                const notifications = res?.data || [];
                setNotifications(notifications.map((n)=>{
                    // Map notification_type to type string
                    let typeStr = "other";
                    if (n.notification_type === 1) typeStr = "organizer";
                    else if (n.notification_type === 2) typeStr = "event";
                    else if (n.notification_type === 4) typeStr = "withdrawal";
                    return {
                        _id: n._id,
                        message: n.description || n.text || n.title || "Notification",
                        type: typeStr,
                        is_read: n.isRead || n.is_read || false,
                        created_at: n.createdAt || n.created_at || new Date()
                    };
                }));
                setUnreadCount(notifications.filter((n)=>!(n.isRead || n.is_read)).length);
            }
        } catch (error) {
            console.error("Error fetching notifications:", error);
        }
    };
    const markAsRead = async (id)=>{
        // TODO: Replace with actual API call
        // await MarkNotificationReadApi(id);
        setNotifications(notifications.map((n)=>n._id === id ? {
                ...n,
                is_read: true
            } : n));
        setUnreadCount(Math.max(0, unreadCount - 1));
    };
    const markAllAsRead = async ()=>{
        // TODO: Replace with actual API call
        // await MarkAllNotificationsReadApi();
        setNotifications(notifications.map((n)=>({
                ...n,
                is_read: true
            })));
        setUnreadCount(0);
    };
    const getNotificationIcon = (type)=>{
        switch(type){
            case "organizer":
                return "/assets/images/menu/event-org.png";
            case "event":
                return "/assets/images/menu/event.png";
            case "withdrawal":
                return "/assets/images/menu/wallet.png";
            default:
                return "/assets/images/home/notification.png";
        }
    };
    const getNotificationLink = (type)=>{
        switch(type){
            case "organizer":
                return "/organizer";
            case "event":
                return "/events";
            case "withdrawal":
                return "/withdrawal-requests";
            default:
                return "#";
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Header$2f$ClickOutside$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
        onClick: ()=>setShowDropdown(false),
        className: "relative",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center mr-3",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: ()=>setShowDropdown(!showDropdown),
                    className: "relative p-2 rounded-xl hover:bg-brand-pastel-gray-purple-1/10 transition-all duration-300 hover:scale-110 active:scale-95 group",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            src: "/assets/images/home/notification.png",
                            alt: "Notification",
                            height: 23,
                            width: 23,
                            className: "w-[18px] sm:w-[23px] transition-transform duration-300 group-hover:brightness-110"
                        }, void 0, false, {
                            fileName: "[project]/src/components/Header/NotificationBell.jsx",
                            lineNumber: 93,
                            columnNumber: 11
                        }, this),
                        unreadCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-[0.55rem] sm:text-[0.65rem] font-bold w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center shadow-lg animate-pulse-slow border-2 border-white",
                            children: unreadCount > 9 ? "9+" : unreadCount
                        }, void 0, false, {
                            fileName: "[project]/src/components/Header/NotificationBell.jsx",
                            lineNumber: 101,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/Header/NotificationBell.jsx",
                    lineNumber: 89,
                    columnNumber: 9
                }, this),
                showDropdown && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "absolute right-0 top-14 w-80 bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl z-[10000] max-h-96 overflow-hidden border border-brand-pastel-gray-purple-1/20 animate-scale-in",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-4 border-b border-brand-pastel-gray-purple-1/20 flex justify-between items-center bg-gradient-to-r from-brand-pastel-gray-purple-1/5 to-transparent",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "font-semibold text-gray-900 text-lg",
                                    children: "Notifications"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/Header/NotificationBell.jsx",
                                    lineNumber: 110,
                                    columnNumber: 15
                                }, this),
                                unreadCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: markAllAsRead,
                                    className: "text-sm text-brand-pastel-gray-purple-1 hover:text-brand-gray-purple-2 font-medium hover:underline transition-colors duration-300",
                                    children: "Mark all as read"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/Header/NotificationBell.jsx",
                                    lineNumber: 112,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/Header/NotificationBell.jsx",
                            lineNumber: 109,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "divide-y divide-brand-pastel-gray-purple-1/10 max-h-80 overflow-y-auto",
                            children: notifications.length > 0 ? notifications.map((notification, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                    href: getNotificationLink(notification.type),
                                    onClick: ()=>{
                                        if (!notification.is_read) {
                                            markAsRead(notification._id);
                                        }
                                        setShowDropdown(false);
                                    },
                                    className: `block p-4 hover:bg-gradient-to-r hover:from-brand-pastel-gray-purple-1/10 hover:to-transparent transition-all duration-300 ${!notification.is_read ? "bg-gradient-to-r from-brand-pastel-gray-purple-1/5 to-transparent border-l-4 border-brand-pastel-gray-purple-1" : ""}`,
                                    style: {
                                        animationDelay: `${index * 0.05}s`
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-start gap-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "p-2 rounded-lg bg-brand-pastel-gray-purple-1/10",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                    src: getNotificationIcon(notification.type),
                                                    alt: notification.type,
                                                    width: 20,
                                                    height: 20,
                                                    className: "mt-0"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/Header/NotificationBell.jsx",
                                                    lineNumber: 139,
                                                    columnNumber: 25
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/Header/NotificationBell.jsx",
                                                lineNumber: 138,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: `text-sm ${!notification.is_read ? "font-semibold text-gray-900" : "text-gray-700"}`,
                                                        children: notification.message
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/Header/NotificationBell.jsx",
                                                        lineNumber: 148,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-xs text-gray-500 mt-1.5",
                                                        children: new Date(notification.created_at).toLocaleString()
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/Header/NotificationBell.jsx",
                                                        lineNumber: 151,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/Header/NotificationBell.jsx",
                                                lineNumber: 147,
                                                columnNumber: 23
                                            }, this),
                                            !notification.is_read && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "w-2.5 h-2.5 bg-gradient-to-r from-brand-pastel-gray-purple-1 to-brand-gray-purple-2 rounded-full mt-2 animate-pulse-slow"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/Header/NotificationBell.jsx",
                                                lineNumber: 156,
                                                columnNumber: 25
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/Header/NotificationBell.jsx",
                                        lineNumber: 137,
                                        columnNumber: 21
                                    }, this)
                                }, notification._id, false, {
                                    fileName: "[project]/src/components/Header/NotificationBell.jsx",
                                    lineNumber: 123,
                                    columnNumber: 19
                                }, this)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "p-8 text-center text-gray-500 text-sm",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-4xl mb-2",
                                        children: "🔔"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Header/NotificationBell.jsx",
                                        lineNumber: 163,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: "No notifications"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Header/NotificationBell.jsx",
                                        lineNumber: 164,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/Header/NotificationBell.jsx",
                                lineNumber: 162,
                                columnNumber: 17
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/Header/NotificationBell.jsx",
                            lineNumber: 120,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/Header/NotificationBell.jsx",
                    lineNumber: 108,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/Header/NotificationBell.jsx",
            lineNumber: 88,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/Header/NotificationBell.jsx",
        lineNumber: 87,
        columnNumber: 5
    }, this);
};
_s(NotificationBell, "sqKfwGOhj9xhUn+OWyji7ePUBmI=");
_c = NotificationBell;
const __TURBOPACK__default__export__ = NotificationBell;
var _c;
__turbopack_refresh__.register(_c, "NotificationBell");

})()),
"[project]/src/components/LanguageSwitcher/LanguageSwitcher.jsx [app-client] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, k: __turbopack_refresh__ }) => (() => {
"use strict";

__turbopack_esm__({
    "default": ()=>__TURBOPACK__default__export__
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_import__("[project]/node_modules/react-i18next/dist/es/index.js [app-client] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$useTranslation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/react-i18next/dist/es/useTranslation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/react-icons/fa/index.mjs [app-client] (ecmascript)");
"__TURBOPACK__ecmascript__hoisting__location__";
;
var _s = __turbopack_refresh__.signature();
"use client";
;
;
;
const LanguageSwitcher = ()=>{
    _s();
    const { i18n, t } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$useTranslation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTranslation"])();
    const [isOpen, setIsOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const dropdownRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const languages = [
        {
            code: "en",
            name: "English",
            nativeName: "English",
            flag: "🇬🇧"
        },
        {
            code: "ar",
            name: "Arabic",
            nativeName: "العربية",
            flag: "🇸🇦"
        }
    ];
    const currentLanguage = languages.find((lang)=>lang.code === i18n.language) || languages[0];
    const changeLanguage = (langCode)=>{
        i18n.changeLanguage(langCode);
        localStorage.setItem("i18nextLng", langCode);
        // Update document direction
        document.documentElement.dir = langCode === "ar" ? "rtl" : "ltr";
        document.documentElement.lang = langCode;
        setIsOpen(false);
        // Reload page to apply direction changes properly and prevent hydration issues
        window.location.reload();
    };
    // Close dropdown when clicking outside
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const handleClickOutside = (event)=>{
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return ()=>document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative",
        ref: dropdownRef,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: ()=>setIsOpen(!isOpen),
                className: "flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#a797cc] focus:ring-offset-2 transition-colors",
                "aria-label": "Change language",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FaGlobe"], {
                        className: "w-4 h-4"
                    }, void 0, false, {
                        fileName: "[project]/src/components/LanguageSwitcher/LanguageSwitcher.jsx",
                        lineNumber: 53,
                        columnNumber: 5
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "hidden sm:inline",
                        children: currentLanguage.flag
                    }, void 0, false, {
                        fileName: "[project]/src/components/LanguageSwitcher/LanguageSwitcher.jsx",
                        lineNumber: 54,
                        columnNumber: 5
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "hidden md:inline",
                        children: currentLanguage.nativeName
                    }, void 0, false, {
                        fileName: "[project]/src/components/LanguageSwitcher/LanguageSwitcher.jsx",
                        lineNumber: 55,
                        columnNumber: 5
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                        className: `w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`,
                        fill: "none",
                        stroke: "currentColor",
                        viewBox: "0 0 24 24",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                            strokeLinecap: "round",
                            strokeLinejoin: "round",
                            strokeWidth: 2,
                            d: "M19 9l-7 7-7-7"
                        }, void 0, false, {
                            fileName: "[project]/src/components/LanguageSwitcher/LanguageSwitcher.jsx",
                            lineNumber: 62,
                            columnNumber: 6
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/LanguageSwitcher/LanguageSwitcher.jsx",
                        lineNumber: 56,
                        columnNumber: 5
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/LanguageSwitcher/LanguageSwitcher.jsx",
                lineNumber: 48,
                columnNumber: 4
            }, this),
            isOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50",
                children: languages.map((lang)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>changeLanguage(lang.code),
                        className: `w-full flex items-center gap-3 px-4 py-2 text-sm text-left hover:bg-gray-50 transition-colors ${currentLanguage.code === lang.code ? "bg-[#a797cc]/10 text-[#a797cc] font-medium" : "text-gray-700"}`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-xl",
                                children: lang.flag
                            }, void 0, false, {
                                fileName: "[project]/src/components/LanguageSwitcher/LanguageSwitcher.jsx",
                                lineNumber: 83,
                                columnNumber: 8
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: lang.nativeName
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/LanguageSwitcher/LanguageSwitcher.jsx",
                                        lineNumber: 85,
                                        columnNumber: 9
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xs text-gray-500",
                                        children: lang.name
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/LanguageSwitcher/LanguageSwitcher.jsx",
                                        lineNumber: 86,
                                        columnNumber: 9
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/LanguageSwitcher/LanguageSwitcher.jsx",
                                lineNumber: 84,
                                columnNumber: 8
                            }, this),
                            currentLanguage.code === lang.code && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                className: "w-4 h-4 ml-auto text-[#a797cc]",
                                fill: "currentColor",
                                viewBox: "0 0 20 20",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    fillRule: "evenodd",
                                    d: "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z",
                                    clipRule: "evenodd"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/LanguageSwitcher/LanguageSwitcher.jsx",
                                    lineNumber: 94,
                                    columnNumber: 10
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/LanguageSwitcher/LanguageSwitcher.jsx",
                                lineNumber: 89,
                                columnNumber: 9
                            }, this)
                        ]
                    }, lang.code, true, {
                        fileName: "[project]/src/components/LanguageSwitcher/LanguageSwitcher.jsx",
                        lineNumber: 74,
                        columnNumber: 7
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/components/LanguageSwitcher/LanguageSwitcher.jsx",
                lineNumber: 72,
                columnNumber: 5
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/LanguageSwitcher/LanguageSwitcher.jsx",
        lineNumber: 47,
        columnNumber: 3
    }, this);
};
_s(LanguageSwitcher, "YbtBu5uKDQknLVJNkWQN024LUlQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$i18next$2f$dist$2f$es$2f$useTranslation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTranslation"]
    ];
});
_c = LanguageSwitcher;
const __TURBOPACK__default__export__ = LanguageSwitcher;
var _c;
__turbopack_refresh__.register(_c, "LanguageSwitcher");

})()),
"[project]/src/components/Header/index.jsx [app-client] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, k: __turbopack_refresh__ }) => (() => {
"use strict";

__turbopack_esm__({
    "default": ()=>__TURBOPACK__default__export__
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$move$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MoveRightIcon$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/move-right.js [app-client] (ecmascript) <export default as MoveRightIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Header$2f$DropdownUser$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/src/components/Header/DropdownUser.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$PageTitle$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/src/components/ui/PageTitle.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Searchbar$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/src/components/ui/Searchbar.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$until$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/src/until/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$js$2d$cookie$2f$dist$2f$js$2e$cookie$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/js-cookie/dist/js.cookie.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Header$2f$NotificationBell$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/src/components/Header/NotificationBell.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$LanguageSwitcher$2f$LanguageSwitcher$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/src/components/LanguageSwitcher/LanguageSwitcher.jsx [app-client] (ecmascript)");
"__TURBOPACK__ecmascript__hoisting__location__";
;
var _s = __turbopack_refresh__.signature();
;
;
;
;
;
;
;
;
;
;
const Header = ({ sidebarOpen, setSidebarOpen, search, setSearch, setPage })=>{
    _s();
    const { push } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    async function logout(e) {
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$js$2d$cookie$2f$dist$2f$js$2e$cookie$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].remove(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$until$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TOKEN_NAME"]);
        push("/");
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "sticky top-0 z-[999] flex w-full mt-4 animate-fade-in",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-grow items-center justify-between px-4 py-4 bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg shadow-brand-pastel-gray-purple-1/20 border border-white/50 hover:shadow-xl hover:shadow-brand-pastel-gray-purple-1/30 transition-all duration-300",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-2 sm:gap-4 lg:hidden",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                "aria-controls": "sidebar",
                                onClick: (e)=>{
                                    e.stopPropagation();
                                    setSidebarOpen(!sidebarOpen);
                                },
                                className: "z-[99999] block rounded-xl border-2 border-brand-pastel-gray-purple-1 bg-white p-2 shadow-md hover:shadow-lg hover:bg-brand-pastel-gray-purple-1/10 transition-all duration-300 lg:hidden group",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "relative block h-5 w-6 cursor-pointer",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "du-block absolute right-0 h-full w-full",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: `relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-brand-pastel-gray-purple-1 delay-[0] duration-200 ease-in-out transition-all ${!sidebarOpen && "!w-full delay-300"}`
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/Header/index.jsx",
                                                    lineNumber: 36,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: `relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-brand-pastel-gray-purple-1 delay-150 duration-200 ease-in-out transition-all ${!sidebarOpen && "delay-400 !w-full"}`
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/Header/index.jsx",
                                                    lineNumber: 39,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: `relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-brand-pastel-gray-purple-1 delay-200 duration-200 ease-in-out transition-all ${!sidebarOpen && "!w-full delay-500"}`
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/Header/index.jsx",
                                                    lineNumber: 42,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/Header/index.jsx",
                                            lineNumber: 35,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "absolute right-0 h-full w-full rotate-45",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: `absolute left-2.5 top-0 block h-full w-0.5 rounded-sm bg-brand-pastel-gray-purple-1 delay-300 duration-200 ease-in-out transition-all ${!sidebarOpen && "!h-0 !delay-[0]"}`
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/Header/index.jsx",
                                                    lineNumber: 47,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: `delay-400 absolute left-0 top-2.5 block h-0.5 w-full rounded-sm bg-brand-pastel-gray-purple-1 duration-200 ease-in-out transition-all ${!sidebarOpen && "!h-0 !delay-200"}`
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/Header/index.jsx",
                                                    lineNumber: 50,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/Header/index.jsx",
                                            lineNumber: 46,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/Header/index.jsx",
                                    lineNumber: 34,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/Header/index.jsx",
                                lineNumber: 26,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/Header/index.jsx",
                            lineNumber: 24,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "hidden lg:block animate-fade-in",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Searchbar$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                search: search,
                                setSearch: setSearch,
                                setPage: setPage
                            }, void 0, false, {
                                fileName: "[project]/src/components/Header/index.jsx",
                                lineNumber: 60,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/Header/index.jsx",
                            lineNumber: 59,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-x-2 sm:gap-x-4 lg:gap-x-3 xl:gap-x-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "animate-fade-in",
                                    style: {
                                        animationDelay: '0.1s'
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$LanguageSwitcher$2f$LanguageSwitcher$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                        fileName: "[project]/src/components/Header/index.jsx",
                                        lineNumber: 67,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/Header/index.jsx",
                                    lineNumber: 66,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "animate-fade-in",
                                    style: {
                                        animationDelay: '0.2s'
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Header$2f$NotificationBell$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                        fileName: "[project]/src/components/Header/index.jsx",
                                        lineNumber: 72,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/Header/index.jsx",
                                    lineNumber: 71,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "animate-fade-in",
                                    style: {
                                        animationDelay: '0.3s'
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Header$2f$DropdownUser$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                        fileName: "[project]/src/components/Header/index.jsx",
                                        lineNumber: 77,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/Header/index.jsx",
                                    lineNumber: 76,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "animate-fade-in",
                                    style: {
                                        animationDelay: '0.4s'
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: (e)=>{
                                            logout(e);
                                        },
                                        className: "w-full flex items-center justify-center gap-2 p-2 sm:p-2.5 rounded-xl text-white text-sm font-semibold bg-gradient-to-r from-brand-pastel-gray-purple-1 to-brand-gray-purple-2 hover:from-brand-gray-purple-2 hover:to-brand-pastel-gray-purple-1 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                src: "/assets/images/home/logout.png",
                                                alt: "Logout",
                                                height: 20,
                                                width: 20,
                                                className: "w-[16px] sm:w-[20px] transition-transform duration-300 group-hover:rotate-12"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/Header/index.jsx",
                                                lineNumber: 88,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "hidden sm:inline",
                                                children: "Logout"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/Header/index.jsx",
                                                lineNumber: 89,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/Header/index.jsx",
                                        lineNumber: 82,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/Header/index.jsx",
                                    lineNumber: 81,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/Header/index.jsx",
                            lineNumber: 63,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/Header/index.jsx",
                    lineNumber: 23,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/Header/index.jsx",
                lineNumber: 22,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-5 block lg:hidden animate-fade-in",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ui$2f$Searchbar$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                    fileName: "[project]/src/components/Header/index.jsx",
                    lineNumber: 97,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/Header/index.jsx",
                lineNumber: 96,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
};
_s(Header, "qsDkn33CqmlEcFEENil8IeDjAvk=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = Header;
const __TURBOPACK__default__export__ = Header;
var _c;
__turbopack_refresh__.register(_c, "Header");

})()),
"[project]/src/components/Layouts/DefaultLayout.jsx [app-client] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, k: __turbopack_refresh__ }) => (() => {
"use strict";

__turbopack_esm__({
    "default": ()=>DefaultLayout
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Sidebar$2f$index$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/src/components/Sidebar/index.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Header$2f$index$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/src/components/Header/index.jsx [app-client] (ecmascript)");
"__TURBOPACK__ecmascript__hoisting__location__";
;
var _s = __turbopack_refresh__.signature();
"use client";
;
;
;
function DefaultLayout({ children, title, breadcrumbs, search, setSearch, setPage }) {
    _s();
    const [sidebarOpen, setSidebarOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex min-h-screen bg-[#b0a0df] transition-all duration-300",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Sidebar$2f$index$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    sidebarOpen: sidebarOpen,
                    setSidebarOpen: setSidebarOpen
                }, void 0, false, {
                    fileName: "[project]/src/components/Layouts/DefaultLayout.jsx",
                    lineNumber: 14,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "overflow-auto relative flex flex-1 flex-col lg:ml-[320px] px-4 sm:px-6 transition-all duration-300",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Header$2f$index$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            sidebarOpen: sidebarOpen,
                            setSidebarOpen: setSidebarOpen,
                            title: title,
                            breadcrumbs: breadcrumbs,
                            search: search,
                            setSearch: setSearch,
                            setPage: setPage
                        }, void 0, false, {
                            fileName: "[project]/src/components/Layouts/DefaultLayout.jsx",
                            lineNumber: 20,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                            className: "flex-1 py-6 animate-fade-in",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mx-auto max-w-screen-2xl",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "transition-all duration-300",
                                    children: children
                                }, void 0, false, {
                                    fileName: "[project]/src/components/Layouts/DefaultLayout.jsx",
                                    lineNumber: 34,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/Layouts/DefaultLayout.jsx",
                                lineNumber: 33,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/components/Layouts/DefaultLayout.jsx",
                            lineNumber: 32,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/Layouts/DefaultLayout.jsx",
                    lineNumber: 18,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/Layouts/DefaultLayout.jsx",
            lineNumber: 12,
            columnNumber: 7
        }, this)
    }, void 0, false);
}
_s(DefaultLayout, "5rGDkYpGQ8fHM9RkMWnKOwsxadk=");
_c = DefaultLayout;
var _c;
__turbopack_refresh__.register(_c, "DefaultLayout");

})()),
"[project]/src/components/Modals/RejectEventModal.jsx [app-client] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, k: __turbopack_refresh__ }) => (() => {
"use strict";

__turbopack_esm__({
    "default": ()=>__TURBOPACK__default__export__
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
"__TURBOPACK__ecmascript__hoisting__location__";
;
var _s = __turbopack_refresh__.signature();
"use client";
;
function RejectEventModal({ show, onClose, onConfirm, title, message }) {
    _s();
    const [rejectionReason, setRejectionReason] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const handleConfirm = ()=>{
        if (!rejectionReason.trim()) {
            alert("Please provide a reason for rejection");
            return;
        }
        onConfirm(rejectionReason);
        setRejectionReason(""); // Reset after confirmation
    };
    const handleClose = ()=>{
        setRejectionReason(""); // Reset on close
        onClose();
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[10000] ${show ? '' : 'hidden'}`,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-white p-6 rounded-lg shadow-lg max-w-md w-full",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                    className: "text-lg font-semibold text-gray-900 mb-2",
                    children: title
                }, void 0, false, {
                    fileName: "[project]/src/components/Modals/RejectEventModal.jsx",
                    lineNumber: 24,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-sm text-gray-800 mb-4",
                    children: message
                }, void 0, false, {
                    fileName: "[project]/src/components/Modals/RejectEventModal.jsx",
                    lineNumber: 25,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mb-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            className: "block text-sm font-medium text-gray-700 mb-2",
                            children: [
                                "Rejection Reason ",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-red-500",
                                    children: "*"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/Modals/RejectEventModal.jsx",
                                    lineNumber: 29,
                                    columnNumber: 30
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/Modals/RejectEventModal.jsx",
                            lineNumber: 28,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                            value: rejectionReason,
                            onChange: (e)=>setRejectionReason(e.target.value),
                            className: "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a797cc] focus:border-transparent",
                            rows: "4",
                            placeholder: "Please specify the reason for rejecting this event...",
                            required: true
                        }, void 0, false, {
                            fileName: "[project]/src/components/Modals/RejectEventModal.jsx",
                            lineNumber: 31,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/Modals/RejectEventModal.jsx",
                    lineNumber: 27,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex justify-end space-x-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: handleClose,
                            className: "px-4 py-2 bg-gray-300 rounded-lg text-gray-900 hover:bg-gray-400 transition",
                            children: "Cancel"
                        }, void 0, false, {
                            fileName: "[project]/src/components/Modals/RejectEventModal.jsx",
                            lineNumber: 42,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: "px-4 py-2 bg-[#e94e2e] text-white rounded-lg hover:bg-[#d43e1e] transition",
                            onClick: handleConfirm,
                            children: "Reject Event"
                        }, void 0, false, {
                            fileName: "[project]/src/components/Modals/RejectEventModal.jsx",
                            lineNumber: 48,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/Modals/RejectEventModal.jsx",
                    lineNumber: 41,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/Modals/RejectEventModal.jsx",
            lineNumber: 23,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/Modals/RejectEventModal.jsx",
        lineNumber: 22,
        columnNumber: 5
    }, this);
}
_s(RejectEventModal, "nguaRFyQscVYgiitpcREXQ8AH0w=");
_c = RejectEventModal;
const __TURBOPACK__default__export__ = RejectEventModal;
var _c;
__turbopack_refresh__.register(_c, "RejectEventModal");

})()),
"[project]/src/app/(AfterLogin)/events/detail/[id]/page.js [app-client] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, k: __turbopack_refresh__ }) => (() => {
"use strict";

__turbopack_esm__({
    "default": ()=>EventDetail
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$store$2f$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/src/api/store/store.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Layouts$2f$DefaultLayout$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/src/components/Layouts/DefaultLayout.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$react$2d$toastify$2e$esm$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/react-toastify/dist/react-toastify.esm.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$events$2f$apis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/src/api/events/apis.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Modals$2f$RejectEventModal$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/src/components/Modals/RejectEventModal.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/calendar.js [app-client] (ecmascript) <export default as Calendar>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/clock.js [app-client] (ecmascript) <export default as Clock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/map-pin.js [app-client] (ecmascript) <export default as MapPin>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$dollar$2d$sign$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__DollarSign$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/dollar-sign.js [app-client] (ecmascript) <export default as DollarSign>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/users.js [app-client] (ecmascript) <export default as Users>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/circle-check.js [app-client] (ecmascript) <export default as CheckCircle2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/circle-x.js [app-client] (ecmascript) <export default as XCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/circle-alert.js [app-client] (ecmascript) <export default as AlertCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/arrow-left.js [app-client] (ecmascript) <export default as ArrowLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$phone$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Phone$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/phone.js [app-client] (ecmascript) <export default as Phone>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/mail.js [app-client] (ecmascript) <export default as Mail>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/user.js [app-client] (ecmascript) <export default as User>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/file-text.js [app-client] (ecmascript) <export default as FileText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Image$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/image.js [app-client] (ecmascript) <export default as Image>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/chevron-left.js [app-client] (ecmascript) <export default as ChevronLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_import__("[project]/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-client] (ecmascript) <export default as ChevronRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
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
;
;
;
// Helper function to get proper image URL
const getEventImageUrl = (event)=>{
    // Check for event_image first
    let imageUrl = event?.event_image;
    // If no event_image, check event_images array
    if (!imageUrl && event?.event_images && Array.isArray(event.event_images) && event.event_images.length > 0) {
        imageUrl = event.event_images[0];
    }
    // If still no image, return dummy
    if (!imageUrl) {
        return "/assets/images/dummyImage.png";
    }
    // If already absolute URL (http/https), return as is
    if (imageUrl.includes("http://") || imageUrl.includes("https://")) {
        return imageUrl;
    }
    // If relative path (starts with /uploads/), construct absolute URL
    if (imageUrl.startsWith("/uploads/")) {
        const apiBase = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_API_BASE || "http://localhost:3434";
        // Remove /api/admin/ or /api/ from base URL if present
        const baseUrl = apiBase.replace(/\/api\/admin\/?$/, "").replace(/\/api\/?$/, "");
        return `${baseUrl}${imageUrl}`;
    }
    // If it's a relative path without /uploads/, try to construct URL
    if (imageUrl.startsWith("/")) {
        const apiBase = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_API_BASE || "http://localhost:3434";
        const baseUrl = apiBase.replace(/\/api\/admin\/?$/, "").replace(/\/api\/?$/, "");
        return `${baseUrl}${imageUrl}`;
    }
    // Default fallback
    return "/assets/images/dummyImage.png";
};
function EventDetail() {
    _s();
    const { id } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showRejectModal, setShowRejectModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [currentImageIndex, setCurrentImageIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const detail = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$store$2f$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDataStore"])((store)=>store.EventsDetail);
    const { fetchEventsDetail } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$store$2f$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDataStore"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (id) {
            setLoading(true);
            fetchEventsDetail({
                id: id
            }).then(()=>{
                setLoading(false);
            }).catch((err)=>{
                console.error("[EVENT-DETAIL] Error:", err);
                setLoading(false);
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$react$2d$toastify$2e$esm$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error("Failed to fetch Event details");
            });
        }
    }, [
        id,
        fetchEventsDetail
    ]);
    // Function to change event status (Accept/Reject)
    const ChangeEventStatus = (newStatus, rejectionReason = "")=>{
        if (!detail?._id) {
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$react$2d$toastify$2e$esm$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error("Event ID not found");
            return;
        }
        setLoading(true);
        const data = {
            eventId: detail._id,
            status: newStatus,
            rejectionReason: rejectionReason || null
        };
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$events$2f$apis$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ChangeEventStatusApi"])(data).then((res)=>{
            if (res?.status === 1) {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$react$2d$toastify$2e$esm$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success(res?.message || "Event status updated successfully");
                // Refresh details after status change
                setTimeout(()=>{
                    fetchEventsDetail({
                        id: detail._id
                    }).then(()=>{
                    // Optionally redirect to events list
                    // router.push("/events");
                    }).catch((err)=>{
                        console.error("[EVENT-STATUS] Error refreshing details:", err);
                    });
                }, 500);
                setShowRejectModal(false);
            } else {
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$react$2d$toastify$2e$esm$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(res?.message || "Failed to update event status");
            }
        }).catch((err)=>{
            console.error("[EVENT-STATUS] Error:", err);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$react$2d$toastify$2e$esm$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(err?.response?.data?.message || "Failed to update event status");
        }).finally(()=>setLoading(false));
    };
    const handleReject = (reason)=>{
        ChangeEventStatus(4, reason); // 4 = Rejected
    };
    const getStatusBadge = ()=>{
        // Check is_approved first (backend field: 0=Pending, 1=Approved, 2=Rejected)
        // Then check event_status (frontend mapped: 1=Pending, 2=Upcoming, 3=Completed, 4=Rejected)
        const isApproved = detail?.is_approved === 1;
        const isRejectedApproved = detail?.is_approved === 2;
        const isPendingApproved = detail?.is_approved === 0 || detail?.is_approved === undefined || detail?.is_approved === null;
        const eventStatus = detail?.event_status;
        // Determine status based on both fields
        let isPending = false;
        let isUpcoming = false;
        let isCompleted = false;
        let isRejected = false;
        if (isRejectedApproved || eventStatus === 4) {
            isRejected = true;
        } else if (isPendingApproved || eventStatus === 1) {
            isPending = true;
        } else if (isApproved || eventStatus === 2) {
            // Check if event date has passed for Completed status
            if (eventStatus === 3) {
                isCompleted = true;
            } else {
                // Check if event date is in the past
                const eventDate = detail?.event_date ? new Date(detail.event_date) : null;
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                if (eventDate && eventDate < today) {
                    isCompleted = true;
                } else {
                    isUpcoming = true;
                }
            }
        } else if (eventStatus === 3) {
            isCompleted = true;
        } else {
            // Default to pending if status is unclear
            isPending = true;
        }
        if (isPending) {
            return {
                text: "Pending",
                className: "bg-yellow-100 text-yellow-800 border-yellow-300",
                icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"], {
                    className: "w-4 h-4"
                }, void 0, false, {
                    fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                    lineNumber: 185,
                    columnNumber: 15
                }, this)
            };
        } else if (isUpcoming) {
            return {
                text: "Upcoming",
                className: "bg-blue-100 text-blue-800 border-blue-300",
                icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__["Calendar"], {
                    className: "w-4 h-4"
                }, void 0, false, {
                    fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                    lineNumber: 191,
                    columnNumber: 15
                }, this)
            };
        } else if (isCompleted) {
            return {
                text: "Completed",
                className: "bg-green-100 text-green-800 border-green-300",
                icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                    className: "w-4 h-4"
                }, void 0, false, {
                    fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                    lineNumber: 197,
                    columnNumber: 15
                }, this)
            };
        } else if (isRejected) {
            return {
                text: "Rejected",
                className: "bg-red-100 text-red-800 border-red-300",
                icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__["XCircle"], {
                    className: "w-4 h-4"
                }, void 0, false, {
                    fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                    lineNumber: 203,
                    columnNumber: 15
                }, this)
            };
        }
        return {
            text: "Pending",
            className: "bg-yellow-100 text-yellow-800 border-yellow-300",
            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"], {
                className: "w-4 h-4"
            }, void 0, false, {
                fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                lineNumber: 209,
                columnNumber: 13
            }, this)
        };
    };
    const statusBadge = getStatusBadge();
    // Improved pending detection
    const isPending = detail?.is_approved === 0 || detail?.is_approved === undefined || detail?.is_approved === null || detail?.event_status === 1 || !detail?.is_approved && !detail?.event_status;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Layouts$2f$DefaultLayout$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "min-h-screen pb-10 bg-gray-50",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>router.back(),
                                className: "flex items-center gap-2 text-gray-600 hover:text-[#a797cc] transition-colors mb-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__["ArrowLeft"], {
                                        className: "w-5 h-5"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                        lineNumber: 228,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-sm font-medium",
                                        children: "Back to Events"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                        lineNumber: 229,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                lineNumber: 224,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                                className: "text-2xl font-bold text-gray-900",
                                                children: "Event Details"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                                lineNumber: 233,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-gray-500 mt-1",
                                                children: "View and manage event information"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                                lineNumber: 234,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                        lineNumber: 232,
                                        columnNumber: 13
                                    }, this),
                                    detail?._id && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-2 px-4 py-2 bg-white rounded-lg border shadow-sm",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-xs font-medium text-gray-600",
                                                        children: "Status:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                                        lineNumber: 239,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: `inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${statusBadge.className}`,
                                                        children: [
                                                            statusBadge.icon,
                                                            statusBadge.text
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                                        lineNumber: 240,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                                lineNumber: 238,
                                                columnNumber: 17
                                            }, this),
                                            isPending && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>ChangeEventStatus(2),
                                                disabled: loading,
                                                className: "flex items-center gap-2 px-4 py-2 bg-[#a797cc] hover:bg-[#a08ec8] text-white rounded-lg text-sm font-semibold transition-all shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed",
                                                title: "Approve Event",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                                        className: "w-4 h-4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                                        lineNumber: 252,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "Approve"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                                        lineNumber: 253,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                                lineNumber: 246,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                        lineNumber: 237,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                lineNumber: 231,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                        lineNumber: 223,
                        columnNumber: 9
                    }, this),
                    loading && !detail?._id ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-center items-center min-h-[500px] bg-white rounded-lg shadow-sm",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-center",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "animate-spin rounded-full h-16 w-16 border-4 border-[#a797cc] border-t-transparent mx-auto"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                    lineNumber: 264,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "mt-6 text-gray-600 font-medium",
                                    children: "Loading event details..."
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                    lineNumber: 265,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                            lineNumber: 263,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                        lineNumber: 262,
                        columnNumber: 11
                    }, this) : detail?._id ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-full space-y-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-1 lg:grid-cols-3 gap-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "lg:col-span-2 space-y-6",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "bg-white rounded-xl shadow-sm border border-gray-200 p-6",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex-1",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex items-center gap-3 mb-3",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                                            className: "text-2xl font-bold text-gray-900",
                                                                            children: detail?.event_name || "Event Name"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                                                            lineNumber: 279,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: `px-3 py-1 rounded-full text-xs font-semibold ${detail?.event_for === 1 ? "bg-blue-100 text-blue-800" : detail?.event_for === 2 ? "bg-pink-100 text-pink-800" : "bg-purple-100 text-purple-800"}`,
                                                                            children: detail?.event_for === 1 ? "Male Only" : detail?.event_for === 2 ? "Female Only" : "Everyone"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                                                            lineNumber: 282,
                                                                            columnNumber: 25
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                                                    lineNumber: 278,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex flex-wrap items-center gap-4 text-sm text-gray-600",
                                                                    children: [
                                                                        detail?.total_rating > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "flex items-center gap-1.5",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "flex items-center",
                                                                                    children: Array(5).fill(0).map((_, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                            className: "text-yellow-400",
                                                                                            children: index < Math.floor(detail?.total_rating || 0) ? "★" : "☆"
                                                                                        }, index, false, {
                                                                                            fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                                                                            lineNumber: 297,
                                                                                            columnNumber: 33
                                                                                        }, this))
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                                                                    lineNumber: 295,
                                                                                    columnNumber: 29
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "font-semibold text-gray-700",
                                                                                    children: detail?.total_rating?.toFixed(1)
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                                                                    lineNumber: 302,
                                                                                    columnNumber: 29
                                                                                }, this),
                                                                                detail?.total_review > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "text-gray-500",
                                                                                    children: [
                                                                                        "(",
                                                                                        detail?.total_review,
                                                                                        " reviews)"
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                                                                    lineNumber: 304,
                                                                                    columnNumber: 31
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                                                            lineNumber: 294,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        detail?.attendees?.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "flex items-center gap-2",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__["Users"], {
                                                                                    className: "w-4 h-4 text-gray-400"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                                                                    lineNumber: 310,
                                                                                    columnNumber: 29
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "font-medium",
                                                                                    children: [
                                                                                        detail?.attendees?.length,
                                                                                        " Attendees"
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                                                                    lineNumber: 311,
                                                                                    columnNumber: 29
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                                                            lineNumber: 309,
                                                                            columnNumber: 27
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                                                    lineNumber: 292,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                                            lineNumber: 277,
                                                            columnNumber: 21
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                                        lineNumber: 276,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "mt-6 pt-6 border-t border-gray-200",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-4",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "relative w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                                        src: detail?.organizer?.profile_image?.includes("http") ? detail?.organizer?.profile_image : "/assets/images/dummyImage.png",
                                                                        alt: "Organizer",
                                                                        width: 64,
                                                                        height: 64,
                                                                        className: "w-full h-full object-cover"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                                                        lineNumber: 322,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                                                    lineNumber: 321,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex-1",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "flex items-center gap-2 mb-1",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                                                                                    className: "w-4 h-4 text-gray-400"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                                                                    lineNumber: 336,
                                                                                    columnNumber: 27
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                                    className: "font-semibold text-gray-900",
                                                                                    children: [
                                                                                        detail?.organizer?.first_name,
                                                                                        " ",
                                                                                        detail?.organizer?.last_name
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                                                                    lineNumber: 337,
                                                                                    columnNumber: 27
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                                                            lineNumber: 335,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "flex flex-wrap items-center gap-4 text-sm text-gray-600",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "flex items-center gap-1.5",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$phone$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Phone$3e$__["Phone"], {
                                                                                            className: "w-3.5 h-3.5"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                                                                            lineNumber: 343,
                                                                                            columnNumber: 29
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                            children: [
                                                                                                detail?.organizer?.country_code,
                                                                                                " ",
                                                                                                detail?.organizer?.phone_number
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                                                                            lineNumber: 344,
                                                                                            columnNumber: 29
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                                                                    lineNumber: 342,
                                                                                    columnNumber: 27
                                                                                }, this),
                                                                                detail?.organizer?.email && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "flex items-center gap-1.5",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__["Mail"], {
                                                                                            className: "w-3.5 h-3.5"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                                                                            lineNumber: 348,
                                                                                            columnNumber: 31
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                            children: detail?.organizer?.email
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                                                                            lineNumber: 349,
                                                                                            columnNumber: 31
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                                                                    lineNumber: 347,
                                                                                    columnNumber: 29
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                                                            lineNumber: 341,
                                                                            columnNumber: 25
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                                                    lineNumber: 334,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                                            lineNumber: 320,
                                                            columnNumber: 21
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                                        lineNumber: 319,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                                lineNumber: 275,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "relative w-full h-[500px] bg-gray-100",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                                src: (()=>{
                                                                    const allImages = [];
                                                                    if (detail?.event_images && Array.isArray(detail.event_images) && detail.event_images.length > 0) {
                                                                        allImages.push(...detail.event_images);
                                                                    } else if (detail?.event_image) {
                                                                        allImages.push(detail.event_image);
                                                                    }
                                                                    return allImages.length > 0 ? getEventImageUrl({
                                                                        event_image: allImages[currentImageIndex || 0]
                                                                    }) : "/assets/images/dummyImage.png";
                                                                })(),
                                                                alt: detail?.event_name || "Event Image",
                                                                fill: true,
                                                                className: "object-cover",
                                                                priority: true,
                                                                onError: (e)=>{
                                                                    e.target.src = "/assets/images/dummyImage.png";
                                                                }
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                                                lineNumber: 362,
                                                                columnNumber: 21
                                                            }, this),
                                                            (()=>{
                                                                const allImages = [];
                                                                if (detail?.event_images && Array.isArray(detail.event_images) && detail.event_images.length > 0) {
                                                                    allImages.push(...detail.event_images);
                                                                } else if (detail?.event_image) {
                                                                    allImages.push(detail.event_image);
                                                                }
                                                                return allImages.length > 1 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                            onClick: ()=>setCurrentImageIndex((prev)=>(prev - 1 + allImages.length) % allImages.length),
                                                                            className: "absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all z-10",
                                                                            "aria-label": "Previous Image",
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__["ChevronLeft"], {
                                                                                className: "w-6 h-6"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                                                                lineNumber: 395,
                                                                                columnNumber: 29
                                                                            }, this)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                                                            lineNumber: 390,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                            onClick: ()=>setCurrentImageIndex((prev)=>(prev + 1) % allImages.length),
                                                                            className: "absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all z-10",
                                                                            "aria-label": "Next Image",
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                                                                className: "w-6 h-6"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                                                                lineNumber: 402,
                                                                                columnNumber: 29
                                                                            }, this)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                                                            lineNumber: 397,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm font-medium z-10",
                                                                            children: [
                                                                                currentImageIndex + 1,
                                                                                " / ",
                                                                                allImages.length
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                                                            lineNumber: 404,
                                                                            columnNumber: 27
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true) : null;
                                                            })()
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                                        lineNumber: 361,
                                                        columnNumber: 19
                                                    }, this),
                                                    (()=>{
                                                        const allImages = [];
                                                        if (detail?.event_images && Array.isArray(detail.event_images) && detail.event_images.length > 0) {
                                                            allImages.push(...detail.event_images.slice(0, 6));
                                                        } else if (detail?.event_image) {
                                                            allImages.push(detail.event_image);
                                                        }
                                                        return allImages.length > 1 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "p-4 bg-gray-50 border-t border-gray-200",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex items-center justify-between mb-3",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "text-sm font-semibold text-gray-700",
                                                                            children: [
                                                                                "Event Images (",
                                                                                allImages.length,
                                                                                ")"
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                                                            lineNumber: 423,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "text-xs text-gray-500",
                                                                            children: "Click to view"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                                                            lineNumber: 426,
                                                                            columnNumber: 27
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                                                    lineNumber: 422,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "grid grid-cols-6 gap-2",
                                                                    children: allImages.map((img, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                            onClick: ()=>setCurrentImageIndex(idx),
                                                                            className: `relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${idx === currentImageIndex ? "border-[#a797cc] ring-2 ring-[#a797cc]/20" : "border-gray-200 hover:border-gray-300"}`,
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                                                src: getEventImageUrl({
                                                                                    event_image: img
                                                                                }),
                                                                                alt: `Event image ${idx + 1}`,
                                                                                fill: true,
                                                                                className: "object-cover",
                                                                                onError: (e)=>{
                                                                                    e.target.src = "/assets/images/dummyImage.png";
                                                                                }
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                                                                lineNumber: 441,
                                                                                columnNumber: 31
                                                                            }, this)
                                                                        }, idx, false, {
                                                                            fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                                                            lineNumber: 432,
                                                                            columnNumber: 29
                                                                        }, this))
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                                                    lineNumber: 430,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                                            lineNumber: 421,
                                                            columnNumber: 23
                                                        }, this) : null;
                                                    })()
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                                lineNumber: 359,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "bg-white rounded-xl shadow-sm border border-gray-200 p-6",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-2 mb-4",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                                                                className: "w-5 h-5 text-[#a797cc]"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                                                lineNumber: 461,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                className: "text-xl font-bold text-gray-900",
                                                                children: "About This Event"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                                                lineNumber: 462,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                                        lineNumber: 460,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-gray-700 leading-relaxed whitespace-pre-wrap",
                                                        children: detail?.event_description || "No description available."
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                                        lineNumber: 464,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                                lineNumber: 459,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                        lineNumber: 273,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-6",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "bg-white rounded-xl shadow-sm border border-gray-200 p-6",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: "text-lg font-bold text-gray-900 mb-4",
                                                        children: "Event Information"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                                        lineNumber: 474,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "space-y-4",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-start gap-3",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$calendar$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Calendar$3e$__["Calendar"], {
                                                                        className: "w-5 h-5 text-[#a797cc] mt-0.5 flex-shrink-0"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                                                        lineNumber: 477,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                className: "text-xs font-medium text-gray-500",
                                                                                children: "Date"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                                                                lineNumber: 479,
                                                                                columnNumber: 25
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                className: "text-sm font-semibold text-gray-900",
                                                                                children: detail?.event_date ? new Date(detail.event_date).toLocaleDateString("en-US", {
                                                                                    weekday: "long",
                                                                                    year: "numeric",
                                                                                    month: "long",
                                                                                    day: "numeric"
                                                                                }) : "N/A"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                                                                lineNumber: 480,
                                                                                columnNumber: 25
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                                                        lineNumber: 478,
                                                                        columnNumber: 23
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                                                lineNumber: 476,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-start gap-3",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
                                                                        className: "w-5 h-5 text-[#a797cc] mt-0.5 flex-shrink-0"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                                                        lineNumber: 492,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                className: "text-xs font-medium text-gray-500",
                                                                                children: "Time"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                                                                lineNumber: 494,
                                                                                columnNumber: 25
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                className: "text-sm font-semibold text-gray-900",
                                                                                children: detail?.event_start_time && detail?.event_end_time ? `${new Date(`1970-01-01T${detail.event_start_time}`).toLocaleTimeString([], {
                                                                                    hour: "2-digit",
                                                                                    minute: "2-digit"
                                                                                })} - ${new Date(`1970-01-01T${detail.event_end_time}`).toLocaleTimeString([], {
                                                                                    hour: "2-digit",
                                                                                    minute: "2-digit"
                                                                                })}` : "N/A"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                                                                lineNumber: 495,
                                                                                columnNumber: 25
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                                                        lineNumber: 493,
                                                                        columnNumber: 23
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                                                lineNumber: 491,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-start gap-3",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__["MapPin"], {
                                                                        className: "w-5 h-5 text-[#a797cc] mt-0.5 flex-shrink-0"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                                                        lineNumber: 504,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                className: "text-xs font-medium text-gray-500",
                                                                                children: "Location"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                                                                lineNumber: 506,
                                                                                columnNumber: 25
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                className: "text-sm font-semibold text-gray-900",
                                                                                children: detail?.event_address || "N/A"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                                                                lineNumber: 507,
                                                                                columnNumber: 25
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                                                        lineNumber: 505,
                                                                        columnNumber: 23
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                                                lineNumber: 503,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-start gap-3",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$dollar$2d$sign$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__DollarSign$3e$__["DollarSign"], {
                                                                        className: "w-5 h-5 text-[#a797cc] mt-0.5 flex-shrink-0"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                                                        lineNumber: 514,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                className: "text-xs font-medium text-gray-500",
                                                                                children: "Price Per Person"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                                                                lineNumber: 516,
                                                                                columnNumber: 25
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                className: "text-sm font-semibold text-gray-900",
                                                                                children: detail?.event_price ? `${detail.event_price} SAR` : "N/A"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                                                                lineNumber: 517,
                                                                                columnNumber: 25
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                                                        lineNumber: 515,
                                                                        columnNumber: 23
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                                                lineNumber: 513,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-start gap-3",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__["Users"], {
                                                                        className: "w-5 h-5 text-[#a797cc] mt-0.5 flex-shrink-0"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                                                        lineNumber: 524,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                className: "text-xs font-medium text-gray-500",
                                                                                children: "Capacity"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                                                                lineNumber: 526,
                                                                                columnNumber: 25
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                className: "text-sm font-semibold text-gray-900",
                                                                                children: [
                                                                                    detail?.no_of_attendees || "N/A",
                                                                                    " ",
                                                                                    detail?.no_of_attendees === 1 ? "person" : "people"
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                                                                lineNumber: 527,
                                                                                columnNumber: 25
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                                                        lineNumber: 525,
                                                                        columnNumber: 23
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                                                lineNumber: 523,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                                        lineNumber: 475,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                                lineNumber: 473,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "bg-white rounded-xl shadow-sm border border-gray-200 p-6",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: "text-lg font-bold text-gray-900 mb-4",
                                                        children: "Instructions"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                                        lineNumber: 537,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "space-y-5",
                                                        children: [
                                                            detail?.dos_instruction && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex items-center gap-2 mb-2",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                                                                className: "w-4 h-4 text-green-600"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                                                                lineNumber: 542,
                                                                                columnNumber: 27
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                                className: "text-sm font-semibold text-gray-900",
                                                                                children: "Do's"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                                                                lineNumber: 543,
                                                                                columnNumber: 27
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                                                        lineNumber: 541,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-sm text-gray-700 pl-6",
                                                                        children: detail.dos_instruction
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                                                        lineNumber: 545,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                                                lineNumber: 540,
                                                                columnNumber: 23
                                                            }, this),
                                                            detail?.do_not_instruction && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex items-center gap-2 mb-2",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__["XCircle"], {
                                                                                className: "w-4 h-4 text-red-600"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                                                                lineNumber: 551,
                                                                                columnNumber: 27
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                                className: "text-sm font-semibold text-gray-900",
                                                                                children: "Don'ts"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                                                                lineNumber: 552,
                                                                                columnNumber: 27
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                                                        lineNumber: 550,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-sm text-gray-700 pl-6",
                                                                        children: detail.do_not_instruction
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                                                        lineNumber: 554,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                                                lineNumber: 549,
                                                                columnNumber: 23
                                                            }, this),
                                                            !detail?.dos_instruction && !detail?.do_not_instruction && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-sm text-gray-500 italic",
                                                                children: "No instructions provided."
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                                                lineNumber: 558,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                                        lineNumber: 538,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                                lineNumber: 536,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                        lineNumber: 471,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                lineNumber: 271,
                                columnNumber: 13
                            }, this),
                            isPending && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-white rounded-xl shadow-sm border border-gray-200 p-6",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-col sm:flex-row items-center justify-center gap-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>ChangeEventStatus(2),
                                            disabled: loading,
                                            className: "w-full sm:w-auto flex items-center justify-center gap-2 bg-[#a797cc] hover:bg-[#a08ec8] text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-md",
                                            children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                                        lineNumber: 576,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "Processing..."
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                                        lineNumber: 577,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                                        className: "w-5 h-5"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                                        lineNumber: 581,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "Accept Event"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                                        lineNumber: 582,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                            lineNumber: 569,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setShowRejectModal(true),
                                            disabled: loading,
                                            className: "w-full sm:w-auto flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-md",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__["XCircle"], {
                                                    className: "w-5 h-5"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                                    lineNumber: 591,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: "Reject Event"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                                    lineNumber: 592,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                            lineNumber: 586,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                    lineNumber: 568,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                lineNumber: 567,
                                columnNumber: 15
                            }, this),
                            !isPending && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-white rounded-xl shadow-sm border border-gray-200 p-6",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex justify-center",
                                    children: [
                                        statusBadge.text === "Upcoming" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-3 px-6 py-4 bg-green-50 border-2 border-green-200 rounded-lg",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                                    className: "w-6 h-6 text-green-600"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                                    lineNumber: 604,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-lg font-semibold text-green-800",
                                                    children: "Event Approved"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                                    lineNumber: 605,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                            lineNumber: 603,
                                            columnNumber: 21
                                        }, this),
                                        statusBadge.text === "Rejected" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-3 px-6 py-4 bg-red-50 border-2 border-red-200 rounded-lg",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__["XCircle"], {
                                                    className: "w-6 h-6 text-red-600"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                                    lineNumber: 610,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-lg font-semibold text-red-800",
                                                    children: "Event Rejected"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                                    lineNumber: 611,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                            lineNumber: 609,
                                            columnNumber: 21
                                        }, this),
                                        statusBadge.text === "Completed" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-3 px-6 py-4 bg-blue-50 border-2 border-blue-200 rounded-lg",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                                    className: "w-6 h-6 text-blue-600"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                                    lineNumber: 616,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-lg font-semibold text-blue-800",
                                                    children: "Event Completed"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                                    lineNumber: 617,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                            lineNumber: 615,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                    lineNumber: 601,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                lineNumber: 600,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                        lineNumber: 269,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"], {
                                className: "w-16 h-16 text-gray-400 mx-auto mb-4"
                            }, void 0, false, {
                                fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                lineNumber: 626,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-lg font-semibold text-gray-900 mb-2",
                                children: "Event Not Found"
                            }, void 0, false, {
                                fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                lineNumber: 627,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-gray-600 mb-6",
                                children: "The event you're looking for doesn't exist or has been removed."
                            }, void 0, false, {
                                fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                lineNumber: 628,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>router.push("/events"),
                                className: "inline-flex items-center gap-2 bg-[#a797cc] hover:bg-[#a08ec8] text-white px-6 py-2 rounded-lg font-medium transition-colors",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__["ArrowLeft"], {
                                        className: "w-4 h-4"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                        lineNumber: 633,
                                        columnNumber: 15
                                    }, this),
                                    "Back to Events"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                                lineNumber: 629,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                        lineNumber: 625,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                lineNumber: 221,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Modals$2f$RejectEventModal$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                show: showRejectModal,
                onClose: ()=>setShowRejectModal(false),
                onConfirm: handleReject,
                title: "Reject Event",
                message: "Are you sure you want to reject this event? Please provide a reason below."
            }, void 0, false, {
                fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
                lineNumber: 641,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/(AfterLogin)/events/detail/[id]/page.js",
        lineNumber: 220,
        columnNumber: 5
    }, this);
}
_s(EventDetail, "j8E1dw8Oa1I0Z7/19cQC7/1n1K8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$store$2f$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDataStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$store$2f$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDataStore"]
    ];
});
_c = EventDetail;
var _c;
__turbopack_refresh__.register(_c, "EventDetail");

})()),
"[project]/src/app/(AfterLogin)/events/detail/[id]/page.js [app-rsc] (ecmascript, Next.js server component, client modules)": (({ r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname }) => (() => {


})()),
}]);

//# sourceMappingURL=src_eae928._.js.map