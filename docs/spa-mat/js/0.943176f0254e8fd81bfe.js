webpackJsonp([0],{CIqK:function(r,n,e){var t=e("NWyr");"string"==typeof t&&(t=[[r.i,t,""]]),t.locals&&(r.exports=t.locals);(0,e("rjj0").default)("cf45672a",t,!1,{})},GD0e:function(r,n,e){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var t=e("7109"),o={components:{QBtn:t.b,QIcon:t.d},data:function(){return{canGoBack:window.history.length>1}},methods:{goBack:function(){window.history.go(-1)}}},a=function(){var r=this,n=r.$createElement,e=r._self._c||n;return e("div",{staticClass:"error-page window-height window-width bg-light column items-center no-wrap"},[e("div",{staticClass:"error-code bg-primary flex items-center content-center justify-center"},[r._v("\n    404\n  ")]),r._v(" "),e("div",[e("div",{staticClass:"error-card shadow-4 bg-white column items-center justify-center no-wrap"},[e("q-icon",{attrs:{name:"error_outline",color:"grey-5"}}),r._v(" "),e("p",{staticClass:"caption reduce-caption-margin text-center"},[r._v("Oops. Nothing here...")]),r._v(" "),e("p",{staticClass:"text-center group"},[r.canGoBack?e("q-btn",{attrs:{color:"primary",push:"",icon:"keyboard_arrow_left"},on:{click:r.goBack}},[r._v("\n          Go back\n        ")]):r._e(),r._v(" "),e("q-btn",{attrs:{color:"primary",push:"","icon-right":"fa-home"},on:{click:function(n){r.$router.replace("/")}}},[r._v("\n          Go home\n        ")])],1)],1)])])},i=[];a._withStripped=!0;var c=e("XyMi"),d=!1;var s=function(r){d||e("CIqK")},p=Object(c.a)(o,a,i,!1,s,"data-v-44345ad4",null);p.options.__file="src/pages/Error404.vue";n.default=p.exports},NWyr:function(r,n,e){(r.exports=e("FZ+f")(!1)).push([r.i,"\n.error-page .error-code[data-v-44345ad4] {\n  height: 30vh;\n  width: 100%;\n  padding-top: 0vh;\n  color: rgba(255,255,255,0.2);\n  overflow: hidden;\n}\n@media (orientation: landscape) {\n.error-page .error-code[data-v-44345ad4] {\n    font-size: 20vw;\n}\n}\n@media (orientation: portrait) {\n.error-page .error-code[data-v-44345ad4] {\n    font-size: 20vh;\n}\n}\n.error-page .error-card[data-v-44345ad4] {\n  border-radius: 2px;\n  margin-top: -25px;\n  width: 80vw;\n  max-width: 600px;\n  padding: 20px;\n}\n.error-page .error-card > i[data-v-44345ad4] {\n  font-size: 5rem;\n}\n.reduce-caption-margin[data-v-44345ad4] {\n  margin-top: 1rem !important;\n}\n",""])}});