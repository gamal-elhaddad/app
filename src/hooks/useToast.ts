import toast, { ValueOrFunction, Renderable } from "react-hot-toast";
import { useSelector } from "react-redux";
import { AppState } from "src/store/Store";

const useToast = () => {

    const customizer = useSelector((state: AppState) => state.customizer);

    const toastPromise = ({ request, onSuccess, onError }: {
        request: any;
        onSuccess: ValueOrFunction<Renderable, any>;
        onError: ValueOrFunction<Renderable, any>;
    }) => {
        toast.promise(
            request(),
            {
                loading: 'Loading...',
                success: onSuccess,
                error: onError,
            },
            {
                position: customizer?.toastPoistion || 'top-right',
            }
        );
    }

    return {
        toastPromise
    }
}

export default useToast