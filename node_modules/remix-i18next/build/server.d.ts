import { type BackendModule, type DefaultNamespace, type FlatNamespace, type InitOptions, type KeyPrefix, type Module, type Namespace, type NewableModule, type TFunction } from "i18next";
import type { EntryContext } from "react-router";
import { LanguageDetector, type LanguageDetectorOption } from "./lib/language-detector.js";
type FallbackNs<Ns> = Ns extends undefined ? DefaultNamespace : Ns extends Namespace ? Ns : DefaultNamespace;
export interface RemixI18NextOption {
    /**
     * The i18next options used to initialize the internal i18next instance.
     */
    i18next?: Omit<InitOptions, "react" | "detection"> | null;
    /**
     * @deprecated Use `plugins` instead.
     * The i18next backend module used to load the translations when creating a
     * new TFunction.
     */
    backend?: NewableModule<BackendModule<unknown>> | BackendModule<unknown>;
    /**
     * The i18next plugins used to extend the internal i18next instance
     * when creating a new TFunction.
     */
    plugins?: NewableModule<Module>[] | Module[];
    detection: LanguageDetectorOption;
}
export declare class RemixI18Next {
    private options;
    private detector;
    constructor(options: RemixI18NextOption);
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
    getLocale(request: Request): Promise<string>;
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
    getRouteNamespaces(context: EntryContext): string[];
    /**
     * Return a TFunction that can be used to translate strings server-side.
     * This function is fixed to a specific namespace.
     *
     * @param requestOrLocale The request object or the locale string already detected
     * @param namespaces The namespaces to use for the T function. (Default: `translation`).
     * @param options The i18next init options and the key prefix to prepend to translation keys.
     */
    getFixedT<N extends FlatNamespace | readonly [FlatNamespace, ...FlatNamespace[]] = DefaultNamespace, KPrefix extends KeyPrefix<FallbackNs<N>> = undefined>(locale: string, namespaces?: N, options?: Omit<InitOptions, "react"> & {
        keyPrefix?: KPrefix;
    }): Promise<TFunction<FallbackNs<N>, KPrefix>>;
    getFixedT<N extends FlatNamespace | readonly [FlatNamespace, ...FlatNamespace[]] = DefaultNamespace, KPrefix extends KeyPrefix<FallbackNs<N>> = undefined>(request: Request, namespaces?: N, options?: Omit<InitOptions, "react"> & {
        keyPrefix?: KPrefix;
    }): Promise<TFunction<FallbackNs<N>, KPrefix>>;
    private createInstance;
}
export { LanguageDetector };
export type { LanguageDetectorOption };
