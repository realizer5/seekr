import {
    extractPageData,
    getFirstParagraphFromHTML,
    getH1FromHTML,
    getImagesFromHTML,
    getURLsFromHTML,
    normalizeURL,
    removeTrailingSlash,
} from "./crawl";
import { expect, test } from "vitest";

test("normalizeURL strip protocol, trailing slash and capital letters", () => {
    const links = [
        "https://blog.boot.dev/path/",
        "https://blog.boot.dev/path",
        "http://blog.boot.dev/path/",
        "http://blog.boot.dev/path",
        "http://Blog.boot.dev/path",
    ];
    const expected = "blog.boot.dev/path";
    links.forEach((link) => {
        const actual = normalizeURL(link);
        expect(actual).toEqual(expected);
    });
});

test("removeTrailingSlash trailing slash and capital letters", () => {
    const links = [
        "https://blog.boot.dev/path/",
        "https://blog.boot.dev/path",
        "https://blog.boot.dev/path/",
    ];
    const expected = "https://blog.boot.dev/path";
    links.forEach((link) => {
        const actual = removeTrailingSlash(link);
        expect(actual).toEqual(expected);
    });
});

test("getH1FromHTML get first h1 tag", () => {
    const inputBody = `<html><body><h1>Test Title</h1><h1>Test Title 2</h1></body></html>`;
    const expected = "Test Title";
    const actual = getH1FromHTML(inputBody);
    expect(actual).toEqual(expected);
});

test("getH1FromHTML get empty string when no h1 tag", () => {
    const html = `<html><body></body></html>`;
    const expected = "";
    const actual = getH1FromHTML(html);
    expect(actual).toEqual(expected);
});

test("getFirstParagraphFromHTML get first p tag in main tag", () => {
    const inputBody = `<html><body><p>Outside paragraph.</p><main><p>Main paragraph.</p></main></body></html>`;
    const expected = "Main paragraph.";
    const actual = getFirstParagraphFromHTML(inputBody);
    expect(actual).toEqual(expected);
});

test("getFirstParagraphFromHTML get fallback p tag text content when no p tag in main", () => {
    const html = `<html><body><p>Outside paragraph.</p><main></main></body></html>`;
    const expected = "Outside paragraph.";
    const actual = getFirstParagraphFromHTML(html);
    expect(actual).toEqual(expected);
});

test("getURLsFromHTML absolute and relative", () => {
    const inputURL = "https://blog.boot.dev";
    const inputBody = [
        `<html><body><a href="/path/one"><span>Boot.dev</span></a> <a href="https://blog.boot.dev/path/two"><span>Boot.dev</span></a> </body></html>`,
        `<html><body><a href="https://blog.boot.dev/path/one"><span>Boot.dev</span></a> <a href="/path/two"><span>Boot.dev</span></a> </body></html>`,
    ];
    const expected = [
        "https://blog.boot.dev/path/one",
        "https://blog.boot.dev/path/two",
    ];
    inputBody.forEach((html) => {
        const actual = getURLsFromHTML(html, inputURL);
        expect(actual).toEqual(expected);
    });
});

test("getURLsFromHTML invalid", () => {
    const inputURL = "https://blog.boot.dev";
    const inputBody = `<html><body><a href=""><span>Boot.dev</span></a></body></html>`;
    const expected: string[] = [];
    const actual = getURLsFromHTML(inputBody, inputURL);
    expect(actual).toEqual(expected);
});

test("getImagesFromHTML absolute and relative", () => {
    const inputURL = "https://blog.boot.dev";
    const inputBody = [
        `<html><body><img src="/path/one.png"><span>Boot.dev</span> <img src="https://blog.boot.dev/path/two.jpg"><span>Boot.dev</span></body></html>`,
        `<html><body><img src="https://blog.boot.dev/path/one.png"><span>Boot.dev</span> <img src="/path/two.jpg"><span>Boot.dev</span></body></html>`,
    ];
    const expected = [
        "https://blog.boot.dev/path/one.png",
        "https://blog.boot.dev/path/two.jpg",
    ];
    inputBody.forEach((html) => {
        const actual = getImagesFromHTML(html, inputURL);
        expect(actual).toEqual(expected);
    });
});

test("getImagesFromHTML invalid", () => {
    const inputURL = "https://blog.boot.dev";
    const inputBody = `<html><body><img src=""><span>Boot.dev</span></body></html>`;
    const expected: string[] = [];
    const actual = getImagesFromHTML(inputBody, inputURL);
    expect(actual).toEqual(expected);
});

test("extractPageData basic", () => {
    const inputURL = "https://crawler-test.com";
    const normalizedURL = normalizeURL(inputURL);
    const inputBody = `
    <html><body>
      <h1>Test Title</h1>
      <p>This is the first paragraph.</p>
      <a href="/link1">Link 1</a>
      <img src="/image1.jpg" alt="Image 1">
    </body></html>
  `;

    const actual = extractPageData(inputBody, inputURL, normalizedURL);
    const expected = {
        url: "crawler-test.com",
        heading: "Test Title",
        first_paragraph: "This is the first paragraph.",
        outgoing_links: ["https://crawler-test.com/link1"],
        image_urls: ["https://crawler-test.com/image1.jpg"],
    };

    expect(actual).toEqual(expected);
});

test("extractPageData with main p", () => {
    const inputURL = "https://crawler-test.com";
    const normalizedURL = normalizeURL(inputURL);
    const inputBody = `
    <html><body>
      <h1>Test Title</h1>
      <p>This is the first paragraph.</p>
      <main><p>Main paragraph</p></main>
      <a href="/link1">Link 1</a>
      <img src="/image1.jpg" alt="Image 1">
    </body></html>
  `;

    const actual = extractPageData(inputBody, inputURL, normalizedURL);
    const expected = {
        url: "crawler-test.com",
        heading: "Test Title",
        first_paragraph: "Main paragraph",
        outgoing_links: ["https://crawler-test.com/link1"],
        image_urls: ["https://crawler-test.com/image1.jpg"],
    };

    expect(actual).toEqual(expected);
});

test("extractPageData invalid link", () => {
    const inputURL = "https://crawler-test.com";
    const normalizedURL = normalizeURL(inputURL);
    const inputBody = `
    <html><body>
      <h1>Test Title</h1>
      <p>This is the first paragraph.</p>
      <a href="">Link 1</a>
      <img src="" alt="Image 1">
    </body></html>
  `;

    const actual = extractPageData(inputBody, inputURL, normalizedURL);
    const expected = {
        url: "crawler-test.com",
        heading: "Test Title",
        first_paragraph: "This is the first paragraph.",
        outgoing_links: [],
        image_urls: [],
    };

    expect(actual).toEqual(expected);
});
