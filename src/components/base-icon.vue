<script setup lang="ts">
defineProps<{
    description?: string;
}>();
</script>

<template>
    <div class="base-icon">
        <slot />
        <div v-if="description" class="base-icon-description">
            {{ description }}
        </div>
    </div>
</template>

<style lang="scss">
.base-icon {
    --icon-width: 24px;
    --icon-height: 24px;
    --position-left: unset;
    --position-right: -10px;
    --position-top: -10px;
    --position-bottom: unset;

    position: relative;
    min-width: var(--icon-width);
    max-width: var(--icon-width);
    min-height: var(--icon-height);
    max-height: var(--icon-height);

    .base-icon-description {
        display: none;
        position: absolute;
        left: var(--position-left);
        right: var(--position-right);
        top: var(--position-top);
        bottom: var(--position-bottom);
        z-index: 10;
    }

    &:hover .base-icon-description {
        display: block;
    }
}
</style>
