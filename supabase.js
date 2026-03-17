// Import Supabase Client from CDN
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.3/+esm';

// Supabase Configuration
const supabaseUrl = 'https://oemvnqqutnjcjdniikav.supabase.co';
const supabaseKey = 'sb_publishable_EXlYEOQCtIayaRgM8do3Bg_tVLyYTux';

// Initialize Supabase
export const supabase = createClient(supabaseUrl, supabaseKey);

// Fetch Projects Function
export async function fetchProjects() {
    const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching projects:', error);
        return [];
    }
    return data;
}

// Add Project Function
export async function addProject(projectData) {
    const { data, error } = await supabase
        .from('projects')
        .insert([projectData]);

    if (error) {
        console.error('Error adding project:', error);
        return { success: false, error };
    }
    return { success: true, data };
}
