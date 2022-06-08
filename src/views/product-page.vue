<script setup lang="ts">
import { watch, ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import CustomLoader from '@/components/base-loader.vue';
import PropertySelector from '@/components/property-selector.vue';

import { useProductOptions } from '@/composables/product';
import { useProductStore } from '@/stores/product';
import { useCartStore } from '@/stores/cart';

const hideExcludedOptions = ref(false);

const router = useRouter();
const route = useRoute();
const sku = route.params.sku as string;

const productStore = useProductStore();
const cartStore = useCartStore();

const { isLoading, data: productSelectors, error } = useProductOptions(sku);

watch(
    () => productSelectors,
    (newProductSelector) => {
        if (newProductSelector.value) {
            productStore.initProductExcludes(newProductSelector.value);
        }
    },
    { deep: true }
);

const hasSelectedProperties = computed(() => productStore.selectedPropertiesAsArray.length);

const productProperties = computed(() => {
    if (hideExcludedOptions.value) {
        return productStore.availableOptions;
    }

    return productSelectors.value?.properties ?? [];
});

const handleAddToCart = () => {
    cartStore.addToCart();
    router.push(`/cart`);
};
</script>

<template>
    <section class="product-shop">
        <h1 v-if="productSelectors?.titlePlural" class="title">
            Customize your awesome
            <strong class="product-name">{{ productSelectors.titlePlural }}</strong>
        </h1>

        <CustomLoader v-if="isLoading" aria-label="Loading..." />

        <div v-else-if="error" aria-label="Error message" class="error-message">{{ error }}</div>

        <template v-else>
            <hr />
            <form @submit.prevent class="selector-form">
                <ul class="list button-list" role="toolbar">
                    <li class="button-list-item">
                        <button
                            class="btn btn-primary"
                            type="button"
                            :disabled="!hasSelectedProperties"
                            @click="productStore.resetSelection()"
                        >
                            Reset
                        </button>
                    </li>
                    <li class="button-list-item">
                        <button
                            class="btn btn-primary"
                            type="button"
                            @click="handleAddToCart"
                            :disabled="!productStore.isValidSelection"
                        >
                            Add to cart
                        </button>
                    </li>
                    <li class="button-list-item">
                        <label class="label options-label">
                            <input type="checkbox" v-model="hideExcludedOptions" />
                            Hide excluded options
                        </label>
                    </li>
                </ul>
                <ul class="list selector-list">
                    <li
                        v-for="productProperty of productProperties"
                        :key="productProperty.slug"
                        class="selector-item"
                    >
                        <PropertySelector :product-property="productProperty" />
                    </li>
                </ul>
            </form>
        </template>
    </section>
</template>

<style scoped lang="scss">
.product-shop {
    padding: 20px 0;

    .error-message {
        padding: 40px 0;
        font-size: 1.5em;
        text-align: center;
        color: var(--dangerous-bg);
    }

    .title {
        font-size: 32px;
        text-align: center;
        text-transform: capitalize;
    }

    .product-name {
        font-size: 36px;
        font-weight: 900;
        text-decoration: underline;
    }

    .selector-form {
        margin: 0 auto;
    }

    .button-list {
        position: sticky;
        top: 0;
        display: flex;
        margin-bottom: 20px;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;
        z-index: 10;
        box-shadow: 0 10px 10px;
        border-radius: 0 0 10px 10px;
        background-color: var(--main-bg);

        .button-list-item {
            margin: 5px;
        }
    }

    .options-label {
        display: inline-block;
    }

    .selector-list {
        display: flex;
        flex-wrap: wrap;
        margin: -10px;
        justify-content: space-between;

        .selector-item {
            flex: 1 0 330px;
            max-height: 300px;
            margin: 10px;
        }
    }
}
</style>
