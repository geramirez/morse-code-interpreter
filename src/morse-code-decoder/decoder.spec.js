import {
  eventsToBeeps, beepsToChars, charsToWords, Beeps,
} from './decoder';

describe('eventsToBeeps', () => {
  test('converts close events to short beeps', () => {
    const events = [[
      { timeStamp: 0, type: 'mousedown' },
      { timeStamp: 50, type: 'mouseup' },
    ]];
    const expectedBeep = [{ type: Beeps.SHORT, startTime: 0, endTime: 50 }];
    const actualBeep = eventsToBeeps(events);
    expect(actualBeep).toEqual(expectedBeep);
  });

  test('converts less close events to long beeps', () => {
    const events = [[
      { timeStamp: 0, type: 'mousedown' },
      { timeStamp: 400, type: 'mouseup' },
    ]];
    const expectedBeep = [{ type: Beeps.LONG, startTime: 0, endTime: 400 }];
    const actualBeep = eventsToBeeps(events);
    expect(actualBeep).toEqual(expectedBeep);
  });

  test('converts more than 2 events to beeps', () => {
    const events = [
      [{ timeStamp: 0, type: 'mousedown' },
      { timeStamp: 100, type: 'mouseup' }],
      [{ timeStamp: 100, type: 'mousedown' },
      { timeStamp: 400, type: 'mouseup' }],
    ];
    const expectedBeep = [
      { type: Beeps.LONG, startTime: 0, endTime: 100 },
      { type: Beeps.LONG, startTime: 100, endTime: 400 },
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
      { char: 'A', startTime: 0, endTime: 100 },
      { char: 'B', startTime: 101, endTime: 200 },
      { char: 'C', startTime: 2001, endTime: 2100 },
      { char: 'D', startTime: 2101, endTime: 2200 },
    ];
    const actualData = testCases.reduce(charsToWords, {});
    expect(actualData.word).toEqual('AB CD');
  });
});
