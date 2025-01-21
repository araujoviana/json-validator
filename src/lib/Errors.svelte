<script lang="ts">
    import { textareaValue } from "./store";
    import { gsap } from "gsap";

    type Predicate<T> = (value: any) => boolean;

    let errorElements: HTMLDivElement[] = [];
    let previousErrors: string[] = [];

    /**
     * Evaluates a given string as a JSON object with key-value pairs and returns an array of error messages if the string is not a valid JSON.
     * The function checks for invalid key-value pair format, misplaced commas, and incorrect key or value types.
     *
     * @param str The input string to be evaluated as a JSON object.
     * @returns An array of error messages if the input string is not a valid JSON, otherwise an empty array.
     */
    function evalSplitJSON(str: string): string[] {
        const trimmedValue = str.trim();

        try {
            JSON.parse(trimmedValue);
            return [];
        } catch (e) {
            if (surroundedBy(trimmedValue) !== "{}") {
                return ["JSON isn't fully surrounded by curly braces."];
            }

            const splitJSON = trimmedValue.slice(1, -1).split(",");
            const errors: string[] = [];

            splitJSON.forEach((pair) => {
                const [key, value] = pair.split(":").map((part) => part.trim());

                if (!key || !value) {
                    errors.push("Invalid key-value pair format.");
                }

                const keyError = checkKeyFormat(key);
                const valueError = checkValueType(value);

                if (keyError) {
                    errors.push(keyError);
                }
                if (valueError) {
                    errors.push(valueError);
                }
            });

            const misplacedCommasError = misplacedCommas(
                trimmedValue.slice(1, -1).trim(),
            );
            if (misplacedCommasError) {
                errors.unshift(misplacedCommasError);
            }

            return errors;
        }
    }

    /**
     * Type predicates to determine the type of a given value.
     * These predicates are designed to work with string representations of values.
     */
    const isNull: Predicate<any> = (value) => value === "null";
    const isBoolean: Predicate<any> = (value) =>
        value === "true" || value === "false";
    const isNumber: Predicate<any> = (value) => !isNaN(Number(value));
    const isString: Predicate<any> = (value) =>
        typeof value === "string" && surroundedBy(value) === '""';
    const isInvalid: Predicate<any> = (value) => true;

    /**
     * Checks if a given key is in a valid format for use in a JSON object.
     *
     * A valid key is non-empty and surrounded by double quotes.
     *
     * @param key The key to be checked.
     * @returns An error message if the key is not in a valid format, or null if it is.
     */
    const checkKeyFormat = (key: string) => {
        if (surroundedBy(key) !== '""') {
            return `Key '${key}' isn't surrounded by double quotes.`;
        }
        if (key.length === 0) {
            return "JSON contains an empty key.";
        }
        return null;
    };

    /**
     * Checks the value type of a given string and returns an error message if the type is invalid.
     * Attempts to suggest a possible correct type based on the input string format.
     *
     * @param value The input string to check
     * @returns An error message if the type is invalid, otherwise null
     */
    const checkValueType = (value: string) => {
        const valueType = checkValue(value);

        if (valueType === "invalid") {
            let possibleType =
                "n undefined? This is probably the side-effect of another error.";
            if (typeof value === "string") {
                if (value.startsWith("[") || value.endsWith("]")) {
                    possibleType = " list, did you forget to close it?";
                } else if (value.startsWith("{") || value.endsWith("}")) {
                    possibleType = "n object, did you forget to close it?";
                } else if (
                    value
                        .split(".")
                        .every((val) => checkValue(val) === "number")
                ) {
                    possibleType = " number? Check for multiple periods.";
                } else {
                    possibleType = " string? Check for missing double quotes.";
                }
            }
            return `${value} is of an invalid type. Is it supposed to be a${possibleType}`;
        }

        return null;
    };

    /**
     * Checks if the input string is surrounded by a pair of enclosing characters.
     *
     * @param str The input string to check.
     * @returns A string containing the enclosing characters if found, otherwise null.
     */
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

    /**
     * Checks the type of a given value and returns a string representation of its type.
     * If the type cannot be determined, it defaults to "invalid".
     *
     * @param value The value to check the type of.
     * @returns A string representation of the value's type.
     */
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

    /**
     * Checks if a given JSON string has misplaced commas at the beginning or end.
     *
     * @param fullJSON The JSON string to be validated.
     * @returns A string error message if the JSON string has misplaced commas, otherwise null.
     */
    const misplacedCommas = (fullJSON: string) => {
        if (fullJSON.startsWith(",")) {
            return "JSON shouldn't start with a comma.";
        } else if (fullJSON.endsWith(",")) {
            return "JSON shouldn't end with a comma.";
        } else {
            return null;
        }
    };

    // GSAP

    /**
     * Hides an error message element with a smooth animation.
     *
     * @param {number} index The index of the error message element to hide in the errorElements array.
     */
    function hideError(index: number) {
        const element = errorElements[index];
        if (element) {
            gsap.to(element, {
                opacity: 0,
                height: 0,
                marginBottom: 0,
                duration: 0.2,
            });
        }
    }

    $: if (errorElements.length) {
        gsap.fromTo(
            errorElements,
            { opacity: 0, x: -100 },
            { opacity: 1, x: 0, duration: 0.5, stagger: 0.1 },
        );
    }

    $: {
        const currentErrors = evalSplitJSON($textareaValue) || [];

        const removedErrors = previousErrors.filter(
            (error) => !currentErrors.includes(error),
        );

        removedErrors.forEach((removedError) => {
            const index = previousErrors.indexOf(removedError);
            if (index !== -1) {
                hideError(index);
            }
        });

        previousErrors = currentErrors;
    }
</script>

<div class="inspector-error-list">
    {#if !$textareaValue.trim()}
        <p>JSON is empty!</p>
    {:else}
        {#each evalSplitJSON($textareaValue) as error, index (error)}
            <div
                class="error-area block"
                bind:this={errorElements[index]}
                style="opacity: 0;"
            >
                <article class="message is-danger">
                    <div class="message-header">
                        <p>Error</p>
                        <button
                            class="delete is-medium"
                            aria-label="delete"
                            onclick={() => hideError(index)}
                        ></button>
                    </div>
                    <div class="message-body">
                        <div>{error}</div>
                    </div>
                </article>
            </div>
        {/each}
    {/if}
</div>

<style>
    .message-header p {
        margin: 0;
    }

    .message-body {
        word-wrap: break-word;
        overflow-wrap: break-word;
    }
</style>
