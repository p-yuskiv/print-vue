import type { IProduct } from './product';
import type { ISlug, ProductOptionType } from './product-selector';

export interface ICustomSize {
    name: string;
    value: number;
}

export interface IProductInCartOption {
    slug: ISlug;
    nullable: boolean;
    name?: string;
    description?: string;
    type?: ProductOptionType;
    customSizes?: ICustomSize[];
}

export interface IProductInCartProperties {
    slug: ISlug;
    title: string;
    locked: boolean;
    options: IProductInCartOption;
}

export interface IProductInCart extends IProduct {
    id: number;
    orderedProperties: IProductInCartProperties[];
}

export interface ICartState {
    products: IProductInCart[];
}
