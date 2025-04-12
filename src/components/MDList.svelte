<script>
    export let ordered;
    export let start;
</script>

{#if ordered}
    <ol {start}><slot /></ol>
{:else}
    <ul class="list-disc list-inside"><slot /></ul>
{/if}
