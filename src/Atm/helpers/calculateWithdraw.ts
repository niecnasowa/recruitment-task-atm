// A little bit about my approach, how I pick algorithm etc
// I started with looking for more information about algo I need to use, I've found these 2 articles
// https://hackernoon.com/the-atm-problem-why-the-greedy-algorithm-isnt-an-optimal-solution
// https://hackernoon.com/solving-the-atm-problem-with-dynamic-programming
// So I have decided that dynamic programming looks like better solution, because for ATM
// the reliability is more important than speed
// So after that I have asked chatGpt to create proper algorithm for me
// (because I am not that good at it, and also want to focus on actual front-end part of this task)
// Later I also adjusted it a little bit to fit more into mine needs
import { Notes, WithdrawResult } from '../types';

export const calculateWithdraw = (
  amount: number,
  availableNotes: Notes,
  balance: number
): WithdrawResult => {
  const maxOverdraft = 100;
  const noteValues = [5, 10, 20];
  const noteCount = noteValues.length;

  // If user wants to get more than is allowed (balance + overdraft limit), can stop here
  if (amount > balance + maxOverdraft) {
    return {
      newBalance: balance,
      toWithdrawNotes: { '5': 0, '10': 0, '20': 0 },
      availableNotes: availableNotes,
      message: `Sorry, maximum overdraft limit of £${maxOverdraft} exceeded.`,
      status: 'failed',
    };
  }

  const dp = new Array(amount + 1).fill(null).map(() => ({
    value: Number.MAX_SAFE_INTEGER,
    notes: { '5': 0, '10': 0, '20': 0 },
  }));
  dp[0].value = 0;

  for (let i = 1; i <= amount; i++) {
    for (let j = 0; j < noteCount; j++) {
      if (noteValues[j] <= i) {
        const prevNotes = dp[i - noteValues[j]].notes;
        const prevValue = dp[i - noteValues[j]].value;

        const newNotes = { ...prevNotes };
        newNotes[noteValues[j].toString() as keyof Notes]++;

        const values = Object.values(newNotes);
        const max = Math.max(...values);
        const min = Math.min(...values);
        const newValue = max - min + prevValue;

        if (
          newValue < dp[i].value &&
          newNotes[noteValues[j].toString() as keyof Notes] <=
            availableNotes[noteValues[j].toString() as keyof Notes]
        ) {
          dp[i].value = newValue;
          dp[i].notes = newNotes;
        }
      }
    }
  }

  let remainingAmount = amount;
  let newBalance = balance;

  let toWithdrawNotes: Notes = { '5': 0, '10': 0, '20': 0 };
  let newAvailableNotes = { ...availableNotes };

  const finalNotes = dp[amount].notes;

  for (const [note, count] of Object.entries(finalNotes)) {
    const noteName = note as keyof Notes;
    const providedNotes = Math.min(count, newAvailableNotes[noteName]);

    toWithdrawNotes[noteName] += providedNotes;
    newAvailableNotes[noteName] -= providedNotes;
    remainingAmount -= providedNotes * parseInt(note);
  }

  newBalance -= amount;

  let message = '';
  let status: 'success' | 'failed' = 'success';

  if (remainingAmount === 0) {
    if (newBalance < 0 && newBalance >= -maxOverdraft) {
      message = `Overdraft! Your balance is now £${newBalance}.`;
    } else if (newBalance < -maxOverdraft) {
      return {
        newBalance: balance,
        toWithdrawNotes: { '5': 0, '10': 0, '20': 0 },
        availableNotes: availableNotes,
        message: `Sorry, maximum overdraft limit of £${maxOverdraft} exceeded.`,
        status: 'failed',
      };
    } else {
      message = `Successfully withdrew £${amount}.`;
    }
  } else {
    return {
      newBalance: balance,
      toWithdrawNotes: { '5': 0, '10': 0, '20': 0 },
      availableNotes: availableNotes,
      status: 'failed',
      message:
        'Sorry, unable to dispense the required amount with available notes.',
    };
  }

  return {
    newBalance,
    toWithdrawNotes,
    availableNotes: newAvailableNotes,
    status,
    message,
  };
};
