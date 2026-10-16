import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getUserApi, refreshTokenApi } from '../utils/burger-api';

export type TUser = {
  email: string;
  name: string;
};

type TUserState = {
  user: TUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
};

const getSavedUser = (): TUser | null => {
  try {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  } catch {
    return null;
  }
};

const initialState: TUserState = {
  user: getSavedUser(),
  isAuthenticated: Boolean(localStorage.getItem('accessToken')),
  isLoading: false
};

export const restoreUser = createAsyncThunk(
  'user/restoreUser',
  async (_, { rejectWithValue }) => {
    let accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    try {
      if (!accessToken && !refreshToken) {
        return rejectWithValue('Нет сохранённой авторизации');
      }

      if (!accessToken && refreshToken) {
        const tokens = await refreshTokenApi(refreshToken);
        accessToken = tokens.accessToken;
        localStorage.setItem('accessToken', tokens.accessToken);
        localStorage.setItem('refreshToken', tokens.refreshToken);
      }

      try {
        const user = await getUserApi(accessToken!);
        localStorage.setItem('user', JSON.stringify(user));
        return user;
      } catch {
        if (!refreshToken) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');

          return rejectWithValue('Не удалось восстановить авторизацию');
        }

        const tokens = await refreshTokenApi(refreshToken);
        localStorage.setItem('accessToken', tokens.accessToken);
        localStorage.setItem('refreshToken', tokens.refreshToken);

        const user = await getUserApi(tokens.accessToken);
        localStorage.setItem('user', JSON.stringify(user));
        return user;
      }
    } catch {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      return rejectWithValue('Не удалось восстановить авторизацию');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<TUser>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(restoreUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(restoreUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isLoading = false;
      })
      .addCase(restoreUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      });
  }
});

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;
