// Type definitions for MyNovelReader

// Global jQuery instance (provided by userscript manager)
declare const $: JQueryStatic;

// Greasemonkey/Tampermonkey API
declare function GM_getValue<T>(key: string, defaultValue?: T): T;
declare function GM_setValue<T>(key: string, value: T): void;
declare function GM_addStyle(css: string): void;
declare function GM_openInTab(url: string, openInBackground?: boolean): void;
declare function GM_registerMenuCommand(name: string, onClick: () => void): void;
declare function GM_getClipboard(): string;
declare function GM_setClipboard(text: string, type?: string): void;

// MyNovelReader specific types
declare module MyNovelReader {
    interface SiteConfig {
        siteName?: string;
        url: string | RegExp;
        exclude?: string;
        enable?: boolean;
        titleReg?: string | RegExp;
        titlePos?: number;
        titleSelector?: string | string[] | ((jQuery: JQueryStatic) => string);
        bookTitleSelector?: string | string[] | ((jQuery: JQueryStatic) => string);
        bookTitleReplace?: string | RegExp;
        chapterTitleReplace?: string | RegExp;
        indexSelector?: string | false | ((jQuery: JQueryStatic) => string);
        prevSelector?: string | false | ((jQuery: JQueryStatic) => string);
        nextSelector?: string | false | ((jQuery: JQueryStatic) => string);
        contentSelector?: string;
        contentRemove?: string;
        contentReplace?: string | RegExp | Array<string | RegExp>;
        contentHandle?: boolean;
        useRawContent?: boolean;
        fixImage?: boolean;
        useiframe?: boolean;
        useSiteFont?: boolean | string;
        withReferer?: boolean;
        nDelay?: number;
        timeout?: number;
        fastboot?: boolean;
        mutationSelector?: string;
        mutationChildCount?: number;
        mutationChildText?: string;
        mutationCheck?: (jQuery: JQueryStatic) => boolean;
        startLaunch?: (jQuery: JQueryStatic) => void;
        startFilter?: () => void;
        fInit?: () => void;
        isVipChapter?: (jQuery: JQueryStatic) => boolean;
        getContent?: (jQuery: JQueryStatic, callback: (data: { content?: string; html?: string }) => void) => void;
        contentPatch?: (jQuery: JQueryStatic) => void;
        contentPatchAsync?: (jQuery: JQueryStatic) => Promise<void>;
        handleContentText?: (node: HTMLElement, info: SiteConfig) => string;
        style?: string;
        iframeSandbox?: string;
    }

    interface SiteConfigs extends Array<SiteConfig> {}
}

// Utility types
declare type Nullable<T> = T | null | undefined;