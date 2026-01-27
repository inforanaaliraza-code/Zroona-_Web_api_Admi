import { DeleteParams, getData, patchRawData, putRawData } from "../index";

  
  export const GetAllEventsApi = async (payload) => {
    return getData("eventList", payload).then((data) => {
      return data;
    });
  };
  export const EventsDetailApi = async (payload) => {
    return getData("event/detail", payload).then((data) => {
      return data;
    });
  };

  export const DeleteEventsApi = async (payload) => {
    return DeleteParams("events/delete", payload).then((data) => {
      return data;
    });
  };
  export const ActiveInActiveEventsApi = async (payload) => {
    return patchRawData("changeStatus", payload).then((data) => {
      return data;
    });
  };
  export const ChangeEventStatusApi = async (payload) => {
    // Map frontend status to backend status
    // Frontend: 1=Pending, 2=Upcoming/Approved, 3=Completed, 4=Rejected
    // Backend: 0=Pending, 1=Approved, 2=Rejected
    const backendPayload = {
      eventId: payload.eventId,
      status: payload.status, // Frontend status
      rejectionReason: payload.reason || payload.rejectionReason
    };
    return putRawData("event/changeStatus", backendPayload).then((data) => {
      return data;
    });
  };
