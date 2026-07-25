import { writable } from "svelte/store";

/**
 * Ziehen und Ablegen zum Sortieren von Zeilenlisten.
 * Die Zeile wird bereits beim Überfahren eines Ziels verschoben, damit die neue
 * Reihenfolge während des Ziehens sichtbar ist. Ein abgebrochener Vorgang
 * stellt die Ausgangsreihenfolge wieder her.
 */
const moveCooldown = 160;

export function createRowDnd(apply: (from: number, to: number) => void) {
    const dragIndex = writable<number | null>(null);
    let current: number | null = null;
    let origin: number | null = null;
    let dropped = false;
    let lastMove = 0;

    function handleDragStart(event: DragEvent, index: number) {
        current = index;
        origin = index;
        dropped = false;
        lastMove = 0;
        dragIndex.set(index);

        if (event.dataTransfer) {
            event.dataTransfer.effectAllowed = "move";
            event.dataTransfer.setData("text/plain", String(index));
        }
    }

    function handleDragOver(event: DragEvent, index: number) {
        if (current === null) {
            return;
        }

        event.preventDefault();

        if (event.dataTransfer) {
            event.dataTransfer.dropEffect = "move";
        }

        if (index === current || !crossedMidpoint(event, index)) {
            return;
        }

        // Solange die Umsortierung noch animiert, keine weitere auslösen.
        const now = performance.now();

        if (now - lastMove < moveCooldown) {
            return;
        }

        lastMove = now;
        apply(current, index);
        current = index;
        dragIndex.set(index);
    }

    /**
     * Erst tauschen, wenn der Zeiger die Mitte der Zielzeile überschritten hat.
     * Ohne diese Schwelle springt die Zeile zwischen zwei Positionen hin und her.
     */
    function crossedMidpoint(event: DragEvent, index: number): boolean {
        const target = event.currentTarget as HTMLElement | null;

        if (!target || current === null) {
            return true;
        }

        const box = target.getBoundingClientRect();
        const midpoint = box.top + box.height / 2;

        return index > current ? event.clientY >= midpoint : event.clientY <= midpoint;
    }

    function handleDrop(event: DragEvent) {
        if (current === null) {
            return;
        }

        event.preventDefault();
        dropped = true;
        reset();
    }

    function handleDragEnd() {
        if (!dropped && current !== null && origin !== null) {
            apply(current, origin);
        }

        reset();
    }

    /** Tastatur-Alternative: Alt + Pfeil hoch/runter verschiebt die Zeile. */
    function handleKeydown(event: KeyboardEvent, index: number) {
        if (!event.altKey || (event.key !== "ArrowUp" && event.key !== "ArrowDown")) {
            return;
        }

        event.preventDefault();
        apply(index, event.key === "ArrowUp" ? index - 1 : index + 1);
    }

    function reset() {
        current = null;
        origin = null;
        dragIndex.set(null);
    }

    return { dragIndex, handleDragStart, handleDragOver, handleDrop, handleDragEnd, handleKeydown };
}
