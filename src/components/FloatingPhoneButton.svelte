<script lang="ts">
    import { CONTACT_INFO } from "../constants/contact";
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="floating-phone-button" on:click={() => (window.location.href = `tel:${CONTACT_INFO.PHONE}`)}>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="phone-icon">
        <path
            d="M17.707 12.293a.999.999 0 0 0-1.414 0l-1.594 1.594c-.739-.22-2.118-.72-2.992-1.594s-1.374-2.253-1.594-2.992l1.594-1.594a.999.999 0 0 0 0-1.414l-4-4a.999.999 0 0 0-1.414 0L3.581 5.005c-.38.38-.594.902-.586 1.435.023 1.424.4 6.37 4.298 10.268s8.844 4.274 10.269 4.298h.028c.528 0 1.027-.208 1.405-.586l2.712-2.712a.999.999 0 0 0 0-1.414l-4-4.001zm-.127 6.712c-1.248-.021-5.518-.356-8.873-3.712-3.366-3.366-3.692-7.651-3.712-8.874L7 4.414 9.586 7 8.293 8.293a1 1 0 0 0-.272.912c.024.115.611 2.842 2.271 4.502s4.387 2.247 4.502 2.271a.991.991 0 0 0 .912-.271L17 14.414 19.586 17l-2.006 2.005z"
        />
    </svg>
    <div class="phone-number">{CONTACT_INFO.PHONE}</div>
</div>

<style>
    .floating-phone-button {
        position: fixed;
        right: -210px;
        top: 310px;
        width: 270px;
        height: 64px;
        border: 1px solid var(--color-gulfstream-500);
        display: flex;
        align-items: center;
        background-color: var(--color-gulfstream-400);
        transition: right 0.2s ease-in-out;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        cursor: pointer;
        z-index: 1000;
    }

    .floating-phone-button:hover {
        right: 0;
    }

    @media (min-width: 768px) {
        .floating-phone-button {
            top: 410px;
        }
    }

    @media (min-width: 1024px) {
        .floating-phone-button {
            top: 510px;
        }
    }

    .phone-icon {
        width: 32px;
        height: 32px;
        margin-left: 1rem;
        fill: black;
    }

    .phone-number {
        display: flex;
        align-items: center;
        padding-left: 1rem;
        font-size: 1.25rem;
        font-weight: 700;
        color: black;
    }
</style>
