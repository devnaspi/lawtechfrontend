import { useSnackbar } from 'notistack';

const useApiErrorHandler = () => {
    const { enqueueSnackbar } = useSnackbar();

    const handleApiError = (error) => {
        if (error.response && error.response.data) {
            const errorData = error.response.data;
            console.log("error is ", error)
            if (errorData.detail) {
                enqueueSnackbar(errorData.detail, { variant: 'error', autoHideDuration: 2000 });
            } else if (typeof errorData === 'string') {
                enqueueSnackbar(errorData, { variant: 'error', autoHideDuration: 2000 });
            } else if (typeof errorData === 'object') {
                try {
                    Object.keys(errorData).forEach((key) => {
                        const message = errorData[key];
                        if (Array.isArray(message)) {
                            message.forEach((msg) => {
                                enqueueSnackbar(msg, { variant: 'error', autoHideDuration: 2000 });
                            });
                        } else {
                            enqueueSnackbar(message, { variant: 'error', autoHideDuration: 2000 });
                        }
                    });
                } catch (e) {
                    console.log('Error while handling error object:', e);
                    enqueueSnackbar('An error occurred while processing the error response.', { variant: 'error', autoHideDuration: 2000 });
                }
            } else {
                enqueueSnackbar('An unexpected error occurred. Please try again.', { variant: 'error', autoHideDuration: 2000 });
            }
        } else {
            console.log(error);
            enqueueSnackbar('A network error occurred. Please check your connection and try again.', { variant: 'error', autoHideDuration: 2000 });
        }
    };

    return { handleApiError };
};

export default useApiErrorHandler;
