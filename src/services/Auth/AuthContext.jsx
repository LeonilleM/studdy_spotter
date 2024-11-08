import { createContext, useReducer, useEffect } from 'react';
import PropTypes from 'prop-types';
import { supabase } from '../supabase/supabase';
import { getCurrentUser, fetchUserData, signIn } from '../Auth/Auth';

const AuthContext = createContext();

const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            return {
                ...state,
                user: action.payload,
                isAuthenticated: true,
                isLoading: false
            };
        case 'LOGOUT':
            return {
                ...state,
                user: null,
                isAuthenticated: false,
                isLoading: false
            };
        case 'SET_LOADING':
            return {
                ...state,
                isLoading: action.payload
            };
        default:
            return state;
    }
};

const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, {
        user: null,
        isAuthenticated: false,
        isLoading: true
    });

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const currentUser = getCurrentUser();
                if (currentUser) {
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
    }, []);

    const login = async (email, password, rememberMe) => {

        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            const data = await signIn(email, password);

            if (!data) {
                throw new Error('No data returned from authentication service');
            }

            if (rememberMe) {
                // Store the JWT in sessionStorage
                sessionStorage.setItem('supabase.auth.token', data.session.access_token);
            }

            const userData = await fetchUserData(data.user.id);
            dispatch({ type: 'LOGIN', payload: userData });
            return userData;
        } catch (error) {
            dispatch({ type: 'SET_LOADING', payload: false });
            throw error; // Re-throw to handle in the component
        }
    };

    const logout = async () => {
        try {
            await supabase.auth.signOut();
            dispatch({ type: 'LOGOUT' });
        } catch (error) {
            console.error('Logout error:', error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ ...state, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export { AuthContext, AuthProvider };