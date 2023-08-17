import { FC } from 'react';
import { Notes } from '../../types';
import styles from './AtmState.module.scss';

interface AtmStateProps {
  availableNotes: Notes;
}

export const AtmState: FC<AtmStateProps> = ({ availableNotes }) => {
  return (
    <div className={styles.container}>
      Available notes in ATM:
      {Object.entries(availableNotes).map(([noteValue, noteAmount]) => (
        <div key={noteValue}>
          {noteAmount} x £{noteValue}
        </div>
      ))}
    </div>
  );
};
