<script lang="ts">
    import { textareaValue } from "./store";
    import { hasErrors, formatJSON } from "./json-utils";

    $: console.log("SUCCESSFUL VALIDATION", formatJSON($textareaValue));
</script>

<div class="inspector-success-area block">
    {#if !hasErrors($textareaValue)}
        <article class="message is-success">
            <div class="message-header">
                <p>Validation Successful!</p>
            </div>
            <div class="message-body">
                <pre>{formatJSON($textareaValue)}</pre>
            </div>
        </article>
    {/if}
</div>
