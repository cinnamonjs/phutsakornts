import { jsx, jsxs } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import { createCookie, ServerRouter, createCookieSessionStorage, UNSAFE_withComponentProps, Outlet, data, useLoaderData, Meta, Links, ScrollRestoration, Scripts, Form } from "react-router";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { initReactI18next, I18nextProvider, useTranslation } from "react-i18next";
import { unstable_createI18nextMiddleware } from "remix-i18next/middleware";
import { useChangeLanguage } from "remix-i18next/react";
import { createThemeSessionResolver, ThemeProvider, PreventFlashOnWrongTheme } from "remix-themes";
import "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { cacheHeader } from "pretty-cache-header";
import { z } from "zod";
const enTranslation = {
  title: "remix-i18next (en)",
  description: "A React Router + remix-i18next example",
  notFound: {
    title: "Page not found",
    description: "The page you are looking for does not exist."
  }
};
const esTranslation = {
  title: "remix-i18next (es)",
  description: "Un ejemplo de React Router + remix-i18next",
  notFound: {
    title: "Página no encontrada",
    description: "La página que estás buscando no existe."
  }
};
const localeCookie = createCookie("lng", {
  path: "/",
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  httpOnly: true
});
const [i18nextMiddleware, getLocale, getInstance] = unstable_createI18nextMiddleware({
  detection: {
    supportedLanguages: ["es", "en"],
    fallbackLanguage: "en",
    cookie: localeCookie
  },
  i18next: {
    resources: { en: { translation: enTranslation }, es: { translation: esTranslation } }
  },
  plugins: [initReactI18next]
});
const streamTimeout = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, entryContext, routerContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    let userAgent = request.headers.get("user-agent");
    let readyOption = userAgent && isbot(userAgent) || entryContext.isSpaMode ? "onAllReady" : "onShellReady";
    let { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(I18nextProvider, { i18n: getInstance(routerContext), children: /* @__PURE__ */ jsx(ServerRouter, { context: entryContext, url: request.url }) }),
      {
        [readyOption]() {
          shellRendered = true;
          let body = new PassThrough();
          let stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) console.error(error);
        }
      }
    );
    setTimeout(abort, streamTimeout + 1e3);
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest,
  streamTimeout
}, Symbol.toStringTag, { value: "Module" }));
const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__remix-themes",
    // domain: 'remix.run',
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secrets: ["s3cr3t"]
    // secure: true,
  }
});
const themeSessionResolver = createThemeSessionResolver(sessionStorage);
const styles = "/assets/index-C1NCwpdG.css";
const links = () => {
  return [{
    rel: "stylesheet",
    href: styles
  }];
};
const unstable_middleware = [i18nextMiddleware];
async function loader$3({
  context,
  request
}) {
  let locale = getLocale(context);
  const {
    getTheme
  } = await themeSessionResolver(request);
  return {
    theme: getTheme(),
    ...data({
      locale
    }, {
      headers: {
        "Set-Cookie": await localeCookie.serialize(locale)
      }
    })
  };
}
function Providers({
  children
}) {
  const data2 = useLoaderData();
  return /* @__PURE__ */ jsx(ThemeProvider, {
    specifiedTheme: data2.theme,
    themeAction: "/action/set-theme",
    children
  });
}
function Layout({
  children
}) {
  let {
    i18n
  } = useTranslation();
  const data2 = useLoaderData();
  return /* @__PURE__ */ jsx(Providers, {
    children: /* @__PURE__ */ jsxs("html", {
      lang: i18n.language,
      dir: i18n.dir(i18n.language),
      children: [/* @__PURE__ */ jsxs("head", {
        children: [/* @__PURE__ */ jsx("meta", {
          charSet: "utf-8"
        }), /* @__PURE__ */ jsx("meta", {
          name: "viewport",
          content: "width=device-width, initial-scale=1"
        }), /* @__PURE__ */ jsx(Meta, {}), /* @__PURE__ */ jsx(PreventFlashOnWrongTheme, {
          ssrTheme: Boolean(data2.theme)
        }), /* @__PURE__ */ jsx(Links, {})]
      }), /* @__PURE__ */ jsxs("body", {
        children: [children, /* @__PURE__ */ jsx(ScrollRestoration, {}), /* @__PURE__ */ jsx(Scripts, {})]
      })]
    })
  });
}
const root = UNSAFE_withComponentProps(function App({
  loaderData
}) {
  useChangeLanguage(loaderData.locale);
  return /* @__PURE__ */ jsx(Outlet, {});
});
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Layout,
  Providers,
  default: root,
  links,
  loader: loader$3,
  unstable_middleware
}, Symbol.toStringTag, { value: "Module" }));
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        destructive: "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline: "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary: "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "button";
  return /* @__PURE__ */ jsx(
    Comp,
    {
      "data-slot": "button",
      className: cn(buttonVariants({ variant, size, className })),
      ...props
    }
  );
}
function meta({
  data: data2
}) {
  return [{
    title: data2 == null ? void 0 : data2.title
  }, {
    name: "description",
    content: data2 == null ? void 0 : data2.description
  }];
}
async function loader$2({
  context
}) {
  let i18n = getInstance(context);
  return data({
    title: i18n.t("title"),
    description: i18n.t("description")
  });
}
const index = UNSAFE_withComponentProps(function Index({
  loaderData
}) {
  let {
    t
  } = useTranslation();
  return /* @__PURE__ */ jsxs("div", {
    style: {
      fontFamily: "system-ui, sans-serif",
      lineHeight: "1.8"
    },
    children: [/* @__PURE__ */ jsx("h1", {
      children: t("title")
    }), /* @__PURE__ */ jsx("p", {
      children: loaderData.description
    }), /* @__PURE__ */ jsxs(Form, {
      children: [/* @__PURE__ */ jsx(Button, {
        type: "submit",
        name: "lng",
        value: "es",
        children: "Español"
      }), /* @__PURE__ */ jsx(Button, {
        type: "submit",
        name: "lng",
        value: "en",
        children: "English"
      })]
    })]
  });
});
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: index,
  loader: loader$2,
  meta
}, Symbol.toStringTag, { value: "Module" }));
const resources = {
  en: {
    translation: enTranslation
  },
  es: {
    translation: esTranslation
  }
};
async function loader$1({
  params
}) {
  const lng = z.string().refine((lng2) => Object.keys(resources).includes(lng2)).safeParse(params.lng);
  if (lng.error) return data({
    error: lng.error
  }, {
    status: 400
  });
  const namespaces = resources[lng.data];
  const ns = z.string().refine((ns2) => {
    return Object.keys(resources[lng.data]).includes(ns2);
  }).safeParse(params.ns);
  if (ns.error) return data({
    error: ns.error
  }, {
    status: 400
  });
  const headers = new Headers();
  if (process.env.NODE_ENV === "production") {
    headers.set("Cache-Control", cacheHeader({
      maxAge: "5m",
      // Cache in the browser for 5 minutes
      sMaxage: "1d",
      // Cache in the CDN for 1 day
      // Serve stale content while revalidating for 7 days
      staleWhileRevalidate: "7d",
      // Serve stale content if there's an error for 7 days
      staleIfError: "7d"
    }));
  }
  return data(namespaces[ns.data], {
    headers
  });
}
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  loader: loader$1
}, Symbol.toStringTag, { value: "Module" }));
async function loader() {
  return data(null, {
    status: 404
  });
}
const notFound = UNSAFE_withComponentProps(function Component() {
  let {
    t
  } = useTranslation("translation", {
    keyPrefix: "notFound"
  });
  return /* @__PURE__ */ jsxs("div", {
    style: {
      fontFamily: "system-ui, sans-serif",
      lineHeight: "1.8"
    },
    children: [/* @__PURE__ */ jsx("h1", {
      children: t("title")
    }), /* @__PURE__ */ jsx("p", {
      children: t("description")
    })]
  });
});
const route3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: notFound,
  loader
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-BUFqFGnq.js", "imports": ["/assets/chunk-NL6KNZEE-BMbPM_1L.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/root-Bj-WHRYg.js", "imports": ["/assets/chunk-NL6KNZEE-BMbPM_1L.js", "/assets/useTranslation-B2mFGTGw.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/index": { "id": "routes/index", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/index-CSD7lC_f.js", "imports": ["/assets/chunk-NL6KNZEE-BMbPM_1L.js", "/assets/useTranslation-B2mFGTGw.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/locales": { "id": "routes/locales", "parentId": "root", "path": "api/locales/:lng/:ns", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/locales-l0sNRNKZ.js", "imports": [], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/not-found": { "id": "routes/not-found", "parentId": "root", "path": "*", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/not-found-LVR2N5d-.js", "imports": ["/assets/chunk-NL6KNZEE-BMbPM_1L.js", "/assets/useTranslation-B2mFGTGw.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 } }, "url": "/assets/manifest-92fb6697.js", "version": "92fb6697", "sri": void 0 };
const assetsBuildDirectory = "build/client";
const basename = "/";
const future = { "unstable_middleware": true, "unstable_optimizeDeps": false, "unstable_splitRouteModules": false, "unstable_subResourceIntegrity": false, "unstable_viteEnvironmentApi": false };
const ssr = true;
const isSpaMode = false;
const prerender = [];
const routeDiscovery = { "mode": "lazy", "manifestPath": "/__manifest" };
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/index": {
    id: "routes/index",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route1
  },
  "routes/locales": {
    id: "routes/locales",
    parentId: "root",
    path: "api/locales/:lng/:ns",
    index: void 0,
    caseSensitive: void 0,
    module: route2
  },
  "routes/not-found": {
    id: "routes/not-found",
    parentId: "root",
    path: "*",
    index: void 0,
    caseSensitive: void 0,
    module: route3
  }
};
export {
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  prerender,
  publicPath,
  routeDiscovery,
  routes,
  ssr
};
