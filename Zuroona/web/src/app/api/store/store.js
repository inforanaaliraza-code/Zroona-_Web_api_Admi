import { create } from "zustand";
import { EventsDetailApi, getEvents } from "../events/apis";
import {
	CMSDetailApi,
	GetAllNotificationApi,
	getCategoryList,
	ProfileDetailApi,
} from "../setting";
import {
	GetAllMyBookingApi,
	GetAllOrganizerBookingApi,
	MyBookingDetailApi,
	OrganizerBookingDetailApi,
} from "../myBookings/apis";
import { GetReviewApi } from "../review/apis";

export const useDataStore = create((set) => ({
	// GetAllOrganizer: {},
	// fetchGetAllOrganizer: async (data) => {
	//   const res = await GetAllOrganizerApi(data);
	//   set({ GetAllOrganizer: await res });
	// },

	// OrganizerDetail: {},
	// fetchOrganizerDetail: async (data) => {
	//   const res = await OrganizerDetailApi(data);
	//   set({ OrganizerDetail: await res?.data });
	// },

	// GetAllUser: {},
	// fetchGetAllUser: async (data) => {
	//   const res = await GetAllUserApi(data);
	//   set({ GetAllUser: await res });
	// },

	ProfileDetail: {},
	fetchProfileDetail: async (data) => {
		const res = await ProfileDetailApi(data);
		set({ ProfileDetail: await res?.data });
	},

	GetAllEvents: {},
	fetchGetAllEvents: async (data) => {
		try {
			console.log("[STORE] Fetching events with params:", data);
			const res = await getEvents(data);
			console.log("[STORE] Events response:", res);
			set({ GetAllEvents: res || {} });
			return res;
		} catch (error) {
			console.error("[STORE] Error fetching events:", error);
			set({ GetAllEvents: {} });
			return { data: [] };
		}
	},

	EventsDetail: {},
	fetchEventsDetail: async (data) => {
		const res = await EventsDetailApi(data);
		set({ EventsDetail: await res?.data });
	},

	GetAllMyBooking: {},
	fetchGetAllMyBooking: async (data) => {
		const res = await GetAllMyBookingApi(data);
		set({ GetAllMyBooking: await res });
	},

	MyBookingDetail: {},
	fetchMyBookingDetail: async (data) => {
		const res = await MyBookingDetailApi(data);
		set({ MyBookingDetail: await res?.data });
	},

	GetAllOrganizerMyBooking: {},
	fetchGetAllOrganizerMyBooking: async (data) => {
		const res = await GetAllOrganizerBookingApi(data);
		set({ GetAllOrganizerMyBooking: await res });
	},

	OrganizerMyBookingDetail: {},
	fetchOrganizerMyBookingDetail: async (data) => {
		const res = await OrganizerBookingDetailApi(data);
		set({ OrganizerMyBookingDetail: await res?.data });
	},

	CMSDetail: {},
	fetchCMSDetail: async (data) => {
		const res = await CMSDetailApi(data);
		set({ CMSDetail: await res?.data });
	},

	CategoryList: {},
	fetchCategoryList: async (data) => {
		const res = await getCategoryList(data);
		set({ getCategoryList: await res?.data });
	},

	GetAllNotification: {},
	fetchGetAllNotification: async (data) => {
		const res = await GetAllNotificationApi(data);
		set({ GetAllNotification: await res?.data });
	},

	GetAllReview: {},
	fetchGetAllReview: async (data) => {
		const res = await GetReviewApi(data);
		set({ GetAllReview: await res });
	},
}));
