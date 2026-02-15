import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { GetProfileApi } from "../../app/api/setting";

// Async thunk to fetch profile information
export const getProfile = createAsyncThunk(
	"profileInfo/getProfile",
	async (_, { rejectWithValue }) => {
		try {
			const response = await GetProfileApi();
			return response?.data;
		} catch (error) {
			return rejectWithValue(
				error.response?.data || { message: "Failed to fetch profile" }
			);
		}
	}
);

const profileInfoSlice = createSlice({
	name: "profileInfo",
	initialState: {
		loading: false,
		loadingProfile: false,
		profileInfo: null,
		profile: null,
		error: null,
	},
	reducers: {
		clearProfileInfo: (state) => {
			state.profileInfo = null;
			state.profile = null;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(getProfile.pending, (state) => {
				state.loading = true;
				state.loadingProfile = true;
				state.error = null;
			})
			.addCase(getProfile.fulfilled, (state, action) => {
				state.loading = false;
				state.loadingProfile = false;
				state.profileInfo = action.payload;
				state.profile = action.payload; // Also set profile for compatibility
			})
			.addCase(getProfile.rejected, (state, action) => {
				state.loading = false;
				state.loadingProfile = false;
				state.error = action.payload;
			});
	},
});

export const { clearProfileInfo } = profileInfoSlice.actions;
export default profileInfoSlice.reducer;
