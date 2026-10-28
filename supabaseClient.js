// supabaseClient.js

// 1. Grab your keys from your Supabase Dashboard (Project Settings > API)
const SUPABASE_URL = 'https://rjncujztrrztbpnwfhjw.supabase.co/rest/v1/';
const SUPABASE_ANON_KEY = 'sb_publishable_yLaqADba-ewEoAh4IsaYIA_gQGmzpsD';

// 2. Initialize the Supabase client
const { createClient } = supabase;
export const _supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY); 