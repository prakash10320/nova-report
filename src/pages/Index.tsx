
import React, { useEffect, useState } from 'react';
import { RefreshCw, AlertCircle } from 'lucide-react';
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

  const loadNews = async (showLoading = true) => {
    try {
      if (showLoading) {
        dispatch({ type: 'SET_LOADING', payload: true });
      }
      
      const articles = await fetchNews({ 
        category: state.selectedCategory,
        count: 12 
      });
      
      dispatch({ type: 'SET_ARTICLES', payload: articles });
      
      if (!showLoading) {
        toast({
          title: "News Updated",
          description: `Loaded ${articles.length} new articles`,
        });
      }
    } catch (error) {
      console.error('Failed to load news:', error);
      dispatch({ 
        type: 'SET_ERROR', 
        payload: 'Failed to load news. Please try again.' 
      });
      toast({
        title: "Error",
        description: "Failed to load news. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Load news on mount and category change
  useEffect(() => {
    loadNews();
  }, [state.selectedCategory]);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      loadNews(false);
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [state.selectedCategory]);

  const handleArticleClick = (article: any) => {
    setSelectedArticle(article);
    setIsModalOpen(true);
  };

  const handleRefresh = () => {
    loadNews();
  };

  const heroArticle = state.articles[0];
  const regularArticles = state.articles.slice(1);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-headline capitalize">
              {state.selectedCategory} News
            </h2>
            <p className="text-body mt-2">
              Stay updated with the latest {state.selectedCategory} stories
            </p>
          </div>
          
          <Button
            onClick={handleRefresh}
            disabled={state.isLoading}
            variant="outline"
            className="hover-lift"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${state.isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Error State */}
        {state.error && (
          <Alert className="mb-8">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {state.error}
              <Button
                onClick={handleRefresh}
                variant="link"
                className="ml-2 p-0 h-auto"
              >
                Try again
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Hero Article */}
        {state.isLoading && !heroArticle ? (
          <div className="mb-12">
            <div className="news-card animate-pulse">
              <div className="h-96 md:h-[500px] bg-muted rounded-2xl"></div>
            </div>
          </div>
        ) : heroArticle ? (
          <div className="mb-12">
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
                <SkeletonCard key={`skeleton-${i}`} />
              ))
            : regularArticles.map((article, index) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  onClick={() => handleArticleClick(article)}
                />
              ))
          }
        </div>

        {/* Empty State */}
        {!state.isLoading && state.articles.length === 0 && !state.error && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📰</div>
            <h3 className="text-xl font-semibold mb-2">No articles found</h3>
            <p className="text-muted-foreground mb-6">
              Try refreshing or selecting a different category
            </p>
            <Button onClick={handleRefresh} className="hover-lift">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh News
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
