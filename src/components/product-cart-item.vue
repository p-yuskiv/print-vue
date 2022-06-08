<script setup lang="ts">
import type { ICustomSize, IProductInCart } from '@/models/product-in-cart';

import BaseIcon from '@/components/base-icon.vue';

defineProps<{
    product: IProductInCart;
}>();

defineEmits<{
    (event: 'remove'): IProductInCart;
}>();

const prettifyCompositeOption = (customSizes: ICustomSize[]) => {
    return customSizes.map(({ name, value }) => `${value} (${name})`).join(' x ');
};
</script>

<template>
    <section class="cart-section">
        <details class="cart-product-item">
            <summary>
                <h2 class="cart-product-item-title">
                    <BaseIcon
                        class="remove-icon"
                        description="Remove product from cart"
                        @click.stop="$emit('remove')"
                    >
                        <span>X</span>
                    </BaseIcon>
                    {{ product.titleSingle }}
                </h2>
            </summary>
            <dl class="properties-list">
                <div
                    v-for="property of product.orderedProperties"
                    :key="property.slug"
                    class="property-item"
                >
                    <dt class="property-item-title">{{ property.title }}</dt>
                    <dd class="property-item-description">
                        <template v-if="property.options.customSizes">
                            {{ prettifyCompositeOption(property.options.customSizes) }}
                        </template>
                        <template v-else>{{ property.options.name }}</template>

                        <BaseIcon
                            v-if="property.options.description"
                            class="description-icon"
                            :description="property.options.description"
                        >
                            <span>?</span>
                        </BaseIcon>
                    </dd>
                </div>
            </dl>
        </details>
    </section>
</template>

<style lang="scss">
.cart-section {
    .base-icon-description {
        width: 250px;
        padding: 10px;
        border: 1px solid black;
        border-radius: 10px;
        background-color: var(--palette-500);
    }

    .base-icon {
        --position-left: 10px;
        --position-right: unset;

        display: flex;
        margin-left: 10px;
        justify-content: center;
        align-items: center;
        border-radius: 50%;
        flex-basis: 24px;
        font-size: 20px;
        font-weight: 600;
        color: var(--accent-color);
        background-color: var(--palette-500);

        &.remove-icon {
            background-color: var(--dangerous-bg);
        }
    }
}
</style>

<style scoped lang="scss">
.cart-section {
    --product-item-bg: var(--palette-300);
    --detail-bg: var(--palette-200);

    .cart-product-item-title {
        display: inline-flex;
        margin-top: 0;
        text-transform: capitalize;
    }

    .remove-icon {
        margin-right: 10px;
    }

    .cart-product-item,
    .properties-list {
        padding: 20px;
        border-radius: 20px;
        border: 1px solid black;
        background-color: var(--product-item-bg);
    }

    .properties-list {
        display: flex;
        flex-wrap: wrap;
        margin: -10px;
        justify-content: space-between;
        background-color: var(--detail-bg);
    }

    .property-item {
        flex: 1 0 240px;
        margin: 5px;
        padding: 10px;
        border-radius: 10px;
        background: var(--palette-100);
    }

    .property-item-title {
        margin-bottom: 10px;
        font-size: 1.1em;
        font-weight: bold;
    }

    .property-item-description {
        display: flex;
        justify-content: space-between;
        position: relative;
    }
}
</style>
