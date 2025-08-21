
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

  const mockTitles = {
    technology: [
      'Revolutionary AI Breakthrough Changes Industry Standards',
      'New Quantum Computing Milestone Achieved by Research Team',
      'Major Tech Company Announces Sustainable Innovation Initiative',
      'Cybersecurity Expert Warns of Emerging Digital Threats',
      'Breakthrough in Renewable Energy Storage Technology',
    ],
    business: [
      'Global Markets React to New Economic Policy Announcement',
      'Startup Raises Record-Breaking Series A Funding Round',
      'Major Corporate Merger Creates Industry Giant',
      'Economic Growth Indicators Show Positive Trends',
      'New Trade Agreement Impacts International Commerce',
    ],
    sports: [
      'Championship Finals Set Record Viewership Numbers',
      'Rising Star Athlete Breaks Long-Standing World Record',
      'Major League Announces Expansion Plans for Next Season',
      'Olympic Preparations Intensify Across Multiple Nations',
      'Sports Medicine Breakthrough Aids Athlete Recovery',
    ],
    health: [
      'Medical Researchers Make Breakthrough in Treatment Development',
      'Global Health Initiative Launches Vaccination Campaign',
      'New Study Reveals Important Lifestyle Health Benefits',
      'Healthcare Technology Improves Patient Care Standards',
      'Mental Health Awareness Program Shows Positive Results',
    ],
    science: [
      'Space Mission Discovers Unprecedented Cosmic Phenomenon',
      'Climate Scientists Report Significant Environmental Changes',
      'Archaeological Team Uncovers Ancient Civilization Evidence',
      'Marine Biology Research Reveals New Ocean Species',
      'Particle Physics Experiment Confirms Theoretical Predictions',
    ],
    world: [
      'International Summit Addresses Global Climate Initiative',
      'Diplomatic Relations Strengthen Between Allied Nations',
      'Cultural Exchange Program Promotes International Understanding',
      'Humanitarian Efforts Provide Relief in Crisis Region',
      'World Leaders Collaborate on Sustainable Development Goals',
    ],
    entertainment: [
      'Film Festival Showcases Independent Cinema Talent',
      'Music Industry Adapts to Digital Streaming Revolution',
      'Television Series Breaks Streaming Platform Records',
      'Celebrity Philanthropist Launches Educational Foundation',
      'Arts Community Celebrates Cultural Heritage Month',
    ],
    general: [
      'Community Initiative Brings Positive Change to Local Area',
      'Educational Program Receives National Recognition Award',
      'Environmental Conservation Effort Shows Promising Results',
      'Public Safety Measures Enhance Community Security',
      'Local Business Innovation Supports Economic Growth',
    ]
  };

  const categoryTitles = mockTitles[category as keyof typeof mockTitles] || mockTitles.general;
  const mockArticles = [];
  
  for (let i = 0; i < count; i++) {
    const titleIndex = i % categoryTitles.length;
    const title = categoryTitles[titleIndex];
    
    mockArticles.push({
      id: `mock-${category}-${Date.now()}-${i}`,
      title: title,
      description: `Comprehensive coverage of ${title.toLowerCase()}. Our expert team provides in-depth analysis and reporting on this developing story, bringing you the latest updates and insights from reliable sources.`,
      content: `${title}

In a significant development within the ${category} sector, new information has emerged that continues to reshape our understanding of current industry trends and developments.

This comprehensive report examines the multifaceted implications of recent developments, providing readers with essential context and expert analysis. Industry specialists have been monitoring these changes closely, offering valuable perspectives on potential outcomes and future directions.

The story involves numerous stakeholders across different sectors, each bringing unique viewpoints and expertise to the discussion. These diverse perspectives help illuminate the broader significance of recent events and their potential long-term impact.

Current analysis suggests that these developments represent more than isolated incidents, instead indicating broader shifts within the industry landscape. Understanding these changes requires careful examination of underlying factors and emerging patterns.

Expert commentary from leading authorities in the field provides additional insight into the complexities surrounding this evolving situation. Their analysis helps contextualize recent events within the broader framework of industry development and market dynamics.

As this story continues to unfold, our newsroom remains committed to providing accurate, timely reporting that keeps readers informed about important developments. We continue to monitor the situation closely and will provide updates as new information becomes available.

The implications of these developments extend beyond immediate industry concerns, potentially influencing policy decisions and strategic planning across multiple sectors. This broader impact underscores the importance of continued attention to these evolving circumstances.`,
      image: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 100000000)}?w=800&h=400&fit=crop&auto=format&q=80&sig=${Math.random()}`,
      category: category,
      sentiment: ['positive', 'neutral', 'negative'][Math.floor(Math.random() * 3)] as 'positive' | 'neutral' | 'negative',
      summary: [
        `Key Development: ${title.substring(0, 100)}...`,
        `Industry Impact: Experts analyze potential effects on ${category} sector growth and innovation`,
        `Future Outlook: Continued monitoring reveals emerging trends and strategic implications`
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
    // Try the API first with a longer timeout for slow server
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

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

    // Handle both single article and array responses
    let articlesArray = [];
    
    if (Array.isArray(data)) {
      articlesArray = data;
    } else if (data.articles && Array.isArray(data.articles)) {
      articlesArray = data.articles;
    } else if (data.title || data.headline) {
      // Single article response
      articlesArray = [data];
    } else {
      throw new Error('Invalid API response format');
    }
    
    const articles = articlesArray.map((item: NewsApiResponse, index: number) => {
      const content = item.content || item.body || item.text || '';
      const title = item.title || item.headline || `Breaking ${params.category || 'Technology'} News`;
      const description = item.description || item.summary || (content.substring(0, 200) + '...');
      
      return {
        id: `api-${Date.now()}-${index}-${Math.random()}`,
        title: title,
        description: description,
        content: content || `This is a comprehensive report about ${title.toLowerCase()}. Our editorial team provides detailed analysis and expert insights into this developing story, offering readers essential context and understanding of the broader implications. The story continues to evolve as new information becomes available from reliable sources and industry experts.`,
        image: item.image || item.image_url || item.img || `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 100000000)}?w=800&h=400&fit=crop&auto=format&q=80&sig=${Math.random()}`,
        category: params.category || 'technology',
        sentiment: generateSentiment(),
        summary: generateAISummary(content, params.category || 'technology'),
        publishedAt: item.published_at || item.publishedAt || new Date(Date.now() - Math.floor(Math.random() * 12 * 60 * 60 * 1000)).toISOString(),
        source: item.source || 'NewsWire',
        author: item.author || 'News Team',
        url: item.url || item.link || '#'
      };
    });

    console.log('Successfully transformed API articles:', articles.length);
    
    // If we got fewer articles than requested, pad with some mock articles
    if (articles.length < (params.count || 12)) {
      const additionalMockCount = (params.count || 12) - articles.length;
      const mockArticles = generateMockArticles(params.category || 'technology', additionalMockCount);
      articles.push(...mockArticles);
    }
    
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
