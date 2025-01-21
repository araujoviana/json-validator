<script lang="ts">
    // This component is responsible for guiding the user to fix the errors on their JSON
    import { textareaValue } from "./store";

    type Predicate<T> = (value: any) => boolean;

    // JSON Common errors
    const evalSplitJSON = () => {
        try {
            return JSON.parse($textareaValue); // TODO make this readable
        } catch (e: any) {
            const splitJSON = $textareaValue
                .slice(1, $textareaValue.length - 1)
                .split(",");

            return splitJSON
                .map(keyInQuotes)
                .concat(splitJSON.map(valueIsValidDataType));
        }
    };

    // REVIEW too many splits

    function keyInQuotes(pair: string): string | null {
        const key: string = pair.split(":")[0].trim(); // Extract and trim the key
        return surroundedBy(key) === '"'
            ? null
            : `Key ${key ? key : "empty key"} isn't surrounded by double quotes.`;
    }

function valueIsValidDataType(pair: string): string | null {
    const value: string = pair.split(":")[1].trim();
    const surrounding = surroundedBy(value);
    const type = surrounding ? surrounding : checkValue(value);

    switch (type) {
        case "{}":
            return `${value} is a valid object.`;
        case "[]":
            return `${value} is a valid list`;
        case "string":
            return `${value} is a valid string`;
        case "number":
            return `${value} is a valid number`;
        case "boolean":
            return `${value} is a valid boolean`;
        case "null":
            return `${value} is a valid null`;
        default:
            return null;
    }
}

    function surroundedBy(str: string): string | null {
        const encloses = ["{}", "[]", "''", '""'];

        // Check if the string is surrounded by matching pairs
        for (let pair of encloses) {
            const open = pair[0];
            const close = pair[1];

            if (str.trim().startsWith(open) && str.trim().endsWith(close)) {
                return pair;
            }
        }

        return null;
    }

    const checkValue = (value: string) => {
        const predicates: [Predicate<any>, string][] = [
            [isNull, "null"],
            [isBoolean, "boolean"],
            [isNumber, "number"],
            [isInvalid, "invalid"],
        ];

        return predicates.find(([pred]) => pred(value))?.[1] ?? "invalid";
    };

    // TODO put this somewhere else
    const isString: Predicate<any> = (value) => typeof value === "string";
    const isNull: Predicate<any> = (value) => value === null;
    const isBoolean: Predicate<any> = (value) => typeof value === "boolean";
    const isNumber: Predicate<any> = (value) => typeof value === "number";
    const isInvalid: Predicate<any> = () => true;
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
