import { getData } from "./index";

export const GetUserBookingDetailApi = async (payload) => {
	return getData("user/event/booked/detail", payload).then((data) => {
		return data;
	});
};
