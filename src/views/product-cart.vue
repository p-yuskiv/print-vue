<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink } from 'vue-router';

import type { IProductInCart } from '@/models/product-in-cart';

import ProductItem from '@/components/product-cart-item.vue';

import { useCartStore } from '@/stores/cart';

const cartStore = useCartStore();

const hasProducts = computed(() => cartStore.products.length);

const handleRemove = (product: IProductInCart) => {
    cartStore.removeFromCart(product);
};
</script>

<template>
    <section class="cart-section">
        <template v-if="hasProducts">
            <h1>Products in cart</h1>
            <ul class="list cart-product-list">
                <li
                    v-for="product of cartStore.products"
                    :key="product.id"
                    class="cart-product-list-item"
                >
                    <ProductItem :product="product" @remove="handleRemove(product)" />
                </li>
            </ul>
            <div class="mock-toolbar">
                <p>Wow, almost done.</p>
                <p>Now we choose delivery...</p>
            </div>
        </template>
        <template v-else>
            <div class="empty-cart-section">
                <h1>Cart is empty</h1>
                <p>Let's choose something awesome</p>
                <RouterLink class="btn btn-primary back-button" to="/product">
                    Review Our Products
                </RouterLink>
            </div>
        </template>
    </section>
</template>

<style scoped lang="scss">
.cart-section {
    h1 {
        text-align: center;
    }

    .empty-cart-section {
        text-align: center;
    }

    .cart-product-list-item {
        &:not(:last-child) {
            margin-bottom: 20px;
        }
    }
    .mock-toolbar {
        text-align: center;
    }
}
</style>
