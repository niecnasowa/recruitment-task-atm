import { calculateWithdraw } from './calculateWithdraw';

describe('calculateWithdraw', () => {
  describe('withdraw notes', () => {
    it(`should return status 'success'`, () => {
      expect(
        calculateWithdraw(100, { '5': 10, '10': 10, '20': 10 }, 200)
      ).toEqual(expect.objectContaining({ status: 'success' }));
    });

    it(`should return message`, () => {
      expect(
        calculateWithdraw(100, { '5': 10, '10': 10, '20': 10 }, 200)
      ).toEqual(
        expect.objectContaining({ message: 'Successfully withdrew £100.' })
      );
    });

    it(`withdraw mixed notes when possible`, () => {
      expect(
        calculateWithdraw(100, { '5': 4, '10': 15, '20': 7 }, 200)
      ).toEqual(
        expect.objectContaining({
          toWithdrawNotes: { '20': 3, '10': 3, '5': 2 },
        })
      );
    });

    it(`withdraw single notes when needed`, () => {
      // Withdraw 100, when ATM has only 20 notes
      expect(calculateWithdraw(100, { '5': 1, '10': 1, '20': 7 }, 200)).toEqual(
        expect.objectContaining({
          toWithdrawNotes: { '20': 5, '10': 0, '5': 0 },
        })
      );

      // Withdraw 5, when ATM has only 5 note
      expect(calculateWithdraw(5, { '5': 1, '10': 0, '20': 0 }, 200)).toEqual(
        expect.objectContaining({
          toWithdrawNotes: { '20': 0, '10': 0, '5': 1 },
        })
      );
    });

    const mockData = [
      {
        amount: 100,
        availableNotes: { '5': 10, '10': 10, '20': 10 },
        balance: 200,
      },
      {
        amount: 200,
        availableNotes: { '5': 0, '10': 10, '20': 5 },
        balance: 200,
      },
      {
        amount: 5,
        availableNotes: { '5': 1, '10': 0, '20': 0 },
        balance: 200,
      },
      {
        amount: 10,
        availableNotes: { '5': 0, '10': 1, '20': 0 },
        balance: 200,
      },
    ];

    mockData.forEach(({ amount, availableNotes, balance }) => {
      it(`should calculate correct values`, () => {
        const result = calculateWithdraw(amount, availableNotes, balance);

        // Message
        expect(result.message).toBe(`Successfully withdrew £${amount}.`);
        // Status
        expect(result.status).toBe('success');
        // New balance
        expect(result.newBalance).toBe(balance - amount);
        // Notes to withdraw
        expect(
          Object.entries(result.toWithdrawNotes).reduce(
            (acc, [noteValue, noteAmount]) =>
              acc + parseInt(noteValue, 10) * noteAmount,
            0
          )
        ).toBe(amount);
        // Notes amount
        Object.keys(availableNotes).forEach((nV) => {
          const noteValue = nV as '5' | '10' | '20';
          expect(availableNotes[noteValue]).toBe(
            result.availableNotes[noteValue] + result.toWithdrawNotes[noteValue]
          );
        });
      });
    });

    describe('overdraft less than 100', () => {
      it(`should return status, message, and correct values`, () => {
        expect(
          calculateWithdraw(290, { '5': 10, '10': 10, '20': 10 }, 200)
        ).toEqual(
          expect.objectContaining({
            availableNotes: {
              '10': 1,
              '20': 2,
              '5': 2,
            },
            message: 'Overdraft! Your balance is now £-90.',
            newBalance: -90,
            status: 'success',
            toWithdrawNotes: {
              '10': 9,
              '20': 8,
              '5': 8,
            },
          })
        );
      });
    });

    describe('overdraft more than 100', () => {
      it(`should return status (failed), message, and the same values`, () => {
        const amount = 310;
        const availableNotes = { '5': 10, '10': 10, '20': 10 };
        const balance = 200;

        const result = calculateWithdraw(amount, availableNotes, balance);

        expect(result).toEqual(
          expect.objectContaining({
            message: 'Sorry, maximum overdraft limit of £100 exceeded.',
            status: 'failed',
            newBalance: balance,
            availableNotes,
          })
        );
      });
    });

    describe('user wants withdraw less than smallest note (5)', () => {
      it(`should return status (failed), message, and the same values`, () => {
        const amount = 4;
        const availableNotes = { '5': 10, '10': 10, '20': 10 };
        const balance = 200;

        const result = calculateWithdraw(amount, availableNotes, balance);

        expect(result).toEqual(
          expect.objectContaining({
            message:
              'Sorry, unable to dispense the required amount with available notes.',
            status: 'failed',
            newBalance: balance,
            availableNotes,
          })
        );
      });
    });

    describe('user wants withdraw more money than atm has', () => {
      it(`should return status (failed), message, and the same values`, () => {
        const amount = 40;
        const availableNotes = { '5': 1, '10': 1, '20': 1 };
        const balance = 200;

        const result = calculateWithdraw(amount, availableNotes, balance);

        expect(result).toEqual(
          expect.objectContaining({
            message:
              'Sorry, unable to dispense the required amount with available notes.',
            status: 'failed',
            newBalance: balance,
            availableNotes,
          })
        );
      });
    });
  });
});
