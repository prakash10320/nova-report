
import React from 'react';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNews } from '../contexts/NewsContext';
import { Button } from '@/components/ui/button';
import ArticleCard from '../components/ArticleCard';

const Bookmarks: React.FC = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useNews();

  const handleRemoveBookmark = (articleId: string) => {
    dispatch({ type: 'REMOVE_BOOKMARK', payload: articleId });
  };

  const clearAllBookmarks = () => {
    state.bookmarks.forEach(article => {
      dispatch({ type: 'REMOVE_BOOKMARK', payload: article.id });
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => navigate('/')}
              variant="ghost"
              size="sm"
              className="hover-lift"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-headline">Bookmarks</h1>
              <p className="text-body mt-1">
                {state.bookmarks.length} saved article{state.bookmarks.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          {state.bookmarks.length > 0 && (
            <Button
              onClick={clearAllBookmarks}
              variant="outline"
              size="sm"
              className="hover-lift"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          )}
        </div>

        {/* Bookmarks Grid */}
        {state.bookmarks.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔖</div>
            <h3 className="text-xl font-medium mb-2">No bookmarks yet</h3>
            <p className="text-muted-foreground mb-6">
              Save articles you want to read later
            </p>
            <Button onClick={() => navigate('/')} className="hover-lift">
              Browse News
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {state.bookmarks.map((article, index) => (
              <div key={article.id} className={`animate-delay-${(index % 3) * 100} animate-fade-in relative group`}>
                <ArticleCard
                  article={article}
                  onClick={() => {}}
                />
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveBookmark(article.id);
                  }}
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookmarks;
