"use client";

import { configureStore } from "@reduxjs/toolkit";
import profileInfoReducer from "./slices/profileInfo";
import EventListReducer from "./slices/EventList";
import CategoryEventListReducer from "./slices/CategoryEventList";
import CategoryListReducer from "./slices/CategoryList";
import EventDetailReducer from "./slices/EventListDetail";
import ReviewsListReducer from "./slices/ReviewsList";
import BookingListReducer from "./slices/OrganizerBookingList";
import BookingdetailsReducer from "./slices/OrgaizerBookingDetail";
import UserEventListReducer from "./slices/UserEventList";
import UserEventDetailReducer from "./slices/UserEventListDetail";
import UserBookingListReducer from "./slices/UserBookingList";
import UserBookingdetailsReducer from "./slices/UserBookingDetail";
import bookingsReducer from "./slices/bookingsSlice";
import UserNotificatonListReducer from "./slices/UserNotificaton";
import UserNotificatonCountReducer from "./slices/UserNotificatonCount";
import EarningReducer from "./slices/Earning";
import WithdrawalListReducer from "./slices/WithdrawalList";
import languageReducer from "./slices/language";
import signupFormReducer from "./slices/signupFormSlice";
import paymentMethodReducer from "./slices/paymentMethodSlice";

export const store = configureStore({
  reducer: {
    profileData: profileInfoReducer,
    EarningData: EarningReducer,
    WithdrawalListData: WithdrawalListReducer,
    CategoryEventData: CategoryEventListReducer,
    CategoryData: CategoryListReducer,
    EventData: EventListReducer,
    EventDetailData: EventDetailReducer,
    ReviewsListData: ReviewsListReducer,
    BookingListData: BookingListReducer,
    BookingDetailData: BookingdetailsReducer,
    UserEventData: UserEventListReducer,
    UserEventDetailData: UserEventDetailReducer,
    UserBookingListData: UserBookingListReducer,
    UserBookingDetailData: UserBookingdetailsReducer,
    bookings: bookingsReducer,
    UserNotificatonListData: UserNotificatonListReducer,
    UserNotificatonCountData: UserNotificatonCountReducer,
    language: languageReducer,
    signupForm: signupFormReducer,
    paymentMethod: paymentMethodReducer,
  },
});
