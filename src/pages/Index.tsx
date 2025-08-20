
import React, { useEffect, useState, useCallback } from 'react';
import { RefreshCw, AlertCircle, Wifi, WifiOff, TrendingUp, Newspaper } from 'lucide-react';
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
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  // Network status monitoring
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast({
        title: "Connection Restored",
        description: "You're back online! Refreshing content...",
      });
      if (state.articles.length === 0) {
        loadNews(false);
      }
    };
    const handleOffline = () => {
      setIsOnline(false);
      toast({
        title: "Connection Lost",
        description: "You're offline. Showing cached content.",
        variant: "destructive",
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [state.articles.length]);

  const loadNews = useCallback(async (showLoading = true) => {
    if (!isOnline && state.articles.length > 0) {
      toast({
        title: "Offline Mode",
        description: "Showing cached articles. Connect to internet for latest news.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (showLoading) {
        dispatch({ type: 'SET_LOADING', payload: true });
      }
      
      dispatch({ type: 'SET_ERROR', payload: null });
      
      console.log('Loading news for category:', state.selectedCategory);
      
      const categoryParam = state.selectedCategory === 'general' ? 'technology' : state.selectedCategory;
      const articles = await fetchNews({ 
        category: categoryParam,
        count: 15,
        min_length: 1200,
        max_length: 3000,
        img_width: 800,
        img_height: 400,
        img_quality: 85
      });
      
      console.log('Successfully loaded articles:', articles.length);
      
      dispatch({ type: 'SET_ARTICLES', payload: articles });
      setLastRefresh(new Date());
      
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
        payload: `Unable to fetch latest news. ${!isOnline ? 'You appear to be offline.' : 'Please check your connection and try again.'}`
      });
      
      toast({
        title: "Loading Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [state.selectedCategory, dispatch, isOnline, state.articles.length]);

  // Load news on mount and category change
  useEffect(() => {
    console.log('Category changed to:', state.selectedCategory);
    loadNews();
  }, [state.selectedCategory]);

  // Auto-refresh every 15 minutes when online and active
  useEffect(() => {
    if (!isOnline) return;
    
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        console.log('Auto-refreshing news...');
        loadNews(false);
      }
    }, 15 * 60 * 1000); // 15 minutes

    return () => clearInterval(interval);
  }, [loadNews, isOnline]);

  const handleArticleClick = (article: any) => {
    console.log('Opening article:', article.title);
    setSelectedArticle(article);
    setIsModalOpen(true);
  };

  const handleRefresh = () => {
    console.log('Manual refresh triggered');
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
      case 'world': return 'World News';
      case 'entertainment': return 'Entertainment';
      case 'science': return 'Science & Innovation';
      default: return `${state.selectedCategory.charAt(0).toUpperCase() + state.selectedCategory.slice(1)} News`;
    }
  };

  const getLastRefreshTime = () => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - lastRefresh.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    return `${Math.floor(diffInMinutes / 60)}h ago`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Header */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center space-x-6">
            <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl">
              <Newspaper className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h2 className="text-headline text-gradient">
                {getCategoryTitle()}
              </h2>
              <p className="text-body mt-2 flex items-center">
                {isOnline ? (
                  <>
                    <Wifi className="h-4 w-4 mr-2 text-emerald-500" />
                    Live updates • {state.articles.length} articles • Updated {getLastRefreshTime()}
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
            disabled={state.isLoading || !isOnline}
            variant="outline"
            size="lg"
            className="hover-lift premium-button"
          >
            <RefreshCw className={`h-5 w-5 mr-2 ${state.isLoading ? 'animate-spin' : ''}`} />
            {state.isLoading ? 'Loading...' : 'Refresh'}
          </Button>
        </div>

        {/* Error State */}
        {state.error && (
          <Alert className="mb-8 border-destructive/20 bg-destructive/5 backdrop-blur-sm">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <AlertDescription className="flex items-center justify-between text-destructive">
              <span className="text-base">{state.error}</span>
              {isOnline && (
                <Button
                  onClick={handleRefresh}
                  variant="link"
                  size="sm"
                  className="ml-4 p-0 h-auto text-destructive hover:text-destructive/80"
                >
                  Retry now
                </Button>
              )}
            </AlertDescription>
          </Alert>
        )}

        {/* Hero Article */}
        {state.isLoading && !heroArticle ? (
          <div className="mb-10">
            <div className="news-card animate-pulse">
              <div className="h-96 md:h-[32rem] bg-muted/50 rounded-2xl"></div>
            </div>
          </div>
        ) : heroArticle ? (
          <div className="mb-10">
            <ArticleCard
              article={heroArticle}
              onClick={() => handleArticleClick(heroArticle)}
              variant="hero"
            />
          </div>
        ) : null}

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
          <div className="text-center py-24">
            <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center mx-auto mb-8">
              <Newspaper className="h-12 w-12 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-4">No articles available</h3>
            <p className="text-muted-foreground mb-10 max-w-md mx-auto text-lg">
              {isOnline 
                ? "We're having trouble loading the latest news. Please try again." 
                : "You're currently offline. Please check your connection and try again."
              }
            </p>
            <Button 
              onClick={handleRefresh} 
              className="hover-lift premium-button px-8 py-3 text-base" 
              disabled={!isOnline || state.isLoading}
            >
              <RefreshCw className="h-5 w-5 mr-2" />
              {state.isLoading ? 'Loading...' : 'Try Again'}
            </Button>
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
