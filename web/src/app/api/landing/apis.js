import { getData } from "../index";

// User API
export const GetEvents = async (payload) => {
	return getData("landing/events", payload).then((data) => {
		return data;
	});
};

export const GetUpcomingEvents = async (payload) => {
	return getData("landing/featured-events", payload).then((data) => {
		return data;
	});
};

export const GetEventDetails = async (eventId) => {
	return getData(`landing/events/${eventId}`).then((data) => {
		return data;
	});
};

export const GetSimilarEvents = async (eventId, categoryId) => {
	return getData(`landing/events/${eventId}/similar`, {
		event_category: categoryId,
	}).then((data) => {
		return data;
	});
};
