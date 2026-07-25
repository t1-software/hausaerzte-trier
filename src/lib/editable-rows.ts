export interface EditableRow {
    id: number;
    cells: string[];
}

let rowIdCounter = 0;

export function nextRowId(): number {
    rowIdCounter += 1;
    return rowIdCounter;
}

export function toRows(source: string[][], columns: number): EditableRow[] {
    return source.map((row) => ({
        id: nextRowId(),
        cells: Array.from({ length: columns }, (_, index) => row[index] ?? ""),
    }));
}

export function cellsOf(rows: EditableRow[]): string[][] {
    return rows.map((row) => [...row.cells]);
}

export function isDirty(rows: EditableRow[], baseline: string[][]): boolean {
    return JSON.stringify(cellsOf(rows)) !== JSON.stringify(baseline);
}

export function moveRow(rows: EditableRow[], from: number, to: number): EditableRow[] {
    if (from === to || from < 0 || to < 0 || from >= rows.length || to >= rows.length) {
        return rows;
    }

    const next = [...rows];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    return next;
}
