import { normalizeURL } from "./crawl";
import { expect, test } from "vitest";

test("normalizeURL", () => {
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
