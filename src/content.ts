import { writable, type Writable } from "svelte/store";

export const times = [
    { day: "Montag", time: "8:00-12:00 Uhr, 16:00-19:00 Uhr" },
    { day: "Dienstag", time: "8:00-12:00 Uhr, Nachmittags: nur nach Vereinbarung" },
    { day: "Mittwoch", time: "8:00-12:00 Uhr" },
    { day: "Donnerstag", time: "8:00-12:00 Uhr, Nachmittags: nur nach Vereinbarung" },
    { day: "Freitag", time: "8:00-12:00 Uhr" },
];

export const vacations: { from: string; to: string }[] = [];
//export const vacations = [{ from: "16.10.2023", to: "27.10.2023" }];
//export const news: string = "";
export const news: string = "Wir machen Urlaub vom 20.05 - 31.05.2024.";

export type Content = Record<string, string[][]>;

export async function getData() {
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

    const result: Content = {};

    headersWithPos.forEach((header) => {
        if (header.header === "Neuigkeiten") {
            result[header.header] = lines.slice(1).map((line) => line.split("\t").slice(header.from, header.to + 1));
        } else {
            result[header.header] = lines
                .slice(1)
                .map((line) => line.split("\t").slice(header.from, header.to + 1))
                .filter((line) => line.some((cell) => cell !== ""));
        }
    });
    content.set(result);
}

export const content: Writable<Content> = writable({});
