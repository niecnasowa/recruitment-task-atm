import { FC } from 'react';
import { Atm } from './Atm';
import styles from './App.module.scss';

export const App: FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.atmWrapper}>
        <img
          src="/atm-background.png"
          width={900}
          height={1000}
          alt="ATM background"
        />
        <div className={styles.atmContent}>
          <Atm />
        </div>
      </div>
    </div>
  );
};

export default App;
