import { createContext, useReducer, useEffect } from 'react';
import PropTypes from 'prop-types';
import { supabase } from '../supabase/supabase';
import { getCurrentUser, fetchUserData, signIn } from '../Auth/Auth';
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

    const login = async (email, password, rememberMe) => {
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            const data = await signIn(email, password, rememberMe);

            if (!data) {
                throw new Error('No data returned from authentication service');
            }

            const currentUser = await getCurrentUser();
            if (currentUser && currentUser.sub) {
                const userData = await fetchUserData(currentUser.sub);
                dispatch({ type: 'LOGIN', payload: userData });
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
            dispatch({ type: 'LOGOUT, payload: null' });
            
        } catch (error) {
            console.error('Logout error:', error);
        }
    }


    return (
        <AuthContext.Provider value={{ ...state, dispatch, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export { AuthContext, AuthProvider };