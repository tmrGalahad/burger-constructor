import { FC, useMemo, useEffect, useState } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient, TOrder } from '@utils-types';
import { useParams } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { getOrderByNumberApi } from '../../utils/burger-api';

export const OrderInfo: FC = () => {
  /** TODO: взять переменные orderData и ingredients из стора */
  const { number } = useParams();
  // ff
  const feedOrders = useSelector((state) => state.feed.orders);
  const userOrders = useSelector((state) => state.orders.orders);
  const ingredients = useSelector((state) => state.ingredients.items);
  const orderFromStore = useMemo(
    () =>
      [...feedOrders, ...userOrders].find(
        (order) => String(order.number) === number
      ),
    [feedOrders, userOrders, number]
  );

  const [orderData, setOrderData] = useState<TOrder | undefined>(
    orderFromStore
  );

  const [isLoading, setIsLoading] = useState(!orderFromStore);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (orderFromStore) {
      setOrderData(orderFromStore);
      setError(null);
      setIsLoading(false);
      return;
    }

    if (!number || !/^\d+$/.test(number)) {
      setError('Некорректный номер заказа');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    getOrderByNumberApi(Number(number))
      .then((order) => {
        setOrderData(order);
      })
      .catch(() => {
        setOrderData(undefined);
        setError('Заказ не найден');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [orderFromStore, number]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date((orderData as any).created_at ?? orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (isLoading) {
    return <Preloader />;
  }

  if (error) {
    return <p> {error} </p>;
  }

  if (!orderInfo) {
    return <p>Заказ не найден</p>;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
