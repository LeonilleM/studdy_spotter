import { createSlice } from '@reduxjs/toolkit';

const reviewsSlice = createSlice({
    name: 'reviews',
    initialState: {
        userReviews: [],
        otherReviews: [],
        isLoading: false,
        isError: null,
    },
    reducers: {
        setUserReviews(state, action) {
            state.userReviews = action.payload;
        },
        setOtherReviews(state, action) {
            state.otherReviews = action.payload;
        },
        setLoading(state, action) {
            state.isLoading = action.payload;
        },
        setError(state, action) {
            state.isError = action.payload;
        },
    },
});

export const { setUserReviews, setOtherReviews, setLoading, setError } = reviewsSlice.actions;
export default reviewsSlice.reducer;