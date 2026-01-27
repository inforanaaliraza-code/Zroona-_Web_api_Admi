import {
    postDataURLIncoded,
    postRawDataToken,
    patchRawDataToken,
    putURLIncodedWithToken,
  } from "../index";
  
  export const LoginApi = async (payload) => {
    // Use unified email + password login endpoint
    return postDataURLIncoded("user/login", payload).then((data) => {
      return data;
    });
  };
  
  export const OrganizerLoginApi = async (payload) => {
    // Organizer login using email + password
    return postDataURLIncoded("organizer/login", payload).then((data) => {
      return data;
    });
  };
  export const SocialLoginApi = async (payload) => {
    return postDataURLIncoded("user/socialLogin", payload).then((data) => {
      return data;
    });
  };
  
  export const OrganzierSignupApi = async (payload) => {
    return postDataURLIncoded("organizer/register", payload).then((data) => {
      return data;
    });
  };
  
  export const UpdateProfileApi = async (payload) => {
    return putURLIncodedWithToken("user/updateProfile", payload).then((data) => {
      return data;
    });
  };
  
  export const ForgotPasswordApi = async (payload) => {
    // Send password reset email
    return postDataURLIncoded("user/forgot-password", payload).then((data) => {
      return data;
    });
  };
  
  export const OrganizerForgotPasswordApi = async (payload) => {
    // Send password reset email for organizer
    return postDataURLIncoded("organizer/forgot-password", payload).then((data) => {
      return data;
    });
  };
  
  export const AdminForgotPasswordApi = async (payload) => {
    // Send password reset email for admin
    return postDataURLIncoded("admin/forgot-password", payload).then((data) => {
      return data;
    });
  };
  export const ContactUsApi = async (payload) => {
    return postDataURLIncoded("user/contactUs", payload).then((data) => {
      return data;
    });
  };
  
  // OTP verification removed - using email verification only
  
  export const ResetPasswordApi = async (payload) => {
    // Reset password using token (no auth token required)
    return postDataURLIncoded("user/reset-password", payload).then((data) => {
      return data;
    });
  };
  
  export const OrganizerResetPasswordApi = async (payload) => {
    // Reset password for organizer using token
    return postDataURLIncoded("organizer/reset-password", payload).then((data) => {
      return data;
    });
  };
  
  export const AdminResetPasswordApi = async (payload) => {
    // Reset password for admin using token
    return postDataURLIncoded("admin/reset-password", payload).then((data) => {
      return data;
    });
  };
  
  export const ChangePasswordApi = async (payload) => {
    return patchRawDataToken("astrologer/changePassword", payload).then(
      (data) => {
        return data;
      }
    );
  };
  
