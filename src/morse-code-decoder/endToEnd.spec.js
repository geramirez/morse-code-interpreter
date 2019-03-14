import { TestScheduler } from 'rxjs/testing';
import { map, scan, takeLast } from 'rxjs/operators';
import { eventsToBeeps, beepsToChars, charsToWords } from './decoder';

const scheduler = new TestScheduler((actual, expected) => {
  expect(actual).toEqual(expected);
});

describe('Morse Code Pipeline', () => {
  it('works', () => {
    scheduler.run((helpers) => {
      const { cold, expectObservable } = helpers;
      const events = {
        a: [
          [{ timeStamp: 0, type: 'mouseup' },
          { timeStamp: 1, type: 'mousedown' }],
          [{ timeStamp: 2, type: 'mouseup' },
          { timeStamp: 5, type: 'mousedown' }],
        ],
        b: [
          [{ timeStamp: 6, type: 'mouseup' },
          { timeStamp: 7, type: 'mousedown' }],
          [{ timeStamp: 8, type: 'mouseup' },
          { timeStamp: 11, type: 'mousedown' }],
        ],
        c: [
          [{ timeStamp: 18, type: 'mouseup' },
          { timeStamp: 19, type: 'mousedown' }],
          [{ timeStamp: 20, type: 'mouseup' },
          { timeStamp: 23, type: 'mousedown' }],
        ],
      };

      const eventStream = cold('abc|', events);

      expectObservable(eventStream.pipe(
        map(eventsToBeeps),
        map(beepsToChars),
        scan(charsToWords, ''),
        map(element => element.word),
      )).toBe('abc|', {a: 'A', b: 'AA', c: 'AA A'});
    });
  });
});
