import { FC } from 'react';
import styles from './Menu.module.scss';
import { Button } from '../../components';

interface MenuProps {
  balance: number;
  onLogout(): void;
  onWithdraw(): void;
}

export const Menu: FC<MenuProps> = ({ balance, onLogout, onWithdraw }) => {
  return (
    <div className={styles.container}>
      <h1>Your ballance is: £{balance}</h1>

      <div className={styles.butttons}>
        <Button onClick={onLogout}>logout</Button>

        <Button onClick={onWithdraw}>withdraw money</Button>
      </div>
    </div>
  );
};
