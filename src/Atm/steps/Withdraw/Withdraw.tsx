import { ChangeEvent, FC, useState } from 'react';
import styles from './Withdraw.module.scss';
import { Button } from '../../components';
import { Notes, WithdrawResult, WithdrawStatus } from '../../types';

const EMPTY_NOTES = {
  '5': 0,
  '10': 0,
  '20': 0,
};

interface WithdrawProps {
  onWithdraw(amount: number): WithdrawResult;
  onGoToMenu(): void;
}

export const Withdraw: FC<WithdrawProps> = ({ onWithdraw, onGoToMenu }) => {
  const [amount, setAmount] = useState<string>('');
  const [withdrawMessage, setWithdrawMessage] = useState<string>('');
  const [withdrawStatus, setWithdrawStatus] = useState<WithdrawStatus | ''>('');
  const [toWithdrawNotes, setToWithdrawNotes] = useState<Notes>(EMPTY_NOTES);

  const handleChangeAmount = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    // Simplified validation
    // Change value only if character is allowed (number)
    if (/^\d+$/.test(value) || value === '') {
      setAmount(value);
    }
  };

  const handleWithdraw = () => {
    const withdrawResult = onWithdraw(parseInt(amount, 10));
    setWithdrawMessage(withdrawResult.message);
    setWithdrawStatus(withdrawResult.status);
    setToWithdrawNotes(withdrawResult.toWithdrawNotes);
  };

  const handleBackToMenu = () => {
    onGoToMenu();
  };

  return (
    <div className={styles.container}>
      {!withdrawMessage && <h1>Insert amount to withdraw (£)</h1>}
      {!!withdrawMessage && <h1>{withdrawMessage}</h1>}
      {!withdrawStatus && (
        <>
          <input
            value={amount}
            onChange={handleChangeAmount}
            type="string"
            className={styles.pinInput}
          />
          <Button onClick={handleWithdraw}>confirm</Button>
        </>
      )}
      {withdrawStatus === 'success' && (
        <>
          <div>
            You've got bills:
            {Object.entries(toWithdrawNotes).map(([noteValue, noteAmount]) => (
              <div key={noteValue}>
                {noteAmount} x £{noteValue}
              </div>
            ))}
          </div>
        </>
      )}
      {!!withdrawStatus && <Button onClick={handleBackToMenu}>ok</Button>}
    </div>
  );
};
