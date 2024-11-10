import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        persistSession: true,
        storage: window.localStorage // Default to sessionStorage
    }
});

// For Remember Me functionality
export const createPersistentClient = () => {
    return createClient(supabaseUrl, supabaseKey, {});
}