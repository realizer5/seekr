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

function getImagesFromHTML(html: string, baseURL: string): string[] {
    const images: string[] = [];
    const dom = new JSDOM(html);
    const imgElements = dom.window.document.querySelectorAll("img");
    for (const imgElement of imgElements) {
        if (imgElement.src.startsWith("/")) {
            try {
                const urlObj = new URL(baseURL + imgElement.src);
                images.push(urlObj.href);
            } catch (error) {
                if (error instanceof Error) {
                    console.warn(`error with relative url: ${error.message}`);
                }
                console.warn(`error with relative url: ${error}`);
            }
        } else {
            try {
                const urlObj = new URL(imgElement.src);
                images.push(urlObj.href);
            } catch (error) {
                if (error instanceof Error) {
                    console.warn(`error with absolute url: ${error.message}`);
                }
                console.warn(`error with absolute url: ${error}`);
            }
        }
    }
    return images;
}

type ExtractedPageData = {
    url: string;
    heading: string;
    first_paragraph: string;
    outgoing_links: string[];
    image_urls: string[];
};

function extractPageData(html: string, pageURL: string): ExtractedPageData {
    const url = pageURL;
    const heading = getH1FromHTML(html);
    const first_paragraph = getFirstParagraphFromHTML(html);
    const outgoing_links = getURLsFromHTML(html, url);
    const image_urls = getImagesFromHTML(html, url);
    return { url, heading, first_paragraph, outgoing_links, image_urls };
}

export {
    normalizeURL,
    getH1FromHTML,
    getFirstParagraphFromHTML,
    getURLsFromHTML,
    getImagesFromHTML,
    extractPageData,
};
