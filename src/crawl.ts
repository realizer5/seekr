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
    const htmlBody = new JSDOM(html);
    const h1 = htmlBody.window.document.querySelector("h1");
    return h1;
}

export { normalizeURL };
