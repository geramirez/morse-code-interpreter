const Beeps = Object.freeze({
  LONG: 'long',
  SHORT: 'short',
});

function chunkByTwo(array) {
  const newArray = [];
  while (array.length > 0) {
    newArray.push(array.splice(0, 2));
  }
  return newArray;
}

function eventsToBeeps(events) {
  return chunkByTwo(events).map((eventPair) => {
    const mouseDown = eventPair[0];
    const mouseUp = eventPair[1];
    const beep = { startTime: mouseDown.timeStamp, endTime: mouseUp.timeStamp };

    if ((mouseUp.timeStamp - mouseDown.timeStamp) >= 3) {
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
  return { ...char, ...{ char: 'D' } };
}

function charsToWords(data, item) {
  if (data.word === undefined) {
    return { word: item.char, lastItem: item };
  }
  if ((item.startTime - data.lastItem.endTime) >= 7) {
    return { word: `${data.word} ${item.char}`, lastItem: item };
  }
  return { word: `${data.word}${item.char}`, lastItem: item };
}

module.exports = {
  eventsToBeeps, beepsToChars, charsToWords, Beeps,
};
