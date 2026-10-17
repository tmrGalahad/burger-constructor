import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState, ChangeEvent } from 'react';
import { useSelector } from '../../services/store';
import { updateUserApi } from '../../utils/burger-api';
import { setUser } from '../../services/userSlice';
import { useDispatch } from '../../services/store';

export const Profile: FC = () => {
  /** TODO: взять переменную из стора */
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();

  const [formValue, setFormValue] = useState({
    name: user?.name ?? '',
    email: user?.email ?? '',
    password: ''
  });

  useEffect(() => {
    setFormValue((prevState) => ({
      ...prevState,
      name: user?.name ?? '',
      email: user?.email ?? ''
    }));
  }, [user?.name, user?.email]);

  const isFormChanged =
    formValue.name !== (user?.name ?? '') ||
    formValue.email !== (user?.email ?? '') ||
    !!formValue.password;

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      alert('Необходимо войти в аккаунт');
      return;
    }
    try {
      const updatedUser = await updateUserApi(
        {
          name: formValue.name,
          email: formValue.email,
          ...(formValue.password ? { password: formValue.password } : {})
        },
        accessToken
      );
      dispatch(setUser(updatedUser));
      localStorage.setItem('user', JSON.stringify(updatedUser));

      setFormValue({
        name: updatedUser.name,
        email: updatedUser.email,
        password: ''
      });
      alert('Профиль успешно обновлён');
    } catch (error) {
      alert(
        error instanceof Error ? error.message : 'Не удалось обновить профиль'
      );
    }
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    setFormValue({
      name: user?.name ?? '',
      email: user?.email ?? '',
      password: ''
    });
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
