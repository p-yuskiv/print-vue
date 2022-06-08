<script setup lang="ts">
import type { ISelectOption } from '@/models/base-select';

const props = defineProps<{ option: ISelectOption }>();
</script>

<template>
    <div class="option">
        {{ props.option.name }}
    </div>
</template>
