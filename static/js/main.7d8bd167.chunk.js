(this["webpackJsonpapp-console-example"]=this["webpackJsonpapp-console-example"]||[]).push([[0],[,,,function(e,n,t){e.exports=t(12)},,,,,function(e,n,t){},function(e,n,t){},function(e){e.exports=JSON.parse('{"name":"app-console","version":"1.0.0","repository":"http://github.com/ijmacd/app-console.git","author":"Iain MacDonald <IJMacD@gmail.com>","main":"dist/index.js","module":"dist/index.modern.js","source":"src/index.js","bin":"src/cli.js","engines":{"node":">=10"},"scripts":{"build":"microbundle-crl --no-compress --format modern,cjs","start":"microbundle-crl watch --no-compress --format modern,cjs","prepare":"run-s build","test":"run-s test:unit test:lint test:build","test:build":"run-s build","test:lint":"eslint .","test:unit":"cross-env CI=1 react-scripts test --env=jsdom","test:watch":"react-scripts test --env=jsdom","predeploy":"cd example && yarn install && yarn run build","deploy":"gh-pages -d example/build"},"peerDependencies":{"react":"^16.0.0"},"devDependencies":{"microbundle-crl":"^0.13.10","babel-eslint":"^10.0.3","cross-env":"^7.0.2","eslint":"^6.8.0","eslint-config-prettier":"^6.7.0","eslint-config-standard":"^14.1.0","eslint-config-standard-react":"^9.2.0","eslint-plugin-import":"^2.18.2","eslint-plugin-node":"^11.0.0","eslint-plugin-prettier":"^3.1.1","eslint-plugin-promise":"^4.2.1","eslint-plugin-react":"^7.17.0","eslint-plugin-standard":"^4.0.1","gh-pages":"^2.2.0","npm-run-all":"^4.1.5","prettier":"^2.0.4","react":"^16.13.1","react-dom":"^16.13.1","react-scripts":"^3.4.1"},"files":["dist"]}')},function(e,n,t){},function(e,n,t){"use strict";t.r(n);var r=t(0),o=t.n(r),i=t(2),a=t.n(i);t(8),t(9);function u(){return(u=Object.assign||function(e){for(var n=1;n<arguments.length;n++){var t=arguments[n];for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r])}return e}).apply(this,arguments)}function c(e,n){(null==n||n>e.length)&&(n=e.length);for(var t=0,r=new Array(n);t<n;t++)r[t]=e[t];return r}function l(e,n){var t;if("undefined"===typeof Symbol||null==e[Symbol.iterator]){if(Array.isArray(e)||(t=function(e,n){if(e){if("string"===typeof e)return c(e,n);var t=Object.prototype.toString.call(e).slice(8,-1);return"Object"===t&&e.constructor&&(t=e.constructor.name),"Map"===t||"Set"===t?Array.from(e):"Arguments"===t||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t)?c(e,n):void 0}}(e))||n&&e&&"number"===typeof e.length){t&&(e=t);var r=0;return function(){return r>=e.length?{done:!0}:{done:!1,value:e[r++]}}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}return(t=e[Symbol.iterator]()).next.bind(t)}var s=function(){function e(){}return e.prototype.then=function(n,t){var r=new e,o=this.s;if(o){var i=1&o?n:t;if(i){try{f(r,1,i(this.v))}catch(a){f(r,2,a)}return r}return this}return this.o=function(e){try{var o=e.v;1&e.s?f(r,1,n?n(o):o):t?f(r,1,t(o)):f(r,2,o)}catch(a){f(r,2,a)}},r},e}();function f(e,n,t){if(!e.s){if(t instanceof s){if(!t.s)return void(t.o=f.bind(null,e,n));1&n&&(n=t.s),t=t.v}if(t&&t.then)return void t.then(f.bind(null,e,n),f.bind(null,e,2));e.s=n,e.v=t;var r=e.o;r&&r(e)}}function h(e){return e instanceof s&&1&e.s}"undefined"!==typeof Symbol&&(Symbol.iterator||(Symbol.iterator=Symbol("Symbol.iterator"))),"undefined"!==typeof Symbol&&(Symbol.asyncIterator||(Symbol.asyncIterator=Symbol("Symbol.asyncIterator")));function p(e,n,t){for(var r;;){var o=e();if(h(o)&&(o=o.v),!o)return i;if(o.then){r=0;break}var i=t();if(i&&i.then){if(!h(i)){r=1;break}i=i.s}if(n){var a=n();if(a&&a.then&&!h(a)){r=2;break}}}var u=new s,c=f.bind(null,u,2);return(0===r?o.then(p):1===r?i.then(l):a.then(v)).then(void 0,c),u;function l(r){i=r;do{if(n&&(a=n())&&a.then&&!h(a))return void a.then(v).then(void 0,c);if(!(o=e())||h(o)&&!o.v)return void f(u,1,i);if(o.then)return void o.then(p).then(void 0,c);h(i=t())&&(i=i.v)}while(!i||!i.then);i.then(l).then(void 0,c)}function p(e){e?(i=t())&&i.then?i.then(l).then(void 0,c):l(i):f(u,1,i)}function v(){(o=e())?o.then?o.then(p).then(void 0,c):p(o):f(u,1,i)}}function v(e,n){try{var t=e()}catch(r){return n(r)}return t&&t.then?t.then(void 0,n):t}var d=function(e,n){try{for(var t=this,r=t.context;r;){var o,i=r.executables,a=void 0===i?{}:i;if(e in a)return Promise.resolve((o=a[e]).call.apply(o,[t].concat(n)));r=r.parent}throw Error("Command '"+e+"' not found")}catch(u){return Promise.reject(u)}},m=function(e,n){try{var t=function(t){if(r)return t;try{return o.context.variables[e]=n,n}catch(i){throw Error(e+" is readonly")}},r=!1,o=this,i=o.context,a=p((function(){return!r&&!!i}),void 0,(function(){function t(t){if(r)return t;if(e in l)try{return l[e]=n,r=!0,n}catch(o){throw Error(e+" is readonly")}i=i.parent}var o=i,a=o.executables,u=void 0===a?{}:a,c=o.variables,l=void 0===c?{}:c,s=function(){if("set"in u)return v((function(){return Promise.resolve(u.set(e,n)).then((function(e){return r=!0,e}))}),(function(){}))}();return s&&s.then?s.then(t):t(s)}));return Promise.resolve(a&&a.then?a.then(t):t(a))}catch(u){return Promise.reject(u)}},g=function(e){try{var n=function(n){return t?n:"commands"===e?b.commands.call(r):"variables"===e?[].concat(Object.keys(r.context.variables),["commands","variables"]):void 0},t=!1,r=this,o=r.context,i=p((function(){return!t&&!!o}),void 0,(function(){function n(n){return t?n:e in c?(t=!0,c[e]):void(o=o.parent)}var r=o,i=r.executables,a=void 0===i?{}:i,u=r.variables,c=void 0===u?{}:u,l=function(){if("get"in a)return v((function(){return Promise.resolve(a.get(e)).then((function(e){return t=!0,e}))}),(function(){}))}();return l&&l.then?l.then(n):n(l)}));return Promise.resolve(i&&i.then?i.then(n):n(i))}catch(a){return Promise.reject(a)}},y=function e(n){try{var t=function(t){var i=!1;if(r)return t;function a(t){if(i)return t;var r=n.command,a=n.args;return Promise.resolve(Promise.all(a.map((function(n){return"object"===typeof n?e.call(o,n):n})))).then((function(e){var n;return r in b?(n=b[r]).call.apply(n,[o].concat(e)):d.call(o,r,e)}))}if("string"===typeof n.variable)return g.call(o,n.variable);var u=function(){if("string"===typeof n.operator){var t=function(t){return i?t:Promise.resolve(e.call(o,n.left)).then((function(t){return Promise.resolve(e.call(o,n.right)).then((function(e){if(I(t)||I(e))return i=!0,function(e,n,t){if(n instanceof Date&&t instanceof Date){if("-"===e)return+n-+t;throw Error("Invalid date calc")}if("+"!==e)throw Error("Invalid date calc");return new Date(+n+ +t)}(n.operator,t,e);switch(n.operator){case"+":return i=!0,t+e;case"-":return i=!0,t-e;case"*":return i=!0,t*e;case"/":return i=!0,t/e}throw Error("Unrecognised operator: "+n.operator)}))}))},r=function(){if("="===n.operator){i=!0;var t=n.name;return Promise.resolve(e.call(o,n.value)).then((function(e){return m.call(o,t,e)}))}}();return r&&r.then?r.then(t):t(r)}}();return u&&u.then?u.then(a):a(u)},r=!1,o=this;if("object"!==typeof n)return Promise.resolve(n);var i=function(){if("object"===typeof n.variable)return r=!0,Promise.resolve(e.call(o,n.variable)).then((function(e){return g.call(o,e)}))}();return Promise.resolve(i&&i.then?i.then(t):t(i))}catch(a){return Promise.reject(a)}},b={ver:function(){return Object({NODE_ENV:"production",PUBLIC_URL:".",WDS_SOCKET_HOST:void 0,WDS_SOCKET_PATH:void 0,WDS_SOCKET_PORT:void 0}).REACT_APP_COMMIT_HASH||t(10).version},help:function(){return"Command Interpreter version "+b.ver()+"\n\xa9 Iain MacDonald\n\nBuiltin commands:\n"+b.commands().join("\n")},commands:function(){var e=new Set(Object.keys(b)),n=this.context;for(;n;){var t=n.executables,r=void 0===t?{}:t;Object.keys(r).forEach(e.add.bind(e)),n=n.parent}return Array.from(e).sort()},variables:function(){return this.context.variables},get:g,set:m,date:function(){return new Date},type:function(e){return e instanceof Date?"date":Array.isArray(e)?"list":null===e?"":typeof e},sleep:function(e){return new Promise((function(n){return setTimeout(n,1e3*e)}))},echo:function(){for(var e=arguments.length,n=new Array(e),t=0;t<e;t++)n[t]=arguments[t];return n.flat().filter(C).map(P).join(" ")},cast:function(e,n){return"number"===n?+e:"string"===n?P(e):"list"===n&&"string"===typeof e?e.split("\n"):e},length:function(e){return(Array.isArray(e)?e:"string"===typeof e?e.split("\n"):[e]).length},json:function(){for(var e=arguments.length,n=new Array(e),t=0;t<e;t++)n[t]=arguments[t];return 0===n.length?null:1===n.length?JSON.stringify(n[0]):JSON.stringify(n)},range:function(e){return Array(e).fill(0).map((function(e,n){return n}))},grep:function(e,n){try{var t=new RegExp(n);return e.filter((function(e){return t.test(e)}))}catch(r){return e.filter((function(e){return e.includes(n)}))}},index:function(e,n){return e[n]},tee:function(e){try{for(var n=this,t=arguments.length,r=new Array(t>1?t-1:0),o=1;o<t;o++)r[o-1]=arguments[o];var i=r.find((function(e){return!e.startsWith("-")}))||"output",a=r.some((function(e){return"-a"===e})),u=function(){if(a)return Promise.resolve(g.call(n,i)).then((function(t){var r=Array.isArray(t)?t:[t];r.push(e),m.call(n,i,r)}));m.call(n,i,e)}();return Promise.resolve(u&&u.then?u.then((function(){return e})):e)}catch(c){return Promise.reject(c)}},eval:function(){for(var e=arguments.length,n=new Array(e),t=0;t<e;t++)n[t]=arguments[t];var r=j(n.join(" "));if(0!==r.length){var o=E(r);return y.call(this,o[0])}}};"undefined"!==typeof alert&&(b.alert=function(){return alert(b.echo.apply(b,arguments))});var x=["foreach","done"],w=["+","-","*","/"],S=function(){function e(e){void 0===e&&(e={}),this.context=e}var n=e.prototype;return n.execute=function(e,n,t){try{var r=this;return void 0===n&&(n=r.output),void 0===t&&(t=r.error),"undefined"===typeof r.context.variables&&(r.context.variables={}),r.output=n,r.error=t,Promise.resolve(v((function(){var o=j(e);if(0!==o.length){var i=E(o);return Promise.resolve(r.executeStatements(i,n,t)).then((function(){}))}}),(function(e){t(e.message)})))}catch(o){return Promise.reject(o)}},n.executeStatements=function(e,n,t){try{var r=this,o=r.context.variables,i=0;return Promise.resolve(p((function(){return i<e.length}),(function(){return i++}),(function(){var a=e[i];return function(){if("foreach"===a.control){var u=b.cast;return Promise.resolve(y.call(r,a.args[0])).then((function(n){function t(n){r.context.forLoop={originalItem:o[n],start:i,items:c,iteration:0,loopVar:n};var t=e.slice(i+1).findIndex((function(e){return"done"===e.control}));if(-1===t)throw Error("Unterminated foreach loop");0!==c.length?o[n]=c[0]:i=t}var c=u.call(b,n,"list");return a.args[1]?Promise.resolve(y.call(r,a.args[1])).then(t):t("item")}))}return function(){if("done"!==a.control)return Promise.resolve(r.executeStatementOperator(a,n,t)).then((function(){}));var e=r.context,o=e.forLoop,u=e.variables;if(!o)throw Error("Unexpected control word: "+a.control);o.iteration++,o.iteration<o.items.length?(i=o.start,u[o.loopVar]=o.items[o.iteration]):("undefined"===typeof o.originalItem?delete u[o.loopVar]:u[o.loopVar]=o.originalItem,r.context.forLoop=null)}()}()})))}catch(a){return Promise.reject(a)}},n.executeStatementOperator=function(e,n,t){try{var r,o=this,i=this.context,a=u({},i,{variables:u({},i.variables)});r="&&"===e.operator?this.executeStatementOperator(e.left,n,t).then((function(){return o.context=a,o.executeStatementOperator(e.right,n,t).then((function(){o.context=i}))})):this.executeStatement(e,n,t);var c=function(){if(!e.background)return Promise.resolve(r).then((function(){}));r.catch((function(e){throw e}))}();return Promise.resolve(c&&c.then?c.then((function(){})):void 0)}catch(l){return Promise.reject(l)}},n.executeStatement=function(e,n,t){try{var r=this,o=r.context.variables,i=v((function(){return Promise.resolve(y.call(r,e)).then((function(e){n(P(e)),o[0]=e}))}),(function(e){t(e.message)}));return Promise.resolve(i&&i.then?i.then((function(){})):void 0)}catch(a){return Promise.reject(a)}},e}();function P(e){return"undefined"===typeof e||null===e?"":e instanceof Date?e.toISOString():Array.isArray(e)?e.map(P).join("\n"):"object"===typeof e?Object.entries(e).map((function(e){return e[0]+" = "+P(e[1])})).join("\n"):String(e)}function j(e){for(var n=[],t=0,r=[{name:"whitespace",regex:/^\s+/,value:function(){return""}},{name:"string",regex:/^"([^"]*)"/,value:function(e){return e.replace(/\\n/g,"\n").replace(/\\t/g,"\t")}},{name:"string_verbatim",regex:/^'[^']*'/,value:function(e){return e.replace(/\\n/g,"\n").replace(/\\t/g,"\t")}},{name:"num",regex:/^-?\d+(?:\.\d+)?/,value:function(e){return+e}},{name:"variable",regex:/^\$+\w+/},{name:"boolean",regex:/^(true|false)/,value:function(e){return"true"===e}},{name:"punctuation",regex:/^(;|\${|}|&&|[|=+*/&])/},{name:"keyword",regex:/^(foreach|done)/},{name:"name",regex:/^[\w-]+/}];t<e.length;){for(var o,i=e.substr(t),a=!1,u=l(r);!(o=u()).done;){var c=o.value,s=c.regex.exec(i);if(s){var f=s[1]||s[0];c.value instanceof Function?f=c.value(f):"undefined"!==typeof c.value&&(f=c.value),"undefined"!==typeof f&&null!==f&&""!==f&&n.push(f),t+=s[0].length,a=!0;break}}if(!a)throw Error("  "+" ".repeat(t)+"^\nUnexpected input at "+t+": "+e.substr(t,10))}return n}function E(e){return D(e,";").map(A)}function A(e){var n=!1;"&"===e[e.length-1]&&(n=!0,e.length--);var t=function(e){return e.reduce((function(e,n){return null===e?n:{operator:"&&",left:e,right:n}}),null)}(D(e,"&&").map(O));return t.background=n,t}function k(e){if(3===e.length&&"string"===typeof e[0]&&"="===e[1])return{operator:"=",name:e[0],value:e[2]};if(3===e.length&&w.includes(e[1]))return{operator:e[1],left:e[0],right:e[2]};if("undefined"!==typeof e[0].variable){if(e.length>1)throw Error("Variable evaluation must be only node in statement");return e[0]}return"number"===typeof e[0]?e[0]:x.includes(e[0])?{control:e[0],args:e.slice(1)}:{command:e[0],args:e.slice(1)}}function O(e){for(var n=[],t=[],r=0;r<e.length;r++){var o=e[r];if("|"===o)n.push(k(t)),t=[];else if("${"===o){var i=e.slice(r+1),a=i.indexOf("}");if(-1===a)throw Error("Unterminated sub-expression");t.push(O(i.slice(0,a))),r+=a+1}else if("number"===typeof o)t.push(o);else if("string"===typeof o&&"$"===o[0]){var u=o.substr(1),c={variable:u};"$"===u[0]&&(c={variable:{variable:u.substr(1)}}),t.push(c)}else if("string"===typeof o&&"'"===o[0]){var l=o.substr(1,o.length-2);t.push(l)}else t.push(o)}if(0===t.length)throw Error("Empty pipe segment");return n.push(k(t)),function(e){return e.reduce((function(e,n){if(null===e)return n;if("undefined"!==typeof n.variable)return{operator:"=",name:n.variable,value:e};if(!n.args)throw Error("Unable to pipe to "+typeof n);return n.args.unshift(e),n}),null)}(n)}function D(e,n){for(var t=[],r=[],o=0;o<e.length;o++)e[o]===n&&r.length?(t.push(r),r=[]):r.push(e[o]);return r.length&&t.push(r),t}function C(e){return!function(e){return"undefined"===typeof e||null===e||""===e}(e)}function I(e){return e instanceof Date}var $={ConsoleDisplay:"_2okS3","ConsoleDisplay-hist-input":"_2k9nO","ConsoleDisplay-hist-error":"_23Wsh"};function _(e){var n=e.shell,t=void 0===n?null:n,r=e.context,i=void 0===r?{}:r,a=e.style,c=void 0===a?{}:a,l=e.onClose,s=void 0===l?null:l,f=o.a.useState([]),h=f[0],p=f[1],v=o.a.useState(""),d=v[0],m=v[1],g=o.a.useState(0),y=g[0],b=g[1],x=o.a.useState(!1),w=x[0],P=x[1],j=o.a.useRef(),E=o.a.useRef(t||new S(i)),A=o.a.useRef(),k=o.a.useState(c.color),O=k[0],D=k[1],C=o.a.useState(c.backgroundColor),I=C[0],_=C[1];o.a.useEffect((function(){i.parent={variables:{textColor:O,backgroundColor:I},executables:{set:function(e,n){if("textColor"===e)return D(n);if("backgroundColor"===e)return _(n);throw Error("Unhandled")},exit:s||function(){},clear:function(){return p([])}}}}),[i,O,D,I,_,s,p]),o.a.useEffect((function(){j.current&&j.current.focus(),A.current&&(A.current.scrollTop=A.current.scrollHeight)}),[h,w]);var N=o.a.useCallback((function(e){function n(e){p((function(n){return[].concat(n,[e])}))}!function(e){try{e.preventDefault(),m(""),b(0),n({value:d,type:"input"});var t=function(){if(E.current)return P(!0),Promise.resolve(E.current.execute(d,(function(e){n({value:e,type:"output"})}),(function(e){n({value:e,type:"error"})}))).then((function(){P(!1)}));n({value:"No interpreter specified",type:"error"})}();Promise.resolve(t&&t.then?t.then((function(){})):void 0)}catch(e){return Promise.reject(e)}}(e)}),[d,m,b,p,P]);var T=u({},c,{color:O,background:I});return o.a.createElement("div",{className:$.ConsoleDisplay,ref:A,onClick:function(){return"Range"!==getSelection().type&&j.current.focus()},style:T},o.a.createElement("ul",null,h.map((function(e,n){return o.a.createElement("li",{key:n,className:$["ConsoleDisplay-hist-"+e.type]},e.value)}))),o.a.createElement("form",{onSubmit:N},!w&&"> ",o.a.createElement("input",{value:d,ref:j,disabled:w,onChange:function(e){return m(e.target.value)},onKeyUp:function(e){var n=h.filter((function(e){return"input"===e.type&&e.value})),t=NaN;"ArrowUp"===e.key?t=Math.min(y+1,n.length):"ArrowDown"===e.key&&(t=Math.max(y-1,0)),isNaN(t)||(b(t),0===t&&0!==y?m(""):0!==t&&m(n[n.length-t].value))},onKeyDown:function(e){return"ArrowUp"===e.key&&e.preventDefault()},autoFocus:!0})))}t(11);var N={demo(){return this.execute('\necho Welcome to the demo "script.";\nsleep 1;\necho Sit back and watch some sample commands;\nsleep 1;\necho executed before your "eyes!";\nsleep 1;\necho ">" date;\ndate;\nsleep 1;\necho ">" sleep 3;\nsleep 3;\necho ">" date;\ntee ${date} d;\nsleep 1;\necho ">" echo \'$0\';\necho $d;\nsleep 1;\necho ">" 5 + 2;\n5 + 2;\nsleep 1;\necho ">" a = \'${6 * 2}\';\na = ${6 * 2};\nsleep 1;\necho ">" echo Answer is \'$a\';\necho Answer is $a;\nsleep 1;\necho ">" range 3;\nrange 3;\nsleep 1;\necho ">" \'$0 | json\';\nrange 3 | json;\nsleep 1;\necho \'> range 50 | grep 7\' ;\nrange 50 | grep 7;\nsleep 1;\necho \'> foreach ${range 10}; sleep 1; $item; done;\';\nforeach ${range 10}; sleep 1; $item; done;\necho \' \';\necho \'Thanks!\';\n')}};var T=function(){return o.a.createElement("div",{className:"App"},o.a.createElement("p",null,"Type demo or help to get started."),o.a.createElement(_,{context:{executables:N}}))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));a.a.render(o.a.createElement(o.a.StrictMode,null,o.a.createElement(T,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}],[[3,1,2]]]);
//# sourceMappingURL=main.7d8bd167.chunk.js.map