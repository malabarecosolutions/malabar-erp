// lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gulvosshlwykjwekiklp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd1bHZvc3NobHd5a2p3ZWtpa2xwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM3NDg4MDUsImV4cCI6MjA1OTMyNDgwNX0.aFNcI3Iwv2Na7CmeGc__Xn9411CNcxR4NgFLfiFiwic';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);