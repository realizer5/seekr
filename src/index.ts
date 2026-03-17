import { argv } from "node:process";
import { getHTML, getURLsFromHTML, normalizeURL } from "./crawl";

async function main() {
    if (argv.length !== 3) {
        console.error("Error: You must provide exactly one URL to scrape.");
        console.info("Usage: npm run start <url>");
        process.exit(1);
    }
    process.exit(0);
}

main();

async function crawlPage(
    baseURL: string,
    currentURL: string = baseURL,
    pages: Record<string, number> = {},
) {
    if (!currentURL.startsWith(baseURL)) return pages;
    const normalizedCurrentURL = normalizeURL(currentURL);
    pages[normalizedCurrentURL] = (pages[normalizedCurrentURL] ?? 0) + 1;
    console.log(`Scraping html from ${currentURL}`);
    try {
        const html = await getHTML(currentURL);
        if (!html) throw new Error(`Error getting html`);
        const urls = getURLsFromHTML(html, baseURL);
        return pages;
    } catch (error) {
        console.error(error);
    }
}
