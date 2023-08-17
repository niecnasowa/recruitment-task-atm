import { ChangeEvent, FC, useState } from 'react';
import styles from './PinLock.module.scss';
import { Button } from '../../components';

interface PinLockProps {
  onCheckPin(pin: string): Promise<{}>;
}

export const PinLock: FC<PinLockProps> = ({ onCheckPin }) => {
  const [pin, setPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChangePin = (e: ChangeEvent<HTMLInputElement>) => {
    setPin(e.target.value);
  };

  const handleCheckPin = () => {
    setIsLoading(true);

    onCheckPin(pin)
      .then((response) => {
        setError('');
        return response;
      })
      .catch((error) => {
        setError('Your pin is incorrect, try again.');
        return error;
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className={styles.container}>
      {!error && <h1>Insert your PIN</h1>}
      {!!error && <h1 className={styles.error}>{error}</h1>}
      <input
        value={pin}
        onChange={handleChangePin}
        maxLength={4}
        type="password"
        className={styles.pinInput}
      />
      <Button
        onClick={handleCheckPin}
        disabled={isLoading}
      >
        {isLoading ? 'loading....' : 'confirm'}
      </Button>
    </div>
  );
};
