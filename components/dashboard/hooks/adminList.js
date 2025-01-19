import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

export async function getAdminList() {
    try {
        const { data, error } = await supabase.from('admin').select('*');

        if (error) {
            console.error("Error in Fetching Admin List from Supabase : ", error)
        }

        return data;
    } catch (error) {
        console.error("Error in Fetching Admin List from Supabase : ", error)
    }
}