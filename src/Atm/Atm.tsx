import axios from 'axios';
import { FC, useState } from 'react';
import { AtmState } from './components';
import { calculateWithdraw } from './helpers';
import { Menu, PinLock, Withdraw } from './steps';
import { Notes } from './types';
import styles from './Atm.module.scss';

const PIN_API = process.env.REACT_APP_PIN_API || '';

type Steps = 'pinLock' | 'menu' | 'withdraw';

export const Atm: FC = () => {
  const [balance, setBalance] = useState<number>(0);
  const [step, setStep] = useState<Steps>('pinLock');
  const [availableNotes, setAvailableNotes] = useState<Notes>({
    '5': 4,
    '10': 15,
    '20': 7,
  });

  const handleCheckPin = (pin: string) =>
    axios
      .post(PIN_API, {
        pin,
      })
      .then((response) => {
        const { currentBalance } = response.data;
        setBalance(parseInt(currentBalance, 10));
        setStep('menu');
        return response;
      });

  const handleLogout = () => {
    setBalance(0);
    setStep('pinLock');
  };

  const handleWithdraw = (amount: number) => {
    const withdrawResult = calculateWithdraw(amount, availableNotes, balance);

    if (withdrawResult.status === 'success') {
      setBalance(withdrawResult.newBalance);
      setAvailableNotes(withdrawResult.availableNotes);
    }

    return withdrawResult;
  };

  return (
    <div className={styles.container}>
      {step === 'pinLock' && <PinLock onCheckPin={handleCheckPin} />}
      {step === 'menu' && (
        <Menu
          balance={balance}
          onLogout={handleLogout}
          onWithdraw={() => setStep('withdraw')}
        />
      )}
      {step === 'withdraw' && (
        <Withdraw
          onWithdraw={handleWithdraw}
          onGoToMenu={() => setStep('menu')}
        />
      )}
      <AtmState availableNotes={availableNotes} />
    </div>
  );
};
