import { describe, it, expect } from 'vitest';

import { useServerResponse } from '../server-response';

describe('server-response composable', () => {
    const MOCK_RESPONSE = 'Server response';
    const MOCK_ERROR_RESPONSE = { message: 'Server response' };

    it('sets `isLoading` flag', async () => {
        const request = Promise.resolve(MOCK_RESPONSE);
        const { isLoading } = useServerResponse(request);

        expect(isLoading.value).toBe(true);
    });

    it('resets `error` value', async () => {
        const request = Promise.resolve(MOCK_RESPONSE);
        const { error } = useServerResponse(request);

        expect(error.value).toBe('');
    });

    it('returns server data', async () => {
        const request = Promise.resolve(MOCK_RESPONSE);
        const { data } = useServerResponse(request);

        expect(data.value).toBeUndefined();
        await expect(request).resolves.toBe(MOCK_RESPONSE);
        expect(data.value).toEqual(MOCK_RESPONSE);
    });

    it('changes `isLoading` flag after server `ok` response', async () => {
        const successRequest = Promise.resolve(MOCK_RESPONSE);
        const { isLoading } = useServerResponse(successRequest);

        expect(isLoading.value).toBe(true);
        await expect(successRequest).resolves.toBe(MOCK_RESPONSE);
        expect(isLoading.value).toBe(false);
    });

    it('changes `isLoading` flag after server `fail` response', async () => {
        const request = Promise.reject(MOCK_RESPONSE);
        const { isLoading } = useServerResponse(request);

        expect(isLoading.value).toBe(true);
        await expect(request).rejects.toBe(MOCK_RESPONSE);
        expect(isLoading.value).toBe(false);
    });

    it('ignores `error` flag after server `ok` response', async () => {
        const successRequest = Promise.resolve(MOCK_RESPONSE);
        const { error } = useServerResponse(successRequest);

        expect(error.value).toBe('');
        await expect(successRequest).resolves.toBe(MOCK_RESPONSE);
        expect(error.value).toBe('');
    });

    it('changes `error` flag after server `fail` response', async () => {
        const request = Promise.reject(MOCK_ERROR_RESPONSE);
        const { error } = useServerResponse(request);

        expect(error.value).toBe('');
        await expect(request).rejects.toEqual(MOCK_ERROR_RESPONSE);
        expect(error.value).toBe(MOCK_ERROR_RESPONSE.message);
    });

    it('returns default `error` message after server `fail` response', async () => {
        const request = Promise.reject(MOCK_RESPONSE);
        const { error } = useServerResponse(request);

        expect(error.value).toBe('');
        await expect(request).rejects.toEqual(MOCK_RESPONSE);
        expect(error.value).toBe('Fail fetch data from server');
    });
});
