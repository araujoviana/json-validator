<script lang="ts">
    import { textareaValue } from "./store";

    const textareaRes: number[] = [10, 50];
    let textareaStatus = "textarea"; // Change color based on results

    const handleInput = () => {
        try {
            textareaValue ? textareaStatus = "textarea is-success" : "textarea"
            const parsedInput = JSON.parse($textareaValue);
            console.log(parsedInput);
        } catch (e) {
            textareaStatus = "textarea is-danger";
            console.error("Invalid JSON", e);
        }
    };
</script>

<textarea
    class={textareaStatus}
    bind:value={$textareaValue}
    placeholder="Paste or write your JSON here"
    rows={textareaRes[0]}
    cols={textareaRes[1]}
    oninput={handleInput}
></textarea>

<style>
</style>
