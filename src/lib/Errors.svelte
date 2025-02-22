<script lang="ts">
    import { textareaValue } from "./store";
    import { hasErrors } from "./json-utils";
    import { hideElement, animateElementList } from "./animations";

    type Predicate<T> = (value: any) => boolean;

    let errorElements: HTMLDivElement[] = [];
    let previousErrors: string[] = [];
    let addedErrors: string[] = [];
    let removedErrors: string[] = [];

    /**
     * Evaluates a given string as a JSON object with key-value pairs and returns an array of error messages if the string is not a valid JSON.
     * The function checks for invalid key-value pair format, misplaced commas, and incorrect key or value types.
     *
     * @param str The input string to be evaluated as a JSON object.
     * @returns An array of error messages if the input string is not a valid JSON, otherwise an empty array.
     */
    function parseErrorsFromJSON(str: string): string[] {
        const trimmedValue = str.trim();

        if (!hasErrors($textareaValue)) {
            return [];
        } else {
            if (surroundedBy(trimmedValue) !== "{}") {
                return ["JSON isn't fully surrounded by curly braces."];
            }

            // Removes {} to ease parsing
            const splitJSON = trimmedValue.slice(1, -1).split(",");
            const errors: string[] = [];

            // allows only alphanumeric characters, underscores, hyphens, and periods
            const validKeyRegex = /^[a-zA-Z0-9_\-.]+$/;

            // matches valid string values enclosed in double quotes,
            // allowing escaped characters and Unicode escape sequences.
            const validValueRegex =
                /^"([^"\\]|\\["\\/bfnrt]|\\u[0-9a-fA-F]{4})*"$/;

            splitJSON.forEach((pair) => {
                const [key, value] = pair.split(":").map((part) => part.trim());

                // Empty key or value
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

                if (!validKeyRegex.test(key.slice(1, -1))) {
                    errors.push(`Key ${key} might contain invalid characters`);
                }

                // Checks for invalid characters on strings only
                if (
                    surroundedBy(value) == '""' &&
                    !validValueRegex.test(value)
                ) {
                    errors.push(
                        `Value ${value} might contain invalid characters`,
                    );
                }

                if (value.startsWith("0")) {
                    errors.push(`${value} has leading zeroes.`);
                }
            });

            const misplacedCommasError = misplacedCommas(
                trimmedValue.slice(1, -1).trim(),
            );
            // These errors might produce additional errors so they're prioritised
            if (misplacedCommasError) {
                errors.unshift(misplacedCommasError);
            }

            console.log(
                "ERRORS REPORTS",
                hasErrors($textareaValue),
                $textareaValue,
                errors,
            );

            if (errors.length < 1) {
                errors.push("Unknown error.");
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

        let possibleType =
            "n undefined? This is probably the side-effect of another error.";

        if (surroundedBy(value) == "{}" || surroundedBy(value) == "[]") {
            console.log(`${value} is surrounded`);
            if (hasErrors(value)) {
                return `There was an error parsing the contents of ${value}.`;
            }
        } else if (valueType === "invalid") {
            if (typeof value === "string") {
                if (value.startsWith("[") || value.endsWith("]")) {
                    console.log(surroundedBy(value));
                    possibleType = " list, did you forget to close it?";
                } else if (
                    value.startsWith("{") ||
                    (value.endsWith("}") && surroundedBy(value) != "{}")
                ) {
                    console.log(surroundedBy(value));
                    possibleType = "n object, did you forget to close it?";
                } else if (
                    value
                        .split(".")
                        .every((val) => checkValue(val) === "number")
                ) {
                    possibleType = " number? Check for multiple periods.";
                } else {
                    possibleType =
                        " string? Check for missing double quotes or invalid characters.";
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
        let trimmedStr;

        if (typeof str === "undefined") {
            return null;
        } else {
            trimmedStr = str.trim();
        }

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

    // Trigger error animation if there are elements in the error list.
    $: if (errorElements.length) {
        animateElementList(errorElements);
    }

    /**
     * Hide error at specific index in the error list.
     * @param {number} index - The index of the error to hide.
     */
    function hideErrorAtIndex(index: number) {
        const element = errorElements[index];
        if (element) {
            hideElement(element);
        }
    }

    $: {
        const currentErrors = parseErrorsFromJSON($textareaValue) || [];

        addedErrors = currentErrors.filter(
            (error) => !previousErrors.includes(error),
        );
        removedErrors = previousErrors.filter(
            (error) => !currentErrors.includes(error),
        );

        removedErrors.forEach((removedError) => {
            const index = previousErrors.indexOf(removedError);
            if (index !== -1) {
                const element = errorElements[index];
                if (element) {
                    hideElement(element);
                    errorElements = errorElements.filter((_, i) => i !== index);
                }
            }
        });

        addedErrors.forEach((addedError) => {
            const index = currentErrors.indexOf(addedError);
            if (index !== -1) {
                const element = errorElements[index];
                if (!element) {
                    // Create new element for the added error
                    const newErrorElement = document.createElement("div");
                    newErrorElement.classList.add("error-area", "block");
                    errorElements.push(newErrorElement);
                    animateElementList([newErrorElement]);
                }
            }
        });

        // Update previousErrors with currentErrors
        previousErrors = currentErrors;
    }
</script>

<div class="inspector-error-list">
    {#if !$textareaValue.trim()}
        <p>JSON is empty!</p>
    {:else}
        {#each parseErrorsFromJSON($textareaValue) as error, index (index)}
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
                            onclick={() => hideErrorAtIndex(index)}
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
