import Intervalonatoinator from "../intervalonatoinator.js";

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
  // .play()
  .createIndexNav(".block-index-nav")
  // .indexNavOnHover()
  // .activateOnItemClick()
  // .activateOnItemHover()
  .addButton("play", ".play-btn")
  .addButton("pause", ".pause-btn")
  .addButton("prev", ".prev-btn")
  .addButton("next", ".next-btn");

block.init().setRelationTo(small, "dom");

small.addHook("onIndexChange", () => {
  // console.log(small.context.currIndex);
});

// instance
//   .addHook("onPlay", () => console.log("Playing"))
//   .addHook("onPause", () => console.log("Paused"))
//   .addButton("play", ".play-btn")
//   .addButton("pause", ".pause-btn")
//   .addButton("prev", ".prev-btn")
//   .addButton("next", ".next-btn")
//   .init()
//   .play()
//   .wait(2000)
//   .pause()
//   .next();
// .play();

// console.log(instance);
// instance.play().pause();
