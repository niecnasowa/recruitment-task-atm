export interface Notes {
  '5': number;
  '10': number;
  '20': number;
}

export type WithdrawStatus = 'success' | 'failed';

export interface WithdrawResult {
  newBalance: number;
  toWithdrawNotes: Notes;
  availableNotes: Notes;
  status: WithdrawStatus;
  message: string;
}
