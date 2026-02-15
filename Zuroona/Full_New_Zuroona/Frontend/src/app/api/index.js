import { BASE_API_URL, TOKEN_NAME } from "@/until";
import axios from "axios";
import { toast } from "react-toastify";
var querystring = require("querystring");
import i18n from "../../lib/i18n";
import useAuthStore from "@/store/useAuthStore";
import Cookies from "universal-cookie";

// Create a cookies instance
const cookies = new Cookies();

// Helper function to get authentication token
const getToken = () => {
	return cookies.get(TOKEN_NAME);
};

export const postFormDataNoToken = async (url = "", data = {}) => {
	try {
		const formData = new FormData();

		for (let key in data) {
			formData.append(key, data[key]);
		}
		const response = await axios.post(BASE_API_URL + url, formData);

		return response.data;
	} catch (error) {
		// toast.error(error.message);
		// toast.error(error.response.data);
		return error.response.data;
	}
};
export const postFormData = async (url = "", data = {}) => {
	try {
		const token = useAuthStore.getState().token;

		const formData = new FormData();

		for (let key in data) {
			// Append value to FormData (handles File, Blob, and other types)
			formData.append(key, data[key]);
		}

		const headers = {};
		
		// Don't set Content-Type manually - let browser set it with boundary for multipart/form-data
		if (token) {
			headers.Authorization = token;
		}

		const response = await axios.post(BASE_API_URL + url, formData, {
			headers: headers,
		});

		return response.data;
	} catch (error) {
		console.error("[POST-FORM-DATA] Error:", error);
		// Return error response or throw to be caught by caller
		if (error.response?.data) {
			return error.response.data;
		}
		throw error;
	}
};

export const postDataURLIncoded = async (url = "", data = {}) => {
	try {
		//const token = await Cookies.get(TOKEN_NAME);
		const formData = new URLSearchParams();
		for (let key in data) {
			formData.append(key, data[key]);
		}

		const response = await axios.post(
			BASE_API_URL + url,
			querystring.stringify(data),
			{ headers: { "Content-Type": "application/x-www-form-urlencoded" } }
		);

		return response.data;
	} catch (error) {
		// toast.error(error.response.data);
		return error.response.data;
	}
};

export const patchFormData = async (url = "", data = {}) => {
	try {
		const token = useAuthStore.getState().token;

		const formData = new URLSearchParams();

		for (let key in data) {
			formData.append(key, data[key]);
		}
		const response = await axios.patch(BASE_API_URL + url, formData, {
			headers: { Authorization: token ? token : "" },
		});

		return response.data;
	} catch (error) {
		// toast.error(error.message);
		// toast.error(error.response.data);
		return error.response.data;
	}
};
export const patchRawData = async (url = "", data = {}) => {
	try {
		const token = useAuthStore.getState().token;

		const response = await axios.patch(BASE_API_URL + url, data, {
			headers: {
				Authorization: token,
			},
		});

		return response.data;
	} catch (error) {
		// toast.error(error.response.data);
		return error.response.data;
	}
};
export const postRawData = async (url = "", data = {}, token) => {
	try {
		const tokens = useAuthStore.getState().token;
		const authToken = token || tokens;

		// Make sure the token has the correct format - add 'Bearer ' prefix if not present
		const formattedToken =
			authToken && !authToken.startsWith("Bearer ")
				? `Bearer ${authToken}`
				: authToken;

		console.log("Making request to:", BASE_API_URL + url);
		console.log(
			"With auth token:",
			formattedToken ? "Token exists" : "No token"
		);

		const response = await axios.post(BASE_API_URL + url, data, {
			headers: { Authorization: formattedToken || "" },
		});

		return response.data;
	} catch (error) {
		console.error("API Error:", error.message);
		if (error.response) {
			console.error("Response data:", error.response.data);
			console.error("Response status:", error.response.status);
		}
		// toast.error(error.message);
		// toast.error(error.response.data);
		return error.response?.data || { status: 0, message: "Network error" };
	}
};
export const postRawDataforURL = async (url = "", id, data = {}) => {
	try {
		const token = useAuthStore.getState().token;

		const response = await axios.post(BASE_API_URL + url + `/${id}`, data, {
			headers: { Authorization: token ? token : "" },
		});

		return response.data;
	} catch (error) {
		// toast.error(error.message);
		// toast.error(error.response.data);
		return error.response.data;
	}
};

export const getDataNoToken = async (url = "", data = {}) => {
	try {
		const response = await axios.get(BASE_API_URL + url, {
			params: data,
		});

		return response.data;
	} catch (error) {
		// toast.error(error.response.data);
		return error.response.data;
	}
};

export const getDataforUrl = async (url = "", data = "") => {
	try {
		const token = useAuthStore.getState().token;

		const response = await axios.get(BASE_API_URL + url + `/${data?.id}`, {
			headers: { Authorization: token ? token : "" },
		});

		return response.data;
	} catch (error) {
		// toast.error(error.response.data);
		return error.response.data;
	}
};

export const getDataforUrlParams = async (url, id, prams) => {
	try {
		const token = useAuthStore.getState().token;

		const response = await axios.get(BASE_API_URL + url + `/${id}`, {
			params: prams,
			headers: { Authorization: token ? token : "" },
		});

		return response.data;
	} catch (error) {
		// toast.error(error.response.data);
		return error.response.data;
	}
};

export const patchRawDataWithURLMulti = async (url, data = {}) => {
	try {
		const token = useAuthStore.getState().token;

		const response = await axios.patch(BASE_API_URL + url, data, {
			headers: {
				token: token,
			},
		});

		return response.data;
	} catch (error) {
		// toast.error(error.response.data);
		return error.response.data;
	}
};

export const getData = async (url = "", data = {}) => {
	try {
		const token = useAuthStore.getState().token;
		const language = i18n?.language || "en";

		// Make sure the token has the correct format - add 'Bearer ' prefix if not present
		const formattedToken =
			token && !token.startsWith("Bearer ") ? `Bearer ${token}` : token;

		console.log("Making GET request to:", BASE_API_URL + url);
		console.log(
			"With auth token:",
			formattedToken ? "Token exists" : "No token"
		);

		const response = await axios.get(BASE_API_URL + url, {
			params: data,
			headers: { Authorization: formattedToken || "", lang: language },
		});

		return response.data;
	} catch (error) {
		console.error("API GET Error:", error.message);
		if (error.response) {
			console.error("Response data:", error.response.data);
			console.error("Response status:", error.response.status);
		}
		// toast.error(error.response.data);
		return error.response?.data || { status: 0, message: "Network error" };
	}
};

export const getDataStringify = async (url = "", data = {}) => {
	try {
		const token = cookies.get(TOKEN_NAME);

		const response = await axios.get(BASE_API_URL + url, {
			params: data,

			headers: { Authorization: token ? token : "" },
		});

		return response.data;
	} catch (error) {
		// toast.error(error.response.data);
		return error.response.data;
	}
};

export const postDataURLIncodedWithToken = async (url = "", data = {}) => {
	try {
		const token = cookies.get(TOKEN_NAME);
		const formData = new URLSearchParams();
		for (let key in data) {
			formData.append(key, data[key]);
		}

		const response = await axios.post(
			BASE_API_URL + url,
			querystring.stringify(data),
			{
				headers: {
					token: token,
					"Content-Type": "application/x-www-form-urlencoded",
				},
			}
		);
		//console.log(response);
		return response.data;
	} catch (error) {
		// toast.error(error.response.data);
		return error.response.data;
	}
};

export const patchDataURLIncoded = async (url = "", data = {}) => {
	try {
		const token = cookies.get(TOKEN_NAME);
		const formData = new URLSearchParams();
		for (let key in data) {
			formData.append(key, data[key]);
		}
		//console.log(data);
		const response = await axios.patch(
			BASE_API_URL + url,
			querystring.stringify(data),
			{
				headers: {
					token: token,
					"Content-Type": "application/x-www-form-urlencoded",
				},
			}
		);
		//console.log(response);
		return response.data;
	} catch (error) {
		// toast.error(error.response.data);
		return error.response.data;
	}
};

export const patchforUrl = async (url = "", data = "") => {
	try {
		const token = cookies.get(TOKEN_NAME);

		const response = await axios.patch(
			BASE_API_URL + url + `/${data?.id}`,
			null,
			{
				headers: { Authorization: token ? token : "" },
			}
		);

		return response.data;
	} catch (error) {
		// toast.error(error.response.data);
		return error.response.data;
	}
};

export const putFormData = async (url = "", data = {}) => {
	try {
		const token = cookies.get(TOKEN_NAME);
		const formData = new FormData();

		for (let key in data) {
			formData.append(key, data[key]);
		}
		const response = await axios.put(BASE_API_URL + url, formData, {
			headers: { Authorization: token ? token : "" },
		});

		return response.data;
	} catch (error) {
		// toast.error(error.response.data);
		return error.response.data;
	}
};

export const putFormDataURLIncoded = async (url = "", data = {}) => {
	try {
		const formData = new FormData();

		for (let key in data) {
			formData.append(key, data[key]);
		}
		const response = await axios.put(
			BASE_API_URL + url,
			querystring.stringify(data),
			{
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
			}
		);

		return response.data;
	} catch (error) {
		// toast.error(error.response.data);
		return error.response.data;
	}
};
export const putFormDataURLIncodedWithToken = async (url = "", data = {}) => {
	try {
		const token = cookies.get(TOKEN_NAME);
		const formData = new FormData();

		for (let key in data) {
			formData.append(key, data[key]);
		}
		const response = await axios.put(
			BASE_API_URL + url,
			querystring.stringify(data),
			{
				headers: {
					token: token,
					"Content-Type": "application/x-www-form-urlencoded",
				},
			}
		);

		return response.data;
	} catch (error) {
		// toast.error(error.response.data);
		return error.response.data;
	}
};

export const putRawData = async (url = "", data = {}) => {
	try {
		const token = cookies.get(TOKEN_NAME);

		const headers = {};
		
		// Only add Authorization header if token exists (for registration updates, token may not be available)
		if (token) {
			headers.Authorization = token;
		}

		const response = await axios.put(BASE_API_URL + url, data, {
			headers: headers,
		});

		return response.data;
	} catch (error) {
		// toast.error(error.response.data);
		return error.response?.data || { status: 0, message: error.message || "Network error" };
	}
};

export const putRawDataForURL = async (url = "", id, data = {}) => {
	try {
		const token = cookies.get(TOKEN_NAME);

		const response = await axios.put(BASE_API_URL + url + `/${id}`, data, {
			headers: {
				token: token,
			},
		});

		return response.data;
	} catch (error) {
		// toast.error(error.response.data);
		return error.response.data;
	}
};

export const putData = async (url, id, body) => {
	try {
		const token = cookies.get(TOKEN_NAME);
		// let data = body;

		// const dataz = new URLSearchParams();

		// for (const key in body) {
		//   dataz.append(key, body[key]);
		// }

		let config = {
			method: "put",

			url: BASE_API_URL + url + `/${id}`,
			headers: {
				"Content-Type": "application/json",
				token: token,
			},

			data: body,
		};

		axios.request(config).then((response) => {
			return response.data;
		});
	} catch (error) {
		toast.error(error?.response?.data?.message || error?.message);
	}
};

export const deleteDataURLIncodedWithToken = async (url = "", data = {}) => {
	try {
		const token = cookies.get(TOKEN_NAME);
		// const formData = new FormData();

		// for (let key in data) {
		//   formData.append(key, data[key]);
		// }
		const response = await axios.delete(
			BASE_API_URL + url,

			{
				headers: {
					token: token,
					"Content-Type": "application/x-www-form-urlencoded",
				},
				data: querystring.stringify(data),
			}
		);

		return response.data;
	} catch (error) {
		// toast.error(error.response.data);
		return error.response.data;
	}
};

export const deleteData = async (url = "", data = {}) => {
	try {
		const token = cookies.get(TOKEN_NAME);
		const response = await axios.delete(BASE_API_URL + url, {
			headers: {
				Authorization: token,
			},
			data,
		});
		return response.data;
	} catch (error) {
		// console.log("error is coming", error);
		return error.response.data;
	}
};

export const deleteforUrl = async (url = "", data = "") => {
	try {
		const token = cookies.get(TOKEN_NAME);

		const response = await axios.delete(
			BASE_API_URL + url + `/${data?.id}`,
			{
				headers: { Authorization: token ? token : "" },
			}
		);

		return response.data;
	} catch (error) {
		// toast.error(error.response.data);
		return error.response.data;
	}
};

export const DeleteParams = async (url = "", data = {}) => {
	try {
		const token = cookies.get(TOKEN_NAME);

		const response = await axios.delete(BASE_API_URL + url, {
			params: data,
			headers: { Authorization: token ? token : "" },
		});

		return response.data;
	} catch (error) {
		// toast.error(error.response.data);
		return error.response.data;
	}
};

export const getDataAndDownload = async (url = "", data = {}) => {
	try {
		//const token = await Cookies.get(TOKEN_NAME);

		const response = await axios({
			url: BASE_API_URL + url, //your url
			method: "GET",
			responseType: "blob", // important
			params: data,
		});

		return response.data;
	} catch (error) {
		// toast.error(error.response.data);
		return error.response.data;
	}
};
export const patchRawDataToken = async (url = "", data = {}, id) => {
	try {
		const token = useAuthStore.getState().token;

		const response = await axios.patch(
			BASE_API_URL + url + `/${id}`,
			data,
			{
				headers: { Authorization: token ? token : "" },
			}
		);

		return response.data;
	} catch (error) {
		// toast.error(error.response.data);
		return error.response.data;
	}
};

export const putURLIncodedWithToken = async (url = "", data = {}) => {
	try {
		const token = await cookie.get("ascus");
		const formData = new URLSearchParams();
		for (let key in data) {
			formData.append(key, data[key]);
		}

		const response = await axios.put(
			BASE_URL + url,
			querystring.stringify(data),
			{
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
					authtoken: token,
				},
			}
		);
		//console.log(response);
		return response.data;
	} catch (error) {
		toast.error(error.response.data);
		return error.response.data;
	}
};

export const postRawDataToken = async (url = "", data = {}, id) => {
	try {
		const token = cookie.get("ascus");

		const response = await axios.post(BASE_URL + url, data, {
			headers: { authtoken: id ? id : token },
		});

		return response.data;
	} catch (error) {
		// toast.error(error.message);
		// toast.error(error.response.data.message);
		return error.response.data;
	}
};
