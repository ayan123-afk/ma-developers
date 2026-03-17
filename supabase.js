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
        console.error('Error fetching projects:', error.message);
        return [];
    }
    return data;
}

// Upload Image Function
export async function uploadImage(file) {
    try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `projects/${fileName}`;

        // Upload to 'madevelopers' bucket
        const { data, error } = await supabase.storage
            .from('madevelopers')
            .upload(filePath, file, { cacheControl: '3600', upsert: false });

        if (error) {
            console.error('Supabase Storage Error:', error.message);
            return { success: false, error: error.message };
        }

        // Get the public URL of the uploaded image
        const { data: publicUrlData } = supabase.storage
            .from('madevelopers')
            .getPublicUrl(filePath);

        return { success: true, url: publicUrlData.publicUrl };
    } catch (err) {
        console.error('Unexpected Upload Error:', err);
        return { success: false, error: 'Unexpected network error during upload.' };
    }
}

// Add Project Function
export async function addProject(projectData) {
    const { data, error } = await supabase
        .from('projects')
        .insert([projectData]);

    if (error) {
        console.error('Supabase Database Error:', error.message);
        return { success: false, error: error.message };
    }
    return { success: true, data };
}
