<script lang="ts">
    import { textareaValue } from "./store";
    import { hasErrors, formatJSON } from "./json-utils";

    /**
     * Copies the formatted JSON text to the system clipboard.
     *
     * @remarks This function utilizes the Clipboard API to write the formatted text.
     *
     * @throws Will catch and handle any errors that occur during the copy operation.
     */
    function copyText(): void {
        navigator.clipboard
            .writeText(formatJSON($textareaValue))
            .then(() => {
                alert("Text copied to clipboard!");
            })
            .catch(() => {
                alert("Failed to copy text.");
            });
    }

    $: {
        console.log("RESULT REPORTS", hasErrors($textareaValue), $textareaValue);
    }
</script>

<div class="inspector-success-area block">
    {#if !hasErrors($textareaValue)}
        <article class="message is-success">
            <div class="message-header">
                <p>Validation Successful!</p>
                <button class="button is-small copy-button" onclick={copyText}>
                    Copy Text
                </button>
            </div>
            <div class="message-body">
                <pre>{formatJSON($textareaValue)}</pre>
            </div>
        </article>
    {/if}
</div>
