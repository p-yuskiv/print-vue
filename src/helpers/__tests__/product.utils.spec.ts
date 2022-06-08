import { describe, it, expect } from 'vitest';

import { isWithinSingleRange, parseCompositeSlug } from '../product.utils';

describe('product.utils', () => {
    it('returns True for a value within single range', () => {
        expect(isWithinSingleRange(10, '5', 15)).toBe(true);
    });

    it('returns True for a value equal to range start/end', () => {
        expect(isWithinSingleRange(10, 10, 15)).toBe(true);
        expect(isWithinSingleRange(10, 1, '10')).toBe(true);
    });

    it('returns False for a value outside of range', () => {
        expect(isWithinSingleRange(10, 11, '15')).toBe(false);
    });

    it('parse composite slug', () => {
        const MOCK_RESULT = {
            compositeSlugName: 'custom',
            values: [
                ['width', '100'],
                ['height', '200'],
            ],
        };

        expect(parseCompositeSlug('custom:width=100:height=200')).toEqual(MOCK_RESULT);
    });

    it('parse composite slug without values list', () => {
        const MOCK_RESULT = {
            compositeSlugName: 'custom',
            values: [],
        };

        expect(parseCompositeSlug('custom')).toEqual(MOCK_RESULT);
    });

    it('parse composite slug with empty values list', () => {
        const MOCK_RESULT = {
            compositeSlugName: 'custom',
            values: [['width'], ['height', '']],
        };

        expect(parseCompositeSlug('custom:width:height=')).toEqual(MOCK_RESULT);
    });

    // Same for the rest functions...
});
