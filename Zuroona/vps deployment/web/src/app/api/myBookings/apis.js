import { DeleteParams, getData, patchRawData, putRawData, postRawData } from "../index";

// User API
export const GetAllMyBookingApi = async (payload) => {
  return getData("user/event/booked/list", payload).then((data) => {
    return data;
  });
};
export const MyBookingDetailApi = async (payload) => {
  return getData("user/event/booked/detail", payload).then((data) => {
    return data;
  });
};

export const DeleteMyBookingApi = async (payload) => {
  return DeleteParams("MyBooking/delete", payload).then((data) => {
    return data;
  });
};


// Organizer API
export const GetAllOrganizerBookingApi = async (payload) => {
  return getData("organizer/event/booking/list", payload).then((data) => {
    return data;
  });
};

export const OrganizerBookingDetailApi = async (payload) => {
  return getData("organizer/event/booking/detail", payload).then((data) => {
    return data;
  });
};

export const ChangeStatusOrganizerApi = async (payload) => {
  return patchRawData("organizer/event/booking/update-status", payload).then((data) => {
    return data;
  });
};

// Host event cancellation
export const CancelEventApi = async (payload) => {
  // payload should contain: { event_id, reason }
  return postRawData("organizer/event/cancel", payload).then((data) => {
    return data;
  });
};


