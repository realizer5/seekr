import {
    getFirstParagraphFromHTML,
    getH1FromHTML,
    getURLsFromHTML,
    normalizeURL,
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

test("getH1FromHTML get first h1 tag", () => {
    const inputBody = `<html><body><h1>Test Title</h1><h1>Test Title 2</h1></body></html>`;
    const expected = "Test Title";
    const actual = getH1FromHTML(inputBody);
    expect(actual).toEqual(expected);
});

test("getFirstParagraphFromHTML get first p tag in main tag", () => {
    const inputBody = `<html><body><p>Outside paragraph.</p><main><p>Main paragraph.</p></main></body></html>`;
    const expected = "Main paragraph.";
    const actual = getFirstParagraphFromHTML(inputBody);
    expect(actual).toEqual(expected);
});

test("getH1FromHTML get empty string when no h1 tag", () => {
    const html = `<html><body></body></html>`;
    const expected = "";
    const actual = getH1FromHTML(html);
    expect(actual).toEqual(expected);
});

test("getFirstParagraphFromHTML get empty string when no p tag in main", () => {
    const html = `<html><body><p>Outside paragraph.</p><main></main></body></html>`;
    const expected = "";
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
    const inputBody = `<html><body><a href="invalid"><span>Boot.dev</span></a></body></html>`;
    const expected: string[] = [];
    const actual = getURLsFromHTML(inputBody, inputURL);
    expect(actual).toEqual(expected);
});
