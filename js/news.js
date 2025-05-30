import supabase from './supabaseClient.js';

async function fetchNews() {
  try {
    console.log('Fetching news articles...');
    
    // First, check if we can connect to Supabase
    const { data: testData, error: testError } = await supabase
      .from('news')
      .select('count')
      .limit(1);
      
    if (testError) {
      console.error('Error connecting to Supabase:', testError);
      document.getElementById('news-list').innerHTML = `
        <p>Error connecting to the news database. Please try again later.</p>
        <p class="error-details">Details: ${testError.message || 'Unknown error'}</p>
      `;
      return;
    }
    
    // Now fetch the actual news data
    const { data, error } = await supabase
      .from('news')
      .select('*') // Select all columns to be safe
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching news:', error);
      document.getElementById('news-list').innerHTML = `
        <p>Error loading news articles. Please try again later.</p>
        <p class="error-details">Details: ${error.message || 'Unknown error'}</p>
      `;
      return;
    }

    if (!data || data.length === 0) {
      console.log('No news articles found');
      document.getElementById('news-list').innerHTML = '<p>No news articles yet.</p>';
      return;
    }
    
    console.log('Retrieved news articles:', data);

    document.getElementById('news-list').innerHTML = data.map(article => {
      // Safely access properties with fallbacks
      const id = article.id || '';
      const title = article.title || 'Untitled Article';
      const intro = article.intro || 'No description available';
      const imageUrl = article.image_url || '';
      const category = article.category || 'News';
      
      const hasImage = imageUrl && imageUrl.trim() !== '';
      
      return `
      <div class="news-item">
        <div class="news-item-content">
          <div class="news-item-category">${category}</div>
          <a href="/news/${article.slug || article.id}" class="news-item-title-link">
            <div class="news-item-title">${title}</div>
          </a>
          ${!hasImage ? `<div class="news-item-intro-preview">${intro}</div>` : ''}
          ${hasImage ? 
            `<div class="news-item-image-container">
              <img src="${imageUrl}" alt="${title}" class="news-item-image">
             </div>` : ''
          }
        </div>
      </div>
    `}).join('');
  } catch (err) {
    console.error('Unexpected error in fetchNews:', err);
    document.getElementById('news-list').innerHTML = `
      <p>An unexpected error occurred. Please try again later.</p>
      <p class="error-details">Details: ${err.message || 'Unknown error'}</p>
    `;
  }
}

// Initialize the page
fetchNews();
