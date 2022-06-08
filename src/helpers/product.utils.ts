import type { ISelectOption } from '@/models/base-select';
import type {
    ICustomConstraint,
    ICustomOption,
    IExcludes,
    IProductSelector,
    IPropertyOption,
    ISlug,
} from '@/models/product-selector';

import { MAX_CUSTOM_VALUE, MIN_CUSTOM_VALUE } from '@/data/constants';
import optionsGeneration from '@/helpers/product-options-provider';

export const isDefined = <T>(argument: T | undefined): argument is T => {
    return argument !== undefined;
};

/**
 * Check whether `slug` is complex \
 * The composite product slug is expected to have the following structure:
 * *`slugName`* `:` *`dimensionProperty`* `:` { { [ *`minValue`* ] `-` [ *`maxValue`* ] | *`value`* } [, ...] }
 *
 * Examples: \
 * `custom:width:100-200,300-400` => `100 <= width >= 200 || 300 <= width >= 400` \
 * `custom:width:100-200` => `100 <= width >= 200` \
 * `custom:height:200-`   => `height >= 200` \
 * `copies:count:-200`    => `count <= 200` \
 * `copies:count:100`     => `count === 100`
 */
const isCompositeSlug = (slug: ISlug): slug is string => {
    return typeof slug === 'string' && slug.includes(':');
};

const hasSameCompositeSlug = (productSlug: ISlug, compositeName: string): productSlug is string => {
    return typeof productSlug === 'string' && productSlug.startsWith(`${compositeName}:`);
};

export const isWithinSingleRange = (
    value: string | number,
    min: string | number,
    max: string | number
) => {
    const minValue = min === '' ? -Infinity : Number(min);
    const maxValue = max === '' ? Infinity : Number(max);
    const _value = Number(value);

    return minValue <= _value && maxValue >= _value;
};

const isWithinRange = (ranges: string, value: string) => {
    return ranges.split(',').some((range) => {
        const [min, max] = range.split('-');

        return isWithinSingleRange(value, min, max);
    });
};

export const parseCompositeSlug = (slug: ISlug) => {
    const [compositeSlugName, ...customValues] = String(slug).split(':');
    const values = customValues.map((customValue) => customValue.split('='));

    return {
        compositeSlugName,
        values,
    };
};

/**
 * The composite selected option (if **optionSlug** contains custom size / number of copies) is expected to have the following structure: \
 * *`_slugName_`* { `:` *`_dimensionProperty_`* `:` *`value`*  }+`
 *
 * Examples: \
 * `custom:width=100:height=200` => `width === 100 & height === 200` \
 * `copies:count=100`            => `count === 100`
 */
const isExcludedOption = (optionSlug: ISlug, excludedOptions?: Set<ISlug>) => {
    if (excludedOptions?.has(optionSlug)) {
        return true;
    }

    if (!excludedOptions?.size || !isCompositeSlug(optionSlug)) {
        return false;
    }

    const { compositeSlugName, values } = parseCompositeSlug(optionSlug);
    const shouldExcludeCompositeOption = [...excludedOptions.values()].some((slug) => {
        if (!hasSameCompositeSlug(slug, compositeSlugName)) {
            return false;
        }

        const [, dimension, rangeOrValue] = slug.split(':');
        const isRange = rangeOrValue.includes('-');

        return values.some(([name, value]) => {
            if (name !== dimension) {
                return false;
            }

            return isRange ? isWithinRange(rangeOrValue, value) : value === rangeOrValue;
        });
    });

    return shouldExcludeCompositeOption;
};

export const getPredicateForExcludes = (selectedProperties: [ISlug, IPropertyOption][]) => {
    return ({ property: excludedPropertySlug, options: excludeOptions }: IExcludes) => {
        return selectedProperties.some(([selectedPropertySlug, selectedOption]) => {
            if (excludedPropertySlug !== selectedPropertySlug) {
                return false;
            }

            const isInExclusionList = isExcludedOption(
                selectedOption.slug,
                new Set(excludeOptions)
            );

            return isInExclusionList;
        });
    };
};

export const getOptionName = (propertyOption?: IPropertyOption) => {
    return String(propertyOption?.name || propertyOption?.slug || '');
};

export const prettifyOptionName = (propertyOption?: IPropertyOption) => {
    if (!propertyOption || !isCompositeSlug(propertyOption.slug)) {
        return getOptionName(propertyOption);
    }

    const { compositeSlugName: optionName, values } = parseCompositeSlug(propertyOption.slug);
    const displayValues = values
        .map(([name, number]) => {
            return `${number ? number : '?'} (${name})`;
        })
        .join(' x ');

    return `${optionName}: ${displayValues}`;
};

export const makeSelectOption = <T extends Record<string, unknown>>({
    propertyOption,
    disabled = false,
    meta,
}: {
    propertyOption: IPropertyOption;
    disabled?: boolean;
    meta: T;
}): ISelectOption<T> | undefined => {
    if (!propertyOption) {
        return undefined;
    }

    const value = isCompositeSlug(propertyOption.slug)
        ? propertyOption.slug.split(':')[0]
        : propertyOption.slug;

    return {
        name: getOptionName(propertyOption),
        value,
        disabled,
        meta,
    };
};

export const getMessageForSingleConstraint = (constraint: ICustomConstraint) => {
    return `${constraint.name} from ${constraint.min} to ${constraint.max}`;
};

export const getMessageForConstraints = (constraints: ICustomConstraint[]) => {
    return constraints.map(getMessageForSingleConstraint);
};

export const getOnlyOption = (options: IPropertyOption[]) => {
    return options.length === 1 && !options[0].customOption ? options[0] : undefined;
};

export const parseBeProduct = (beProduct: IProductSelector) => {
    const properties = beProduct.properties.map((productProperty) => {
        const optionType = productProperty.options.find(({ type }) => type)?.type;

        if (optionType && optionsGeneration.knownOption(optionType)) {
            // use custom option creator for 'typed' property
            const customOption = optionsGeneration.createOption(optionType, productProperty);

            return {
                ...productProperty,
                options: [...productProperty.options, customOption],
            };
        }

        const options = productProperty.options.map((option) => {
            if (!option.customSizes) {
                return option;
            }

            const unitTypeKey = `${productProperty.slug}Unit`;

            const customOption = Object.entries(option.customSizes).reduce(
                (result, [name, value]: [string, string | number]) => {
                    if (name === unitTypeKey) {
                        result.unitType = String(value);
                    } else if (name.startsWith('min') || name.startsWith('max')) {
                        const constraintName = name.slice(3).toLocaleLowerCase();

                        const itemIndex = result.optionsConstraint.findIndex(
                            (constraint) => constraint.name === constraintName
                        );

                        const constraintItem =
                            itemIndex >= 0
                                ? result.optionsConstraint[itemIndex]
                                : ({
                                      name: constraintName,
                                      min: MIN_CUSTOM_VALUE,
                                      max: MAX_CUSTOM_VALUE,
                                  } as ICustomConstraint);

                        const constraintKey = name.slice(0, 3) as keyof ICustomConstraint;
                        (constraintItem[constraintKey] as number) = value as number;

                        if (itemIndex < 0) {
                            result.optionsConstraint.push(constraintItem);
                        }
                    }

                    return result;
                },
                { optionsConstraint: [] } as ICustomOption
            );
            return {
                ...option,
                customOption,
            };
        });

        return {
            ...productProperty,
            options,
        };
    });

    return {
        ...beProduct,
        properties,
    } as IProductSelector;
};
