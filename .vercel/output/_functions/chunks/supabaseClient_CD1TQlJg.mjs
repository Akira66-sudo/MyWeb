import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://emkdrleoagjxyhpyhflt.supabase.co";
const supabaseKey = "sb_publishable_vLSNWb-12yQVsXQRjoLtfg_dDCqQXM1";
const supabase = createClient(supabaseUrl, supabaseKey) ;

export { supabase as s };
