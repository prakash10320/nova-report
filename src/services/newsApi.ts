
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

const generateAISummary = (content: string): string[] => {
  if (!content || content.length < 100) {
    return [
      'Key developments are being monitored by industry experts',
      'This story continues to evolve with new information emerging',
      'Stakeholders are analyzing the potential long-term implications'
    ];
  }
  
  // Extract key sentences and create AI-style summary points
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 30);
  const summaryPoints = [];
  
  if (sentences.length >= 3) {
    summaryPoints.push(`Key Finding: ${sentences[0].trim().substring(0, 120)}...`);
    summaryPoints.push(`Impact Analysis: ${sentences[Math.floor(sentences.length/2)].trim().substring(0, 120)}...`);
    summaryPoints.push(`Future Outlook: ${sentences[sentences.length-1].trim().substring(0, 120)}...`);
  } else {
    summaryPoints.push('Breaking developments are being closely monitored');
    summaryPoints.push('Expert analysis suggests significant implications ahead');
    summaryPoints.push('This story will continue to develop with new information');
  }
  
  return summaryPoints;
};

export const fetchNews = async (params: NewsApiParams = {}) => {
  try {
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

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('API Response data received:', data);

    // Handle error from API
    if (data.error) {
      throw new Error(data.error);
    }

    // Transform the API response to match our Article interface
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
        image: item.image || item.image_url || item.img || `https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=400&fit=crop&auto=format&q=80`,
        category: params.category || 'technology',
        sentiment: generateSentiment(),
        summary: generateAISummary(content),
        publishedAt: item.published_at || item.publishedAt || new Date().toISOString(),
        source: item.source || 'NewsWire',
        author: item.author || 'News Team',
        url: item.url || item.link || '#'
      };
    });

    console.log('Transformed articles:', articles);
    return articles;
  } catch (error) {
    console.error('Error fetching news from API:', error);
    throw error;
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
