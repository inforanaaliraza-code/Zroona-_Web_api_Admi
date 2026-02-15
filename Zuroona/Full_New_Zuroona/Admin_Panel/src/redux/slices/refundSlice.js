import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { GetRefundListApi, GetRefundDetailApi, UpdateRefundStatusApi } from "@/api/setting";

// Async thunks
export const fetchRefunds = createAsyncThunk(
  "refund/fetchRefunds",
  async (params, { rejectWithValue }) => {
    try {
      const response = await GetRefundListApi(params);
      if (response?.status === 1 || response?.code === 200) {
        let refundData = [];
        if (Array.isArray(response?.data)) {
          refundData = response.data;
        } else if (response?.data?.refunds && Array.isArray(response.data.refunds)) {
          refundData = response.data.refunds;
        } else if (response?.data && typeof response.data === 'object') {
          refundData = Object.values(response.data).find(val => Array.isArray(val)) || [];
        }
        
        // Normalize data
        refundData = refundData.map(refund => ({
          ...refund,
          booking_id: refund.booking_id?._id || refund.booking_id || refund._id,
          user: refund.user || { email: refund.user_id || "N/A" },
          currency: refund.currency || "SAR",
          status: refund.status !== undefined ? refund.status : 0,
        }));
        
        return {
          refunds: refundData,
          totalCount: response?.total_count || refundData.length,
        };
      } else {
        return rejectWithValue(response?.message || "Failed to fetch refunds");
      }
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch refunds");
    }
  }
);

export const fetchRefundDetail = createAsyncThunk(
  "refund/fetchRefundDetail",
  async (refundId, { rejectWithValue }) => {
    try {
      const response = await GetRefundDetailApi({ refund_id: refundId });
      if (response?.status === 1 || response?.code === 200) {
        return response.data;
      } else {
        return rejectWithValue(response?.message || "Failed to fetch refund details");
      }
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch refund details");
    }
  }
);

export const updateRefundStatus = createAsyncThunk(
  "refund/updateRefundStatus",
  async ({ refundId, status, adminResponse, paymentRefundId }, { rejectWithValue }) => {
    try {
      if (!refundId || status === undefined) {
        return rejectWithValue("Refund ID and status are required");
      }

      const refundIdString = refundId?.toString ? refundId.toString() : String(refundId);
      
      const payload = {
        refund_id: refundIdString,
        status: status,
        ...(adminResponse && { admin_response: adminResponse }),
        ...(paymentRefundId && { payment_refund_id: paymentRefundId }),
      };
      
      const response = await UpdateRefundStatusApi(payload);
      
      if (response?.status === 1 || response?.code === 200) {
        return { refundId: refundIdString, updatedData: response.data };
      } else {
        return rejectWithValue(response?.message || "Failed to update refund status");
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || "Failed to update refund status");
    }
  }
);

const refundSlice = createSlice({
  name: "refund",
  initialState: {
    refunds: [],
    refundDetail: null,
    loading: false,
    detailLoading: false,
    updating: false,
    error: null,
    detailError: null,
    totalCount: 0,
    filters: {
      page: 1,
      limit: 10,
      search: "",
      status: "all",
    },
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setSearch: (state, action) => {
      state.filters.search = action.payload;
    },
    setPage: (state, action) => {
      state.filters.page = action.payload;
    },
    setStatusFilter: (state, action) => {
      state.filters.status = action.payload;
    },
    clearRefundDetail: (state) => {
      state.refundDetail = null;
      state.detailError = null;
    },
    clearError: (state) => {
      state.error = null;
      state.detailError = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch refunds
    builder
      .addCase(fetchRefunds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRefunds.fulfilled, (state, action) => {
        state.loading = false;
        state.refunds = action.payload.refunds;
        state.totalCount = action.payload.totalCount;
        state.error = null;
      })
      .addCase(fetchRefunds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.refunds = [];
        state.totalCount = 0;
      });

    // Fetch refund detail
    builder
      .addCase(fetchRefundDetail.pending, (state) => {
        state.detailLoading = true;
        state.detailError = null;
      })
      .addCase(fetchRefundDetail.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.refundDetail = action.payload;
        state.detailError = null;
      })
      .addCase(fetchRefundDetail.rejected, (state, action) => {
        state.detailLoading = false;
        state.detailError = action.payload;
        state.refundDetail = null;
      });

    // Update refund status
    builder
      .addCase(updateRefundStatus.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(updateRefundStatus.fulfilled, (state, action) => {
        state.updating = false;
        // Update the refund in the list
        const index = state.refunds.findIndex(
          (r) => r._id === action.payload.refundId || String(r._id) === action.payload.refundId
        );
        if (index !== -1 && action.payload.updatedData) {
          state.refunds[index] = { ...state.refunds[index], ...action.payload.updatedData };
        }
        state.error = null;
      })
      .addCase(updateRefundStatus.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload;
      });
  },
});

export const {
  setFilters,
  setSearch,
  setPage,
  setStatusFilter,
  clearRefundDetail,
  clearError,
} = refundSlice.actions;

export default refundSlice.reducer;
