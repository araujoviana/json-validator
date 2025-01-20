<script lang="ts">
    let textareaValue: string = "";
    const textareaRes: number[] = [4, 50];

    const handleInput = () => {
        try {
            const parsedInput = JSON.parse(textareaValue);
            console.log(parsedInput);
        } catch (e) {
            console.error("Invalid JSON", e);
        }
    };
</script>

<textarea 
    id="json-textarea" 
    bind:value={textareaValue} 
    placeholder="Paste or write your JSON here" 
    rows={textareaRes[0]} 
    cols={textareaRes[1]} 
    oninput={handleInput}
></textarea>
