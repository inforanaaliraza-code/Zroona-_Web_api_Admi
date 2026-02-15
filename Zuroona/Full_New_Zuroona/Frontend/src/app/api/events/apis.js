import { getData, postRawData, deleteData } from "../index";

export const getEvents = async (data) => {
	// Use the correct endpoint for event list
	return await getData("user/event/list", data);
};

export const getEventsById = async (data) => {
	return await getData("user/event/detail", data);
};

// Export the EventsDetailApi which was missing - alias for getEventsById
export const EventsDetailApi = getEventsById;

export const getUserEvents = async (data) => {
	return await getData("user/event/all", data);
};

export const EventBookingApi = async (payload, token) => {
	return await postRawData("user/event/book", payload, token);
};

// Guest booking cancellation
export const CancelBookingApi = async (payload, token) => {
	return await postRawData("user/event/cancel", payload, token);
};

// Host event cancellation
export const CancelEventApi = async (payload, token) => {
	return await postRawData("organizer/event/cancel", payload, token);
};

export const getUserBookedEvents = async (data) => {
	return await getData("user/event/booked", data);
};

export const getUserBookedEventsDetail = async (data) => {
	return await getData("user/event/booked/detail", data);
};

export const DeleteEventsApi = async (payload) => {
	return await deleteData("organizer/event/delete", payload);
};
