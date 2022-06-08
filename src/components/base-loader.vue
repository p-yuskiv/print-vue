<template>
    <div class="loader" />
</template>

<style scoped>
.loader {
    --loader-size: 100px;

    min-width: var(--loader-size);
    height: var(--loader-size);
    background: center/ contain url(/src/assets/loader.svg) no-repeat;
}
</style>
