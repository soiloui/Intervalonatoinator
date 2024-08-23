export function onStackComplete(fn) {
  setTimeout(() => {
    fn();
  }, 0);
}

export function deepMerge(target, source) {
  // Iterate over all keys in the source object
  for (const key in source) {
    // Check if the value is an object, and if the target has the same key
    if (source[key] instanceof Object && key in target) {
      // Recursively merge objects
      Object.assign(source[key], deepMerge(target[key], source[key]));
    }
  }

  // Merge target and source objects
  return Object.assign(target || {}, source);
}

export function randomID() {
  return String(Date.now().toString(32) + Math.random().toString(16)).replace(/\./g, "");
}

export function Observer(selector) {
  const observers = {};
  const events = ["click", "hover"];
  const nodes = document.querySelectorAll(selector) || [];

  function _bindDefault() {
    nodes.forEach((node, i) => {
      for (const event of events) {
        if (event === "hover") {
          if (isMobile().any) {
            // Mobile
            node.addEventListener("touchstart", (e) => {
              emit("hover", {
                hover: true,
                node: node,
                index: i,
              });
            });
            node.addEventListener("touchend", (e) => {
              emit("hover", {
                hover: false,
                node: node,
                index: i,
              });
            });
          } else {
            node.addEventListener("mouseenter", (e) => {
              emit("hover", {
                hover: true,
                node: node,
                index: i,
              });
            });
            node.addEventListener("mouseleave", (e) => {
              emit("hover", {
                hover: false,
                node: node,
                index: i,
              });
            });
          }
        } else {
          node.addEventListener(event, (e) => {
            emit(event, {
              event: e,
              node: node,
              index: i,
            });
          });
        }
      }
    });
  }

  function subscribe(type, observer) {
    if (!observers[type]) observers[type] = [];
    observers[type].push(observer);
  }

  function unsubscribe(type, observer) {
    const index = observers[type] ? observers[type].indexOf(observer) : -1;
    if (index > -1) observers[type].splice(index, 1);
  }

  function emit(type, data) {
    if (observers[type]) {
      observers[type].forEach((fn) => {
        fn(data || null);
      });
    }
  }

  // Initialize by binding default events
  _bindDefault();

  // Expose public methods
  return {
    subscribe,
    unsubscribe,
    emit,
  };
}

export function isMobile(param) {
  const appleIphone = /iPhone/i;
  const appleIpod = /iPod/i;
  const appleTablet = /iPad/i;
  const appleUniversal = /\biOS-universal(?:.+)Mac\b/i;
  const androidPhone = /\bAndroid(?:.+)Mobile\b/i; // Match 'Android' AND 'Mobile'
  const androidTablet = /Android/i;
  const amazonPhone = /(?:SD4930UR|\bSilk(?:.+)Mobile\b)/i; // Match 'Silk' AND 'Mobile'
  const amazonTablet = /Silk/i;
  const windowsPhone = /Windows Phone/i;
  const windowsTablet = /\bWindows(?:.+)ARM\b/i; // Match 'Windows' AND 'ARM'
  const otherBlackBerry = /BlackBerry/i;
  const otherBlackBerry10 = /BB10/i;
  const otherOpera = /Opera Mini/i;
  const otherChrome = /\b(CriOS|Chrome)(?:.+)Mobile/i;
  const otherFirefox = /Mobile(?:.+)Firefox\b/i; // Match 'Mobile' AND 'Firefox'

  function isAppleTabletOnIos13(navigator) {
    return (
      typeof navigator !== "undefined" &&
      navigator.platform === "MacIntel" &&
      typeof navigator.maxTouchPoints === "number" &&
      navigator.maxTouchPoints > 1 &&
      typeof MSStream === "undefined"
    );
  }

  function createMatch(userAgent) {
    return function (regex) {
      return regex.test(userAgent);
    };
  }

  let nav = {
    userAgent: "",
    platform: "",
    maxTouchPoints: 0,
  };

  if (!param && typeof navigator !== "undefined") {
    nav = {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      maxTouchPoints: navigator.maxTouchPoints || 0,
    };
  } else if (typeof param === "string") {
    nav.userAgent = param;
  } else if (param && param.userAgent) {
    nav = {
      userAgent: param.userAgent,
      platform: param.platform,
      maxTouchPoints: param.maxTouchPoints || 0,
    };
  }

  let userAgent = nav.userAgent;

  // Facebook mobile app's integrated browser adds a bunch of strings that
  // match everything. Strip it out if it exists.
  let tmp = userAgent.split("[FBAN");
  if (typeof tmp[1] !== "undefined") {
    userAgent = tmp[0];
  }

  // Twitter mobile app's integrated browser on iPad adds a "Twitter for
  // iPhone" string. Same probably happens on other tablet platforms.
  // This will confuse detection so strip it out if it exists.
  tmp = userAgent.split("Twitter");
  if (typeof tmp[1] !== "undefined") {
    userAgent = tmp[0];
  }

  const match = createMatch(userAgent);

  const result = {
    apple: {
      phone: match(appleIphone) && !match(windowsPhone),
      ipod: match(appleIpod),
      tablet:
        !match(appleIphone) &&
        (match(appleTablet) || isAppleTabletOnIos13(nav)) &&
        !match(windowsPhone),
      universal: match(appleUniversal),
      device:
        (match(appleIphone) ||
          match(appleIpod) ||
          match(appleTablet) ||
          match(appleUniversal) ||
          isAppleTabletOnIos13(nav)) &&
        !match(windowsPhone),
    },
    amazon: {
      phone: match(amazonPhone),
      tablet: !match(amazonPhone) && match(amazonTablet),
      device: match(amazonPhone) || match(amazonTablet),
    },
    android: {
      phone:
        (!match(windowsPhone) && match(amazonPhone)) ||
        (!match(windowsPhone) && match(androidPhone)),
      tablet:
        !match(windowsPhone) &&
        !match(amazonPhone) &&
        !match(androidPhone) &&
        (match(amazonTablet) || match(androidTablet)),
      device:
        (!match(windowsPhone) &&
          (match(amazonPhone) ||
            match(amazonTablet) ||
            match(androidPhone) ||
            match(androidTablet))) ||
        match(/\bokhttp\b/i),
    },
    windows: {
      phone: match(windowsPhone),
      tablet: match(windowsTablet),
      device: match(windowsPhone) || match(windowsTablet),
    },
    other: {
      blackberry: match(otherBlackBerry),
      blackberry10: match(otherBlackBerry10),
      opera: match(otherOpera),
      firefox: match(otherFirefox),
      chrome: match(otherChrome),
      device:
        match(otherBlackBerry) ||
        match(otherBlackBerry10) ||
        match(otherOpera) ||
        match(otherFirefox) ||
        match(otherChrome),
    },
    any: false,
    phone: false,
    tablet: false,
  };

  result.any =
    result.apple.device ||
    result.android.device ||
    result.windows.device ||
    result.other.device;
  // excludes 'other' devices and ipods, targeting touchscreen phones
  result.phone = result.apple.phone || result.android.phone || result.windows.phone;
  result.tablet = result.apple.tablet || result.android.tablet || result.windows.tablet;

  return result;
}
