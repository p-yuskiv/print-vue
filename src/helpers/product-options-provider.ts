import {
    ProductOptionType,
    type IProductProperty,
    type IPropertyOption,
} from '@/models/product-selector';

import { MIN_CUSTOM_VALUE, MAX_CUSTOM_VALUE } from '@/data/constants';

/**
 * @module OptionTypesProvider
 * Singleton to register additional features that allow you to generate user-created options of various types
 */

type IOptionCreator = (productProperty: IProductProperty) => IPropertyOption;
type IProvider = Record<ProductOptionType, IOptionCreator>;

class OptionTypesProvider {
    private providers = {} as IProvider;

    registerCreator(type: ProductOptionType, optionCreator: IOptionCreator) {
        this.providers[type] = optionCreator;
    }

    knownOption(type: ProductOptionType) {
        return Boolean(this.providers[type]);
    }

    createOption(type: ProductOptionType, productProperty: IProductProperty) {
        if (!this.knownOption(type)) {
            throw new Error(`Creator for ${type} was not registered`);
        }

        return this.providers[type](productProperty);
    }
}

const providerInstance = new OptionTypesProvider();

// predefined function for "DIGITAL"
providerInstance.registerCreator(
    ProductOptionType.DIGITAL,
    (productProperty: IProductProperty) => ({
        slug: 'custom',
        nullable: false,
        customOption: {
            optionsConstraint: [
                {
                    name: String(productProperty.slug),
                    min: MIN_CUSTOM_VALUE,
                    max: MAX_CUSTOM_VALUE,
                },
            ],
        },
    })
);

export default providerInstance;
