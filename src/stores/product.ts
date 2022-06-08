import { defineStore } from 'pinia';

import type { IOptionsList } from '@/models/options-list';
import type {
    IPropertyOption,
    IProductProperty,
    IProductSelector,
    ISlug,
} from '@/models/product-selector';

import {
    getMessageForConstraints,
    getOnlyOption,
    getPredicateForExcludes,
    isDefined,
    isWithinSingleRange,
    parseCompositeSlug,
} from '@/helpers/product.utils';

interface IAppliedConstraints {
    incompatibleProperties: Record<ISlug, string>;
    excludedOptions: IOptionsList;
}

interface IProductState {
    selectedProperties: Record<ISlug, IPropertyOption>;
    currentProduct: IProductSelector;
}

export const useProductStore = defineStore({
    id: 'product',
    state: (): IProductState => ({
        selectedProperties: {},
        currentProduct: {} as IProductSelector,
    }),
    getters: {
        /**
         * Prepares a list of options in which user-defined parameters do not meet the constraints
         *
         * These getters are needed only to highlight temporarily invalid options in which
         * the user enters data independently, such as "copies" or "size"
         *
         * Options in which the user can enter arbitrary values may be temporarily invalid (out of range)
         *
         * @returns { Record<optionSlug, validationMessage> }
         */
        invalidCustomOptions(): Record<ISlug, string> {
            return Object.entries(this.selectedProperties).reduce(
                (invalidOptions, [propertySlug, selectedOption]) => {
                    const optionsConstraint = selectedOption.customOption?.optionsConstraint;
                    if (!optionsConstraint) {
                        return invalidOptions;
                    }

                    const { values } = parseCompositeSlug(selectedOption.slug);
                    const hasEnoughValues = values.length >= optionsConstraint.length;

                    const isInvalid =
                        !hasEnoughValues ||
                        values.some(([dimension, value]) => {
                            const constraint = optionsConstraint.find(
                                ({ name }) => dimension === name
                            );

                            if (!constraint) {
                                return false;
                            }

                            return !isWithinSingleRange(value, constraint.min, constraint.max);
                        });

                    if (isInvalid) {
                        invalidOptions[propertySlug] = `Expected ${getMessageForConstraints(
                            optionsConstraint
                        ).join(', ')}`;
                    }

                    return invalidOptions;
                },
                {} as Record<ISlug, string>
            );
        },

        /**
         * Prepares a list of options in which user-defined parameters do not meet the constraints
         *
         * These getters are needed only to highlight temporarily invalid options in which
         * the user enters data independently, such as "copies" or "size"
         *
         * Options in which the user can enter arbitrary values may be temporarily invalid (out of range)
         *
         * @returns { Record<optionSlug, validationMessage> }
         */
        invalidSelection(): Record<ISlug, string> {
            return {
                ...this.getActualConstraints.incompatibleProperties,
                ...this.invalidCustomOptions,
            } as Record<ISlug, string>;
        },

        /**
         * Checks if all options are selected and the product is ready to add to cart
         */
        isValidSelection() {
            return Boolean(this.allSelectedProperties);
        },

        /**
         * Returns an helper that allows you to check whether a given product property
         * is user-selected or actually selected because it contains only one option to choose from
         */
        isValidSelector() {
            return (propertySlug: ISlug) => {
                if (this.invalidSelection[propertySlug]) {
                    return false;
                }

                const isSelected = this.selectedProperties[propertySlug];
                if (isSelected) {
                    return true;
                }

                const options = this.getOptionsByPropertySlug(propertySlug);
                if (options.length === 0) {
                    return true;
                }

                const isOnlyOption = Boolean(getOnlyOption(options));

                return isOnlyOption;
            };
        },

        /**
         * For each product property, returns an array of options that cannot be selected
         * (based on the selection made earlier)
         */
        allExcludedOptions(): IOptionsList {
            return this.getActualConstraints.excludedOptions;
        },

        /**
         * For each product property, returns an array of options that can be selected
         * (based on the selection made earlier)
         */
        availableOptions(): IProductProperty[] {
            const excludes = this.allExcludedOptions;

            return (
                this.currentProduct.properties?.map((productProperty) => {
                    const availableOptions = productProperty.options.filter(({ slug }) => {
                        return !excludes[productProperty.slug]?.has(slug);
                    });

                    return {
                        ...productProperty,
                        options: availableOptions,
                    };
                }) ?? []
            );
        },

        /**
         * Checks whether the product has selected all possible properties and returns it's array.
         * The values in the properties are selected by the user independently or
         * automatically if there is only one option left.
         */
        allSelectedProperties(): IProductProperty[] | null {
            const availableOptions = this.availableOptions;
            const selectedProperties = this.selectedProperties;

            const hasInvalidSelection = Object.keys(this.invalidSelection).length;
            if (hasInvalidSelection) {
                return null;
            }

            let invalidSelection = false;

            const selectedPropertiesList = availableOptions
                .map((productProperty) => {
                    if (selectedProperties[productProperty.slug]) {
                        return {
                            ...productProperty,
                            options: [selectedProperties[productProperty.slug]],
                        };
                    }

                    if (productProperty.options.length === 1) {
                        return {
                            ...productProperty,
                            options: [productProperty.options[0]],
                        };
                    }

                    if (productProperty.options.length > 1) {
                        // The product cannot be added to the cart if the value for the product property is unknown
                        invalidSelection = true;
                    }

                    // Delete the invalid property (if it has no options for selection)
                    return undefined;
                })
                .filter(isDefined);

            return invalidSelection ? null : selectedPropertiesList;
        },

        /**
         * For each property, calculates a list of options that can no longer be selected due to earlier choices
         *
         * Custom (user-filled) fields may be temporarily invalid.
         * However, they should not automatically disable user-selected options
         * that could theoretically be compatible with these fields
         * (when the user enters a value that is not in the forbidden range)
         */
        getActualConstraints(): IAppliedConstraints {
            const allProductExcludes = this.currentProduct.excludes;
            const selectedPropertiesAsArray = this.selectedPropertiesAsArray;

            if (!allProductExcludes || !selectedPropertiesAsArray.length) {
                return {
                    incompatibleProperties: {},
                    excludedOptions: {},
                };
            }

            const incompatibleProperties = {} as Record<ISlug, string>;

            const hasApplicableExcludes = getPredicateForExcludes(selectedPropertiesAsArray);

            const excludedOptions = allProductExcludes.reduce((result, _excludedOptions) => {
                const excludesForSelection = _excludedOptions.filter(hasApplicableExcludes);
                if (!excludesForSelection.length) {
                    return result;
                }

                const isAffectMultiSelectedProperties = excludesForSelection.length > 1;
                if (isAffectMultiSelectedProperties) {
                    // Affects affects only relationships with custom options
                    const incompatiblePropertiesList = excludesForSelection.map(
                        ({ property, options }) => {
                            const propertyName =
                                this.currentProduct.properties.find(({ slug }) => slug === property)
                                    ?.title ?? property;

                            // Yes, for options too it will be necessary to receive the name, instead of slug ))
                            return [property, `"${propertyName}" = [${options.join(', ')}]`];
                        }
                    );
                    incompatiblePropertiesList.forEach(([propertySlug, title]) => {
                        const restProperties = incompatiblePropertiesList
                            .filter(([slug]) => slug !== propertySlug)
                            .map(([, propertyName]) => propertyName)
                            .join(', ');
                        if (incompatibleProperties[propertySlug]) {
                            incompatibleProperties[propertySlug] += `, ${restProperties}`;
                        } else {
                            const prevIncompatibleProperties = `${title} is not compatible with ${restProperties}`;
                            incompatibleProperties[propertySlug] = prevIncompatibleProperties;
                        }
                    });
                }

                return _excludedOptions.reduce((prevExcludes, excludes) => {
                    if (!hasApplicableExcludes(excludes)) {
                        const { property, options } = excludes;
                        if (prevExcludes[property]) {
                            options.forEach((option) => prevExcludes[property].add(option));
                        } else {
                            prevExcludes[property] = new Set(options);
                        }
                    }

                    return prevExcludes;
                }, result);
            }, {} as IOptionsList);

            return {
                incompatibleProperties,
                excludedOptions,
            };
        },

        selectedPropertiesAsArray(): [string, IPropertyOption][] {
            return Object.entries(this.selectedProperties || {}).filter(
                ([, selectedOption]) => selectedOption
            );
        },

        getOptionsByPropertySlug() {
            return (propertySlug: ISlug) => {
                return (
                    this.availableOptions.find(({ slug }) => slug === propertySlug)?.options ?? []
                );
            };
        },
    },
    actions: {
        initProductExcludes(currentProduct: IProductSelector) {
            this.$reset();
            this.currentProduct = currentProduct || {};
        },
        resetSelection() {
            this.selectedProperties = {};
        },
    },
});
