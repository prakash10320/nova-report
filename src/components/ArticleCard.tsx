
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
        <div className="relative h-80 md:h-96 lg:h-[28rem]">
          <img
            src={article.image}
            alt={article.title}
            className="article-image"
            loading="lazy"
          />
          <div className="absolute inset-0 gradient-overlay" />
          
          {/* Content overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
            <div className="flex items-center gap-3 mb-4">
              <Badge className="capitalize bg-primary/90 hover:bg-primary text-primary-foreground">
                {article.category}
              </Badge>
              {article.sentiment && (
                <Badge variant="outline" className="text-white border-white/30 bg-white/10 backdrop-blur-sm">
                  {article.sentiment}
                </Badge>
              )}
              <div className="flex items-center text-white/80 text-sm">
                <Clock className="h-4 w-4 mr-1" />
                {formatTime(article.publishedAt)}
              </div>
            </div>
            
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-balance leading-tight">
              {article.title}
            </h2>
            <p className="text-lg text-white/90 line-clamp-3 mb-6 leading-relaxed">
              {article.description}
            </p>
            
            <div className="flex items-center justify-between">
              <Button variant="secondary" className="hover-lift bg-white/90 text-gray-900 hover:bg-white">
                <ExternalLink className="h-4 w-4 mr-2" />
                Read Full Story
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBookmark}
                className="text-white hover:text-white hover:bg-white/20 backdrop-blur-sm"
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
      className="news-card cursor-pointer overflow-hidden animate-fade-in group h-full flex flex-col"
      onClick={onClick}
      style={{
        animationDelay: `${Math.random() * 200}ms`
      }}
    >
      <div className="relative aspect-video overflow-hidden">
        <img
          src={article.image}
          alt={article.title}
          className="article-image"
          loading="lazy"
        />
        <div className="absolute top-3 left-3">
          <Badge className="capitalize bg-primary/90 hover:bg-primary text-primary-foreground text-xs">
            {article.category}
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBookmark}
          className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-900 border-0 h-8 w-8 p-0"
        >
          {isBookmarked ? (
            <BookmarkCheck className="h-4 w-4" />
          ) : (
            <Bookmark className="h-4 w-4" />
          )}
        </Button>
      </div>
      
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-3">
          {article.sentiment && (
            <Badge variant="outline" className={`sentiment-${article.sentiment} text-xs`}>
              {article.sentiment}
            </Badge>
          )}
          <div className="flex items-center text-muted-foreground text-xs">
            <Clock className="h-3 w-3 mr-1" />
            {formatTime(article.publishedAt)}
          </div>
        </div>
        
        <h3 className="text-subheadline mb-3 line-clamp-2 group-hover:text-primary transition-colors flex-shrink-0">
          {article.title}
        </h3>
        
        <p className="text-body line-clamp-3 mb-4 flex-1">
          {article.description}
        </p>
        
        {article.summary && (
          <div className="space-y-2 mb-4">
            <p className="text-xs font-medium text-muted-foreground">Key Points:</p>
            <ul className="space-y-1">
              {article.summary.slice(0, 2).map((point, index) => (
                <li key={index} className="text-xs text-muted-foreground flex items-start">
                  <span className="w-1 h-1 bg-primary rounded-full mr-2 mt-1.5 flex-shrink-0"></span>
                  <span className="line-clamp-2">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <Button 
          variant="ghost" 
          className="w-full justify-start p-0 h-auto text-primary hover:text-primary hover-lift mt-auto"
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          Read more
        </Button>
      </div>
    </div>
  );
};

export default ArticleCard;
