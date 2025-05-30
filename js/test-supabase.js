import supabase from './supabaseClient.js';

async function testSupabaseConnection() {
  console.log('Testing Supabase connection...');
  
  try {
    // List all tables in the public schema
    const { data: tables, error: tablesError } = await supabase
      .from('news')
      .select('*')
      .limit(5);
    
    if (tablesError) {
      console.error('Error fetching news table:', tablesError);
    } else {
      console.log('News table data:', tables);
    }
  } catch (error) {
    console.error('Error testing Supabase connection:', error);
  }
}

testSupabaseConnection();
