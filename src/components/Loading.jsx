export const loadingComponent = (message = '') => {
    return (
        <div role="status" className="flex items-center justify-center h-full gap-1 bg-background absolute z-40 w-full">
            <div className='h-4 w-4 bg-secondary rounded-full animate-bounce [animation-delay:-0.3s]'></div>
            <div className='h-4 w-4 bg-secondary rounded-full animate-bounce [animation-delay:-0.15s]'></div>
            <div className='h-4 w-4 bg-secondary rounded-full animate-bounce'></div>
            <span className='text-secondary ml-2 font-lato'>{message}</span>
            <span className='text-secondary ml-2 font-lato sr-only'>Loading...</span>
        </div>
    );
};

