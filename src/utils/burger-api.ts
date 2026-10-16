import { TIngredient, TOrder, TOrdersData, TUser } from './types';

const BURGER_API_URL = 'https://practicetasks.kz/burger-constructor';

type TResponse<T> = {
  success: boolean;
  data?: T;
  message?: string;
  accessToken?: string;
  refreshToken?: string;
  user?: TUser;
  order?: TOrder;
  orders?: TOrder[];
  total?: number;
  totalToday?: number;
};

export const getIngredients = async (): Promise<TIngredient[]> => {
  const response = await fetch(`${BURGER_API_URL}/ingredients`);

  if (!response.ok) {
    throw new Error('Ошибка загрузки ингредиентов');
  }

  const data: TResponse<TIngredient[]> = await response.json();

  if (!data.success || !data.data) {
    throw new Error('Не удалось загрузить ингредиенты');
  }

  return data.data;
};

export const getOrders = async (): Promise<TOrdersData> => {
  const response = await fetch(`${BURGER_API_URL}/orders/all`);

  if (!response.ok) {
    throw new Error('Ошибка загрузки заказов');
  }

  const data: TResponse<TOrder[]> = await response.json();

  if (!data.success) {
    throw new Error('Не удалось загрузить заказы');
  }

  return {
    orders: data.orders || [],
    total: data.total || 0,
    totalToday: data.totalToday || 0
  };
};

export const createOrderApi = async (
  ingredients: string[]
): Promise<TOrder> => {
  const response = await fetch(`${BURGER_API_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ ingredients })
  });
  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(`Ошибка ${response.status}: ${errorText}`);
  }
  const data: TResponse<never> = await response.json();
  if (!data.success || !data.order) {
    throw new Error(data.message || 'Не удалось оформить заказ');
  }
  return data.order;
};

export const loginApi = async (email: string, password: string) => {
  const response = await fetch(`${BURGER_API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });

  const data = await response.json();

  if (
    !response.ok ||
    !data.success ||
    !data.access_token ||
    !data.refresh_token ||
    !data.user
  ) {
    throw new Error(data.message || 'Не удалось войти');
  }

  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    user: data.user
  };
};

export const registerApi = async (
  email: string,
  password: string,
  name: string
) => {
  const response = await fetch(`${BURGER_API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password, name })
  });

  const data = await response.json();

  if (
    !response.ok ||
    !data.success ||
    !data.access_token ||
    !data.refresh_token ||
    !data.user
  ) {
    throw new Error(data.message || 'Не удалось зарегистрироваться');
  }

  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    user: data.user
  };
};

export const refreshTokenApi = async (refreshToken: string) => {
  const response = await fetch(`${BURGER_API_URL}/auth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ token: refreshToken })
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Не удалось обновить токен');
  }

  const accessToken = data.access_token ?? data.accessToken;
  const newRefreshToken = data.refresh_token ?? data.refreshToken;

  if (!accessToken || !newRefreshToken) {
    throw new Error('Сервер не вернул новые токены');
  }

  return {
    accessToken,
    refreshToken: newRefreshToken
  };
};

export const getUserApi = async (accessToken: string): Promise<TUser> => {
  const response = await fetch(`${BURGER_API_URL}/auth/user`, {
    method: 'GET',
    headers: {
      Authorization: accessToken
    }
  });

  const data = await response.json();

  if (!response.ok || !data.success || !data.user) {
    throw new Error(data.message || 'Не удалось получить пользователя');
  }

  return data.user as TUser;
};

export const logoutApi = async (refreshToken: string) => {
  const response = await fetch(`${BURGER_API_URL}/auth/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ token: refreshToken })
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Не удалось выйти из аккаунта');
  }

  return data;
};
