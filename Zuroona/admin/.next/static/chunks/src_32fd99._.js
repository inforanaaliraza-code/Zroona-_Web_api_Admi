(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["static/chunks/src_32fd99._.js", {

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
"[project]/src/components/Loader/Loader.jsx [app-client] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, k: __turbopack_refresh__ }) => (() => {
"use strict";

__turbopack_esm__({
    "default": ()=>__TURBOPACK__default__export__
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$loader$2d$spinner$2f$dist$2f$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/react-loader-spinner/dist/module.js [app-client] (ecmascript)");
"__TURBOPACK__ecmascript__hoisting__location__";
"use client";
;
;
;
function Loader(props) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$loader$2d$spinner$2f$dist$2f$module$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ThreeCircles"], {
            height: "30",
            width: "80",
            color: props.color ? props.color : "#a797cc",
            ariaLabel: "bars-loading",
            wrapperStyle: {},
            wrapperClass: "justify-center",
            visible: true
        }, void 0, false, {
            fileName: "[project]/src/components/Loader/Loader.jsx",
            lineNumber: 8,
            columnNumber: 7
        }, this)
    }, void 0, false);
}
_c = Loader;
const __TURBOPACK__default__export__ = Loader;
var _c;
__turbopack_refresh__.register(_c, "Loader");

})()),
"[project]/src/components/CMS/TermsConditions.jsx [app-client] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, k: __turbopack_refresh__ }) => (() => {
"use strict";

__turbopack_esm__({
    "default": ()=>__TURBOPACK__default__export__
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$setting$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/src/api/setting.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$store$2f$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/src/api/store/store.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Loader$2f$Loader$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/src/components/Loader/Loader.jsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$formik$2f$dist$2f$formik$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/formik/dist/formik.esm.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/shared/lib/app-dynamic.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$react$2d$toastify$2e$esm$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/react-toastify/dist/react-toastify.esm.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$yup$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/yup/index.esm.js [app-client] (ecmascript)");
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
const TextEditor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(()=>__turbopack_require__("[project]/src/components/TextEditor/TextEditor.jsx [app-client] (ecmascript, async loader)")(__turbopack_import__), {
    loadableGenerated: {
        modules: [
            "src/components/CMS/TermsConditions.jsx -> " + "@/components/TextEditor/TextEditor"
        ]
    },
    ssr: false
});
_c = TextEditor;
const TextEditorAr = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(()=>__turbopack_require__("[project]/src/components/TextEditorAr/TextEditorAr.jsx [app-client] (ecmascript, async loader)")(__turbopack_import__), {
    loadableGenerated: {
        modules: [
            "src/components/CMS/TermsConditions.jsx -> " + "@/components/TextEditorAr/TextEditorAr"
        ]
    },
    ssr: false
});
_c1 = TextEditorAr;
function TermsConditions(props) {
    _s();
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const quillRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])();
    const CMSDetail = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$store$2f$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDataStore"])((store)=>store.CMSDetail);
    const { fetchCMSDetail } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$store$2f$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDataStore"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        fetchCMSDetail({
            cms_type: props.status
        });
    }, []);
    const initialValues = {
        content: props.status ? CMSDetail?.description : "",
        content_ar: props.status ? CMSDetail?.description_ar : ""
    };
    const formik = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$formik$2f$dist$2f$formik$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useFormik"])({
        initialValues: initialValues,
        validationSchema: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$yup$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.object({
            content: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$yup$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.string().required("Required"),
            content_ar: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$yup$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__.string().required("Required")
        }),
        enableReinitialize: true,
        onSubmit: (values, { isSubmitting, resetForm })=>{
            setLoading(true);
            const payload = {
                cms_type: parseInt(props.status),
                title: "Zuroona Terms & Conditions",
                description: values.content,
                description_ar: values.content_ar,
                id: CMSDetail?._id
            };
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$setting$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AddEditCMSApi"])(payload).then((data)=>{
                setLoading(false);
                if (data?.status === 1) {
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$react$2d$toastify$2e$esm$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].success(data.message);
                    fetchCMSDetail({
                        cms_type: props.status
                    });
                } else {
                    setLoading(false);
                    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$toastify$2f$dist$2f$react$2d$toastify$2e$esm$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toast"].error(data.message);
                }
            });
        }
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
        onSubmit: formik.handleSubmit,
        className: "flex flex-col items-center",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex justify-center mb-4 w-full",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mb-4 max-w-5xl w-5/6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TextEditor, {
                            ref: quillRef,
                            name: "content",
                            value: formik.values.content,
                            onBlur: formik.onBlur,
                            formik: formik
                        }, void 0, false, {
                            fileName: "[project]/src/components/CMS/TermsConditions.jsx",
                            lineNumber: 70,
                            columnNumber: 11
                        }, this),
                        formik.errors.content && formik.touched.content && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-red-500",
                            children: formik.errors.content
                        }, void 0, false, {
                            fileName: "[project]/src/components/CMS/TermsConditions.jsx",
                            lineNumber: 78,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/CMS/TermsConditions.jsx",
                    lineNumber: 69,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/CMS/TermsConditions.jsx",
                lineNumber: 68,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex justify-center mb-4 w-full",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mb-4 max-w-5xl w-5/6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TextEditorAr, {
                            ref: quillRef,
                            name: "content_ar",
                            value: formik.values.content_ar,
                            onBlur: formik.onBlur,
                            formik: formik
                        }, void 0, false, {
                            fileName: "[project]/src/components/CMS/TermsConditions.jsx",
                            lineNumber: 84,
                            columnNumber: 11
                        }, this),
                        formik.errors.content_ar && formik.touched.content_ar && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-red-500",
                            children: formik.errors.content_ar
                        }, void 0, false, {
                            fileName: "[project]/src/components/CMS/TermsConditions.jsx",
                            lineNumber: 92,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/CMS/TermsConditions.jsx",
                    lineNumber: 83,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/CMS/TermsConditions.jsx",
                lineNumber: 82,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-full flex justify-center",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    type: "submit",
                    className: "gap-x-2 px-48 py-3 text-white bg-[#a3cc69] hover:bg-[#9fb68b] transition-all duration-300 rounded-md text-1xl uppercase font-semibold shadow-lg hover:shadow-xl transform hover:scale-105",
                    children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Loader$2f$Loader$2e$jsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        color: "#fff"
                    }, void 0, false, {
                        fileName: "[project]/src/components/CMS/TermsConditions.jsx",
                        lineNumber: 102,
                        columnNumber: 13
                    }, this) : props.status ? "Update" : "Save"
                }, void 0, false, {
                    fileName: "[project]/src/components/CMS/TermsConditions.jsx",
                    lineNumber: 97,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/CMS/TermsConditions.jsx",
                lineNumber: 96,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/CMS/TermsConditions.jsx",
        lineNumber: 67,
        columnNumber: 5
    }, this);
}
_s(TermsConditions, "Qe3VVOPK+x5CYSQVY9It7iEbh7E=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$store$2f$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDataStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$api$2f$store$2f$store$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDataStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$formik$2f$dist$2f$formik$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useFormik"]
    ];
});
_c2 = TermsConditions;
const __TURBOPACK__default__export__ = TermsConditions;
var _c, _c1, _c2;
__turbopack_refresh__.register(_c, "TextEditor");
__turbopack_refresh__.register(_c1, "TextEditorAr");
__turbopack_refresh__.register(_c2, "TermsConditions");

})()),
}]);

//# sourceMappingURL=src_32fd99._.js.map