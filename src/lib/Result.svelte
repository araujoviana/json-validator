<script lang="ts">
    import { textareaValue } from "./store";
    import { gsap } from "gsap";

    const hasErrors = () => {
        try {
            JSON.parse($textareaValue.trim());
            return true;
        } catch (e) {
            return false;
        }
    };
</script>

<div class="inspector-success-area">
    {#if hasErrors()}
        <article class="message is-success">
            <div class="message-header">
                <p>Validation Successful!</p>
            </div>
            <div class="message-body">
                <!-- REVIEW is this too much for this area? -->
                <pre>{JSON.stringify(JSON.parse($textareaValue), null, 2)}</pre>
            </div>
        </article>
    {/if}
</div>
