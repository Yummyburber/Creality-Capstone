// supabaseClient.js

// 1. Base URL only (Removed /rest/v1/)
const SUPABASE_URL = 'https://rjncujztrrztbpnwfhjw.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_yLaqADba-ewEoAh4IsaYIA_gQGmzpsD';

// 2. Initialize the Supabase client globally so script.js can see it
const _supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);