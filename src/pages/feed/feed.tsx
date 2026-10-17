import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
// import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchFeedOrders } from '../../services/feedSlice';

export const Feed: FC = () => {
  /** TODO: взять переменную из стора */
  const dispatch = useDispatch();

  const orders = useSelector((state) => state.feed.orders);

  useEffect(() => {
    dispatch(fetchFeedOrders());
  }, [dispatch]);

  if (!orders.length) {
    return <Preloader />;
  }

  return (
    <FeedUI
      orders={orders}
      handleGetFeeds={() => dispatch(fetchFeedOrders())}
    />
  );
};
