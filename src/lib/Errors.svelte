<script lang="ts">
    // This component is responsible for guiding the user to fix the errors on their JSON, no warnings.
    import { onMount } from "svelte";
    import { textareaValue } from "./store";
    import { gsap } from "gsap";

    type Predicate<T> = (value: any) => boolean;

    function evalSplitJSON(str: string): string[] {
        try {
            if (JSON.parse(str)) {
                return [];
            }
        } catch (e) {
            const trimmedValue = str.trim();
            if (!(surroundedBy(trimmedValue) === "{}")) {
                return ["JSON isn't fully surrounded by curly braces."];
            }

            const splitJSON = trimmedValue.slice(1, -1).split(",");
            const errors = [];

            splitJSON.forEach((pair) => {
                const [key, value] = pair.split(":").map((part) => part.trim());
                const keyError = checkKeyFormat(key);
                const valueError = checkValueType(value);

                if (keyError || valueError) {
                    errors.push(keyError || valueError);
                }
            });

            const misplacedCommasError = misplacedCommas(
                trimmedValue.slice(1, -1).trim(),
            );
            if (misplacedCommasError) {
                errors.unshift(misplacedCommasError);
            }

            console.log(splitJSON, errors, typeof errors);

            return errors;
        }
    }

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
            console.log("Checking for surrouding quotes in key", key);
            if (key.length === 0) {
                return `JSON contains an empty key.`;
            } else {
                return `Key '${key}' isn't surrounded by double quotes.`;
            }
        }
        return null;
    };

    const checkValueType = (value: string) => {
        const valueType = checkValue(value); // Get the inferred type of the value

        if (valueType === "invalid") {
            // HACK added 'n' to conform to english grammar
            let possibleType =
                "n undefined? This is probably the side-effect of another error.";
            if (typeof value === "string") {
                if (value.startsWith("[") || value.endsWith("]")) {
                    // Possible list
                    possibleType = " list, did you forget to close it?";
                } else if (value.startsWith("{") || value.endsWith("}")) {
                    // Possible object
                    possibleType = "n object, did you forget to close it?";
                } else if (
                    // Possible number
                    value.split(".").every((val) => {
                        console.log(val, "d");
                        return checkValue(val) === "number";
                    })
                ) {
                    possibleType = " number? Check for multiple periods.";
                } else {
                    // Possible string
                    possibleType = " string? Check for missing double quotes.";
                }
            }
            return `${value} is of an invalid type. Is it supposed to be a${possibleType}`;
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

    // GSAP

    let errorElements: HTMLDivElement[] = [];
    $: if (errorElements.length) {
        gsap.fromTo(
            errorElements,
            { opacity: 0, x: -100 },
            { opacity: 1, x: 0, duration: 0.5, stagger: 0.1 },
        );
    }

    // Removing errors

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
</script>

<p>REMOVE THIS LATER: {$textareaValue}</p>

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
