import { DeleteParams, getData, patchRawData } from "../index";

  
  export const GetAllUserApi = async (payload) => {
    return getData("user/list", payload).then((data) => {
      return data;
    });
  };
  export const UserDetailApi = async (payload) => {
    return getData("user/detail", payload).then((data) => {
      return data;
    });
  };

  export const DeleteUserApi = async (payload) => {
    return DeleteParams("user/delete", payload).then((data) => {
      return data;
    });
  };
  export const ActiveInActiveUserApi = async (payload) => {
    return patchRawData("user/changeStatus", payload).then((data) => {
      return data;
    });
  };

  export const UpdateUserApi = async (payload) => {
    return putRawData("user/update", payload).then((data) => {
      return data;
    });
  };
