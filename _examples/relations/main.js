import Intervalonatoinator from "../../intervalonatoinator.js";

const block = Intervalonatoinator({
  dom: {
    enabled: true,
    selectors: {
      children: ".block",
    },
  },
});

const small = Intervalonatoinator({
  intervalTime: 1000,
  dom: {
    enabled: true,
    selectors: {
      children: ".small",
    },
  },
});

small
  .init()
  .play()
  .addButton("play", ".play-btn")
  .addButton("pause", ".pause-btn")
  .addButton("prev", ".prev-btn")
  .addButton("next", ".next-btn");

block.init().setRelationTo(small, "dom");
