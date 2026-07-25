import { writable } from "svelte/store";

/**
 * Ziehen und Ablegen zum Sortieren von Zeilenlisten und Kartenrastern.
 * Der Eintrag wird bereits beim Überfahren eines Ziels verschoben, damit die
 * neue Reihenfolge während des Ziehens sichtbar ist. Ein abgebrochener Vorgang
 * stellt die Ausgangsreihenfolge wieder her.
 */
const moveCooldown = 220;

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

        if (index === current || !crossedMidpoint(event)) {
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
     * Erst tauschen, wenn der Zeiger die Mitte des Ziels überschritten hat —
     * sonst springt der Eintrag zwischen zwei Positionen hin und her.
     * In Rastern zählt die Achse, auf der Ziel und gezogenes Element auseinanderliegen:
     * Nachbarn in derselben Zeile werden an der horizontalen Mitte gemessen,
     * alle anderen an der vertikalen.
     */
    function crossedMidpoint(event: DragEvent): boolean {
        const target = event.currentTarget as HTMLElement | null;

        if (!target) {
            return true;
        }

        const targetBox = target.getBoundingClientRect();
        const sourceBox = document.querySelector(".row-dragging")?.getBoundingClientRect();

        if (!sourceBox) {
            return true;
        }

        const deltaX = targetBox.left + targetBox.width / 2 - (sourceBox.left + sourceBox.width / 2);
        const deltaY = targetBox.top + targetBox.height / 2 - (sourceBox.top + sourceBox.height / 2);

        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            const midpoint = targetBox.left + targetBox.width / 2;
            return deltaX > 0 ? event.clientX >= midpoint : event.clientX <= midpoint;
        }

        const midpoint = targetBox.top + targetBox.height / 2;
        return deltaY > 0 ? event.clientY >= midpoint : event.clientY <= midpoint;
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

    /** Tastatur-Alternative: Alt + Pfeiltasten verschieben den Eintrag. */
    function handleKeydown(event: KeyboardEvent, index: number) {
        const step =
            event.key === "ArrowUp" || event.key === "ArrowLeft"
                ? -1
                : event.key === "ArrowDown" || event.key === "ArrowRight"
                  ? 1
                  : 0;

        if (!event.altKey || step === 0) {
            return;
        }

        event.preventDefault();
        apply(index, index + step);
    }

    function reset() {
        current = null;
        origin = null;
        dragIndex.set(null);
    }

    return { dragIndex, handleDragStart, handleDragOver, handleDrop, handleDragEnd, handleKeydown };
}
