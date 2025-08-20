
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

const generateSentiment = (): 'positive' | 'neutral' | 'negative' => {
  const sentiments = ['positive', 'neutral', 'negative'];
  return sentiments[Math.floor(Math.random() * sentiments.length)] as 'positive' | 'neutral' | 'negative';
};

const generateSummary = (content: string): string[] => {
  // Simple AI-like summary generation (in a real app, this would be server-side)
  const sentences = content.split('.').filter(s => s.trim().length > 20);
  const keyPoints = sentences.slice(0, 3).map((sentence, index) => {
    const points = [
      `Key finding: ${sentence.trim().substring(0, 80)}...`,
      `Important update: ${sentence.trim().substring(0, 80)}...`,
      `Notable development: ${sentence.trim().substring(0, 80)}...`
    ];
    return points[index] || `Summary point: ${sentence.trim().substring(0, 80)}...`;
  });
  
  return keyPoints;
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

    const response = await fetch(`${API_BASE_URL}/generate-news`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': API_KEY,
      },
      body: JSON.stringify(defaultParams)
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    console.log('API Response:', data);

    // Transform the API response to match our Article interface
    const articles = data.map((item: any, index: number) => ({
      id: `${Date.now()}-${index}`,
      title: item.title || 'Breaking News',
      description: item.description || item.content?.substring(0, 200) + '...' || 'No description available',
      content: item.content || 'Content not available',
      image: item.image || `https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=400&fit=crop&auto=format`,
      category: params.category || 'technology',
      sentiment: generateSentiment(),
      summary: generateSummary(item.content || ''),
      publishedAt: new Date().toISOString(),
    }));

    return articles;
  } catch (error) {
    console.error('Error fetching news:', error);
    throw error;
  }
};

export const searchNews = async (query: string) => {
  // In a real implementation, this would search the API
  // For now, we'll fetch general news and filter by query
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
