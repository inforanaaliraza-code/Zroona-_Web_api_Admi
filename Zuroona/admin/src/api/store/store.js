"use client";
import { create } from "zustand";
import { GetAllOrganizerApi, OrganizerDetailApi } from "../organizer/apis";
import { GetAllUserApi, UserDetailApi } from "../user/apis";
import { EventsDetailApi, GetAllEventsApi } from "../events/apis";
import { CMSDetailApi } from "../setting";

export const useDataStore = create((set) => ({

GetAllOrganizer: {},
fetchGetAllOrganizer: async (data) => {
  const res = await GetAllOrganizerApi(data);
  set({ GetAllOrganizer: await res });
  console.log(res);
},

OrganizerDetail: {},
fetchOrganizerDetail: async (data) => {
  const res = await OrganizerDetailApi(data);
  set({ OrganizerDetail: await res?.data });
},

GetAllUser: {},
fetchGetAllUser: async (data) => {
  const res = await GetAllUserApi(data);
  set({ GetAllUser: await res });
  console.log(res);
},

UserDetail: {},
fetchUserDetail: async (data) => {
  const res = await UserDetailApi(data);
  set({ UserDetail: await res?.data });
},

GetAllEvents: {},
fetchGetAllEvents: async (data) => {
  const res = await GetAllEventsApi(data);
  set({ GetAllEvents: await res });
  console.log(res);
},

EventsDetail: {},
fetchEventsDetail: async (data) => {
  const res = await EventsDetailApi(data);
  console.log("[STORE] EventsDetailApi response:", res);
  console.log("[STORE] Setting EventsDetail to:", res?.data);
  set({ EventsDetail: res?.data || {} });
  return res;
},

CMSDetail: {},
CMSDetailLoading: false,
fetchCMSDetail: async (data) => {
  set({ CMSDetailLoading: true });
  try {
    const res = await CMSDetailApi(data);
    // Ensure CMSDetail is always an object, never undefined
    set({ CMSDetail: res?.data || {}, CMSDetailLoading: false });
    return res?.data || {};
  } catch (error) {
    console.error("Error fetching CMS detail:", error);
    set({ CMSDetail: {}, CMSDetailLoading: false });
    return {};
  }
},
}));