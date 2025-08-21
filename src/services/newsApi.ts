
// Mock news data generator for when API fails
const generateMockArticles = (category: string, count: number = 12) => {
  const categories = {
    general: 'Breaking News',
    technology: 'Tech Innovation',
    world: 'Global Affairs', 
    business: 'Market Updates',
    health: 'Health & Wellness',
    sports: 'Sports News',
    entertainment: 'Entertainment',
    science: 'Scientific Discovery'
  };

  const mockArticles = [];
  
  for (let i = 0; i < count; i++) {
    const categoryName = categories[category as keyof typeof categories] || 'Latest News';
    
    mockArticles.push({
      id: `mock-${category}-${Date.now()}-${i}`,
      title: `${categoryName}: Breaking Development in ${category.charAt(0).toUpperCase() + category.slice(1)} Sector ${i + 1}`,
      description: `This is a comprehensive report covering the latest developments in ${category}. Our expert analysis reveals important insights that could impact the future of this industry. Stay informed with our detailed coverage of this evolving story.`,
      content: `In a significant development within the ${category} sector, new information has emerged that could reshape our understanding of current trends. 

This breaking story involves multiple stakeholders and has implications that extend far beyond the immediate industry. Expert analysts have been closely monitoring the situation, providing crucial insights into what these changes might mean for consumers, businesses, and the broader market.

The development comes at a time when the ${category} industry is experiencing unprecedented growth and transformation. Industry leaders have been quick to respond, with many expressing both optimism and caution about the potential impacts.

Key stakeholders include major corporations, regulatory bodies, and consumer advocacy groups, all of whom have different perspectives on how this news will affect their respective interests. The complexity of the situation requires careful analysis to understand the full scope of implications.

Our newsroom has been working around the clock to verify information from multiple sources and provide our readers with the most accurate and up-to-date reporting available. We continue to monitor the situation closely and will provide updates as new information becomes available.

The story represents a significant shift in how the industry approaches key challenges, potentially setting new precedents for future developments. Early indicators suggest that this could be a turning point that influences policy decisions and corporate strategies for years to come.

As the situation continues to develop, we remain committed to providing comprehensive coverage that helps our readers understand not just what is happening, but why it matters and what it could mean for the future.`,
      image: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 100000000)}?w=800&h=400&fit=crop&auto=format&q=80&sig=${Math.random()}`,
      category: category,
      sentiment: ['positive', 'neutral', 'negative'][Math.floor(Math.random() * 3)] as 'positive' | 'neutral' | 'negative',
      summary: [
        `Breaking: Major developments reported in ${category} sector with industry-wide implications`,
        `Analysis: Experts predict significant changes ahead as new information emerges`,
        `Impact: Stakeholders across the industry are reassessing strategies and policies`
      ],
      publishedAt: new Date(Date.now() - Math.floor(Math.random() * 24 * 60 * 60 * 1000)).toISOString(),
      source: 'NewsWire Network',
      author: 'Editorial Team',
      url: '#'
    });
  }
  
  return mockArticles;
};

const API_BASE_URL = 'https://news-generator-api-l4yd.onrender.com';
const API_KEY = 'test5678';

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
  url?: string;
  link?: string;
  source?: string;
  author?: string;
  published_at?: string;
  publishedAt?: string;
  [key: string]: any;
}

const generateSentiment = (): 'positive' | 'neutral' | 'negative' => {
  const sentiments = ['positive', 'neutral', 'negative'];
  return sentiments[Math.floor(Math.random() * sentiments.length)] as 'positive' | 'neutral' | 'negative';
};

const generateAISummary = (content: string, category: string): string[] => {
  if (!content || content.length < 100) {
    return [
      `Breaking developments in ${category} sector are being monitored by industry experts`,
      'This story continues to evolve with new information emerging from reliable sources',
      'Stakeholders are analyzing the potential long-term implications for the market'
    ];
  }
  
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 30);
  const summaryPoints = [];
  
  if (sentences.length >= 3) {
    summaryPoints.push(`Key Finding: ${sentences[0].trim().substring(0, 120)}...`);
    summaryPoints.push(`Market Impact: ${sentences[Math.floor(sentences.length/2)].trim().substring(0, 120)}...`);
    summaryPoints.push(`Future Outlook: ${sentences[sentences.length-1].trim().substring(0, 120)}...`);
  } else {
    summaryPoints.push(`Breaking developments in ${category} are being closely monitored`);
    summaryPoints.push('Expert analysis suggests significant implications for industry stakeholders');
    summaryPoints.push('This story will continue to develop as new information becomes available');
  }
  
  return summaryPoints;
};

export const fetchNews = async (params: NewsApiParams = {}) => {
  const defaultParams = {
    category: 'technology',
    count: 12,
    min_length: 1200,
    max_length: 3000,
    img_width: 800,
    img_height: 400,
    img_quality: 85,
    ...params
  };

  console.log('Attempting to fetch news with params:', defaultParams);

  try {
    // Try the API first with a shorter timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const response = await fetch(`${API_BASE_URL}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': API_KEY,
        'Accept': 'application/json',
      },
      body: JSON.stringify(defaultParams),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    console.log('API Response status:', response.status);

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('API Response data received:', data);

    if (data.error) {
      throw new Error(data.error);
    }

    // Transform the API response
    const articlesArray = Array.isArray(data) ? data : [data];
    
    const articles = articlesArray.map((item: NewsApiResponse, index: number) => {
      const content = item.content || item.body || item.text || '';
      const title = item.title || item.headline || `Breaking ${params.category || 'Technology'} News`;
      const description = item.description || item.summary || (content.substring(0, 200) + '...');
      
      return {
        id: `api-${Date.now()}-${index}`,
        title: title,
        description: description,
        content: content || `This is a developing story about ${title.toLowerCase()}. Our newsroom is working to bring you comprehensive coverage with detailed analysis and expert insights. The full article content will provide in-depth reporting on this important development, including background information, expert opinions, and potential implications for the future. Stay tuned as we continue to monitor this situation and provide updates as new information becomes available.`,
        image: item.image || item.image_url || item.img || `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 100000000)}?w=800&h=400&fit=crop&auto=format&q=80&sig=${Math.random()}`,
        category: params.category || 'technology',
        sentiment: generateSentiment(),
        summary: generateAISummary(content, params.category || 'technology'),
        publishedAt: item.published_at || item.publishedAt || new Date().toISOString(),
        source: item.source || 'NewsWire',
        author: item.author || 'News Team',
        url: item.url || item.link || '#'
      };
    });

    console.log('Successfully transformed API articles:', articles.length);
    return articles;

  } catch (error) {
    console.warn('API failed, using mock data:', error);
    
    // Return mock data when API fails
    const mockArticles = generateMockArticles(params.category || 'technology', params.count || 12);
    console.log('Generated mock articles:', mockArticles.length);
    return mockArticles;
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
    // Return mock search results
    return generateMockArticles('general', 10).filter(article =>
      article.title.toLowerCase().includes(query.toLowerCase()) ||
      article.description.toLowerCase().includes(query.toLowerCase())
    );
  }
};
