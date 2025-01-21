<script lang="ts">
    // This component is responsible for guiding the user to fix the errors on their JSON
    import { textareaValue } from "./store";

    // JSON Common errors
    const evalSplitJSON = () => {
        try {
            return JSON.parse($textareaValue); // TODO make this readable
        } catch (e: any) {
            const splitJSON = $textareaValue
                .slice(1, $textareaValue.length - 1)
                .split(",");

            if (splitJSON.map(keyInQuotes).join()) {
            }
            return "";
        }
    };

    function keyInQuotes(pair: string): string {
        const key: string = pair.split(",")[0].trim(); // Extract and trim the key
        return key.startsWith('"') && key.endsWith('"')
            ? ""
            : `Key ${key} isn't surrounded by double quotes.`;
    }

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
