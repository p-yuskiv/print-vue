import type { IProduct } from './product';

export type ISlug = string | number;

// List of specific types of product properties
export enum ProductOptionType {
    DIGITAL = 'digital',
}

export interface IBECustomSizes {
    [unitType: `${string}Unit`]: string;
    [constraint: `min${string}` | `max${string}`]: number;
}

export interface ICustomConstraint {
    name: string;
    min: number;
    max: number;
}

export interface ICustomOption {
    unitType?: string;
    optionsConstraint: ICustomConstraint[];
}

export interface IPropertyOption {
    slug: ISlug;
    nullable: boolean;
    name?: string;
    description?: string;
    type?: ProductOptionType;
    customSizes?: IBECustomSizes;
    customOption?: ICustomOption;
}

export interface IProductProperty {
    slug: ISlug;
    title: string;
    locked: boolean;
    options: IPropertyOption[];
}

export interface IExcludes {
    property: ISlug;
    options: ISlug[];
}

export interface IProductSelector extends IProduct {
    properties: IProductProperty[];
    maxDesigns: number;
    bleed: number;
    excludes: IExcludes[][];
}
