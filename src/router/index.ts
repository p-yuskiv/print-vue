import { createRouter, createWebHistory } from 'vue-router';

import ProductHome from '@/views/product-list.vue';
import ProductPage from '@/views/product-page.vue';
import ProductCart from '@/views/product-cart.vue';
import AboutUsPage from '@/views/about-us.vue';
import DescriptionPage from '@/views/description-page.vue';
import MockPage from '@/views/mock-page.vue';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/product',
            component: ProductHome,
        },
        {
            path: '/product/:sku',
            component: ProductPage,
        },
        {
            path: '/cart',
            component: ProductCart,
        },
        {
            path: '/:catchAll(.*)',
            redirect: '/',
        },
        {
            path: '/home',
            alias: '/',
            component: MockPage,
        },
        {
            path: '/about',
            component: AboutUsPage,
        },
        {
            path: '/register',
            component: DescriptionPage,
        },
        {
            path: '/login',
            component: MockPage,
        },
    ],
});

export default router;
