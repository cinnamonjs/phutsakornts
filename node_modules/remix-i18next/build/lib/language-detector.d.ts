import type { Cookie, SessionStorage } from "react-router";
export interface LanguageDetectorOption {
    /**
     * Define the list of supported languages, this is used to determine if one of
     * the languages requested by the user is supported by the application.
     * This should be be same as the supportedLngs in the i18next options.
     */
    supportedLanguages: string[];
    /**
     * Define the fallback language that it's going to be used in the case user
     * expected language is not supported.
     * This should be be same as the fallbackLng in the i18next options.
     */
    fallbackLanguage: string;
    /**
     * If you want to use a cookie to store the user preferred language, you can
     * pass the Cookie object here.
     */
    cookie?: Cookie;
    /**
     * If you want to use a session to store the user preferred language, you can
     * pass the SessionStorage object here.
     * When this is not defined, getting the locale will ignore the session.
     */
    sessionStorage?: SessionStorage;
    /**
     * If defined a sessionStorage and want to change the default key used to
     * store the user preferred language, you can pass the key here.
     * @default "lng"
     */
    sessionKey?: string;
    /**
     * If you want to use search parameters for language detection and want to
     * change the default key used to for the parameter name,
     * you can pass the key here.
     * @default "lng"
     */
    searchParamKey?: string;
    /**
     * The order the library will use to detect the user preferred language.
     * By default the order is
     * - searchParams
     * - cookie
     * - session
     * - header
     * If customized, a an extra `custom` option can be added to the order.
     * And finally the fallback language.
     */
    order?: Array<"searchParams" | "cookie" | "session" | "header" | "custom">;
    /**
     * A function that can be used to find the locale based on the request object
     * using any custom logic you want.
     * This can be useful to get the locale from the URL pathname, or to query it
     * from the database or fetch it from an API.
     * @param request The request object received by the server.
     */
    findLocale?(request: Request): Promise<string | Array<string> | null>;
}
/**
 * The LanguageDetector contains the logic to detect the user preferred language
 * fully server-side by using a SessionStorage, Cookie, URLSearchParams, or
 * Headers.
 */
export declare class LanguageDetector {
    private options;
    constructor(options: LanguageDetectorOption);
    private isSessionOnly;
    private isCookieOnly;
    detect(request: Request): Promise<string>;
    private get defaultOrder();
    private fromSearchParams;
    private fromCookie;
    private fromSessionStorage;
    private fromHeader;
    private fromCustom;
    private fromSupported;
}
