<script lang="ts">
    import { textareaValue } from "./store";
    import { hasErrors } from "./json-utils";
    import { hideElement, animateElementList } from "./animations";

    let warningElements: HTMLDivElement[] = [];
    let previousWarnings: string[] = [];

    function parseWarningsFromJSON(str: string): string[] {
        const trimmedValue = str.trim();

        if (hasErrors($textareaValue)) {
            return [];
        }
        // TODO rename since splitJSON has already been used
        const splitJSON = trimmedValue.slice(1, -1).split(",");
        const warnings: string[] = [];
        let keys: string[] = [];

        if (splitJSON[0] === "") {
            warnings.push("JSON shouldn't be empty.");
        }

        splitJSON.forEach((pair) => {
            const [key, value] = pair.split(":").map((part) => part.trim());

            if (keys.includes(key)) {
                warnings.push(
                    `JSON objects should not have multiple keys with the same name. Key ${key} is a duplicate.`,
                );
            } else {
                keys.push(key);
            }

            if (key === "") {
                warnings.push(`${key ? key : "Empty key"} contains empty string value.`);
            }
        });

        return warnings;
    }

    // Trigger warning animation if there are elements in the warning list.
    $: if (warningElements.length) {
        animateElementList(warningElements);
    }

    /**
     * Hide warning at specific index in the warning list.
     * @param {number} index - The index of the warning to hide.
     */
    function hideWarningAtIndex(index: number) {
        const element = warningElements[index];
        if (element) {
            hideElement(element);
        }
    }

    // Handle removed warnings and update the previous warnings list.
    $: {
        const currentWarnings = parseWarningsFromJSON($textareaValue) || [];

        const removedWarnings = previousWarnings.filter(
            (warning) => !currentWarnings.includes(warning),
        );

        // Hide removed warnings
        removedWarnings.forEach((removedWarning) => {
            const index = previousWarnings.indexOf(removedWarning);
            if (index !== -1) {
                hideWarningAtIndex(index);
            }
        });

        previousWarnings = currentWarnings;
    }
</script>

<div class="inspector-warning-list">
    {#if !hasErrors($textareaValue)}
        {#each parseWarningsFromJSON($textareaValue) as warning, index (warning)}
            <div
                class="warning-area block"
                bind:this={warningElements[index]}
                style="opacity: 0;"
            >
                <article class="message is-warning">
                    <div class="message-header">
                        <p>Warning</p>
                        <button
                            class="delete is-medium"
                            aria-label="delete"
                            onclick={() => hideWarningAtIndex(index)}
                        ></button>
                    </div>
                    <div class="message-body">
                        <div>{warning}</div>
                    </div>
                </article>
            </div>
        {/each}
    {/if}
</div>
