<script lang="ts">
    import { textareaValue } from "./store";
    import { hasErrors, formatJSON } from "./json-utils";

    const textareaRes: number[] = [10, 50];
    let textareaStatus = "textarea"; // Change color based on results

    const handleInput = () => {
        console.log("READER REPORTS", hasErrors($textareaValue), $textareaValue);
        if (hasErrors($textareaValue)) {
            textareaStatus = "textarea is-danger";
            console.error("Invalid JSON");
        } else {
            textareaValue
                ? (textareaStatus = "textarea is-success")
                : "textarea";
            const parsedInput = JSON.parse($textareaValue);
            console.log(parsedInput);
        }
    };

    const handleFile = (event: Event) => {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                textareaValue.set(reader.result as string);
            };
            reader.readAsText(file);
        }
    };

    const handleDragOver = (event: DragEvent) => {
        event.preventDefault();
        textareaStatus = "textarea is-focused"; // ?
    };

    const handleDrop = (event: DragEvent) => {
        event.preventDefault();
        const file = event.dataTransfer?.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                textareaValue.set(reader.result as string);
            };
            reader.readAsText(file);
        }
        textareaStatus = "textarea";
    };
</script>

<textarea
    class={textareaStatus}
    bind:value={$textareaValue}
    placeholder="Drop you JSON here!"
    rows={textareaRes[0]}
    cols={textareaRes[1]}
    oninput={handleInput}
    ondragover={handleDragOver}
    ondrop={handleDrop}
></textarea>

<div class="alt-inputs">
    <div class="file">
        <label class="file-label">
            <input class="file-input" type="file" onchange={handleFile} />
            <span class="file-cta">
                <span class="file-icon">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="size-6"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
                        />
                    </svg>
                </span>
                <span class="file-label"> Import from file… </span>
            </span>
        </label>

        <button
            class="button is-primary format-button"
            disabled={hasErrors($textareaValue)}
            onclick={() => {
                textareaValue.set(formatJSON($textareaValue) as string);
            }}
        >
            <span class="icon is-small">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="size-6"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                    />
                </svg>
            </span>
            Format JSON
        </button>
    </div>
</div>

<style>
    .alt-inputs {
        padding-top: 1rem;
        display: grid;
        grid-template-columns: auto auto;
        gap: 1rem;
        align-items: center;
        justify-content: start;
    }
    .file,
    button {
        gap: 1rem;
    }
</style>
