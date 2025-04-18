import { configureStore } from '@reduxjs/toolkit';
import reviewsReducer from '../features/reviews/reviewSlice';

const store = configureStore({
    reducer: {
        reviews: reviewsReducer,
    },
});

export default store;