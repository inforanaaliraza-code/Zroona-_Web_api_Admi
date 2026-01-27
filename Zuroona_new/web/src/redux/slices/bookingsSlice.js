import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { GetUserBookingsApi } from "@/app/api/setting";

// Async thunk to fetch user bookings
export const fetchUserBookings = createAsyncThunk(
  "bookings/fetchUserBookings",
  async (_, { rejectWithValue }) => {
    try {
      const response = await GetUserBookingsApi();
      if (response && (response.status === 1 || response.status === true)) {
        // Map API response to normalized format
        const mappedBookings = (response.data || []).map(booking => ({
          _id: booking._id || booking.book_id,
          status: booking.book_status !== undefined ? booking.book_status : booking.status,
          payment_status: booking.payment_status,
          attendees: booking.no_of_attendees || booking.attendees || 0,
          total_amount: booking.book_details?.total_amount || booking.total_amount,
          refund_request_id: booking.refund_request_id,
          invoice_id: booking.invoice_id,
          invoice_url: booking.invoice_url,
          order_id: booking.order_id,
          event_start_time: booking.event_start_time || booking.event?.event_start_time,
          event_end_time: booking.event_end_time || booking.event?.event_end_time,
          event_address: booking.event_address || booking.event?.event_address,
          event_category: booking.event_category || booking.event?.event_category,
          organizer: {
            first_name: booking.organizer_first_name || booking.organizer?.first_name,
            last_name: booking.organizer_last_name || booking.organizer?.last_name,
            profile_image: booking.organizer_profile_image || booking.organizer?.profile_image,
          },
          event: {
            _id: booking.event_id || booking.event?._id,
            event_name: booking.event_name || booking.event?.event_name,
            event_date: booking.event_date || booking.event?.event_date,
            event_images: booking.event_image ? [booking.event_image] : (booking.event?.event_images || []),
            event_image: booking.event_image || booking.event?.event_image,
            event_address: booking.event_address || booking.event?.event_address,
            event_price: booking.event_price || booking.event?.event_price,
            event_description: booking.event_description || booking.event?.event_description,
            event_category: booking.event_category || booking.event?.event_category,
            event_for: booking.event_for || booking.event?.event_for,
            event_type: booking.event_type || booking.event?.event_type,
            event_start_time: booking.event_start_time || booking.event?.event_start_time,
            event_end_time: booking.event_end_time || booking.event?.event_end_time,
            organizer: {
              first_name: booking.organizer_first_name || booking.organizer?.first_name,
              last_name: booking.organizer_last_name || booking.organizer?.last_name,
              profile_image: booking.organizer_profile_image || booking.organizer?.profile_image,
            }
          },
          createdAt: booking.createdAt,
          updatedAt: booking.updatedAt
        }));
        return mappedBookings;
      } else {
        return rejectWithValue(response?.message || "Failed to fetch bookings");
      }
    } catch (error) {
      return rejectWithValue(error.message || "Error fetching bookings");
    }
  }
);

const bookingsSlice = createSlice({
  name: "bookings",
  initialState: {
    bookings: [],
    filteredBookings: [],
    loading: false,
    error: null,
    activeTab: "all",
    searchQuery: "",
  },
  reducers: {
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
      // Filter bookings based on active tab
      let filtered = [];
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (action.payload === "all") {
        filtered = [...state.bookings];
        filtered.sort((a, b) => {
          const dateA = new Date(a.event?.event_date || 0);
          const dateB = new Date(b.event?.event_date || 0);
          const aIsUpcoming = dateA >= today;
          const bIsUpcoming = dateB >= today;
          if (aIsUpcoming && !bIsUpcoming) return -1;
          if (!aIsUpcoming && bIsUpcoming) return 1;
          return dateA - dateB;
        });
      } else if (action.payload === "pending") {
        filtered = state.bookings.filter(booking => booking.status === 1);
        filtered.sort((a, b) => {
          const dateA = new Date(a.event?.event_date || 0);
          const dateB = new Date(b.event?.event_date || 0);
          return dateA - dateB;
        });
      } else if (action.payload === "approved") {
        filtered = state.bookings.filter(booking => booking.status === 2);
        filtered.sort((a, b) => {
          const dateA = new Date(a.event?.event_date || 0);
          const dateB = new Date(b.event?.event_date || 0);
          const aIsUpcoming = dateA >= today;
          const bIsUpcoming = dateB >= today;
          if (aIsUpcoming && !bIsUpcoming) return -1;
          if (!aIsUpcoming && bIsUpcoming) return 1;
          return dateA - dateB;
        });
      } else if (action.payload === "rejected") {
        filtered = state.bookings.filter(booking => booking.status === 4);
        filtered.sort((a, b) => {
          const dateA = new Date(a.event?.event_date || 0);
          const dateB = new Date(b.event?.event_date || 0);
          return dateB - dateA;
        });
      } else if (action.payload === "cancelled") {
        filtered = state.bookings.filter(booking => booking.status === 3);
        filtered.sort((a, b) => {
          const dateA = new Date(a.event?.event_date || 0);
          const dateB = new Date(b.event?.event_date || 0);
          return dateB - dateA;
        });
      }
      state.filteredBookings = filtered;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
      // Apply search filter
      const searchLower = action.payload.toLowerCase();
      const filtered = state.bookings.filter(booking => {
        const eventName = booking.event?.event_name?.toLowerCase() || "";
        const organizerName = `${booking.organizer?.first_name || ""} ${booking.organizer?.last_name || ""}`.toLowerCase();
        const category = booking.event?.event_category?.toLowerCase() || "";
        return eventName.includes(searchLower) || 
               organizerName.includes(searchLower) || 
               category.includes(searchLower);
      });
      state.filteredBookings = filtered;
    },
    updateBooking: (state, action) => {
      const index = state.bookings.findIndex(b => b._id === action.payload._id);
      if (index !== -1) {
        state.bookings[index] = { ...state.bookings[index], ...action.payload };
      }
    },
    removeBooking: (state, action) => {
      state.bookings = state.bookings.filter(b => b._id !== action.payload);
      state.filteredBookings = state.filteredBookings.filter(b => b._id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
        // Apply current filter
        const tab = state.activeTab;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        let filtered = [];
        if (tab === "all") {
          filtered = [...action.payload];
          filtered.sort((a, b) => {
            const dateA = new Date(a.event?.event_date || 0);
            const dateB = new Date(b.event?.event_date || 0);
            const aIsUpcoming = dateA >= today;
            const bIsUpcoming = dateB >= today;
            if (aIsUpcoming && !bIsUpcoming) return -1;
            if (!aIsUpcoming && bIsUpcoming) return 1;
            return dateA - dateB;
          });
        } else if (tab === "pending") {
          filtered = action.payload.filter(booking => booking.status === 1);
        } else if (tab === "approved") {
          filtered = action.payload.filter(booking => booking.status === 2);
        } else if (tab === "rejected") {
          filtered = action.payload.filter(booking => booking.status === 4);
        } else if (tab === "cancelled") {
          filtered = action.payload.filter(booking => booking.status === 3);
        }
        state.filteredBookings = filtered;
      })
      .addCase(fetchUserBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch bookings";
      });
  },
});

export const { setActiveTab, setSearchQuery, updateBooking, removeBooking } = bookingsSlice.actions;
export default bookingsSlice.reducer;
