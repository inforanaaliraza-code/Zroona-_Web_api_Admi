import { BASE_API_URL, TOKEN_NAME } from "@/until";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
var querystring = require("querystring");

// normalize axios error so callers don't crash when error.response is undefined
const normalizeAxiosError = (error) => {
  const fallback = {
    status: 0,
    message:
      error?.response?.data?.message || error?.message || "Something went wrong",
  };
  return error?.response?.data || fallback;
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
    const token = await Cookies.get(TOKEN_NAME);

    const formData = new FormData();

    for (let key in data) {
      formData.append(key, data[key]);
    }
    const response = await axios.post(BASE_API_URL + url, formData, {
      headers: { Authorization: token ? token : "" },
    });

    return response.data;
  } catch (error) {
    // toast.error(error.message);
    // toast.error(error.response.data);
    return error.response.data;
  }
};
export const patchFormData = async (url = "", data = {}) => {
  try {
    const token = await Cookies.get(TOKEN_NAME);

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
    const token = await Cookies.get(TOKEN_NAME);

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
export const postRawData = async (url = "", data = {}) => {
  try {
    const token = await Cookies.get(TOKEN_NAME);

    const response = await axios.post(BASE_API_URL + url, data, {
      headers: { Authorization: token ? token : "" },
    });

    return response.data;
  } catch (error) {
    return normalizeAxiosError(error);
  }
};
export const postRawDataforURL = async (url = "", id, data = {}) => {
  try {
    const token = await Cookies.get(TOKEN_NAME);

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
    const token = await Cookies.get(TOKEN_NAME);

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
    const token = await Cookies.get(TOKEN_NAME);

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
    const token = await Cookies.get(TOKEN_NAME);

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
    const token = await Cookies.get(TOKEN_NAME);

    const response = await axios.get(BASE_API_URL + url, {
      params: data,
      headers: { Authorization: token ? token : "" },
    });

    return response.data;
  } catch (error) {
    // toast.error(error.response.data);
    if (error.response) {
      return error.response.data;
    } else if (error.request) {
      // Network error - server not reachable
      return {
        status: 0,
        code: 500,
        message: "Network error: Unable to reach server",
        error: "Network error"
      };
    } else {
      // Request setup error
      return {
        status: 0,
        code: 500,
        message: error.message || "An error occurred",
        error: error.message
      };
    }
  }
};

export const getDataStringify = async (url = "", data = {}) => {
  try {
    const token = await Cookies.get(TOKEN_NAME);

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

export const postDataURLIncoded = async (url = "", data = {}) => {
  try {
    //const token = await Cookies.get(TOKEN_NAME);
    const formData = new URLSearchParams();
    for (let key in data) {
      formData.append(key, data[key]);
    }
    //console.log(data);
    const response = await axios.post(
      BASE_API_URL + url,
      querystring.stringify(data),
      {
        headers: {
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

export const postDataURLIncodedWithToken = async (url = "", data = {}) => {
  try {
    const token = await Cookies.get(TOKEN_NAME);
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
    const token = await Cookies.get(TOKEN_NAME);
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
    const token = await Cookies.get(TOKEN_NAME);

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
    const token = await Cookies.get(TOKEN_NAME);
    const formData = new FormData();

    // Append all fields to FormData - simplified approach
    for (let key in data) {
      const value = data[key];
      
      // Skip null, undefined, or empty strings
      if (value === null || value === undefined || value === '') {
        continue;
      }
      
      // If it's a File object, append as-is with proper name
      if (value instanceof File) {
        formData.append(key, value, value.name);
      } else if (typeof value === 'object') {
        // Skip objects (except File) - they cause issues
        console.warn(`[putFormData] Skipping object value for key: ${key}`);
        continue;
      } else {
        // Convert other values to string
        formData.append(key, String(value));
      }
    }
    
    // Check if FormData has any entries
    let hasEntries = false;
    for (let pair of formData.entries()) {
      hasEntries = true;
      break;
    }
    
    if (!hasEntries) {
      console.warn('[putFormData] FormData is empty, falling back to JSON');
      return putRawData(url, data);
    }
    
    const response = await axios.put(BASE_API_URL + url, formData, {
      headers: { 
        Authorization: token ? token : "",
        // Let axios set Content-Type automatically with boundary for FormData
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
      timeout: 60000, // 60 seconds timeout for file uploads
    });

    return response.data;
  } catch (error) {
    console.error('[putFormData] Error:', error);
    console.error('[putFormData] Error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers
      }
    });
    return error.response?.data || { status: 0, message: error.message };
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
    const token = await Cookies.get(TOKEN_NAME);
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
    const token = await Cookies.get(TOKEN_NAME);

    const response = await axios.put(BASE_API_URL + url, data, {
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

export const putRawDataForURL = async (url = "", id, data = {}) => {
  try {
    const token = await Cookies.get(TOKEN_NAME);

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
    const token = await Cookies.get(TOKEN_NAME);
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
    const token = await Cookies.get(TOKEN_NAME);
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
    const token = await Cookies.get(TOKEN_NAME);
    const formData = new FormData();

    for (let key in data) {
      formData.append(key, data[key]);
    }
    const response = await axios.delete(BASE_API_URL + url, {
      headers: {
        token: token,
      },
      data: formData,
    });

    return response.data;
  } catch (error) {
    // toast.error(error.response.data);
    return error.response.data;
  }
};

export const deleteforUrl = async (url = "", data = "") => {
  try {
    const token = await Cookies.get(TOKEN_NAME);

    const response = await axios.delete(BASE_API_URL + url + `/${data?.id}`, {
      headers: { Authorization: token ? token : "" },
    });

    return response.data;
  } catch (error) {
    // toast.error(error.response.data);
    return error.response.data;
  }
};

export const DeleteParams = async (url = "", data = {}) => {
  try {
    const token = await Cookies.get(TOKEN_NAME);

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
