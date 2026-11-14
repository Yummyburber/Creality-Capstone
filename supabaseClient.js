// Supabase project configuration
const SUPABASE_URL = "https://rjncujztrrztbpnwfhjw.supabase.co";

// Public publishable key (safe for browser use)
const SUPABASE_ANON_KEY = "sb_publishable_yLaqADba-ewEoAh4IsaYIA_gQGmzpsD";

// Initialize Supabase once and make it available to other scripts
window._supabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);