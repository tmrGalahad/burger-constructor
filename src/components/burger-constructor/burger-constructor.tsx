import { FC, useMemo, useState } from 'react';
import { TConstructorIngredient, TOrder } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
// import { TConstructorItems } from '../ui/burger-constructor/type';
import { useSelector, useDispatch } from '../../services/store';
import { createOrderApi } from '../../utils/burger-api';
import { clearConstructor } from '../../services/constructorSlice';
import { useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */
  const dispatch = useDispatch();
  const constructorItems = useSelector((state) => state.burgerConstructor);
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  const [orderRequest, setOrderRequest] = useState(false);
  const [orderModalData, setOrderModalData] = useState<TOrder | null>(null);

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (sum: number, item: TConstructorIngredient) => sum + item.price,
        0
      ),
    [constructorItems]
  );

  const onOrderClick = async () => {
    if (orderRequest) return;
    if (!constructorItems.bun || constructorItems.ingredients.length === 0) {
      return;
    }
    if (!user) {
      navigate('/login');
      return;
    }

    setOrderRequest(true);

    try {
      const ingredients = [
        constructorItems.bun._id,
        ...constructorItems.ingredients.map((item) => item._id),
        constructorItems.bun._id
      ];

      const order = await createOrderApi(ingredients);

      setOrderModalData(order);
      dispatch(clearConstructor());
    } catch (error) {
      console.error('Ошибка оформления заказа:', error);
    } finally {
      setOrderRequest(false);
    }
  };

  const closeOrderModal = () => {
    setOrderModalData(null);
  };

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
