import { getData } from "./index";

export const GetUserEventListDetailApi = async (payload) => {
	return getData("user/event/detail", payload).then((data) => {
		return data;
	});
};
