<script lang="ts">
    // TODO Remove this later
    // import viteLogo from '/vite.svg'
    import Reader from "./lib/Reader.svelte";
    import Errors from "./lib/Errors.svelte";
</script>

<main>
    <h1 class="title">JSON Validator</h1>

    <div class="reader-container">
        <Reader />
    </div>

    <div class="content">
        <Errors />
        <!-- TODO Add file input -->
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
