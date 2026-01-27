import {
    deleteData,
    DeleteParams,
    getData,
    patchRawData,
    postFormData,
    postRawData,
    putRawData,
  } from "./index";
  
  export const LoginApi = async (payload) => {
    return postRawData("login", payload).then((data) => {
      return data;
    });
  };
  
  export const forgotPasswordApi = async (payload) => {
    // For SMS OTP, use mobile_number instead of email
    return postRawData("forgot-password", {
      mobile_number: payload.mobile_number || payload.phone_number,
      phone_number: payload.mobile_number || payload.phone_number
    }).then((data) => {
      return data;
    });
  };
  
  export const OTPVerificationApi = async (payload) => {
    // Support both sms_otp and email_otp for backward compatibility
    return postRawData("verify-otp", {
      sms_otp: payload.sms_otp || payload.email_otp,
      email_otp: payload.sms_otp || payload.email_otp
    }).then((data) => {
      return data;
    });
  };
  
  export const resetPasswordApi = async (payload) => {
    return postRawData("admin/resetPassword", payload).then((data) => {
      return data;
    });
  };
  
  export const changePasswordApi = async (payload) => {
    return postRawData("change-password", payload).then((data) => {
      return data;
    });
  };
  
  export const logoutApi = async (payload) => {
    return postRawData("logout", payload).then((data) => {
      return data;
    });
  };
  export const UploadFileApi = async (payload) => {
    return postFormData("user/uploadFile", payload).then((data) => {
      return data;
    });
  };
  
  
  export const AddEditBiotechPartnerApi = async (payload) => {
    return postRawData("biotech-energy-partner/add", payload).then(
      (data) => {
        return data;
      }
    );
  };
  export const BiotechPartnerDetailApi = async (payload) => {
    return getData("biotech-energy-partner/detail", payload).then(
      (data) => {
        return data;
      }
    );
  };
  
  export const GetAllMediaApi = async (payload) => {
    return getData("media/list", payload).then((data) => {
      return data;
    });
  };
  export const MediaDetailApi = async (payload) => {
    return getData("media/detail", payload).then((data) => {
      return data;
    });
  };
  export const AddMediaApi = async (payload) => {
    return postRawData("media/add", payload).then((data) => {
      return data;
    });
  };
  export const EditMediaApi = async (payload) => {
    return putRawData("media/update", payload).then((data) => {
      return data;
    });
  };
  export const DeleteMediaApi = async (payload) => {
    return DeleteParams("media/delete", payload).then((data) => {
      return data;
    });
  };
  export const ActiveInActiveMediaApi = async (payload) => {
    return patchRawData("media/status/change", payload).then((data) => {
      return data;
    });
  };
  
  export const GetAllBlogApi = async (payload) => {
    return getData("blog/list", payload).then((data) => {
      return data;
    });
  };
  export const BlogDetailApi = async (payload) => {
    return getData("blog/detail", payload).then((data) => {
      return data;
    });
  };
  export const AddBlogApi = async (payload) => {
    return postRawData("blog/add", payload).then((data) => {
      return data;
    });
  };
  export const EditBlogApi = async (payload) => {
    return putRawData("blog/update", payload).then((data) => {
      return data;
    });
  };
  export const DeleteBlogApi = async (payload) => {
    return DeleteParams("blog/delete", payload).then((data) => {
      return data;
    });
  };
  export const ActiveInActiveBlogApi = async (payload) => {
    return patchRawData("blog/status/change", payload).then((data) => {
      return data;
    });
  };
  export const GetAllContactEnueryApi = async (payload) => {
    return getData("user-contact/list", payload).then((data) => {
      return data;
    });
  };
  export const GetAllApplyNowEnueryApi = async (payload) => {
    return getData("career-apply/list", payload).then((data) => {
      return data;
    });
  };
  export const DeleteRequestQuoteApi = async (payload) => {
    return DeleteParams("request-quote/delete", payload).then((data) => {
      return data;
    });
  };
  
  export const AddEditCMSApi = async (payload) => {
    return putRawData("cms/update", payload).then((data) => {
      return data;
    });
  };
  export const CMSDetailApi = async (payload) => {
    return getData("cms/detail", payload).then((data) => {
      return data;
    });
  };
  export const GetAllLeaveReplyApi = async (payload) => {
    return getData("reply/list", payload).then((data) => {
      return data;
    });
  };

  // ===== REFUND MANAGEMENT APIs =====
  export const GetRefundListApi = async (payload) => {
    return getData("admin/refund/list", payload).then((data) => {
      return data;
    });
  };

  export const GetRefundDetailApi = async (payload) => {
    return getData("admin/refund/detail", payload).then((data) => {
      return data;
    });
  };

  export const UpdateRefundStatusApi = async (payload) => {
    return putRawData("admin/refund/update-status", payload).then((data) => {
      return data;
    });
  };

  // ===== CAREER APPLICATION MANAGEMENT APIs =====
  export const GetCareerApplicationsApi = async (payload) => {
    return getData("admin/career/applications", payload).then((data) => {
      return data;
    });
  };

  export const GetCareerApplicationDetailApi = async (payload) => {
    return getData("admin/career/application/detail", payload).then((data) => {
      return data;
    });
  };

  export const UpdateCareerApplicationStatusApi = async (payload) => {
    return putRawData("admin/career/application/update-status", payload).then((data) => {
      return data;
    });
  };
  