function b(v){return v&&v.__esModule&&Object.prototype.hasOwnProperty.call(v,"default")?v.default:v}var d={exports:{}};(function(v){var m=Object.prototype.hasOwnProperty,c="~";function _(){}Object.create&&(_.prototype=Object.create(null),new _().__proto__||(c=!1));function g(s,t,n){this.fn=s,this.context=t,this.once=n||!1}function x(s,t,n,r,l){if(typeof n!="function")throw new TypeError("The listener must be a function");var u=new g(n,r||s,l),o=c?c+t:t;return s._events[o]?s._events[o].fn?s._events[o]=[s._events[o],u]:s._events[o].push(u):(s._events[o]=u,s._eventsCount++),s}function w(s,t){--s._eventsCount===0?s._events=new _:delete s._events[t]}function f(){this._events=new _,this._eventsCount=0}f.prototype.eventNames=function(){var t=[],n,r;if(this._eventsCount===0)return t;for(r in n=this._events)m.call(n,r)&&t.push(c?r.slice(1):r);return Object.getOwnPropertySymbols?t.concat(Object.getOwnPropertySymbols(n)):t},f.prototype.listeners=function(t){var n=c?c+t:t,r=this._events[n];if(!r)return[];if(r.fn)return[r.fn];for(var l=0,u=r.length,o=new Array(u);l<u;l++)o[l]=r[l].fn;return o},f.prototype.listenerCount=function(t){var n=c?c+t:t,r=this._events[n];return r?r.fn?1:r.length:0},f.prototype.emit=function(t,n,r,l,u,o){var a=c?c+t:t;if(!this._events[a])return!1;var e=this._events[a],p=arguments.length,h,i;if(e.fn){switch(e.once&&this.removeListener(t,e.fn,void 0,!0),p){case 1:return e.fn.call(e.context),!0;case 2:return e.fn.call(e.context,n),!0;case 3:return e.fn.call(e.context,n,r),!0;case 4:return e.fn.call(e.context,n,r,l),!0;case 5:return e.fn.call(e.context,n,r,l,u),!0;case 6:return e.fn.call(e.context,n,r,l,u,o),!0}for(i=1,h=new Array(p-1);i<p;i++)h[i-1]=arguments[i];e.fn.apply(e.context,h)}else{var E=e.length,y;for(i=0;i<E;i++)switch(e[i].once&&this.removeListener(t,e[i].fn,void 0,!0),p){case 1:e[i].fn.call(e[i].context);break;case 2:e[i].fn.call(e[i].context,n);break;case 3:e[i].fn.call(e[i].context,n,r);break;case 4:e[i].fn.call(e[i].context,n,r,l);break;default:if(!h)for(y=1,h=new Array(p-1);y<p;y++)h[y-1]=arguments[y];e[i].fn.apply(e[i].context,h)}}return!0},f.prototype.on=function(t,n,r){return x(this,t,n,r,!1)},f.prototype.once=function(t,n,r){return x(this,t,n,r,!0)},f.prototype.removeListener=function(t,n,r,l){var u=c?c+t:t;if(!this._events[u])return this;if(!n)return w(this,u),this;var o=this._events[u];if(o.fn)o.fn===n&&(!l||o.once)&&(!r||o.context===r)&&w(this,u);else{for(var a=0,e=[],p=o.length;a<p;a++)(o[a].fn!==n||l&&!o[a].once||r&&o[a].context!==r)&&e.push(o[a]);e.length?this._events[u]=e.length===1?e[0]:e:w(this,u)}return this},f.prototype.removeAllListeners=function(t){var n;return t?(n=c?c+t:t,this._events[n]&&w(this,n)):(this._events=new _,this._eventsCount=0),this},f.prototype.off=f.prototype.removeListener,f.prototype.addListener=f.prototype.on,f.prefixed=c,f.EventEmitter=f,v.exports=f})(d);var O=d.exports;const L=b(O);export{L as E};
//# sourceMappingURL=chatbot-core-file.DqvJXvYX.js.map
