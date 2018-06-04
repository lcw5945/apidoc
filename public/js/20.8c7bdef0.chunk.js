webpackJsonp([20],{1451:function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!==typeof t&&"function"!==typeof t?e:t}function o(e,t){if("function"!==typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(t,"__esModule",{value:!0}),n.d(t,"default",function(){return f});var c=n(1),i=n.n(c),u=n(325),s=n(1871),l=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),f=function(e){function t(){return r(this,t),a(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return o(t,e),l(t,[{key:"render",value:function(){return i.a.createElement("div",{id:"jsonBox"},i.a.createElement(u.a,null),i.a.createElement(s.a,null))}}]),t}(i.a.Component)},1871:function(e,t,n){"use strict";function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function a(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!==typeof t&&"function"!==typeof t?e:t}function o(e,t){if("function"!==typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}n.d(t,"a",function(){return p});var c=n(569),i=(n.n(c),n(568)),u=n.n(i),s=n(1),l=n.n(s),f=n(1882),h=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),p=function(e){function t(e){r(this,t);var n=a(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.state={current:"",base64:"",hash:""},n}return o(t,e),h(t,[{key:"changeTitle",value:function(e){var t="";if(!this.state.base64)return void u.a.error("请先输入内容");t="encryption"===e?f.a.toBase64(this.state.base64):f.a.fromBase64(this.state.base64),this.setState({current:e,hash:t})}},{key:"changeTextarea",value:function(e){this.setState({base64:e.target.value})}},{key:"render",value:function(){return l.a.createElement("div",{className:"base64-container clearfix"},l.a.createElement("textarea",{onInput:this.changeTextarea.bind(this)}),l.a.createElement("div",{className:"title"},l.a.createElement("span",{className:"encryption"===this.state.current?"current":"",onClick:this.changeTitle.bind(this,"encryption")},"加密"),l.a.createElement("span",{className:"decrypt"===this.state.current?"current":"",onClick:this.changeTitle.bind(this,"decrypt")},"解密")),l.a.createElement("ul",{className:"content"},l.a.createElement("li",{className:"encryption"===this.state.current?"li-show":"li-hide"},this.state.hash),l.a.createElement("li",{className:"decrypt"===this.state.current?"li-show":"li-hide"},this.state.hash)))}}]),t}(l.a.Component)},1882:function(e,t,n){"use strict";var r="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",a=function(e){for(var t={},n=0,r=e.length;n<r;n++)t[e.charAt(n)]=n;return t}(r),o=String.fromCharCode,c=function(e){if(e.length<2){var t=e.charCodeAt(0);return t<128?e:t<2048?o(192|t>>>6)+o(128|63&t):o(224|t>>>12&15)+o(128|t>>>6&63)+o(128|63&t)}var n=65536+1024*(e.charCodeAt(0)-55296)+(e.charCodeAt(1)-56320);return o(240|n>>>18&7)+o(128|n>>>12&63)+o(128|n>>>6&63)+o(128|63&n)},i=/[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g,u=function(e){return e.replace(i,c)},s=function(e){var t=[0,2,1][e.length%3],n=e.charCodeAt(0)<<16|(e.length>1?e.charCodeAt(1):0)<<8|(e.length>2?e.charCodeAt(2):0);return[r.charAt(n>>>18),r.charAt(n>>>12&63),t>=2?"=":r.charAt(n>>>6&63),t>=1?"=":r.charAt(63&n)].join("")},l=function(e){return e.replace(/[\s\S]{1,3}/g,s)},f=function(e){return l(u(e))},h=function(e,t){return t?f(String(e)).replace(/[+\/]/g,function(e){return"+"==e?"-":"_"}).replace(/=/g,""):f(String(e))},p=function(e){return h(e,!0)},b=new RegExp(["[À-ß][-¿]","[à-ï][-¿]{2}","[ð-÷][-¿]{3}"].join("|"),"g"),d=function(e){switch(e.length){case 4:var t=(7&e.charCodeAt(0))<<18|(63&e.charCodeAt(1))<<12|(63&e.charCodeAt(2))<<6|63&e.charCodeAt(3),n=t-65536;return o(55296+(n>>>10))+o(56320+(1023&n));case 3:return o((15&e.charCodeAt(0))<<12|(63&e.charCodeAt(1))<<6|63&e.charCodeAt(2));default:return o((31&e.charCodeAt(0))<<6|63&e.charCodeAt(1))}},y=function(e){return e.replace(b,d)},g=function(e){var t=e.length,n=t%4,r=(t>0?a[e.charAt(0)]<<18:0)|(t>1?a[e.charAt(1)]<<12:0)|(t>2?a[e.charAt(2)]<<6:0)|(t>3?a[e.charAt(3)]:0),c=[o(r>>>16),o(r>>>8&255),o(255&r)];return c.length-=[0,0,2,1][n],c.join("")},m=function(e){return e.replace(/[\s\S]{1,4}/g,g)},v=function(e){return y(m(e))},A=function(e){return v(String(e).replace(/[-_]/g,function(e){return"-"==e?"+":"/"}).replace(/[^A-Za-z0-9\+\/]/g,""))},C={atob:m,btoa:l,fromBase64:A,toBase64:h,utob:u,encode:h,encodeURI:p,btou:y,decode:A};t.a=C}});
//# sourceMappingURL=20.8c7bdef0.chunk.js.map