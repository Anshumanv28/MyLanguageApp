import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://bjtjlipgvnzwehmsbqsj.supabase.co"; // Found in Supabase Dashboard -> Project Settings
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJqdGpsaXBndm56d2VobXNicXNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAzNTA1MzQsImV4cCI6MjA1NTkyNjUzNH0.692VgyXfvEejqwp4vNC2ZM3_yQCr5dzRkqimW43jBAc"; // Found in Supabase -> API Settings

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
