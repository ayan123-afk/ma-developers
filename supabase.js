import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.3/+esm';

const supabaseUrl = 'https://oemvnqqutnjcjdniikav.supabase.co';
const supabaseKey = 'sb_publishable_EXlYEOQCtIayaRgM8do3Bg_tVLyYTux';

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function fetchProjects() {
    const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
    if (error) console.error('Fetch error:', error);
    return data || [];
}

export async function uploadImage(file) {
    try {
        const fileExt = file.name.split('.').pop();
        // Create a unique clean filename
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `projects/${fileName}`;

        // Upload to bucket
        const { data, error } = await supabase.storage
            .from('madevelopers')
            .upload(filePath, file, { cacheControl: '3600', upsert: true });

        if (error) throw error;

        // Get public URL
        const { data: publicUrlData } = supabase.storage
            .from('madevelopers')
            .getPublicUrl(filePath);

        return { success: true, url: publicUrlData.publicUrl };
    } catch (err) {
        console.error('Storage Error:', err);
        return { success: false, error: err.message || 'Failed to upload image' };
    }
}

export async function addProject(projectData) {
    try {
        const { data, error } = await supabase.from('projects').insert([projectData]);
        if (error) throw error;
        return { success: true, data };
    } catch (err) {
        console.error('Database Error:', err);
        return { success: false, error: err.message || 'Failed to insert to database' };
    }
}
