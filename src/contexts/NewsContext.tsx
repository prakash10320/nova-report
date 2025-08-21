
import React, { createContext, useContext, useReducer, useEffect } from 'react';

interface Article {
  id: string;
  title: string;
  description: string;
  content: string;
  image: string;
  category: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
  summary?: string[];
  publishedAt: string;
  author?: string;
  source?: string;
  url?: string;
}

interface NewsState {
  articles: Article[];
  bookmarks: Article[];
  selectedCategory: string;
  isLoading: boolean;
  error: string | null;
}

type NewsAction =
  | { type: 'SET_ARTICLES'; payload: Article[] }
  | { type: 'ADD_BOOKMARK'; payload: Article }
  | { type: 'REMOVE_BOOKMARK'; payload: string }
  | { type: 'SET_CATEGORY'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'LOAD_FROM_STORAGE'; payload: Partial<NewsState> };

const initialState: NewsState = {
  articles: [],
  bookmarks: [],
  selectedCategory: 'general',
  isLoading: false,
  error: null,
};

const newsReducer = (state: NewsState, action: NewsAction): NewsState => {
  switch (action.type) {
    case 'SET_ARTICLES':
      return { ...state, articles: action.payload, isLoading: false, error: null };
    case 'ADD_BOOKMARK':
      const newBookmarks = [...state.bookmarks, action.payload];
      localStorage.setItem('bookmarks', JSON.stringify(newBookmarks));
      return { ...state, bookmarks: newBookmarks };
    case 'REMOVE_BOOKMARK':
      const filteredBookmarks = state.bookmarks.filter(article => article.id !== action.payload);
      localStorage.setItem('bookmarks', JSON.stringify(filteredBookmarks));
      return { ...state, bookmarks: filteredBookmarks };
    case 'SET_CATEGORY':
      localStorage.setItem('selectedCategory', action.payload);
      return { ...state, selectedCategory: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'LOAD_FROM_STORAGE':
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

const NewsContext = createContext<{
  state: NewsState;
  dispatch: React.Dispatch<NewsAction>;
} | null>(null);

export const NewsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(newsReducer, initialState);

  useEffect(() => {
    // Load from localStorage on mount
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    const selectedCategory = localStorage.getItem('selectedCategory') || 'general';

    dispatch({
      type: 'LOAD_FROM_STORAGE',
      payload: { bookmarks, selectedCategory }
    });
  }, []);

  return (
    <NewsContext.Provider value={{ state, dispatch }}>
      {children}
    </NewsContext.Provider>
  );
};

export const useNews = () => {
  const context = useContext(NewsContext);
  if (!context) {
    throw new Error('useNews must be used within a NewsProvider');
  }
  return context;
};

export type { Article };
