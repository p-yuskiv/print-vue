import { defineComponent, h, type VNode } from 'vue';

import BaseSelect from '@/components/base-select.vue';
import type { ISelectOption } from '@/models/base-select';
import type { ExtractProps } from '@/models/generic-extract-props';

type INonGenericProps = Omit<
    ExtractProps<typeof BaseSelect>,
    'modelSelected' | 'options' | 'onUpdate:modelSelected'
>;

interface IGenericProps<T> extends INonGenericProps {
    options: ISelectOption<T>[];
    modelSelected?: ISelectOption<T>;
}

interface IGenericSlotProps<T> {
    index: number;
    option: ISelectOption<T>;
    selected: boolean;
}

export function useGenericBaseSelect<T extends Record<string, unknown>>() {
    const wrapper = defineComponent((props: IGenericProps<T>, { slots }) => {
        return () => h(BaseSelect, props, slots);
    });

    return wrapper as typeof wrapper & {
        new (): {
            $emit: {
                (event: 'update:modelSelected', selected?: ISelectOption<T>): void;
            };
            $slots: {
                default: (arg: IGenericSlotProps<T>) => VNode[];
            };
        };
    };
}
