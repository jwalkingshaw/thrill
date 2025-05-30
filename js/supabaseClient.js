// Supabase client setup
// These are the Supabase project URL and anon key
const SUPABASE_URL = "https://kgdqqpskaetkrirrxugd.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtnZHFxcHNrYWV0a3JpcnJ4dWdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4NzUyMDcsImV4cCI6MjA2MzQ1MTIwN30.828PSrhZs5mhQC1U7NyLTv5_Q2Ab3Fvnknq6K-rD8qk";

// Create the Supabase client
let supabase;
try {
  supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  console.log('Supabase client initialized successfully');
} catch (error) {
  console.error('Error initializing Supabase client:', error);
  // Provide a fallback to prevent script errors
  supabase = {
    from: () => ({
      select: () => ({
        order: () => ({
          then: () => Promise.resolve({ data: [], error: { message: 'Supabase client failed to initialize' } })
        }),
        eq: () => ({
          single: () => Promise.resolve({ data: null, error: { message: 'Supabase client failed to initialize' } })
        })
      })
    })
  };
}

export default supabase;
