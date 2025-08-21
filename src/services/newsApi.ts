
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
  
  // Generate diverse images for each category
  const categoryImages = {
    technology: [
      'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1563206767-5b18f218e8de?w=800&h=400&fit=crop'
    ],
    business: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=400&fit=crop'
    ],
    sports: [
      'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1546525848-3ce03ca516f6?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1593030103066-0093718efeb9?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1571002857488-d8c470449ba6?w=800&h=400&fit=crop'
    ],
    health: [
      'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1571772996211-2f02c9727629?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&h=400&fit=crop'
    ],
    science: [
      'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1562736103-0ed70a7bd32e?w=800&h=400&fit=crop'
    ],
    world: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1589519160732-57fc498494f8?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1521295121783-8a321d551ad2?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1569098644584-210bcd375b59?w=800&h=400&fit=crop'
    ],
    entertainment: [
      'https://images.unsplash.com/photo-1489599375274-055414489dfb?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1594736797933-d0cccba59711?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1518929458119-e5bf444c30f4?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&h=400&fit=crop'
    ],
    general: [
      'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1432821596592-e2c18b78144f?w=800&h=400&fit=crop',
      'https://images.unsplash.com/photo-1444653614773-995cb1ef9efa?w=800&h=400&fit=crop'
    ]
  };
  
  const images = categoryImages[category as keyof typeof categoryImages] || categoryImages.general;
  
  for (let i = 0; i < count; i++) {
    const titleIndex = i % categoryTitles.length;
    const imageIndex = i % images.length;
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
      image: images[imageIndex],
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

// Enhanced image URL validation and fixing
const validateAndFixImageUrl = (url: string): string | null => {
  if (!url) return null;
  
  // Clean up the URL
  const cleanUrl = url.trim().replace(/[\[\]"']/g, '');
  
  // Check if it's a valid URL
  if (!cleanUrl.match(/^https?:\/\/.+/)) return null;
  
  // Check if it's a direct image URL
  if (cleanUrl.match(/\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i)) {
    return cleanUrl;
  }
  
  // For Unsplash URLs, ensure proper format
  if (cleanUrl.includes('unsplash.com')) {
    if (!cleanUrl.includes('?')) {
      return `${cleanUrl}?w=800&h=400&fit=crop&auto=format&q=80`;
    }
    return cleanUrl;
  }
  
  return cleanUrl;
};

export const fetchNews = async (params: NewsApiParams = {}) => {
  const defaultParams = {
    category: 'technology',
    count: 15,
    min_length: 1200,
    max_length: 3000,
    img_width: 800,
    img_height: 400,
    img_quality: 85,
    ...params
  };

  console.log('Fetching news with params:', defaultParams);

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 45000); // 45 second timeout

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
    console.log('API Response received:', data);

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
      articlesArray = [data];
    } else {
      throw new Error('Invalid API response format');
    }
    
    const articles = articlesArray.map((item: NewsApiResponse, index: number) => {
      const content = item.content || item.body || item.text || '';
      const title = item.title || item.headline || `Breaking ${params.category || 'Technology'} News`;
      const description = item.description || item.summary || (content.substring(0, 200) + '...');
      
      // Enhanced image URL handling
      let imageUrl = null;
      const possibleImageFields = [
        item.image, item.image_url, item.img, item.photo, item.picture,
        item.featured_image, item.thumbnail, item.media
      ];
      
      for (const field of possibleImageFields) {
        if (field) {
          imageUrl = validateAndFixImageUrl(field);
          if (imageUrl) break;
        }
      }
      
      // If no valid image found, use category-specific fallback
      if (!imageUrl) {
        const categoryImages = {
          technology: `https://images.unsplash.com/photo-${1518709268805 + index}?w=800&h=400&fit=crop&auto=format&q=80`,
          business: `https://images.unsplash.com/photo-${1486406146926 + index}?w=800&h=400&fit=crop&auto=format&q=80`,
          sports: `https://images.unsplash.com/photo-${1461896836934 + index}?w=800&h=400&fit=crop&auto=format&q=80`,
          health: `https://images.unsplash.com/photo-${1559757148000 + index}?w=800&h=400&fit=crop&auto=format&q=80`,
          science: `https://images.unsplash.com/photo-${1532094349884 + index}?w=800&h=400&fit=crop&auto=format&q=80`,
          entertainment: `https://images.unsplash.com/photo-${1489599375274 + index}?w=800&h=400&fit=crop&auto=format&q=80`,
          world: `https://images.unsplash.com/photo-${1506905925346 + index}?w=800&h=400&fit=crop&auto=format&q=80`,
          general: `https://images.unsplash.com/photo-${1504711434969 + index}?w=800&h=400&fit=crop&auto=format&q=80`
        };
        
        imageUrl = categoryImages[params.category as keyof typeof categoryImages] || categoryImages.general;
      }
      
      return {
        id: `api-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`,
        title: title,
        description: description,
        content: content || `This is a comprehensive report about ${title.toLowerCase()}. Our editorial team provides detailed analysis and expert insights into this developing story, offering readers essential context and understanding of the broader implications. The story continues to evolve as new information becomes available from reliable sources and industry experts.`,
        image: imageUrl,
        category: params.category || 'technology',
        sentiment: generateSentiment(),
        summary: generateAISummary(content, params.category || 'technology'),
        publishedAt: item.published_at || item.publishedAt || new Date(Date.now() - Math.floor(Math.random() * 12 * 60 * 60 * 1000)).toISOString(),
        source: item.source || 'NewsWire',
        author: item.author || 'News Team',
        url: item.url || item.link || '#'
      };
    });

    console.log('Successfully processed API articles:', articles.length);
    
    return articles;

  } catch (error) {
    console.warn('API failed, using mock data:', error);
    return generateMockArticles(params.category || 'technology', params.count || 15);
  }
};

export const searchNews = async (query: string) => {
  if (!query.trim()) return [];
  
  console.log('Searching for:', query);
  
  try {
    // Try to search using the API with search-like parameters
    const searchParams = {
      category: 'general',
      count: 20,
      min_length: 800,
      max_length: 2500
    };
    
    const articles = await fetchNews(searchParams);
    
    // Filter articles based on search query
    const filteredArticles = articles.filter(article => 
      article.title.toLowerCase().includes(query.toLowerCase()) ||
      article.description.toLowerCase().includes(query.toLowerCase()) ||
      article.content.toLowerCase().includes(query.toLowerCase()) ||
      article.category.toLowerCase().includes(query.toLowerCase())
    );
    
    // If no matches found, generate some mock search results
    if (filteredArticles.length === 0) {
      const mockSearchResults = generateMockArticles('general', 5).map(article => ({
        ...article,
        title: `${query.charAt(0).toUpperCase() + query.slice(1)} News: ${article.title}`,
        description: `Latest updates on ${query}. ${article.description}`,
        category: 'search'
      }));
      
      return mockSearchResults;
    }
    
    return filteredArticles;
    
  } catch (error) {
    console.error('Error searching news:', error);
    
    // Return mock search results as fallback
    const mockResults = generateMockArticles('general', 5).map(article => ({
      ...article,
      title: `${query.charAt(0).toUpperCase() + query.slice(1)} News: ${article.title}`,
      description: `Latest updates on ${query}. ${article.description}`,
      category: 'search'
    }));
    
    return mockResults;
  }
};
