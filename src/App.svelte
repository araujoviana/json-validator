<script lang="ts">
    // TODO Add a favicon!!!

    import Reader from "./lib/Reader.svelte";
    import Errors from "./lib/Errors.svelte";
    import Result from "./lib/Result.svelte";
    import Warnings from "./lib/Warnings.svelte";
</script>

<main>
    <h1 class="title">JSON Validator</h1>

    <div class="reader-container">
        <Reader />
    </div>

    <div class="validation-container block">
        <Errors />
        <Warnings />
        <!-- TODO Add file input -->
    </div>

    <div class="result-container">
        <Result />
    </div>
    <!-- TODO footer (bulma has one)-->
</main>

<style>
    .title {
        text-shadow: 1px 1px 2px black;
    }

    .reader-container {
        padding: var(--reader-padding);
    }
</style>
