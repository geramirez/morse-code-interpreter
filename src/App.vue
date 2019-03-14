<template>
  <div id="app">
    <h1>{{ message$ }}</h1>
    <button><h1>Beep</h1></button>
  </div>
  
</template>

<script>
import { merge } from "rxjs";
import {
  buffer,
  bufferCount,
  debounceTime,
  distinctUntilChanged,
  map,
  filter,
  scan
} from "rxjs/operators";

import {
  eventsToBeeps,
  beepsToChars,
  charsToWords
} from "./morse-code-decoder/decoder";

export default {
  name: "App",
  subscriptions() {
    const closeStream = this.$fromDOMEvent("button", "keyup").pipe(
      debounceTime(1000)
    );

    const infostream = merge(
      this.$fromDOMEvent("button", "keyup"),
      this.$fromDOMEvent("button", "keydown")
    ).pipe(
      distinctUntilChanged((last, current) => last.type === current.type),
      bufferCount(2),
      buffer(closeStream),
      map(eventArray => eventArray[0]),
      map(eventsToBeeps),
      map(beepsToChars),
      scan(charsToWords, ""),
      map(wordData => wordData.word)
    );
    return {
      message$: infostream
    };
  }
};
</script>
<style>
</style>
