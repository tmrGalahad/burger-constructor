import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '../utils/types';
import { getUserOrdersApi } from '../utils/burger-api';

type TOrdersState = {
  orders: TOrder[];
  isLoading: boolean;
  error: string | null;
};
const initialState: TOrdersState = {
  orders: [],
  isLoading: false,
  error: null
};

export const fetchUserOrders = createAsyncThunk(
  'orders/fetchUserOrders',
  async (_, { rejectWithValue }) => {
    try {
      return await getUserOrdersApi();
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Не удалось загрузить заказы'
      );
    }
  }
);
const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  }
});

export default ordersSlice.reducer;
