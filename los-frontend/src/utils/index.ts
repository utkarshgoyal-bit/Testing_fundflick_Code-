const setLocalStorage = (key: string, value: string) => {
  localStorage.setItem(key, value);
};
const getLocalStorage = (key: string) => {
  const value = localStorage.getItem(key) || "{}";
  if (value) {
    return JSON.parse(value || "{}");
  }
  return {};
};
const removeLocalStorage = (key: string) => {
  localStorage.removeItem(key);
};
const userAgent = navigator?.userAgent;
// const userAgentData = navigator?.userAgentData.platform || { indexOf: () => -1 };
const isMobile = /Mobi|Android/i.test(userAgent);
const isDesktop = !isMobile;
const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !("MSStream" in window);
const isAndroid = /Android/.test(userAgent);
const isWindows = /Windows/.test(userAgent);
const isMacOS = /Macintosh|MacIntel/.test(userAgent);
const isLinux = /Linux/.test(userAgent);
const isWebView = /wv/.test(userAgent);
const isSafari = /^((?!chrome|android).)*safari/i.test(userAgent);
const isChrome = /Chrome/.test(userAgent) && !isSafari;
const isFirefox = /Firefox/.test(userAgent);
const isEdge = /Edg/.test(userAgent);
const isOpera = /OPR/.test(userAgent);
const isBrave = /Brave/.test(userAgent);
const isIE = /MSIE|Trident/.test(userAgent);
const isElectron = /Electron/.test(userAgent);
const isPWA = window.matchMedia("(display-mode: standalone)").matches;
function getOS() {
  let os = "Unknown OS";
  if (userAgent.indexOf("Windows") !== -1) {
    os = "Windows";
  } else if (
    userAgent.indexOf("Mac OS") !== -1 ||
    userAgent.indexOf("macOS") !== -1
  ) {
    os = "macOS";
  } else if (userAgent.indexOf("Linux") !== -1) {
    os = "Linux";
  } else if (userAgent.indexOf("Android") !== -1) {
    os = "Android";
  } else if (userAgent.indexOf("iOS") !== -1) {
    os = "iOS";
  }

  return os;
}
const currentOS = getOS();

export {
  setLocalStorage,
  getLocalStorage,
  removeLocalStorage,
  currentOS,
  userAgent,
  isDesktop,
  isIOS,
  isAndroid,
  isWindows,
  isMacOS,
  isLinux,
  isWebView,
  isSafari,
  isChrome,
  isFirefox,
  isEdge,
  isOpera,
  isBrave,
  isIE,
  isElectron,
  isPWA,
};
