const Beeps = Object.freeze({
  LONG: 'long',
  SHORT: 'short',
});

const NEW_WORD_BREAK = 1000;
const SHORT_THRESHOLD_BREAK = 100;

function chunkByTwo(array) {
  const newArray = [];
  while (array.length > 0) {
    newArray.push(array.splice(0, 2));
  }
  return newArray;
}

function eventsToBeeps(events) {
  return events.map((eventPair) => {
    const keyDown = eventPair[0];
    const keyUp = eventPair[1];
    const beep = { startTime: keyDown.timeStamp, endTime: keyUp.timeStamp };
    if ((keyUp.timeStamp - keyDown.timeStamp) >= SHORT_THRESHOLD_BREAK) {
      return { ...beep, ...{ type: Beeps.LONG } };
    }
    return { ...beep, ...{ type: Beeps.SHORT } };
  });
}

function beepsToChars(codeSequence) {
  const stringSequence = JSON.stringify(codeSequence.map(c => c.type));
  const char = {
    startTime: codeSequence[0].startTime,
    endTime: codeSequence[codeSequence.length - 1].endTime,
  };

  if (stringSequence === JSON.stringify([Beeps.SHORT, Beeps.LONG])) {
    return { ...char, ...{ char: 'A' } };
  }
  if (stringSequence === JSON.stringify([Beeps.LONG, Beeps.SHORT, Beeps.SHORT, Beeps.SHORT])) {
    return { ...char, ...{ char: 'B' } };
  }
  if (stringSequence === JSON.stringify([Beeps.LONG, Beeps.SHORT, Beeps.LONG, Beeps.SHORT])) {
    return { ...char, ...{ char: 'C' } };
  }
  if (stringSequence === JSON.stringify([Beeps.SHORT, Beeps.SHORT, Beeps.SHORT])) {
    return { ...char, ...{ char: 'S' } };
  }
  if (stringSequence === JSON.stringify([Beeps.LONG, Beeps.LONG, Beeps.LONG])) {
    return { ...char, ...{ char: 'O' } };
  }
  return { ...char, ...{ char: 'D' } };
}

function charsToWords(data, item) {
  if (data.word === undefined) {
    return { word: item.char, lastItem: item };
  }
  if ((item.startTime - data.lastItem.endTime) >= NEW_WORD_BREAK) {
    return { word: `${data.word} ${item.char}`, lastItem: item };
  }
  return { word: `${data.word}${item.char}`, lastItem: item };
}

export {
  eventsToBeeps, beepsToChars, charsToWords, Beeps,
};
