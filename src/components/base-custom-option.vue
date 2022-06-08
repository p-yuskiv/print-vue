<script setup lang="ts">
import { ref, computed, unref } from 'vue';

import type { ISelectOption } from '@/models/base-select';
import type { IPropertyOption } from '@/models/product-selector';

import { getMessageForSingleConstraint } from '@/helpers/product.utils';

const props = defineProps<{
    option: ISelectOption<{ option: IPropertyOption }>;
    selected: boolean;
}>();

const propertyOption = computed(() => props.option.meta?.option);

const emit = defineEmits<{
    (event: 'select', selected?: ISelectOption<{ option: IPropertyOption }>): void;
}>();

const constraints = computed(() => propertyOption.value?.customOption?.optionsConstraint || []);
const customValues = ref(Array(constraints.value.length).fill(''));

const buildCustomSlug = () => {
    const values = customValues.value
        .map((value, index) => `${constraints.value[index].name}=${value}`)
        .join(':');

    return `${propertyOption.value?.slug}:${values}`;
};

const handleClick = (canUnselect?: boolean) => {
    if (props.option.disabled) {
        return;
    }

    const shouldUnselect = props.selected && canUnselect;
    const ownOption = shouldUnselect
        ? undefined
        : {
              name: 'custom',
              value: 'custom',
              meta: {
                  option: {
                      ...unref(propertyOption),
                      slug: buildCustomSlug(),
                  } as IPropertyOption,
              },
          };

    emit('select', ownOption);
};
</script>

<template>
    <form
        v-if="propertyOption"
        @submit.prevent
        class="custom-option-editor"
        @click.stop="handleClick(true)"
    >
        <template v-for="(constraint, index) of constraints" :key="constraint.name">
            <label class="custom-label">
                {{ constraint.name }}
            </label>
            <input
                type="number"
                class="input-text custom-value"
                :title="`Expected ${getMessageForSingleConstraint(constraint)}`"
                :placeholder="getMessageForSingleConstraint(constraint)"
                pattern="[\d]+"
                :min="constraint.min"
                :max="constraint.max"
                v-model="customValues[index]"
                :disabled="option.disabled"
                @click.stop="handleClick(false)"
                @keyup="handleClick(false)"
            />
            <span class="custom-unit">{{ propertyOption?.customOption?.unitType }}</span>
        </template>
    </form>
</template>

<style scoped lang="scss">
.custom-option-editor {
    width: 100%;
    display: grid;
    grid-template-columns: auto 1fr auto;
    grid-column-gap: 10px;
    column-gap: 10px;
    grid-row-gap: 10px;
    align-items: baseline;
}

.custom-label {
    text-transform: capitalize;
}

.custom-value {
    &:invalid {
        outline: 3px solid var(--dangerous-bg);
    }
}
.custom-unit {
    text-transform: lowercase;
}
</style>
