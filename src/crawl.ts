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
    const paraText = dom.window.document.querySelector("main p")?.textContent;
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
        if (linkElement.href.startsWith("/")) {
            try {
                const urlObj = new URL(baseURL + linkElement.href);
                urls.push(urlObj.href);
            } catch (error) {
                if (error instanceof Error) {
                    console.warn(`error with relative url: ${error.message}`);
                }
                console.warn(`error with relative url: ${error}`);
            }
        } else {
            try {
                const urlObj = new URL(linkElement.href);
                urls.push(urlObj.href);
            } catch (error) {
                if (error instanceof Error) {
                    console.warn(`error with absolute url: ${error.message}`);
                }
                console.warn(`error with absolute url: ${error}`);
            }
        }
    }
    return urls;
}

export {
    normalizeURL,
    getH1FromHTML,
    getFirstParagraphFromHTML,
    getURLsFromHTML,
};
