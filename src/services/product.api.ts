import type { IProductSelector } from '@/models/product-selector';
import type { IProduct } from '@/models/product';

import products from '@/data/products.json';

import posters from '@/data/posters.json';
import flyers from '@/data/flyers.json';
import businesscards from '@/data/businesscards.json';

const PRODUCTS = {
    posters,
    flyers,
    businesscards,
} as Record<string, IProductSelector>;

const FAKE_DELAY = 1000;
const MIN_FAKE_DELAY = 100;

const fakeFetch = <T>(data: T): Promise<T> => {
    return new Promise((resolve, reject) => {
        const responseDelay = Math.floor(Math.random() * FAKE_DELAY + MIN_FAKE_DELAY);

        setTimeout(() => {
            if (data) {
                resolve(data);
            } else {
                reject(new Error('Bad request'));
            }
        }, responseDelay);
    });
};

export const fetchProductList = () => fakeFetch<IProduct[]>(products);

export const fetchProduct = (sku: string) => fakeFetch<IProductSelector>(PRODUCTS[sku]);
