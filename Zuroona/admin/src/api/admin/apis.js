import { DeleteParams, getData, postRawData, putRawData, putFormData } from "../index";

// Admin Management CRUD
export const GetAllAdminsApi = async (payload) => {
  return getData("admin/list", payload).then((data) => {
    return data;
  });
};

export const GetAdminDetailApi = async (payload) => {
  return getData("admin/detail", payload).then((data) => {
    return data;
  });
};

export const CreateAdminApi = async (payload) => {
  return postRawData("admin/create", payload).then((data) => {
    return data;
  });
};

export const UpdateAdminApi = async (payload) => {
  // Separate file upload from other data
  const hasFile = payload.profile_image && payload.profile_image instanceof File;
  
  if (hasFile) {
    // Step 1: Upload image first
    try {
      const { postFormData } = require("../index");
      const uploadPayload = {
        file: payload.profile_image,
        dirName: "Zuroona/Admin"
      };
      
      const uploadRes = await postFormData("uploadFile", uploadPayload);
      
      if (uploadRes?.status === 1 && uploadRes?.data?.location) {
        // Step 2: Update admin with image URL
        const updatePayload = { ...payload };
        updatePayload.profile_image = uploadRes.data.location;
        delete updatePayload.profile_image; // Remove File object
        return putRawData("admin/update", updatePayload).then((data) => {
          return data;
        });
      } else {
        // If upload fails, continue without image
        console.warn("Image upload failed, updating without image");
        const updatePayload = { ...payload };
        delete updatePayload.profile_image;
        return putRawData("admin/update", updatePayload).then((data) => {
          return data;
        });
      }
    } catch (uploadError) {
      console.error("Error uploading image:", uploadError);
      // Continue with update without image
      const updatePayload = { ...payload };
      delete updatePayload.profile_image;
      return putRawData("admin/update", updatePayload).then((data) => {
        return data;
      });
    }
  } else {
    // No file, use regular JSON
    const jsonPayload = { ...payload };
    if (!jsonPayload.profile_image || jsonPayload.profile_image === null || jsonPayload.profile_image === '') {
      delete jsonPayload.profile_image;
    }
    return putRawData("admin/update", jsonPayload).then((data) => {
      return data;
    });
  }
};

export const DeleteAdminApi = async (payload) => {
  return DeleteParams("admin/delete", payload).then((data) => {
    return data;
  });
};

// Get current admin profile
export const GetCurrentAdminApi = async () => {
  return getData("admin/current", {}).then((data) => {
    return data;
  });
};

// Admin notifications
export const GetAdminNotificationsApi = async (payload) => {
  return getData("notifications", payload).then((data) => {
    return data;
  });
};

// Wallet details
// Wallet Management
export const GetWalletStatsApi = async () => {
  return getData("wallet/stats").then((data) => {
    return data;
  });
};

export const GetWalletDetailsApi = async () => {
  return getData("wallet/details", {}).then((data) => {
    return data;
  });
};

// Withdrawal requests
export const GetWithdrawalRequestsApi = async (payload) => {
  return getData("admin/organizer/withdrawalList", payload).then((data) => {
    return data;
  });
};

export const UpdateWithdrawalRequestApi = async (payload) => {
  return putRawData("admin/withdrawalStatus", payload).then((data) => {
    return data;
  });
};

export const GetWithdrawalStatsApi = async () => {
  return getData("admin/organizer/withdrawalStats").then((data) => {
    return data;
  });
};

// Guest Invoices Management
export const GetInvoiceStatsApi = async () => {
  return getData("bookings/invoices/stats").then((data) => {
    return data;
  });
};

// Guest invoices/receipts
export const GetGuestInvoicesApi = async (payload) => {
  return getData("bookings/invoices", payload).then((data) => {
    return data;
  });
};

