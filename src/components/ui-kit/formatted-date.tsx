import { FC } from 'react';

type FormattedDateProps = {
  date: Date;
  className?: string;
};

const getDiffDays = (date: Date) =>
  Math.floor((new Date().getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

const getFormattedTime = (date: Date) =>
  `${String(date.getHours()).padStart(2, '0')}:${String(
    date.getMinutes()
  ).padStart(2, '0')}`;

const pluralizeDays = (days: number) => {
  const mod10 = days % 10;
  const mod100 = days % 100;

  if (mod10 === 1 && mod100 !== 11) {
    return `${days} день`;
  }

  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    return `${days} дня`;
  }

  return `${days} дней`;
};

const getFormattedDate = (date: Date) =>
  `${pluralizeDays(getDiffDays(date))} назад, ${getFormattedTime(date)}`;

const isToday = (date: Date) => getDiffDays(date) === 0;

const isYesterday = (date: Date) => getDiffDays(date) === 1;

export const FormattedDate: FC<FormattedDateProps> = ({ date, className }) => {
  const diffDays = getDiffDays(date);

  if (diffDays < 0) {
    return <span className={className}>Сегодня, {getFormattedTime(date)}</span>;
  }

  if (isToday(date)) {
    return <span className={className}>Сегодня, {getFormattedTime(date)}</span>;
  }

  if (isYesterday(date)) {
    return <span className={className}>Вчера, {getFormattedTime(date)}</span>;
  }

  return <span className={className}>{getFormattedDate(date)}</span>;
};
