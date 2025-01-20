<!-- Keeping this one for reference -->

<script lang="ts">
    let count: number = $state(0);
    const increment = () => {
        count += 1;
    };
</script>

<button onclick={increment}>
    count is {count}
</button>
