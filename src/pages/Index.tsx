
import React, { useEffect, useState, useCallback } from 'react';
import { RefreshCw, AlertCircle, Wifi, WifiOff, TrendingUp } from 'lucide-react';
import { useNews } from '../contexts/NewsContext';
import { fetchNews } from '../services/newsApi';
import Navbar from '../components/Navbar';
import ArticleCard from '../components/ArticleCard';
import ArticleModal from '../components/ArticleModal';
import SkeletonCard from '../components/SkeletonCard';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from '@/hooks/use-toast';

const Index: React.FC = () => {
  const { state, dispatch } = useNews();
  const [selectedArticle, setSelectedArticle] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [retryCount, setRetryCount] = useState(0);

  // Network status monitoring
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (state.articles.length === 0) {
        loadNews(false);
      }
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadNews = useCallback(async (showLoading = true, isRetry = false) => {
    try {
      if (showLoading && state.articles.length === 0) {
        dispatch({ type: 'SET_LOADING', payload: true });
      }
      
      dispatch({ type: 'SET_ERROR', payload: null });
      
      console.log('Loading news for category:', state.selectedCategory);
      
      const categoryParam = state.selectedCategory === 'general' ? 'technology' : state.selectedCategory;
      const articles = await fetchNews({ 
        category: categoryParam,
        count: 12,
        min_length: 700,
        max_length: 2000
      });
      
      console.log('Successfully loaded articles:', articles.length);
      
      dispatch({ type: 'SET_ARTICLES', payload: articles });
      setRetryCount(0);
      
      if (!showLoading && state.articles.length > 0) {
        toast({
          title: "News Updated",
          description: `Refreshed with ${articles.length} latest articles`,
        });
      }
    } catch (error) {
      console.error('Failed to load news:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to load news';
      
      dispatch({ 
        type: 'SET_ERROR', 
        payload: `Unable to fetch latest news. ${isOnline ? 'Using cached content.' : 'You appear to be offline.'}`
      });
      
      // Auto-retry with exponential backoff (only if online and few retries)
      if (retryCount < 2 && isOnline && !isRetry) {
        const retryDelay = 1000 * Math.pow(2, retryCount); // 1s, 2s
        setTimeout(() => {
          console.log(`Auto-retry attempt ${retryCount + 1}/2`);
          setRetryCount(prev => prev + 1);
          loadNews(false, true);
        }, retryDelay);
      }
      
      if (!isRetry) {
        toast({
          title: "Connection Issue",
          description: isOnline ? "Showing cached content while we reconnect" : "You're offline",
          variant: "destructive",
        });
      }
    }
  }, [state.selectedCategory, dispatch, isOnline, retryCount, state.articles.length]);

  // Load news on mount and category change
  useEffect(() => {
    console.log('Category changed to:', state.selectedCategory);
    setRetryCount(0);
    loadNews();
  }, [state.selectedCategory]);

  // Auto-refresh every 10 minutes when online and active
  useEffect(() => {
    if (!isOnline) return;
    
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        console.log('Auto-refreshing news...');
        loadNews(false);
      }
    }, 10 * 60 * 1000); // 10 minutes

    return () => clearInterval(interval);
  }, [loadNews, isOnline]);

  const handleArticleClick = (article: any) => {
    console.log('Opening article:', article.title);
    setSelectedArticle(article);
    setIsModalOpen(true);
  };

  const handleRefresh = () => {
    console.log('Manual refresh triggered');
    setRetryCount(0);
    loadNews(true);
  };

  const heroArticle = state.articles[0];
  const regularArticles = state.articles.slice(1);

  const getCategoryTitle = () => {
    switch (state.selectedCategory) {
      case 'general': return 'Top Stories';
      case 'technology': return 'Technology News';
      case 'business': return 'Business Updates';
      case 'sports': return 'Sports Coverage';
      case 'health': return 'Health & Wellness';
      default: return `${state.selectedCategory.charAt(0).toUpperCase() + state.selectedCategory.slice(1)} News`;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Enhanced Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div>
              <h2 className="text-headline flex items-center">
                <TrendingUp className="h-6 w-6 mr-3 text-primary" />
                {getCategoryTitle()}
              </h2>
              <p className="text-body mt-1 flex items-center">
                {isOnline ? (
                  <>
                    <Wifi className="h-4 w-4 mr-2 text-green-500" />
                    Live updates • {state.articles.length} articles
                  </>
                ) : (
                  <>
                    <WifiOff className="h-4 w-4 mr-2 text-destructive" />
                    Offline mode • Showing cached content
                  </>
                )}
              </p>
            </div>
          </div>
          
          <Button
            onClick={handleRefresh}
            disabled={state.isLoading}
            variant="outline"
            size="sm"
            className="hover-lift"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${state.isLoading ? 'animate-spin' : ''}`} />
            {state.isLoading ? 'Loading...' : 'Refresh'}
          </Button>
        </div>

        {/* Error State */}
        {state.error && (
          <Alert className="mb-6 border-destructive/20 bg-destructive/5">
            <AlertCircle className="h-4 w-4 text-destructive" />
            <AlertDescription className="flex items-center justify-between text-destructive">
              <span>{state.error}</span>
              {isOnline && (
                <Button
                  onClick={handleRefresh}
                  variant="link"
                  size="sm"
                  className="ml-2 p-0 h-auto text-destructive hover:text-destructive"
                >
                  Retry now
                </Button>
              )}
            </AlertDescription>
          </Alert>
        )}

        {/* Hero Article */}
        {state.isLoading && !heroArticle ? (
          <div className="mb-8">
            <div className="news-card animate-pulse">
              <div className="h-80 md:h-96 bg-muted rounded-xl"></div>
            </div>
          </div>
        ) : heroArticle ? (
          <div className="mb-8">
            <ArticleCard
              article={heroArticle}
              onClick={() => handleArticleClick(heroArticle)}
              variant="hero"
            />
          </div>
        ) : null}

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {state.isLoading && regularArticles.length === 0
            ? Array.from({ length: 9 }, (_, i) => (
                <div key={`skeleton-${i}`} className={`animate-delay-${(i % 3) * 100}`}>
                  <SkeletonCard />
                </div>
              ))
            : regularArticles.map((article, index) => (
                <div key={article.id} className={`animate-delay-${(index % 3) * 100} animate-fade-in`}>
                  <ArticleCard
                    article={article}
                    onClick={() => handleArticleClick(article)}
                  />
                </div>
              ))
          }
        </div>

        {/* Empty State */}
        {!state.isLoading && state.articles.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-6">📰</div>
            <h3 className="text-xl font-semibold mb-3">No articles available</h3>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              {isOnline 
                ? "We're having trouble loading the latest news. Please try again." 
                : "You're currently offline. Please check your connection and try again."
              }
            </p>
            <Button 
              onClick={handleRefresh} 
              className="hover-lift" 
              disabled={!isOnline || state.isLoading}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              {state.isLoading ? 'Loading...' : 'Try Again'}
            </Button>
          </div>
        )}

        {/* Retry indicator */}
        {retryCount > 0 && state.isLoading && (
          <div className="fixed bottom-6 right-6 bg-card border border-border rounded-xl p-4 shadow-lg animate-fade-in z-50 backdrop-blur-sm">
            <div className="flex items-center space-x-3">
              <RefreshCw className="h-5 w-5 animate-spin text-primary" />
              <div>
                <p className="text-sm font-medium">Reconnecting...</p>
                <p className="text-xs text-muted-foreground">Attempt {retryCount}/2</p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Article Modal */}
      {selectedArticle && (
        <ArticleModal
          article={selectedArticle}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedArticle(null);
          }}
        />
      )}
    </div>
  );
};

export default Index;
