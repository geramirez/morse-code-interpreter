import {
  eventsToBeeps, beepsToChars, charsToWords, Beeps,
} from './decoder';

describe('eventsToBeeps', () => {
  test('converts close events to short beeps', () => {
    const events = [[
      { timeStamp: 0, type: 'mousedown' },
      { timeStamp: 1, type: 'mouseup' },
    ]];
    const expectedBeep = [{ type: Beeps.SHORT, startTime: 0, endTime: 1 }];
    const actualBeep = eventsToBeeps(events);
    expect(actualBeep).toEqual(expectedBeep);
  });

  test('converts less close events to long beeps', () => {
    const events = [[
      { timeStamp: 0, type: 'mousedown' },
      { timeStamp: 3, type: 'mouseup' },
    ]];
    const expectedBeep = [{ type: Beeps.LONG, startTime: 0, endTime: 3 }];
    const actualBeep = eventsToBeeps(events);
    expect(actualBeep).toEqual(expectedBeep);
  });

  test('converts more than 2 events to beeps', () => {
    const events = [
      [{ timeStamp: 0, type: 'mousedown' },
      { timeStamp: 3, type: 'mouseup' }],
      [{ timeStamp: 4, type: 'mousedown' },
      { timeStamp: 7, type: 'mouseup' }],
    ];
    const expectedBeep = [
      { type: Beeps.LONG, startTime: 0, endTime: 3 },
      { type: Beeps.LONG, startTime: 4, endTime: 7 },
    ];
    const actualBeep = eventsToBeeps(events);
    expect(actualBeep).toEqual(expectedBeep);
  });
});

describe('beepsToChars', () => {
  test('decodes codes into UTF-8 char', () => {
    const testCases = [
      {
        expectedLetter: 'A',
        codeSequence: [
          { type: Beeps.SHORT, startTime: 0 }, { type: Beeps.LONG, endTime: 1 }],
      },
      {
        expectedLetter: 'B',
        codeSequence: [
          { type: Beeps.LONG, startTime: 0 },
          { type: Beeps.SHORT },
          { type: Beeps.SHORT },
          { type: Beeps.SHORT, endTime: 1 },
        ],
      },
      {
        expectedLetter: 'C',
        codeSequence: [
          { type: Beeps.LONG, startTime: 0 },
          { type: Beeps.SHORT },
          { type: Beeps.LONG },
          { type: Beeps.SHORT, endTime: 1 },
        ],
      },
      {
        expectedLetter: 'O',
        codeSequence: [
          { type: Beeps.LONG, startTime: 0 },
          { type: Beeps.LONG },
          { type: Beeps.LONG, endTime: 1 },
        ],
      },
      {
        expectedLetter: 'S',
        codeSequence: [
          { type: Beeps.SHORT, startTime: 0 },
          { type: Beeps.SHORT },
          { type: Beeps.SHORT, endTime: 1 },
        ],
      },
    ];
    testCases.forEach((testCase) => {
      const actualLetter = beepsToChars(testCase.codeSequence);
      expect(actualLetter.char).toEqual(testCase.expectedLetter);
      expect(actualLetter.startTime).toEqual(0);
      expect(actualLetter.endTime).toEqual(1);
    });
  });
});

describe('charsToWords', () => {
  test('decodes codes into UTF-8 char', () => {
    const testCases = [
      { char: 'A', startTime: 0, endTime: 1 },
      { char: 'B', startTime: 4, endTime: 5 },
      { char: 'C', startTime: 12, endTime: 13 },
      { char: 'D', startTime: 14, endTime: 15 },
    ];
    const actualData = testCases.reduce(charsToWords, {});
    expect(actualData.word).toEqual('AB CD');
  });
});
