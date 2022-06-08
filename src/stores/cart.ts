import { defineStore } from 'pinia';

import { useProductStore } from '@/stores/product';
import { parseCompositeSlug } from '@/helpers/product.utils';
import type { ICartState, IProductInCart } from '@/models/product-in-cart';

let id = 0; // mock id generator (given by BE)

export const useCartStore = defineStore({
    id: 'cart',
    state: () =>
        ({
            products: [],
        } as ICartState),
    getters: {},
    actions: {
        addToCart() {
            const productStore = useProductStore();
            const allSelectedProperties = productStore.allSelectedProperties;
            const { sku, active, titlePlural, titleSingle } = productStore.currentProduct;

            if (!allSelectedProperties) {
                return;
            }

            const orderedProperties = allSelectedProperties.map(
                ({ slug, title, locked, options: [selectedOptions] }) => {
                    const { values } = parseCompositeSlug(selectedOptions.slug);
                    const customSizes = !values.length
                        ? undefined
                        : values.map(([name, value]) => ({ name, value: Number(value) }));

                    const options = {
                        slug: selectedOptions.slug,
                        nullable: selectedOptions.nullable,
                        name: selectedOptions.name || String(selectedOptions.slug),
                        description: selectedOptions.description,
                        type: selectedOptions.type,
                        customSizes,
                    };

                    const productInCartProperty = {
                        slug,
                        title: title || String(slug),
                        locked,
                        options,
                    };

                    return productInCartProperty;
                }
            );

            const product = {
                id: ++id,
                sku,
                active,
                titlePlural,
                titleSingle,
                orderedProperties,
            };

            this.products.push(product);
        },

        removeFromCart(product: IProductInCart) {
            this.products = this.products.filter(({ id }) => id !== product.id);
        },
    },
});
