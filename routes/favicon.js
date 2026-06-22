import express from "express";
import { URL } from "url";
import { load } from "cheerio";

const router = express.Router();

// Simple in-memory cache with TTL
const CACHE_TTL_MS = (parseInt(process.env.FAVICON_CACHE_TTL || "3600", 10) || 3600) * 1000;
const CACHE_MAX_ITEMS = parseInt(process.env.FAVICON_CACHE_MAX_ITEMS || "1000", 10) || 1000;
const faviconCache = new Map();

function setCache(key, value) {
    try {
        faviconCache.set(key, { value, expires: Date.now() + CACHE_TTL_MS });
        // simple eviction of oldest entries
        if (faviconCache.size > CACHE_MAX_ITEMS) {
            const firstKey = faviconCache.keys().next().value;
            if (firstKey) faviconCache.delete(firstKey);
        }
    } catch (e) {
        // ignore cache errors
    }
}

function getCache(key) {
    const entry = faviconCache.get(key);
    if (!entry) return null;
    if (entry.expires < Date.now()) {
        faviconCache.delete(key);
        return null;
    }
    return entry.value;
}

function selectBestIcon($, baseUrl) {
    const selectors = [
        "link[rel='icon']",
        "link[rel='shortcut icon']",
        "link[rel='apple-touch-icon']",
        "link[rel='apple-touch-icon-precomposed']",
        "link[rel*='icon']"
    ];

    for (let sel of selectors) {
        const el = $(sel).first();
        if (el && el.attr) {
            const href = el.attr("href");
            if (href) {
                try {
                    return new URL(href, baseUrl).toString();
                } catch (e) {
                    continue;
                }
            }
        }
    }

    // Try to find any link with rel containing icon
    const any = $("link").filter((i, el) => {
        const rel = $(el).attr("rel") || "";
        return /icon/i.test(rel);
    }).first();

    if (any && any.attr) {
        const href = any.attr("href");
        if (href) {
            try {
                return new URL(href, baseUrl).toString();
            } catch (e) {}
        }
    }

    return null;
}

const PRODUCT_ICONS = {
    excel: "https://static2.sharepointonline.com/files/fabric/assets/brand-icons/product/png/excel_48x1.png",
    sharepoint: "https://static2.sharepointonline.com/files/fabric/assets/brand-icons/product/png/sharepoint_48x1.png",
    microsoft: "https://static2.sharepointonline.com/files/fabric/assets/brand-icons/product/png/microsoft_48x1.png"
};

function isExcelUrl(parsed) {
    const href = parsed.href.toLowerCase();

    // Detect direct Excel file links or SharePoint/OneDrive Excel viewers.
    const excelFilePattern = /\.(xlsx|xls|xlsm|xltx|xlsb|csv|ods)(?:$|[\?&#\/])/i;
    const excelUrlPattern = /(^|\.)excel\.|office\.com.*excel|onedrive\.live\.com.*excel|\/(_layouts\/15\/wopiframe\.aspx|_layouts\/15\/xlviewer\.aspx|_layouts\/15\/doc\.aspx)|\/:x:\/(?:r|p)\//i;

    return excelFilePattern.test(href) || excelUrlPattern.test(href);
}

function getMicrosoftIcon(parsed) {
    const hostname = parsed.hostname.toLowerCase();
    const href = parsed.href.toLowerCase();

    if (isExcelUrl(parsed)) {
        return PRODUCT_ICONS.excel;
    }

    if (hostname.includes("sharepoint") || href.includes("sharepoint.")) {
        return PRODUCT_ICONS.sharepoint;
    }

    if (hostname.includes("microsoft") || hostname.includes("office.com") || hostname.includes("microsoftonline.com") || hostname.includes("azure.com") || hostname.includes("visualstudio.com") || hostname.includes("teams.microsoft.com") || hostname.includes("onedrive.com") || hostname.includes("outlook.com") || hostname.includes("powerbi.com") || hostname.includes("dynamics.com")) {
        return PRODUCT_ICONS.microsoft;
    }

    return null;
}

router.get("/", async (req, res) => {
    const target = req.query.url;

    if (!target) {
        return res.status(400).json({ error: "Missing url parameter" });
    }

    try {
        // return cached result when available
        const cached = getCache(target);
        if (cached) return res.json({ url: cached, cached: true });

        const parsed = new URL(target);

        // If the URL matches Excel / SharePoint / Microsoft patterns, return a product icon immediately
        const msIcon = getMicrosoftIcon(parsed);
        if (msIcon) {
            setCache(target, msIcon);
            return res.json({ url: msIcon, source: "product" });
        }

        // Fetch HTML of target page with a short timeout
        const response = await fetch(parsed.toString(), { redirect: 'follow', timeout: 5000 });

        if (!response.ok) {
            // fallback to favicon.ico
            const ico = `${parsed.origin}/favicon.ico`;
            setCache(target, ico);
            return res.json({ url: ico });
        }

        const html = await response.text();

        const $ = load(html);

        let iconUrl = selectBestIcon($, parsed.origin);

        if (!iconUrl) {
            // try with base set to page URL
            iconUrl = selectBestIcon($, parsed.toString());
        }

        if (!iconUrl) {
            // default fallback
            iconUrl = `${parsed.origin}/favicon.ico`;
        }

        setCache(target, iconUrl);

        return res.json({ url: iconUrl });

    } catch (err) {
        try {
            const parsed = new URL(target);
            const ico = `${parsed.origin}/favicon.ico`;
            setCache(target, ico);
            return res.json({ url: ico });
        } catch (e) {
            // final fallback to google s2 using the host from the param
            const fallback = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(target)}&sz=64`;
            setCache(target, fallback);
            return res.json({ url: fallback });
        }
    }
});

export default router;
