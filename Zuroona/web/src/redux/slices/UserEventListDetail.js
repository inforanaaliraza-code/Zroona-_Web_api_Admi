import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { GetUserEventListDetailApi } from "../../app/api/event";

export const getUserEventListDetail = createAsyncThunk(
	"getUserEventListDetail",
	async (payload, { rejectWithValue }) => {
		try {
			const response = await GetUserEventListDetailApi(payload);
			return response;
		} catch (error) {
			return rejectWithValue(error.response.data);
		}
	}
);

const UserEventListDetailSlice = createSlice({
	name: "UserEventListDetail",
	initialState: {
		loading: false,
		UserEventListDetail: null,
		error: null,
	},
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(getUserEventListDetail.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(getUserEventListDetail.fulfilled, (state, action) => {
				state.loading = false;
				state.UserEventListDetail = action.payload;
			})
			.addCase(getUserEventListDetail.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			});
	},
});

export default UserEventListDetailSlice.reducer;
