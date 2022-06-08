import type { ISlug } from './product-selector';

export interface ISelectOption<T = Record<string, unknown>> {
    name: string;
    value: ISlug;
    disabled?: boolean;
    meta?: T;
}

export interface ISelectProps<T = Record<string, unknown>> {
    options: ISelectOption<T>[];
    modelSelected?: ISelectOption<T>;
}

export interface ISelectEmits {
    (event: 'update:modelValue', option?: ISelectOption): void;
}
