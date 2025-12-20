import { DeleteParams, getData, postRawData, putRawData } from "../index";

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
  return putRawData("admin/update", payload).then((data) => {
    return data;
  });
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
  return getData("admin/notifications", payload).then((data) => {
    return data;
  });
};

// Wallet details
export const GetWalletDetailsApi = async () => {
  return getData("wallet/details", {}).then((data) => {
    return data;
  });
};

// Withdrawal requests
export const GetWithdrawalRequestsApi = async (payload) => {
  return getData("organizer/withdrawalList", payload).then((data) => {
    return data;
  });
};

export const UpdateWithdrawalRequestApi = async (payload) => {
  return putRawData("withdrawalStatus", payload).then((data) => {
    return data;
  });
};

