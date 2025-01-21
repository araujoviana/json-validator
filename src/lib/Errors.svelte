<script lang="ts">
    // This component is responsible for guiding the user to fix the errors on their JSON, no warnings.
    import { textareaValue } from "./store";

    type Predicate<T> = (value: any) => boolean;

    const evalSplitJSON = () => {
        try {
            return JSON.parse($textareaValue) ? "This is valid JSON!" : "";
        } catch (e) {
            const trimmedValue = $textareaValue.trim();
            if (surroundedBy(trimmedValue) !== "{}") {
                return ["JSON isn't fully surrounded by curly braces."];
            }

            const errors: string[] = [];
            validateObject(trimmedValue.slice(1, -1), errors);
            return errors;
        }
    };

    const validateObject = (content: string, errors: string[]) => {
        const splitJSON = splitKeyValuePairs(content);

        splitJSON.forEach((pair) => {
            const [key, value] = pair.split(":").map((part) => part.trim());
            const keyError = checkKeyFormat(key);
            const valueError = checkValueType(value);

            if (keyError) errors.push(keyError);
            if (valueError) errors.push(valueError);

            // Handle nested objects or arrays
            if (surroundedBy(value) === "{}") {
                validateObject(value.slice(1, -1), errors);
            } else if (surroundedBy(value) === "[]") {
                validateArray(value.slice(1, -1), errors);
            }
        });

        const misplacedCommasError = misplacedCommas(content.trim());
        if (misplacedCommasError) {
            errors.unshift(misplacedCommasError);
        }
    };

    const validateArray = (content: string, errors: string[]) => {
        const elements = splitArrayElements(content);

        elements.forEach((element) => {
            if (surroundedBy(element) === "{}") {
                validateObject(element.slice(1, -1), errors);
            } else if (surroundedBy(element) === "[]") {
                validateArray(element.slice(1, -1), errors);
            } else {
                const valueError = checkValueType(element.trim());
                if (valueError) errors.push(valueError);
            }
        });
    };

    const splitKeyValuePairs = (content: string): string[] => {
        return content
            .split(",")
            .map((pair) => pair.trim())
            .filter((pair) => pair);
    };

    const splitArrayElements = (content: string): string[] => {
        return content
            .split(",")
            .map((element) => element.trim())
            .filter((element) => element);
    };

    // REVIEW too many splits

    const isNull: Predicate<any> = (value) => value === "null";
    const isBoolean: Predicate<any> = (value) =>
        value === "true" || value === "false";
    const isNumber: Predicate<any> = (value) => !isNaN(Number(value));
    const isString: Predicate<any> = (value) =>
        typeof value === "string" && surroundedBy(value) === '""';
    const isInvalid: Predicate<any> = (value) => true; // Always evaluates to true

    const checkKeyFormat = (key: string) => {
        console.log(key, surroundedBy(key));
        if (surroundedBy(key) !== '""') {
            return `Key '${key}' isn't surrounded by double quotes.`;
        }
        return null;
    };

    const checkValueType = (value: string) => {
        const valueType = checkValue(value); // Get the inferred type of the value

        if (valueType === "invalid") {
            // HACK added 'n' to conform to english grammar
            let possibleType =
                "n undefined or is there an open list or object somewhere";
            if (typeof value === "string") {
                if (value.startsWith("[") || value.endsWith("]")) {
                    // Possible list
                    possibleType = " list, did you forget to close it";
                } else if (value.startsWith("{") || value.endsWith("}")) {
                    // Possible object
                    possibleType = "n object, did you forget to close it";
                } else if (
                    // Possible number
                    value.split(".").every((val) => {
                        console.log(val, "d");
                        return checkValue(val) === "number";
                    })
                ) {
                    possibleType = " number";
                } else {
                    // Possible string
                    possibleType = " string";
                }
            }
            return `${value} is of an invalid type. Is it supposed to be a${possibleType}?`;
        } else null;
    };

    function surroundedBy(str: string): string | null {
        const encloses = ["{}", "[]", "''", '""'];
        const trimmedStr = str.trim();

        for (let pair of encloses) {
            const open = pair[0];
            const close = pair[1];

            if (trimmedStr.startsWith(open) && trimmedStr.endsWith(close)) {
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
            [isString, "string"],
            [isInvalid, "invalid"],
        ];

        return predicates.find(([pred]) => pred(value))?.[1] ?? "invalid";
    };

    const misplacedCommas = (fullJSON: string) => {
        if (fullJSON.startsWith(",")) {
            return "JSON shouldn't start with a comma.";
        } else if (fullJSON.endsWith(",")) {
            return "JSON shouldn't end with a comma.";
        } else {
            return null;
        }
    };
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
