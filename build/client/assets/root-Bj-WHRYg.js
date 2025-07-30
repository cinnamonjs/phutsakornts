import{r,j as n,w as j,u as C,M as k,L,S as A,b as M,O as b}from"./chunk-NL6KNZEE-BMbPM_1L.js";import{u as S}from"./useTranslation-B2mFGTGw.js";function B(t){let{i18n:e}=S();r.useEffect(()=>{e.language!==t&&e.changeLanguage(t)},[t,e])}function P(t,e,a){const s=r.useRef(typeof window<"u"&&"BroadcastChannel"in window?new BroadcastChannel(`${t}-channel`):null);return w(s,"message",e),w(s,"messageerror",a),r.useCallback(i=>{var d;(d=s==null?void 0:s.current)==null||d.postMessage(i)},[])}function w(t,e,a=()=>{}){r.useEffect(()=>{const s=t.current;if(s)return s.addEventListener(e,a),()=>s.removeEventListener(e,a)},[e,a])}function R(t){const e=document.createElement("style");e.appendChild(document.createTextNode(`* {
       -webkit-transition: none !important;
       -moz-transition: none !important;
       -o-transition: none !important;
       -ms-transition: none !important;
       transition: none !important;
    }`)),document.head.appendChild(e),t(),setTimeout(()=>{window.getComputedStyle(e).transition,document.head.removeChild(e)},100)}function O({disableTransitions:t=!1}={}){return r.useCallback(e=>{t?R(()=>{e()}):e()},[t])}var T=(t=>(t.DARK="dark",t.LIGHT="light",t))(T||{}),N=Object.values(T),g=r.createContext(void 0);g.displayName="ThemeContext";var p="(prefers-color-scheme: light)",v=()=>window.matchMedia(p).matches?"light":"dark",h=typeof window<"u"?window.matchMedia(p):null;function D({children:t,specifiedTheme:e,themeAction:a,disableTransitionOnThemeChange:s=!1}){const i=O({disableTransitions:s}),[d,l]=r.useState(()=>e?N.includes(e)?e:null:typeof window!="object"?null:v()),[m,u]=r.useState(e?"USER":"SYSTEM"),f=P("remix-themes",o=>{i(()=>{console.log("broadcastThemeChange",s),l(o.data.theme),u(o.data.definedBy)})});r.useEffect(()=>{if(m==="USER")return()=>{};const o=c=>{i(()=>{l(c.matches?"light":"dark")})};return h==null||h.addEventListener("change",o),()=>h==null?void 0:h.removeEventListener("change",o)},[i,m]);const x=r.useCallback(o=>{const c=typeof o=="function"?o(d):o;if(c===null){const y=v();i(()=>{l(y),u("SYSTEM"),f({theme:y,definedBy:"SYSTEM"})}),fetch(`${a}`,{method:"POST",body:JSON.stringify({theme:null})})}else i(()=>{l(c),u("USER")}),f({theme:c,definedBy:"USER"}),fetch(`${a}`,{method:"POST",body:JSON.stringify({theme:c})})},[f,i,d,a]),E=r.useMemo(()=>[d,x,{definedBy:m}],[d,x,m]);return n.jsx(g.Provider,{value:E,children:t})}var U=String.raw`
(() => {
  const theme = window.matchMedia(${JSON.stringify(p)}).matches
    ? 'light'
    : 'dark';
  
  const cl = document.documentElement.classList;
  const dataAttr = document.documentElement.dataset.theme;

  if (dataAttr != null) {
    const themeAlreadyApplied = dataAttr === 'light' || dataAttr === 'dark';
    if (!themeAlreadyApplied) {
      document.documentElement.dataset.theme = theme;
    }
  } else {
    const themeAlreadyApplied = cl.contains('light') || cl.contains('dark');
    if (!themeAlreadyApplied) {
      cl.add(theme);
    }
  }
  
  const meta = document.querySelector('meta[name=color-scheme]');
  if (meta) {
    if (theme === 'dark') {
      meta.content = 'dark light';
    } else if (theme === 'light') {
      meta.content = 'light dark';
    }
  }
})();
`;function $({ssrTheme:t,nonce:e}){const[a]=H();return n.jsxs(n.Fragment,{children:[n.jsx("meta",{name:"color-scheme",content:a==="light"?"light dark":"dark light"}),t?null:n.jsx("script",{dangerouslySetInnerHTML:{__html:U},nonce:e,suppressHydrationWarning:!0})]})}function H(){const t=r.useContext(g);if(t===void 0)throw new Error("useTheme must be used within a ThemeProvider");return t}const J="/assets/index-C1NCwpdG.css",G=()=>[{rel:"stylesheet",href:J}];function Y({children:t}){const e=C();return n.jsx(D,{specifiedTheme:e.theme,themeAction:"/action/set-theme",children:t})}function I({children:t}){let{i18n:e}=S();const a=C();return n.jsx(Y,{children:n.jsxs("html",{lang:e.language,dir:e.dir(e.language),children:[n.jsxs("head",{children:[n.jsx("meta",{charSet:"utf-8"}),n.jsx("meta",{name:"viewport",content:"width=device-width, initial-scale=1"}),n.jsx(k,{}),n.jsx($,{ssrTheme:!!a.theme}),n.jsx(L,{})]}),n.jsxs("body",{children:[t,n.jsx(A,{}),n.jsx(M,{})]})]})})}const Q=j(function({loaderData:e}){return B(e.locale),n.jsx(b,{})});export{I as Layout,Q as default,G as links};
