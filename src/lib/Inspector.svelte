<script lang="ts">
    // This component is responsible for guiding the user to fix the errors on their JSON
    import { textareaValue } from "./store";

    // JSON Common errors
    const evalSplitJSON = () => {
        try {
            return JSON.parse($textareaValue); // TODO make this readable
        } catch (e: any) {
            let splitJSON = $textareaValue
                .slice(1, $textareaValue.length - 1)
                .split(",");

            return splitJSON;
        }
    };

    const a = "";
</script>

<p>value: {$textareaValue}</p>

<div class="inspector-error-list">
    {#if !$textareaValue.trim()}
        <p>JSON is empty!</p>
    {:else}
        <p>{evalSplitJSON()}</p>
    {/if}
</div>

<style>
</style>
