!function(n,i){"function"==typeof define&&define.amd?define(["jquery"],i):"undefined"!=typeof exports?i(require("jquery")):(i(n.jquery),n.AdminMenu={})}(this,function(n){"use strict";i=n,i&&i.__esModule;var i,t,e,s,a,o,r,l,c,g,f,h,d,u="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(n){return typeof n}:function(n){return n&&"function"==typeof Symbol&&n.constructor===Symbol&&n!==Symbol.prototype?"symbol":typeof n},p=(t=jQuery,e=!1,s={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"oTransitionEnd otransitionend",transition:"transitionend"},a={TRANSITION_END:"mmTransitionEnd",triggerTransitionEnd:function n(i){t(i).trigger(e.end)},supportsTransitionEnd:function n(){return Boolean(e)}},e=function n(){if(window.QUnit)return!1;var i=document.createElement("mm");for(var t in s)if(void 0!==i.style[t])return{end:s[t]};return!1}(),t.fn.emulateTransitionEnd=function n(i){var e=this,s=!1;return t(this).one(a.TRANSITION_END,function(){s=!0}),setTimeout(function(){s||a.triggerTransitionEnd(e)},i),this},a.supportsTransitionEnd()&&(t.event.special[a.TRANSITION_END]={bindType:e.end,delegateType:e.end,handle:function n(i){if(t(i.target).is(this))return i.handleObj.handler.apply(this,arguments)}}),a);o=jQuery,r="AdminMenu",c="."+(l="AdminMenu"),g=o.fn[r],f={toggle:!0,preventDefault:!0,activeClass:"active",collapseClass:"collapse",collapseInClass:"in",collapsingClass:"collapsing",triggerElement:"a",parentTrigger:"li",subMenu:"ul"},h={SHOW:"show"+c,SHOWN:"shown"+c,HIDE:"hide"+c,HIDDEN:"hidden"+c,CLICK_DATA_API:"click"+c+".data-api"},d=function(){function n(i,t){(function n(i,t){if(!(i instanceof t))throw TypeError("Cannot call a class as a function")})(this,n),this._element=i,this._config=this._getConfig(t),this._transitioning=null,this.init()}return n.prototype.init=function n(){var i=this;o(this._element).find(this._config.parentTrigger+"."+this._config.activeClass).has(this._config.subMenu).children(this._config.subMenu).attr("aria-expanded",!0).addClass(this._config.collapseClass+" "+this._config.collapseInClass),o(this._element).find(this._config.parentTrigger).not("."+this._config.activeClass).has(this._config.subMenu).children(this._config.subMenu).attr("aria-expanded",!1).addClass(this._config.collapseClass),o(this._element).find(this._config.parentTrigger).has(this._config.subMenu).children(this._config.triggerElement).on(h.CLICK_DATA_API,function(n){var t=o(this),e=t.parent(i._config.parentTrigger),s=e.siblings(i._config.parentTrigger).children(i._config.triggerElement),a=e.children(i._config.subMenu);i._config.preventDefault&&n.preventDefault(),"true"!==t.attr("aria-disabled")&&(e.hasClass(i._config.activeClass)?(t.attr("aria-expanded",!1),i._hide(a)):(i._show(a),t.attr("aria-expanded",!0),i._config.toggle&&s.attr("aria-expanded",!1)),i._config.onTransitionStart&&i._config.onTransitionStart(n))})},n.prototype._show=function n(i){if(!(this._transitioning||o(i).hasClass(this._config.collapsingClass))){var t=this,e=o(i),s=o.Event(h.SHOW);if(e.trigger(s),!s.isDefaultPrevented()){e.parent(this._config.parentTrigger).addClass(this._config.activeClass),this._config.toggle&&this._hide(e.parent(this._config.parentTrigger).siblings().children(this._config.subMenu+"."+this._config.collapseInClass).attr("aria-expanded",!1)),e.removeClass(this._config.collapseClass).addClass(this._config.collapsingClass).height(0),this.setTransitioning(!0);var a=function n(){e.removeClass(t._config.collapsingClass).addClass(t._config.collapseClass+" "+t._config.collapseInClass).height("").attr("aria-expanded",!0),t.setTransitioning(!1),e.trigger(h.SHOWN)};if(!p.supportsTransitionEnd()){a();return}e.height(e[0].scrollHeight).one(p.TRANSITION_END,a).emulateTransitionEnd(350)}}},n.prototype._hide=function n(i){if(!this._transitioning&&o(i).hasClass(this._config.collapseInClass)){var t=this,e=o(i),s=o.Event(h.HIDE);if(e.trigger(s),!s.isDefaultPrevented()){e.parent(this._config.parentTrigger).removeClass(this._config.activeClass),e.height(e.height())[0].offsetHeight,e.addClass(this._config.collapsingClass).removeClass(this._config.collapseClass).removeClass(this._config.collapseInClass),this.setTransitioning(!0);var a=function n(){t._transitioning&&t._config.onTransitionEnd&&t._config.onTransitionEnd(),t.setTransitioning(!1),e.trigger(h.HIDDEN),e.removeClass(t._config.collapsingClass).addClass(t._config.collapseClass).attr("aria-expanded",!1)};if(!p.supportsTransitionEnd()){a();return}0==e.height()||"none"==e.css("display")?a():e.height(0).one(p.TRANSITION_END,a).emulateTransitionEnd(350)}}},n.prototype.setTransitioning=function n(i){this._transitioning=i},n.prototype.dispose=function n(){o.removeData(this._element,l),o(this._element).find(this._config.parentTrigger).has(this._config.subMenu).children(this._config.triggerElement).off("click"),this._transitioning=null,this._config=null,this._element=null},n.prototype._getConfig=function n(i){return i=o.extend({},f,i)},n._jQueryInterface=function i(t){return this.each(function(){var i=o(this),e=i.data(l),s=o.extend({},f,i.data(),(void 0===t?"undefined":u(t))==="object"&&t);if(!e&&/dispose/.test(t)&&this.dispose(),e||(e=new n(this,s),i.data(l,e)),"string"==typeof t){if(void 0===e[t])throw Error('No method named "'+t+'"');e[t]()}})},n}(),o.fn[r]=d._jQueryInterface,o.fn[r].Constructor=d,o.fn[r].noConflict=function(){return o.fn[r]=g,d._jQueryInterface}});