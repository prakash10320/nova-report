
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

interface NewsApiResponse {
  title?: string;
  headline?: string;
  description?: string;
  summary?: string;
  content?: string;
  body?: string;
  text?: string;
  image?: string;
  image_url?: string;
  img?: string;
  [key: string]: any;
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

// Different images for different categories
const getCategoryImage = (category: string, index: number = 0): string => {
  const imageMap: { [key: string]: string[] } = {
    technology: [
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=400&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=400&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=400&fit=crop&auto=format'
    ],
    sports: [
      'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=400&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=400&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=800&h=400&fit=crop&auto=format'
    ],
    business: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=400&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=400&fit=crop&auto=format'
    ],
    health: [
      'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=400&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&h=400&fit=crop&auto=format'
    ],
    general: [
      'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=400&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=800&h=400&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&h=400&fit=crop&auto=format'
    ]
  };

  const categoryImages = imageMap[category] || imageMap.general;
  return categoryImages[index % categoryImages.length];
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

    console.log('Fetching news with params:', defaultParams);

    const response = await fetch(`${API_BASE_URL}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': API_KEY,
        'Accept': 'application/json',
      },
      body: JSON.stringify(defaultParams)
    });

    console.log('API Response status:', response.status);
    console.log('API Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('API Response data:', data);

    // Handle error from API
    if (data.error) {
      throw new Error(data.error);
    }

    // Transform the API response to match our Article interface
    const articlesArray = Array.isArray(data) ? data : [data];
    
    const articles = articlesArray.map((item: NewsApiResponse, index: number) => ({
      id: `api-${Date.now()}-${index}`,
      title: item.title || item.headline || `Breaking ${params.category || 'Technology'} News ${index + 1}`,
      description: item.description || item.summary || (item.content?.substring(0, 200) + '...') || 'Latest news update - stay informed with breaking developments.',
      content: item.content || item.body || item.text || 'Full article content will be available shortly. This is a developing story with more details to follow.',
      image: item.image || item.image_url || item.img || getCategoryImage(params.category || 'technology', index),
      category: params.category || 'technology',
      sentiment: generateSentiment(),
      summary: generateSummary(item.content || item.body || item.text || ''),
      publishedAt: new Date().toISOString(),
    }));

    console.log('Transformed articles:', articles);
    return articles;
  } catch (error) {
    console.error('Error fetching news from API:', error);
    
    // Enhanced fallback with different images and more realistic content
    const fallbackArticles = Array.from({ length: params.count || 12 }, (_, index) => ({
      id: `fallback-${Date.now()}-${index}`,
      title: [
        `Breaking: Major ${params.category || 'Technology'} Development Unfolds`,
        `Latest ${params.category || 'Technology'} Innovation Changes Everything`,
        `${params.category || 'Technology'} Industry Sees Unprecedented Growth`,
        `New ${params.category || 'Technology'} Breakthrough Announced Today`,
        `${params.category || 'Technology'} Experts Share Critical Insights`,
        `Important ${params.category || 'Technology'} Update for This Week`
      ][index % 6],
      description: [
        'Industry leaders are closely monitoring this developing situation as it could have far-reaching implications for the future.',
        'Recent developments have caught the attention of experts worldwide, with many calling it a game-changing moment.',
        'This significant announcement has sparked widespread discussion and analysis across various platforms.',
        'Sources close to the matter suggest this could be one of the most important developments this year.',
        'Preliminary reports indicate substantial interest from major stakeholders and industry participants.',
        'The latest information suggests this development will have lasting impact on the entire sector.'
      ][index % 6],
      content: [
        'This developing story continues to evolve as new information becomes available. Industry experts are analyzing the potential implications and long-term effects of this significant development. Stay tuned for more updates as we continue to monitor the situation.',
        'Recent analysis suggests that this development represents a major shift in current market dynamics. Leading professionals in the field have shared their perspectives on what this means for future trends and opportunities.',
        'The announcement has generated considerable interest from various sectors, with many viewing it as a pivotal moment. Our team continues to gather information and will provide comprehensive coverage as details emerge.',
        'Initial reactions from industry leaders have been largely positive, with many expressing optimism about the potential benefits. We are tracking all related developments and will keep you informed of any significant updates.',
        'This story has captured widespread attention due to its potential impact on current industry standards. Experts are conducting detailed analysis to understand the full scope of implications.',
        'The development marks an important milestone that could influence future decisions and strategies across the sector. We continue to monitor all aspects of this evolving situation.'
      ][index % 6],
      image: getCategoryImage(params.category || 'technology', index),
      category: params.category || 'technology',
      sentiment: generateSentiment(),
      summary: [
        ['Major development creates industry-wide impact', 'Expert analysis reveals significant implications', 'Stakeholders closely monitoring the situation'],
        ['Innovation breakthrough captures global attention', 'Industry leaders share positive outlook', 'Long-term benefits expected for sector'],
        ['Market dynamics shift due to new announcement', 'Professional analysis highlights key changes', 'Future trends likely to be influenced'],
        ['Stakeholder interest reaches unprecedented levels', 'Comprehensive analysis currently underway', 'Significant updates expected soon'],
        ['Industry standards may face important changes', 'Expert evaluation reveals critical insights', 'Sector-wide implications being assessed'],
        ['Milestone achievement recognized across industry', 'Strategic impact analysis in progress', 'Future decisions likely to be influenced']
      ][index % 6],
      publishedAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
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
