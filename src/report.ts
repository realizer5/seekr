import { resolve } from "node:path";
import { ExtractedPageData } from "./crawl";
import { cwd } from "node:process";
import { writeFileSync } from "node:fs";

export function writeJSONReport(
    pageData: Record<string, ExtractedPageData>,
    filename = "report.json",
): void {
    const sorted = Object.values(pageData).sort((a, b) =>
        a.url.localeCompare(b.url),
    );
    const data = JSON.stringify(sorted, null, 2);
    const path = resolve(cwd(), filename);
    writeFileSync(path, data);
}
