
// Using the direct API endpoint provided by client
const API_BASE_URL = 'https://news-generator-api-l4yd.onrender.com';
const API_KEY = 'test5678'; // Using the test key that allows all domains

interface NewsApiParams {
  category?: string;
  count?: number;
  min_length?: number;
  max_length?: number;
  img_width?: number | null;
  img_height?: number | null;
  img_quality?: number | null;
}

const generateSentiment = (): 'positive' | 'neutral' | 'negative' => {
  const sentiments = ['positive', 'neutral', 'negative'];
  return sentiments[Math.floor(Math.random() * sentiments.length)] as 'positive' | 'neutral' | 'negative';
};

const generateSummary = (content: string): string[] => {
  if (!content || content.includes('Error:')) {
    return [
      'Breaking news article with latest updates',
      'Stay informed with real-time coverage',
      'Follow developments as they unfold'
    ];
  }
  
  const sentences = content.split('.').filter(s => s.trim().length > 20);
  const keyPoints = sentences.slice(0, 3).map((sentence, index) => {
    const points = [
      `Key finding: ${sentence.trim().substring(0, 80)}...`,
      `Important update: ${sentence.trim().substring(0, 80)}...`,
      `Notable development: ${sentence.trim().substring(0, 80)}...`
    ];
    return points[index] || `Summary point: ${sentence.trim().substring(0, 80)}...`;
  });
  
  return keyPoints.length > 0 ? keyPoints : [
    'Breaking news article with latest updates',
    'Stay informed with real-time coverage', 
    'Follow developments as they unfold'
  ];
};

export const fetchNews = async (params: NewsApiParams = {}) => {
  try {
    const defaultParams = {
      category: 'technology',
      count: 12,
      min_length: 700,
      max_length: 2000,
      img_width: null,
      img_height: null,
      img_quality: null,
      ...params
    };

    console.log('Fetching news directly from API:', defaultParams);

    const response = await fetch(`${API_BASE_URL}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': API_KEY
      },
      body: JSON.stringify(defaultParams)
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Direct API Response:', data);

    // Handle error from API
    if (data.error) {
      throw new Error(data.error);
    }

    // Transform the API response to match our Article interface
    const articlesArray = Array.isArray(data) ? data : [data];
    
    const articles = articlesArray.map((item: any, index: number) => ({
      id: `${Date.now()}-${index}`,
      title: item.title || item.headline || 'Breaking News',
      description: item.description || item.summary || item.content?.substring(0, 200) + '...' || 'Latest news update - stay informed with breaking developments.',
      content: item.content || item.body || item.text || 'Full article content will be available shortly. This is a developing story.',
      image: item.image || item.image_url || item.img || `https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=400&fit=crop&auto=format`,
      category: params.category || 'technology',
      sentiment: generateSentiment(),
      summary: generateSummary(item.content || item.body || item.text || ''),
      publishedAt: new Date().toISOString(),
    }));

    console.log('Transformed articles:', articles);
    return articles;
  } catch (error) {
    console.error('Error fetching news from API:', error);
    
    // Fallback with mock data if API fails
    const fallbackArticles = Array.from({ length: params.count || 12 }, (_, index) => ({
      id: `fallback-${Date.now()}-${index}`,
      title: `Breaking: ${params.category || 'Technology'} News Update ${index + 1}`,
      description: 'This is a fallback article while we work to restore the news feed. We apologize for any inconvenience.',
      content: 'We are currently experiencing technical difficulties with our news service. Our team is working to resolve this issue and restore full functionality. Please check back shortly for the latest news updates.',
      image: `https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=400&fit=crop&auto=format`,
      category: params.category || 'technology',
      sentiment: generateSentiment(),
      summary: [
        'Technical difficulties with news service detected',
        'Team working to restore full functionality',
        'Service expected to resume shortly'
      ],
      publishedAt: new Date().toISOString(),
    }));
    
    return fallbackArticles;
  }
};

export const searchNews = async (query: string) => {
  try {
    const articles = await fetchNews({ count: 20 });
    return articles.filter(article => 
      article.title.toLowerCase().includes(query.toLowerCase()) ||
      article.description.toLowerCase().includes(query.toLowerCase())
    );
  } catch (error) {
    console.error('Error searching news:', error);
    throw error;
  }
};
