import supabase from './supabaseClient.js';

// Get article slug from URL query parameter
function getArticleSlug() {
  const urlParams = new URLSearchParams(window.location.search);
  const slug = urlParams.get('slug') || '';
  // Decode the slug to handle URL-encoded characters like %20
  return decodeURIComponent(slug);
}


async function fetchArticle() {
  try {
    console.log('Fetching article details...');
    const slug = getArticleSlug();
    
    if (!slug) {
      console.log('No article slug provided in URL');
      document.getElementById('article-title').textContent = 'Article Not Found';
      document.getElementById('article-intro').textContent = 'The requested article could not be found.';
      return;
    }
    
    console.log('Fetching article with slug:', slug);

    // First check if we can connect to Supabase
    const { data: testData, error: testError } = await supabase
      .from('news')
      .select('count')
      .limit(1);
      
    if (testError) {
      console.error('Error connecting to Supabase:', testError);
      document.getElementById('article-title').textContent = 'Database Error';
      document.getElementById('article-intro').textContent = `Error connecting to the database: ${testError.message || 'Unknown error'}`;
      return;
    }

    // Fetch the article by slug
    console.log('Looking up article with slug:', slug);
    
    // First try direct match with the exact slug
    const { data: article, error: fetchError } = await supabase
      .from('news')
      .select('*')
      .or(`slug.eq.${slug},slug.eq.${slug.replace(/-/g, ' ')},id.eq.${slug}`)
      .single();
      
    if (fetchError) {
      console.error('Error fetching article:', fetchError);
      // Fallback to ID if slug not found
      if (fetchError.code === 'PGRST116') {
        const { data: articleById, error: idError } = await supabase
          .from('news')
          .select('*')
          .eq('id', slug)
          .single();
          
        if (idError) {
          throw idError;
        }
        
        // If we found by ID, redirect to the canonical URL with slug
        if (articleById && articleById.slug) {
          window.location.href = `/news/${articleById.slug}`;
          return;
        }
      }
      
      document.getElementById('article-title').textContent = 'Database Error';
      document.getElementById('article-intro').textContent = `Error: ${fetchError.message || 'Article not found'}`;
      return;
    }
    
    if (!article) {
      throw new Error('Article not found');
    }
    
    if (!article) {
      console.log('No article found with slug:', slugToFind);
      document.getElementById('article-title').textContent = 'Article Not Found';
      document.getElementById('article-intro').textContent = 'The requested article could not be found.';
      return;
    }
    
    const data = article;

    // The article check is now handled earlier in the code
    
    console.log('Article data retrieved:', data);
    
    // Safely access properties with fallbacks
    const title = data.title || 'Untitled Article';
    const intro = data.intro || 'No description available';
    const content = data.content || 'No content available';
    const imageUrl = data.image_url || '';
    const category = data.category || 'News';
    
    // Update the DOM with article data
    document.getElementById('article-title').textContent = title;
    document.getElementById('article-intro').textContent = intro;
    
    // Add category if available
    if (category) {
      const categoryElement = document.createElement('div');
      categoryElement.className = 'article-category';
      categoryElement.textContent = category;
      document.getElementById('article-intro').before(categoryElement);
    }
    
    // Add image if available
    if (imageUrl && imageUrl.trim() !== '') {
      const imageContainer = document.createElement('div');
      imageContainer.className = 'article-image-container';
      imageContainer.innerHTML = `<img src="${imageUrl}" alt="${title}" class="article-image">`;
      document.getElementById('article-intro').after(imageContainer);
    }
    
    document.getElementById('article-content').innerHTML = content;
  } catch (err) {
    console.error('Unexpected error in fetchArticle:', err);
    document.getElementById('article-title').textContent = 'Error';
    document.getElementById('article-intro').textContent = `An unexpected error occurred: ${err.message || 'Unknown error'}`;
  }
}

fetchArticle();
