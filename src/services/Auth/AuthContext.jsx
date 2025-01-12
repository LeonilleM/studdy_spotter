import { createContext, useReducer, useEffect } from 'react';
import PropTypes from 'prop-types';
import { supabase } from '../supabase/supabase';
import { getCurrentUser, fetchUserData, signIn, signUp, updateUserProfile } from '../Auth/Auth';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            return {
                ...state,
                user: action.payload,
                isAuthenticated: true,
                isLoading: false,
                error: null
            };
        case 'LOGOUT':
            return {
                ...state,
                user: null,
                isAuthenticated: false,
                isLoading: false
            };
        case 'SIGNUP':
            return {
                ...state,
                user: action.payload,
                isAuthenticated: true,
                isLoading: false,
                error: null
            };
        case 'PROFILE_UPDATE':
            return {
                ...state,
                user: { ...state.user, ...action.payload },
                isAuthenticated: true,
            };
        case 'SET_LOADING':
            return {
                ...state,
                isLoading: action.payload
            };
        case 'SET_ERROR':
            return {
                ...state,
                error: action.payload,
                isLoading: false
            };
        default:
            return state;
    }
};

const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, {
        user: null,
        isAuthenticated: false,
        isLoading: true,
        error: null
    });

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const currentUser = await getCurrentUser();
                if (currentUser && currentUser.sub) {
                    const userData = await fetchUserData(currentUser.sub);
                    dispatch({ type: 'LOGIN', payload: userData });
                } else {
                    dispatch({ type: 'SET_LOADING', payload: false });
                }
            } catch (error) {
                console.error('Auth initialization error:', error);
                dispatch({ type: 'SET_LOADING', payload: false });
            }
        };
        initializeAuth();

        const { data: subscription } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
                if (session) {
                    const decodedToken = jwtDecode(session.access_token);
                    fetchUserData(decodedToken.sub).then(userData => {
                        dispatch({ type: 'LOGIN', payload: userData });
                    });
                }
            } else if (event === 'SIGNED_OUT') {
                dispatch({ type: 'LOGOUT' });
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const isAdmin = () => {
        return state.user && state.user.role.name === 'Admin';
    }

    const signup = async (email, password, firstName, lastName) => {
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            const data = await signUp(email, password, firstName, lastName);
            if (!data) throw new Error('No data returned from authentication service');

            const currentUser = await getCurrentUser();
            if (currentUser && currentUser.sub) {
                const userData = await fetchUserData(currentUser.sub);
                dispatch({ type: 'SIGNUP', payload: userData });
                return userData;
            } else {
                dispatch({ type: 'SET_LOADING', payload: false });
            }
        } catch (error) {
            console.error('Signup error:', error);
            dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to sign up' });
            throw error;
        }
    }

    const login = async (email, password) => {
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            const data = await signIn(email, password);

            if (!data) {
                throw new Error('No data returned from authentication service');
            }

            const currentUser = await getCurrentUser();
            if (currentUser && currentUser.sub) {
                const userData = await fetchUserData(currentUser.sub);
                dispatch({ type: 'LOGIN', payload: userData });
                return userData;
            } else {
                dispatch({ type: 'SET_LOADING', payload: false });
            }
        } catch (error) {
            console.error('Login error:', error);
            dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to sign in' });
            throw error;
        }
    };

    const logout = async () => {
        try {

            await supabase.auth.signOut();
            dispatch({ type: 'LOGOUT', payload: null });

        } catch (error) {
            dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to sign out' });
            console.error('Logout error:', error);
            throw error
        }
    }

    // Is delete relates to the flag if a user is deleting their image
    const profileUpdate = async (profileData, isDeleteImage) => {
        try {
            const updatedUser = await updateUserProfile(profileData, isDeleteImage);
            dispatch({ type: 'PROFILE_UPDATE', payload: { ...state.user, ...updatedUser } });

        } catch (error) {
            console.error('Profile update error:', error);
            dispatch({ type: 'SET_ERROR', payload: error.message || 'Failed to update profile' });
            throw error;
        }
    }


    return (
        <AuthContext.Provider value={{ ...state, dispatch, signup, login, logout, profileUpdate, isAdmin }}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export { AuthContext, AuthProvider };