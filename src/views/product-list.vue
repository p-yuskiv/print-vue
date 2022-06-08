<script setup lang="ts">
import { useRouter, RouterLink } from 'vue-router';

import CustomLoader from '@/components/base-loader.vue';

import { useProductList } from '@/composables/product';

const router = useRouter();

const { isLoading, data: products, error } = useProductList();

const navigateTo = (productSku: string) => router.push(`/product/${productSku}`);
</script>

<template>
    <section class="products-page">
        <h1 class="title">Choose one of the most awesome products</h1>

        <div class="main-product-menu">
            <CustomLoader v-if="isLoading" />

            <div v-else-if="error">{{ error }}</div>

            <template v-else>
                <ul class="list product-list" role="menubar" aria-label="Product list">
                    <li
                        v-for="product of products"
                        :key="product.sku"
                        class="product-item"
                        @keypress.enter.self="navigateTo(product.sku)"
                    >
                        <RouterLink
                            :to="`/product/${product.sku}`"
                            class="product-link main-panel"
                            role="menuitem"
                            aria-label="Open for details"
                        >
                            <span class="product-description">{{ product.titleSingle }}</span>
                        </RouterLink>
                    </li>
                </ul>
            </template>
        </div>
    </section>
</template>

<styles scoped lang="scss">
@import '@/assets/mixins.scss';

.products-page {
    --padding-top: 105px;
    --padding-bottom: 50px;

    padding: 20px 0;

    .title {
        margin-top: 0;
        font-size: 36px;
        text-align: center;
        text-transform: capitalize;
    }

    .main-product-menu {
        --angel-main: -15deg;

        display: flex;
        min-height: 600px;
        padding-top: var(--padding-top);
        padding-bottom: var(--padding-bottom);
        justify-content: center;
        align-items: center;
    }

    .product-list {
        position: relative;
        display: flex;
        flex-direction: column-reverse;
        transform: skewY(var(--angel-main)) translate(50px);
    }

    .product-link {
        display: flex;
        height: 100%;
        align-items: center;
        font-size: 24px;
        font-weight: bold;
        letter-spacing: 0.05em;
        text-decoration: none;
        transition: var(--transition-duration);

        .product-description {
            color: var(--palette-50);
        }
    }

    .product-item {
        padding: 15px;
        list-style: none;

        @include d3-panel();

        &::before {
            background: center / contain url(../assets/placeholder.png);
        }
    }

    @media screen and (max-width: 620px) {
        .title {
            font-size: 18px;
        }

        .product-link {
            font-size: 18px;
        }

        .product-item:first-child::after {
            z-index: -1;
            box-shadow: -100px 100px 20px rgb(0 0 0 / 25%);
        }

        .main-product-menu {
            min-height: 400px;

            .product-item,
            .product-item::before,
            .product-item::after {
                --item-height: 50px;
                --item-width: 150px;
                --item-shift: -50px;
            }
        }
    }
}
</styles>
