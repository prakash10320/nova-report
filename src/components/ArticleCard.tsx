
import React from 'react';
import { Clock, Bookmark, BookmarkCheck, ExternalLink } from 'lucide-react';
import { Article, useNews } from '../contexts/NewsContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ArticleCardProps {
  article: Article;
  onClick: () => void;
  variant?: 'default' | 'hero';
}

const ArticleCard: React.FC<ArticleCardProps> = ({ 
  article, 
  onClick, 
  variant = 'default' 
}) => {
  const { state, dispatch } = useNews();
  const isBookmarked = state.bookmarks.some(bookmark => bookmark.id === article.id);

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isBookmarked) {
      dispatch({ type: 'REMOVE_BOOKMARK', payload: article.id });
    } else {
      dispatch({ type: 'ADD_BOOKMARK', payload: article });
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  if (variant === 'hero') {
    return (
      <div 
        className="news-card cursor-pointer overflow-hidden animate-fade-in group relative"
        onClick={onClick}
      >
        <div className="relative h-96 md:h-[500px]">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=400&fit=crop&auto=format';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          {/* Content overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
            <div className="flex items-center gap-4 mb-4">
              <Badge className="capitalize bg-primary hover:bg-primary">
                {article.category}
              </Badge>
              {article.sentiment && (
                <Badge variant="outline" className={`sentiment-${article.sentiment} text-white border-white/30`}>
                  {article.sentiment}
                </Badge>
              )}
              <div className="flex items-center text-white/80 text-sm">
                <Clock className="h-4 w-4 mr-1" />
                {formatTime(article.publishedAt)}
              </div>
            </div>
            
            <h2 className="text-2xl md:text-4xl font-bold mb-4 text-balance leading-tight">
              {article.title}
            </h2>
            <p className="text-lg text-white/90 line-clamp-3 mb-4">
              {article.description}
            </p>
            
            <div className="flex items-center justify-between">
              <Button variant="secondary" className="hover-lift">
                <ExternalLink className="h-4 w-4 mr-2" />
                Read Full Story
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBookmark}
                className="text-white hover:text-white hover:bg-white/20"
              >
                {isBookmarked ? (
                  <BookmarkCheck className="h-5 w-5" />
                ) : (
                  <Bookmark className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="news-card cursor-pointer overflow-hidden animate-fade-in group"
      onClick={onClick}
      style={{
        animationDelay: `${Math.random() * 200}ms`
      }}
    >
      <div className="relative aspect-video overflow-hidden">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=400&fit=crop&auto=format';
          }}
        />
        <div className="absolute top-4 left-4">
          <Badge className="capitalize bg-primary/90 hover:bg-primary">
            {article.category}
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBookmark}
          className="absolute top-4 right-4 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border-0"
        >
          {isBookmarked ? (
            <BookmarkCheck className="h-4 w-4" />
          ) : (
            <Bookmark className="h-4 w-4" />
          )}
        </Button>
      </div>
      
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          {article.sentiment && (
            <Badge variant="outline" className={`sentiment-${article.sentiment}`}>
              {article.sentiment}
            </Badge>
          )}
          <div className="flex items-center text-muted-foreground text-sm">
            <Clock className="h-4 w-4 mr-1" />
            {formatTime(article.publishedAt)}
          </div>
        </div>
        
        <h3 className="text-subheadline mb-3 line-clamp-2 group-hover:text-primary transition-colors">
          {article.title}
        </h3>
        
        <p className="text-body line-clamp-3 mb-4">
          {article.description}
        </p>
        
        {article.summary && (
          <div className="space-y-1 mb-4">
            <p className="text-sm font-medium text-muted-foreground">Key Points:</p>
            <ul className="space-y-1">
              {article.summary.slice(0, 2).map((point, index) => (
                <li key={index} className="text-xs text-muted-foreground flex items-start">
                  <span className="w-1 h-1 bg-primary rounded-full mr-2 mt-2 flex-shrink-0"></span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <Button 
          variant="ghost" 
          className="w-full justify-start p-0 h-auto text-primary hover:text-primary hover-lift"
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          Read more
        </Button>
      </div>
    </div>
  );
};

export default ArticleCard;
