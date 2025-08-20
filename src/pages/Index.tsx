
import React, { useEffect, useState, useCallback } from 'react';
import { RefreshCw, AlertCircle, Wifi, WifiOff } from 'lucide-react';
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
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadNews = useCallback(async (showLoading = true, isRetry = false) => {
    if (!isOnline && !isRetry) {
      toast({
        title: "Offline",
        description: "Please check your internet connection",
        variant: "destructive",
      });
      return;
    }

    try {
      if (showLoading) {
        dispatch({ type: 'SET_LOADING', payload: true });
      }
      
      console.log('Loading news for category:', state.selectedCategory);
      
      const articles = await fetchNews({ 
        category: state.selectedCategory === 'general' ? 'technology' : state.selectedCategory,
        count: 12,
        min_length: 700,
        max_length: 2000
      });
      
      console.log('Loaded articles:', articles.length);
      
      dispatch({ type: 'SET_ARTICLES', payload: articles });
      dispatch({ type: 'SET_ERROR', payload: null });
      setRetryCount(0);
      
      if (!showLoading) {
        toast({
          title: "News Updated",
          description: `Loaded ${articles.length} new articles`,
        });
      }
    } catch (error) {
      console.error('Failed to load news:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to load news';
      
      dispatch({ 
        type: 'SET_ERROR', 
        payload: `Connection issue: ${errorMessage}. Retrying automatically...`
      });
      
      // Auto-retry logic with exponential backoff
      if (retryCount < 3 && isOnline) {
        const retryDelay = 2000 * Math.pow(2, retryCount); // 2s, 4s, 8s
        setTimeout(() => {
          console.log(`Retrying... attempt ${retryCount + 1}/3`);
          setRetryCount(prev => prev + 1);
          loadNews(false, true);
        }, retryDelay);
      }
      
      toast({
        title: "Loading Issue",
        description: `${errorMessage}. ${retryCount < 3 ? 'Retrying automatically...' : 'Please try again.'}`,
        variant: "destructive",
      });
    }
  }, [state.selectedCategory, dispatch, isOnline, retryCount]);

  // Load news on mount and category change
  useEffect(() => {
    console.log('Category changed to:', state.selectedCategory);
    loadNews();
  }, [state.selectedCategory]);

  // Auto-refresh every 5 minutes when online
  useEffect(() => {
    if (!isOnline) return;
    
    const interval = setInterval(() => {
      console.log('Auto-refreshing news...');
      loadNews(false);
    }, 5 * 60 * 1000);

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
    loadNews();
  };

  const heroArticle = state.articles[0];
  const regularArticles = state.articles.slice(1);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-headline capitalize">
              {state.selectedCategory === 'general' ? 'Top Stories' : `${state.selectedCategory} News`}
            </h2>
            <p className="text-body mt-1 flex items-center">
              {isOnline ? (
                <>
                  <Wifi className="h-4 w-4 mr-2 text-green-500" />
                  Live updates • {state.articles.length} articles loaded
                </>
              ) : (
                <>
                  <WifiOff className="h-4 w-4 mr-2 text-red-500" />
                  You're offline
                </>
              )}
            </p>
          </div>
          
          <Button
            onClick={handleRefresh}
            disabled={state.isLoading || !isOnline}
            variant="outline"
            size="sm"
            className="hover-lift"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${state.isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Error State */}
        {state.error && (
          <Alert className="mb-6 border-destructive/50 bg-destructive/10">
            <AlertCircle className="h-4 w-4 text-destructive" />
            <AlertDescription className="flex items-center justify-between text-destructive">
              <span>{state.error}</span>
              <Button
                onClick={handleRefresh}
                variant="link"
                size="sm"
                className="ml-2 p-0 h-auto text-destructive hover:text-destructive"
              >
                Try again
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Hero Article */}
        {state.isLoading && !heroArticle ? (
          <div className="mb-8">
            <div className="news-card animate-pulse">
              <div className="h-64 md:h-80 bg-muted rounded-t-lg"></div>
              <div className="p-6">
                <div className="h-4 bg-muted rounded w-3/4 mb-3"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
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
        {!state.isLoading && state.articles.length === 0 && !state.error && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📰</div>
            <h3 className="text-xl font-medium mb-2">No articles found</h3>
            <p className="text-muted-foreground mb-6">
              We're working to load the latest news. Try refreshing or check your connection.
            </p>
            <Button onClick={handleRefresh} className="hover-lift" disabled={!isOnline}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh News
            </Button>
          </div>
        )}

        {/* Retry indicator */}
        {retryCount > 0 && (
          <div className="fixed bottom-4 right-4 bg-card border border-border rounded-lg p-3 shadow-lg animate-fade-in z-50">
            <div className="flex items-center space-x-2">
              <RefreshCw className="h-4 w-4 animate-spin text-primary" />
              <span className="text-sm">Reconnecting... ({retryCount}/3)</span>
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
