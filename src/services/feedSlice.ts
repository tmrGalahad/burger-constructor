import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getOrders } from '../utils/burger-api';
import { TOrder } from '../utils/types';

type TFeedState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  isLoading: boolean;
  error: string | null;
};
const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: false,
  error: null
};

export const fetchFeedOrders = createAsyncThunk(
  'feed/fetchFeedOrders',
  async (_, { rejectWithValue }) => {
    try {
      return await getOrders();
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : 'Не удалось загрузить ленту заказов'
      );
    }
  }
);

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeedOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFeedOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(fetchFeedOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

export default feedSlice.reducer;
