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
          { timeStamp: 99, type: 'mousedown' }],
          [{ timeStamp: 101, type: 'mouseup' },
          { timeStamp: 400, type: 'mousedown' }],
        ],
        b: [
          [{ timeStamp: 600, type: 'mouseup' },
          { timeStamp: 699, type: 'mousedown' }],
          [{ timeStamp: 700, type: 'mouseup' },
          { timeStamp: 1000, type: 'mousedown' }],
        ],
        c: [
          [{ timeStamp: 2800, type: 'mouseup' },
          { timeStamp: 2899, type: 'mousedown' }],
          [{ timeStamp: 3000, type: 'mouseup' },
          { timeStamp: 4300, type: 'mousedown' }],
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
