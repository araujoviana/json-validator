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
                return "cool";
            }
            return "";
        }
    };

    // REVIEW too many splits

    function keyInQuotes(pair: string): string | null {
        const key: string = pair.split(",")[0].trim(); // Extract and trim the key
        return surroundedBy(key) === '"'
            ? null
            : `Key ${key} isn't surrounded by double quotes.`;
    }

    function valueIsValidDataType(pair: string): string {
        const value: string = pair.split(",")[0];
        switch (surroundedBy(value)) {
            case '"': // String
                // TODO check for double quotes INSIDE the string
                return `${value} is a valid string.`;
                case '{}':
                return `${value} is a valid object.`
        }

        return "";
    }

    function surroundedBy(str: string): string | null {
        const surrounds = ["'", "{", "["];

        let surroundedWith = surrounds.find(
            (surround) => str.trim().startsWith(surround) && str.endsWith(surround),
        );

        return surroundedWith || null;
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
