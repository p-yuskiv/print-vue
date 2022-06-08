import { computed, type Ref } from 'vue';

import type { ISelectOption } from '@/models/base-select';
import type { IProductProperty, IPropertyOption } from '@/models/product-selector';

import { fetchProductList, fetchProduct } from '@/services/product.api';
import { useServerResponse } from './server-response';
import { useProductStore } from '@/stores/product';
import {
    getOnlyOption,
    getOptionName,
    makeSelectOption,
    parseBeProduct,
} from '@/helpers/product.utils';

export const useProductList = () => {
    return useServerResponse(fetchProductList());
};

export const useProductOptions = (sku: string) => {
    const productResponse = fetchProduct(sku).then(parseBeProduct);

    return useServerResponse(productResponse);
};

export const useProductSelectorData = (
    productProperty: Ref<IProductProperty>,
    filter: Ref<string>
) => {
    const productStore = useProductStore();

    const isValid = computed(() => {
        return productStore.isValidSelector(productProperty.value.slug);
    });

    const validationError = computed(() => {
        return productStore.invalidSelection[productProperty.value.slug];
    });

    const options = computed(() => {
        const excludedOptions = productStore.allExcludedOptions[productProperty.value.slug];
        const searchText = filter.value.trim().toLocaleLowerCase();
        const _options = !searchText
            ? productProperty.value.options
            : productProperty.value.options.filter((option) => {
                  const optionName = getOptionName(option);

                  return optionName.toLocaleLowerCase().includes(searchText);
              });

        return _options.map((propertyOption) => {
            return makeSelectOption<{ option: IPropertyOption }>({
                propertyOption,
                disabled: excludedOptions?.has(propertyOption.slug),
                meta: { option: propertyOption },
            });
        }) as ISelectOption<{ option: IPropertyOption }>[];
    });

    const selected = computed(() => {
        const propertyOption = productStore.selectedProperties[productProperty.value.slug];

        return makeSelectOption<{ option: IPropertyOption }>({
            propertyOption,
            disabled: false,
            meta: { option: propertyOption },
        });
    });

    const onlyOption = computed(() => {
        const excludedOptions = productStore.allExcludedOptions[productProperty.value.slug];
        const availableOptions = productProperty.value.options.filter(
            ({ slug }) => !excludedOptions?.has(slug)
        );

        return getOnlyOption(availableOptions);
    });

    const handleChangeSelection = (selected?: ISelectOption<{ option: IPropertyOption }>) => {
        if (!selected) {
            delete productStore.selectedProperties[productProperty.value.slug];

            return;
        }

        const selectedOption = selected.meta?.option as IPropertyOption;
        productStore.selectedProperties[productProperty.value.slug] = selectedOption;
    };

    return {
        isValid,
        validationError,
        options,
        selected,
        onlyOption,
        handleChangeSelection,
    };
};
