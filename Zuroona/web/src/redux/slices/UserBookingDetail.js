import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { GetUserBookingDetailApi } from "../../app/api/booking";

export const getUserBookingDetail = createAsyncThunk(
	"getUserBookingDetail",
	async (payload, { rejectWithValue }) => {
		try {
			const response = await GetUserBookingDetailApi(payload);
			return response;
		} catch (error) {
			return rejectWithValue(error.response.data);
		}
	}
);

const UserBookingDetailSlice = createSlice({
	name: "UserBookingDetail",
	initialState: {
		loading: false,
		UserBookingDetail: null,
		error: null,
	},
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(getUserBookingDetail.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(getUserBookingDetail.fulfilled, (state, action) => {
				state.loading = false;
				state.UserBookingDetail = action.payload;
			})
			.addCase(getUserBookingDetail.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			});
	},
});

export default UserBookingDetailSlice.reducer;
