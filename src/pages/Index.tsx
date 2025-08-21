import React, { useEffect, useState, useCallback } from 'react';
import { RefreshCw, AlertCircle, Wifi, WifiOff, TrendingUp, Newspaper, Filter } from 'lucide-react';
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

  useEffect(() => {
    loadNews();
  }, [state.selectedCategory]);

  useEffect(() => {
    if (!isOnline) return;
    
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        loadNews(false);
      }
    }, 15 * 60 * 1000);

    return () => clearInterval(interval);
  }, [loadNews, isOnline]);

  const handleArticleClick = (article: any) => {
    setSelectedArticle(article);
    setIsModalOpen(true);
  };

  const handleRefresh = () => {
    loadNews(true);
  };

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

  const heroArticle = state.articles[0];
  const regularArticles = state.articles.slice(1);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        {/* Enhanced Mobile-First Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 mb-6 sm:mb-8 md:mb-10">
          <div className="flex items-center space-x-3 sm:space-x-4 md:space-x-6">
            <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl shadow-lg">
              <Newspaper className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent leading-tight">
                {getCategoryTitle()}
              </h2>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mt-1 sm:mt-2">
                <div className="flex items-center text-xs sm:text-sm text-muted-foreground">
                  {isOnline ? (
                    <>
                      <Wifi className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-emerald-500" />
                      Live updates
                    </>
                  ) : (
                    <>
                      <WifiOff className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-destructive" />
                      Offline mode
                    </>
                  )}
                </div>
                <span className="hidden sm:inline text-muted-foreground">•</span>
                <span className="text-xs sm:text-sm text-muted-foreground">
                  {state.articles.length} articles
                </span>
                <span className="hidden sm:inline text-muted-foreground">•</span>
                <span className="text-xs sm:text-sm text-muted-foreground">
                  Updated {getLastRefreshTime()}
                </span>
              </div>
            </div>
          </div>
          
          <Button
            onClick={handleRefresh}
            disabled={state.isLoading || !isOnline}
            variant="outline"
            size="sm"
            className="w-full sm:w-auto bg-gradient-to-r from-primary/10 to-accent/10 hover:from-primary/20 hover:to-accent/20 border-primary/20 hover:border-primary/40 transition-all duration-300"
          >
            <RefreshCw className={`h-4 w-4 sm:h-5 sm:w-5 mr-2 ${state.isLoading ? 'animate-spin' : ''}`} />
            {state.isLoading ? 'Loading...' : 'Refresh'}
          </Button>
        </div>

        {/* Error State */}
        {state.error && (
          <Alert className="mb-6 sm:mb-8 border-destructive/20 bg-destructive/5 backdrop-blur-sm rounded-2xl">
            <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-destructive" />
            <AlertDescription className="flex flex-col sm:flex-row sm:items-center justify-between text-destructive gap-2 sm:gap-4">
              <span className="text-sm sm:text-base">{state.error}</span>
              {isOnline && (
                <Button
                  onClick={handleRefresh}
                  variant="link"
                  size="sm"
                  className="self-start sm:self-auto p-0 h-auto text-destructive hover:text-destructive/80 text-sm"
                >
                  Retry now
                </Button>
              )}
            </AlertDescription>
          </Alert>
        )}

        {/* Hero Article - Enhanced Mobile Layout */}
        {state.isLoading && !heroArticle ? (
          <div className="mb-6 sm:mb-8 md:mb-10">
            <div className="animate-pulse bg-muted/50 rounded-3xl h-[60vh] sm:h-[70vh] md:h-[80vh]"></div>
          </div>
        ) : heroArticle ? (
          <div className="mb-6 sm:mb-8 md:mb-10">
            <ArticleCard
              article={heroArticle}
              onClick={() => handleArticleClick(heroArticle)}
              variant="hero"
            />
          </div>
        ) : null}

        {/* Articles Grid - Better Mobile Responsiveness */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {state.isLoading && regularArticles.length === 0
            ? Array.from({ length: 9 }, (_, i) => (
                <div key={`skeleton-${i}`} className="animate-fade-in">
                  <SkeletonCard />
                </div>
              ))
            : regularArticles.map((article, index) => (
                <div key={article.id} className="animate-fade-in" style={{ animationDelay: `${(index % 3) * 100}ms` }}>
                  <ArticleCard
                    article={article}
                    onClick={() => handleArticleClick(article)}
                  />
                </div>
              ))
          }
        </div>

        {/* Enhanced Empty State */}
        {!state.isLoading && state.articles.length === 0 && (
          <div className="text-center py-16 sm:py-20 md:py-24 px-4">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8 shadow-xl">
              <Newspaper className="h-10 w-10 sm:h-12 sm:w-12 text-primary" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">No articles available</h3>
            <p className="text-muted-foreground mb-8 sm:mb-10 max-w-md mx-auto text-base sm:text-lg leading-relaxed">
              {isOnline 
                ? "We're having trouble loading the latest news. Please try again." 
                : "You're currently offline. Please check your connection and try again."
              }
            </p>
            <Button 
              onClick={handleRefresh} 
              className="w-full sm:w-auto bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 px-6 sm:px-8 py-3 text-base font-medium rounded-xl shadow-lg" 
              disabled={!isOnline || state.isLoading}
            >
              <RefreshCw className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
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
