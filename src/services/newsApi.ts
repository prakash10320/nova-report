
// Using your Flask backend instead of direct API calls
const BACKEND_BASE_URL = 'http://localhost:5000';

interface NewsApiParams {
  category?: string;
  count?: number;
}

const generateSentiment = (): 'positive' | 'neutral' | 'negative' => {
  const sentiments = ['positive', 'neutral', 'negative'];
  return sentiments[Math.floor(Math.random() * sentiments.length)] as 'positive' | 'neutral' | 'negative';
};

const generateSummary = (content: string): string[] => {
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
      ...params
    };

    console.log('Fetching news from Flask backend:', defaultParams);

    const queryParams = new URLSearchParams({
      category: defaultParams.category,
      count: defaultParams.count.toString()
    });

    const response = await fetch(`${BACKEND_BASE_URL}/get-news?${queryParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`Backend request failed: ${response.status}`);
    }

    const data = await response.json();
    console.log('Backend Response:', data);

    // Handle error from backend
    if (data.error) {
      throw new Error(data.error);
    }

    // Transform the backend response to match our Article interface
    const articles = (Array.isArray(data) ? data : [data]).map((item: any, index: number) => ({
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
    console.error('Error fetching news from backend:', error);
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
