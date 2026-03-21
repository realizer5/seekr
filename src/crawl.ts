import { URL } from "node:url";
import { JSDOM } from "jsdom";

function normalizeURL(url: string): string {
    const urlObj = new URL(url);
    const result = urlObj.host + urlObj.pathname;
    if (result.slice(-1) === "/") {
        return result.slice(0, -1);
    }
    return result;
}

function removeTrailingSlash(url: string): string {
    try {
        const urlObj = new URL(url);
        const result = urlObj.href;
        return result.endsWith("/") ? result.slice(0, -1) : result;
    } catch (error) {
        console.error(`Error normalizing URL ${url}`, error);
        return "";
    }
}

function getH1FromHTML(html: string): string {
    const dom = new JSDOM(html);
    const headingText = dom.window.document.querySelector("h1")?.textContent;
    if (headingText) {
        return headingText;
    }
    return "";
}

function getFirstParagraphFromHTML(html: string): string {
    const dom = new JSDOM(html);
    const paraText =
        dom.window.document.querySelector("main p")?.textContent ??
        dom.window.document.querySelector("p")?.textContent;
    if (paraText) {
        return paraText;
    }
    return "";
}

function getURLsFromHTML(html: string, baseURL: string): string[] {
    const urls: string[] = [];
    const dom = new JSDOM(html);
    const linkElements = dom.window.document.querySelectorAll("a");
    for (const linkElement of linkElements) {
        try {
            const href = linkElement.getAttribute("href");
            if (!href) continue;
            const urlObj = new URL(href, baseURL);
            const url = removeTrailingSlash(urlObj.href);
            if (urls.includes(url)) continue;
            urls.push(url);
        } catch (error) {
            console.warn(`error with getting url: ${error}`);
        }
    }
    return urls;
}

function getImagesFromHTML(html: string, baseURL: string): string[] {
    const images: string[] = [];
    const dom = new JSDOM(html);
    const imgElements = dom.window.document.querySelectorAll("img");
    for (const imgElement of imgElements) {
        const src = imgElement.getAttribute("src");
        if (!src) continue;
        const urlObj = new URL(src, baseURL);
        const url = removeTrailingSlash(urlObj.href);
        if (images.includes(url)) continue;
        images.push(url);
    }
    return images;
}

export type ExtractedPageData = {
    url: string;
    heading: string;
    first_paragraph: string;
    outgoing_links: string[];
    image_urls: string[];
};

function extractPageData(
    html: string,
    baseURL: string,
    nromalizedURL: string,
): ExtractedPageData {
    const url = nromalizedURL;
    const heading = getH1FromHTML(html);
    const first_paragraph = getFirstParagraphFromHTML(html);
    const outgoing_links = getURLsFromHTML(html, baseURL);
    const image_urls = getImagesFromHTML(html, baseURL);
    return { url, heading, first_paragraph, outgoing_links, image_urls };
}
export {
    normalizeURL,
    removeTrailingSlash,
    getH1FromHTML,
    getFirstParagraphFromHTML,
    getURLsFromHTML,
    getImagesFromHTML,
    extractPageData,
};
