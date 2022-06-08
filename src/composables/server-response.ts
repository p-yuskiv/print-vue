import { ref } from 'vue';

export const useServerResponse = <T>(serverResponse: Promise<T>) => {
    const isLoading = ref(true);
    const error = ref('');
    const data = ref<T>();

    serverResponse
        .then((serverData) => {
            data.value = serverData;
            isLoading.value = false;
        })
        .catch((serverError: Error) => {
            error.value = serverError.message || 'Fail fetch data from server';
            isLoading.value = false;
        });

    return {
        isLoading,
        error,
        data,
    };
};
