import {
  data,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  type LinksFunction,
} from "react-router";
import { useChangeLanguage } from "remix-i18next/react";
import type { Route } from "./+types/root";
import {
  getLocale,
  i18nextMiddleware,
  localeCookie,
} from "./middleware/i18next";
import {
  ThemeProvider,
  PreventFlashOnWrongTheme,
} from "remix-themes";
import { themeSessionResolver } from "./sessions.server";
import { useTranslation } from "react-i18next";
import styles from "~/index.css?url";

export const links = () => {
  return [
    { rel: "stylesheet", href: styles }
  ];
}

export const unstable_middleware = [i18nextMiddleware];

export async function loader({ context, request }: Route.LoaderArgs) {
  let locale = getLocale(context);
  const { getTheme } = await themeSessionResolver(request);
  return {
    theme: getTheme(),
    ...data(
      { locale },
      { headers: { "Set-Cookie": await localeCookie.serialize(locale) } }
    )
  }
}

export function Providers({ children }: { children: React.ReactNode }) {
  const data = useLoaderData();
  return <ThemeProvider specifiedTheme={data.theme} themeAction="/action/set-theme">
    {children}
  </ThemeProvider>
}

export function Layout({ children }: { children: React.ReactNode }) {
  let { i18n } = useTranslation();
  const data = useLoaderData();
  return (
    <Providers>
      <html lang={i18n.language} dir={i18n.dir(i18n.language)}>
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <Meta />
          <PreventFlashOnWrongTheme ssrTheme={Boolean(data.theme)} />
          <Links />
        </head>
        <body>
          {children}
          <ScrollRestoration />
          <Scripts />
        </body>
      </html >
    </Providers>
  );
}

export default function App({ loaderData }: Route.ComponentProps) {
  useChangeLanguage(loaderData.locale);
  return <Outlet />;
}
