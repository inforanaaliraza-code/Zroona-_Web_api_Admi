import { getData, postRawData, putRawData } from "../index";

export const AddReviewApi = async (payload) => {
    return postRawData("user/event/review/add", payload).then((data) => {
      return data;
    });
  };
  
  export const GetReviewApi = async (payload) => {
    return getData("user/event/review/list", payload).then((data) => {
      return data;
    });
  };
