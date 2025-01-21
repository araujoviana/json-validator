<script lang="ts">
    // TODO Remove this later
    // import viteLogo from '/vite.svg'
    import Counter from "./lib/Counter.svelte";
    import Reader from "./lib/Reader.svelte";
    import Errors from "./lib/Errors.svelte";
</script>

<main>
    <h1 class="title">My JSON Validator!</h1>

    <div id="json-reader-container">
        <Reader />
    </div>

    <div class="content">
        <Errors />
    </div>

    <Counter />
</main>

<style>
    /* Something cool style and nice!*/
    .title {
        text-shadow: 1px 1px 2px black;
    }
</style>
