<script setup lang="ts">
import { ref, computed, toRef } from 'vue';

import type { IProductProperty, IPropertyOption } from '@/models/product-selector';
import type { ISelectOption } from '@/models/base-select';

import { useGenericBaseSelect } from '@/components/base-select-generic';
import BaseIcon from '@/components/base-icon.vue';
import CustomOption from '@/components/base-custom-option.vue';
import PropertySelectorOption from '@/components/property-selector-option.vue';

import { MAX_LIST_SIZE } from '@/data/constants';
import { getOptionName, prettifyOptionName } from '@/helpers/product.utils';
import { useProductSelectorData } from '@/composables/product';

const BaseSelect = useGenericBaseSelect<{ option: IPropertyOption }>();

const props = defineProps<{
    productProperty: IProductProperty;
}>();

const productProperty = toRef(props, 'productProperty');

const filterInput = ref('');

const showFilterInput = computed(() => props.productProperty.options.length > MAX_LIST_SIZE);

const { isValid, validationError, options, selected, onlyOption, handleChangeSelection } =
    useProductSelectorData(productProperty, filterInput);

const selectedOptionName = computed(() => {
    if (!selected.value?.name) {
        return getOptionName(onlyOption.value);
    }

    return prettifyOptionName(selected.value.meta?.option);
});

const productName = computed(() => {
    return props.productProperty.title ?? props.productProperty.slug;
});

const getOptionDescription = (option: ISelectOption<{ option: IPropertyOption }>) => {
    return option.meta?.option?.description || '';
};

const getCustomOption = (option: ISelectOption<{ option: IPropertyOption }>) => {
    return option.meta?.option;
};
</script>

<template>
    <BaseSelect
        :class="[
            'product-selector',
            { single: onlyOption },
            { valid: isValid },
            { invalid: validationError },
        ]"
        :options="options"
        @update:modelSelected="handleChangeSelection"
        :modelSelected="selected"
        aria-label="Select product property"
    >
        <template #header>
            <h2 class="title">
                {{ productName }}
            </h2>
            <div
                v-if="selectedOptionName"
                @click.stop="handleChangeSelection()"
                class="selected-option"
            >
                <div>{{ selectedOptionName }}</div>
                <BaseIcon
                    v-if="validationError"
                    class="validation-icon"
                    :description="validationError"
                >
                    <span>?</span>
                </BaseIcon>
            </div>
            <input
                v-if="showFilterInput"
                class="input-text filter-input"
                placeholder="Start typing"
                @keyup.esc="filterInput = ''"
                title="Press 'Esc' to clear field"
                v-model="filterInput"
            />
        </template>
        <template #default="{ option, selected }">
            <CustomOption
                v-if="getCustomOption(option)?.customOption"
                :option="option"
                :selected="selected"
                @select="handleChangeSelection"
                :aria-label="getOptionDescription(option)"
            />
            <PropertySelectorOption v-else :option="option" />
            <BaseIcon
                v-if="getOptionDescription(option)"
                class="option-icon"
                :description="getOptionDescription(option)"
                aria-hidden="true"
            >
                <span>?</span>
            </BaseIcon>
        </template>
        <template #empty>
            <div class="base-select-empty">No available options found</div>
        </template>
    </BaseSelect>
</template>

<style lang="scss">
.product-selector {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;

    .base-select-list {
        margin-top: 10px;
        padding: 0 5px;
        overflow-x: auto;
    }

    &.single {
        .base-select-list-item {
            color: var(--option-single-color);
            background-color: var(--option-single-bg);
        }
    }

    .base-select-list-item {
        display: flex;
        padding: 10px 20px;
        align-items: center;
        justify-content: space-between;
        border-radius: 10px;
        border: 1px solid black;
        font-weight: bold;
        color: var(--option-color);
        background-color: var(--option-bg);
        user-select: none;
        cursor: pointer;

        &.selected {
            color: var(--option-selected-color);
            background-color: var(--option-selected-bg);
        }

        &.disabled {
            color: var(--option-excluded-color);
            background-color: var(--option-excluded-bg);
            cursor: not-allowed;

            .option {
                opacity: 0.5;
            }
        }

        &:not(:last-child) {
            margin-bottom: 5px;
        }
    }

    .base-icon-description {
        width: 250px;
        padding: 10px;
        border: 1px solid black;
        border-radius: 10px;
        background-color: var(--palette-500);
    }

    .base-icon {
        display: flex;
        margin-left: 10px;
        justify-content: center;
        align-items: center;
        border-radius: 50%;
        font-size: 20px;
        font-weight: 600;
        color: var(--accent-color);
        background-color: var(--palette-500);
    }
}
</style>

<style scoped lang="scss">
.product-selector {
    --list-unselected-bg: var(--palette-200);
    --list-valid-bg: var(--palette-300);
    --list-invalid-bg: var(--dangerous-bg);

    --option-color: var(--primary-color);
    --option-bg: var(--palette-100);
    --option-selected-color: var(--accent-color);
    --option-selected-bg: var(--palette-900);
    --option-single-color: var(--accent-color);
    --option-single-bg: var(--palette-700);
    --option-excluded-color: var(--disabled-color);
    --option-excluded-bg: inherit;

    padding: 20px 10px;
    border: 1px solid black;
    border-radius: 20px;
    background-color: var(--list-unselected-bg);
    box-shadow: 5px 2px 5px;

    &.valid {
        background-color: var(--list-valid-bg);
    }

    &.invalid {
        background-color: var(--list-invalid-bg);
    }

    &:not(.last-child) {
        margin-bottom: 10px;
    }

    .title {
        margin: 0 5px;
        font-size: 1.2em;
    }

    .filter-input {
        width: 100%;
        margin-top: 10px;
    }

    .selected-option {
        display: flex;
        justify-content: space-between;
        margin: 10px 20px 0 20px;
        padding: 10px 20px;
        border: 1px solid black;
        border-radius: 20px;
        color: var(--option-selected-color);
        background-color: var(--option-selected-bg);
    }

    .base-select-empty {
        margin: auto;
        font-size: 1.1em;
        font-weight: 500;
    }
}
</style>
