import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://acjvweypsumucqdjpwol.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjanZ3ZXlwc3VtdWNxZGpwd29sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyNTkwNDcsImV4cCI6MjA2MzgzNTA0N30.58MzplJo9fhKNAwA47-filLWKhlskv5lwY8IUQM0cys';

export const supabase = createClient(supabaseUrl, supabaseKey);
