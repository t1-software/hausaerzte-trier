import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async () => {
    try {
        const request = await fetch(
            "https://docs.google.com/spreadsheets/d/e/2PACX-1vTFZGNUxP7dSQoxkfsBJ7Kvj_Sllm2Lw7M2K_7YKdfhXKhIQRtbiXcNcET8qRvNAS-4yUEO3F_ZK1H-/pub?gid=0&single=true&output=tsv"
        );
        const data = await request.text();
        const lines = data.split("\n");
        const headers = lines[0].split("\t").map((h) => h.replaceAll("\r", ""));

        const headersWithPos: { header: string; from: number; to: number }[] = headers
            .map((h, idx) => ({ header: h, from: idx, to: idx }))
            .filter((h) => h.header !== "");

        headersWithPos.forEach((header, idx) => {
            if (idx < headersWithPos.length - 1) {
                header.to = headersWithPos[idx + 1].from - 1;
            } else {
                header.to = headers.length - 1;
            }
        });

        const result: Record<string, string[][]> = {};

        headersWithPos.forEach((header) => {
            if (header.header === "Neuigkeiten") {
                result[header.header] = lines
                    .slice(1)
                    .map((line) => line.split("\t").slice(header.from, header.to + 1));
            } else {
                result[header.header] = lines
                    .slice(1)
                    .map((line) => line.split("\t").slice(header.from, header.to + 1))
                    .filter((line) => line.some((cell) => cell !== ""));
            }
        });

        return {
            content: result,
        };
    } catch (error) {
        console.error("Failed to load content:", error);
        return {
            content: {},
        };
    }
};
