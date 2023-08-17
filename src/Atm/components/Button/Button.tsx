import { FC } from 'react';
import styles from './Button.module.scss';

export const Button: FC<JSX.IntrinsicElements['button']> = ({
  children,
  ...props
}) => {
  return (
    <button {...props} className={styles.button}>
      {children}
    </button>
  );
};
