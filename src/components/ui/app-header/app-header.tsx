import React, { FC } from 'react';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import { BurgerIcon, ListIcon, ProfileIcon } from '@ui-kit';
import { NavLink } from 'react-router-dom';

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({ userName }) => (
  <header className={styles.header}>
    <nav className={`${styles.menu} p-4`}>
      <div className={styles.menu_part_left}>
        <NavLink
          to='/'
          className={({ isActive }) =>
            `${styles.link} ${isActive ? styles.link_active : ''}`
          }
        >
          {({ isActive }) => (
            <>
              <BurgerIcon type={isActive ? 'secondary' : 'primary'} />
              <p
                className={`${styles.link_text} text text_type_main-default ml-2 mr-10`}
              >
                Конструктор
              </p>
            </>
          )}
        </NavLink>

        <NavLink
          to='/feed'
          className={({ isActive }) =>
            `${styles.link} ${isActive ? styles.link_active : ''}`
          }
        >
          {({ isActive }) => (
            <>
              <ListIcon type={isActive ? 'secondary' : 'primary'} />
              <p
                className={`${styles.link_text} text text_type_main-default ml-2`}
              >
                Лента заказов
              </p>
            </>
          )}
        </NavLink>
      </div>

      <NavLink
        to='/profile'
        className={({ isActive }) =>
          `${styles.link_position_last} ${isActive ? styles.link_active : styles.link}`
        }
      >
        {({ isActive }) => (
          <>
            <ProfileIcon type={isActive ? 'secondary' : 'primary'} />
            <p
              className={`${styles.link_text} text text_type_main-default ml-2`}
            >
              {userName || 'Личный кабинет'}
            </p>
          </>
        )}
      </NavLink>
    </nav>
  </header>
);
