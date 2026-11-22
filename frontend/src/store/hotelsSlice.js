import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as hotelsApi from "../api/hotelsApi";

const PAGE_SIZE = 5;

export const loadHotels = createAsyncThunk("hotels/loadHotels", async function (_, thunkApi) {
  const state = thunkApi.getState().hotels;
  const page = state.page;
  return hotelsApi.fetchHotels({
    title: state.searchTitle,
    minPrice: state.minPrice,
    maxPrice: state.maxPrice,
    sort: state.sort,
    offset: (page - 1) * PAGE_SIZE,
    limit: PAGE_SIZE
  });
});

export const loadHotel = createAsyncThunk("hotels/loadHotel", async function (id) {
  return hotelsApi.fetchHotel(id);
});

export const saveHotel = createAsyncThunk("hotels/saveHotel", async function ({ id, formData }, thunkApi) {
  try {
    if (id) {
      return await hotelsApi.updateHotel(id, formData);
    }
    return await hotelsApi.createHotel(formData);
  } catch (error) {
    return thunkApi.rejectWithValue(error);
  }
});

export const removeHotel = createAsyncThunk("hotels/removeHotel", async function (id, thunkApi) {
  try {
    const data = await hotelsApi.deleteHotel(id);
    return { id: id, message: data.message };
  } catch (error) {
    return thunkApi.rejectWithValue(error);
  }
});

const initialState = {
  items: [],
  total: 0,
  page: 1,
  limit: PAGE_SIZE,
  searchTitle: "",
  minPrice: "",
  maxPrice: "",
  sort: "newest",
  minRating: 0,
  current: null,
  loading: false,
  saving: false,
  error: "",
  formErrors: {},
  successMessage: ""
};

const hotelsSlice = createSlice({
  name: "hotels",
  initialState,
  reducers: {
    setSearchTitle: function (state, action) {
      state.searchTitle = action.payload;
    },
    setMinPrice: function (state, action) {
      state.minPrice = action.payload;
    },
    setMaxPrice: function (state, action) {
      state.maxPrice = action.payload;
    },
    setSort: function (state, action) {
      state.sort = action.payload;
    },
    setMinRating: function (state, action) {
      state.minRating = action.payload;
    },
    setPage: function (state, action) {
      state.page = action.payload;
    },
    resetFilters: function (state) {
      state.searchTitle = "";
      state.minPrice = "";
      state.maxPrice = "";
      state.sort = "newest";
      state.minRating = 0;
      state.page = 1;
    },
    clearSuccess: function (state) {
      state.successMessage = "";
    },
    clearFormErrors: function (state) {
      state.formErrors = {};
      state.error = "";
    },
    resetCurrent: function (state) {
      state.current = null;
    }
  },
  extraReducers: function (builder) {
    builder
      .addCase(loadHotels.pending, function (state) {
        state.loading = true;
        state.error = "";
      })
      .addCase(loadHotels.fulfilled, function (state, action) {
        state.loading = false;
        state.items = action.payload.hotels;
        state.total = action.payload.total;
        state.limit = action.payload.limit;
      })
      .addCase(loadHotels.rejected, function (state) {
        state.loading = false;
        state.error = "Could not load hotels. Please check backend connection.";
      })
      .addCase(loadHotel.pending, function (state) {
        state.loading = true;
        state.error = "";
      })
      .addCase(loadHotel.fulfilled, function (state, action) {
        state.loading = false;
        state.current = action.payload.hotel;
      })
      .addCase(loadHotel.rejected, function (state) {
        state.loading = false;
        state.current = null;
        state.error = "Hotel not found.";
      })
      .addCase(saveHotel.pending, function (state) {
        state.saving = true;
        state.formErrors = {};
        state.error = "";
      })
      .addCase(saveHotel.fulfilled, function (state, action) {
        state.saving = false;
        state.successMessage = action.payload.message;
      })
      .addCase(saveHotel.rejected, function (state, action) {
        state.saving = false;
        state.formErrors = (action.payload && action.payload.errors) || {};
        state.error = (action.payload && action.payload.message) || "Could not save hotel.";
      })
      .addCase(removeHotel.fulfilled, function (state, action) {
        state.successMessage = action.payload.message || "Hotel deleted successfully.";
        state.items = state.items.filter(function (hotel) {
          return hotel.id !== action.payload.id;
        });
        state.total = Math.max(0, state.total - 1);
      })
      .addCase(removeHotel.rejected, function (state) {
        state.error = "Could not delete hotel.";
      });
  }
});

export const {
  setSearchTitle,
  setMinPrice,
  setMaxPrice,
  setSort,
  setMinRating,
  setPage,
  resetFilters,
  clearSuccess,
  clearFormErrors,
  resetCurrent
} = hotelsSlice.actions;

export default hotelsSlice.reducer;
