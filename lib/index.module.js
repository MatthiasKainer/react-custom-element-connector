import t,{useRef as n,useEffect as e}from"react";const r=t=>t&&("[object Function]"===Object.prototype.toString.call(t)||"function"==typeof t||t instanceof Function);function c(t){return Object.entries(t).filter((t=>"tag"!==t[0]&&!r(t[1]))).reduce(((t,[n,e])=>(t[function(t){return t.toLowerCase()!==t?t.replace(/[A-Z]/g,"-$&").toLowerCase():t}(n)]=e,t)),{})}function o(o){if(!o.tag)return console.error("[CustomElement] Missing tag property"),null;const u=n();return e((()=>{const{current:t}=u;if(!t)return;const n=function(t){return Object.entries(t).filter((t=>"tag"!==t[0]&&r(t[1]))).reduce(((t,[n,e])=>(t[n]=t=>e(t.detail),t)),{})}(o);return Object.entries(n).forEach((([n,e])=>t.addEventListener(n,e))),()=>{Object.entries(n).forEach((([n,e])=>t.removeEventListener(n,e)))}}),[]),t.createElement(o.tag,{ref:u,...c(o)},null)}export{o as CustomElement};
//# sourceMappingURL=index.module.js.map