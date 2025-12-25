import { DeleteParams, getData, patchRawData, putRawData } from "../index";


export const GetAllOrganizerApi = async (payload) => {
  return getData("organizer/list", payload).then((data) => {
    return data;
  });
};
export const OrganizerDetailApi = async (payload) => {
  return getData("organizer/detail", payload).then((data) => {
    return data;
  });
};

export const DeleteOrganizerApi = async (payload) => {
  return DeleteParams("organizer/delete", payload).then((data) => {
    return data;
  });
};
export const ChangeStatusOrganizerApi = async (payload) => {
  // Map frontend status: 1=Pending, 2=Approved, 3=Rejected
  // Backend: 1=Pending, 2=Approved, 3=Rejected
  const backendPayload = {
    userId: payload.userId || payload.id,
    is_approved: payload.is_approved || payload.status,
    rejection_reason: payload.rejection_reason || payload.reason
  };
  return putRawData("changeStatus", backendPayload).then((data) => {
    return data;
  });
};

export const ActiveInActiveOrganizerApi = async (payload) => {
  // Support both isActive and isSuspended
  const apiPayload = {
    id: payload.id,
    ...(payload.isActive !== undefined && { isActive: payload.isActive }),
    ...(payload.isSuspended !== undefined && { isSuspended: payload.isSuspended }),
  };
  return patchRawData("changeOrganizerStatus", apiPayload).then((data) => {
    return data;
  });
};

