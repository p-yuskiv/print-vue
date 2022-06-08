<script setup lang="ts">
import type { ISelectOption } from '@/models/base-select';

export interface ISelectProps {
    options: ISelectOption[];
    modelSelected?: ISelectOption;
}

export interface ISelectEmits {
    (event: 'update:modelSelected', selected?: ISelectOption): void;
}

const props = defineProps<ISelectProps>();

const emit = defineEmits<ISelectEmits>();

const handleSelect = (selected: ISelectOption) => {
    if (selected.disabled) {
        return;
    }

    const shouldUnselect = selected.value === props.modelSelected?.value;
    emit('update:modelSelected', shouldUnselect ? undefined : selected);
};
</script>

<template>
    <div class="base-select" aria-role="listbox">
        <slot name="header" />

        <ul v-if="props.options.length" class="list base-select-list">
            <li
                v-for="(option, index) of props.options"
                :key="option.value"
                @click="handleSelect(option)"
                @keyup.enter="handleSelect(option)"
                :class="[
                    'base-select-list-item',
                    { disabled: option.disabled },
                    { selected: option.value === props.modelSelected?.value },
                ]"
                aria-role="option"
                :aria-selected="Boolean(option.value === props.modelSelected?.value)"
                :aria-disabled="Boolean(option.disabled)"
                tabindex="0"
            >
                <slot
                    :index="index"
                    :option="option"
                    :selected="option.value === props.modelSelected?.value"
                    class="123"
                />
            </li>
        </ul>

        <slot v-else name="empty" />

        <slot name="footer" />
    </div>
</template>

<style scoped lang="scss">
.base-select {
    .base-select-list-item {
        cursor: pointer;
    }

    .disabled {
        cursor: not-allowed;
    }
}
</style>
