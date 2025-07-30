import { createInstance, } from "i18next";
import { LanguageDetector, } from "./lib/language-detector.js";
export class RemixI18Next {
    options;
    detector;
    constructor(options) {
        this.options = options;
        this.detector = new LanguageDetector(this.options.detection);
    }
    /**
     * Detect the current locale by following the order defined in the
     * `detection.order` option.
     * By default the order is
     * - searchParams
     * - cookie
     * - session
     * - header
     * And finally the fallback language.
     */
    async getLocale(request) {
        return this.detector.detect(request);
    }
    /**
     * Get the namespaces required by the routes which are going to be rendered
     * when doing SSR.
     *
     * @param context The EntryContext object received by `handleRequest` in entry.server
     *
     * @example
     * await instance.init({
     *   ns: i18n.getRouteNamespaces(context),
     *   // ...more options
     * });
     */
    getRouteNamespaces(context) {
        let namespaces = Object.values(context.routeModules).flatMap((route) => {
            if (typeof route?.handle !== "object")
                return [];
            if (!route.handle)
                return [];
            if (!("i18n" in route.handle))
                return [];
            if (typeof route.handle.i18n === "string")
                return [route.handle.i18n];
            if (Array.isArray(route.handle.i18n) &&
                route.handle.i18n.every((value) => typeof value === "string")) {
                return route.handle.i18n;
            }
            return [];
        });
        return [...new Set(namespaces)];
    }
    async getFixedT(requestOrLocale, namespaces, options = {}) {
        let [instance, locale] = await Promise.all([
            this.createInstance({ ...this.options.i18next, ...options }),
            typeof requestOrLocale === "string"
                ? requestOrLocale
                : this.getLocale(requestOrLocale),
        ]);
        await instance.changeLanguage(locale);
        if (namespaces)
            await instance.loadNamespaces(namespaces);
        else if (instance.options.defaultNS) {
            await instance.loadNamespaces(instance.options.defaultNS);
        }
        else
            await instance.loadNamespaces("translation");
        return instance.getFixedT(locale, namespaces, options?.keyPrefix);
    }
    async createInstance(options = {}) {
        let instance = createInstance();
        let plugins = [
            ...(this.options.backend ? [this.options.backend] : []),
            ...(this.options.plugins || []),
        ];
        for (const plugin of plugins)
            instance.use(plugin);
        await instance.init(options);
        return instance;
    }
}
export { LanguageDetector };
//# sourceMappingURL=server.js.map