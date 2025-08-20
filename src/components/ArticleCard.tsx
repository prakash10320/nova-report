
import React from 'react';
import { Clock, Bookmark, BookmarkCheck, ExternalLink, Eye } from 'lucide-react';
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
        <div className="relative h-96 md:h-[32rem] lg:h-[36rem]">
          <img
            src={article.image}
            alt={article.title}
            className="article-image"
            loading="lazy"
          />
          <div className="gradient-overlay absolute inset-0" />
          
          {/* Content overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 text-white">
            <div className="flex items-center gap-4 mb-6">
              <Badge className="capitalize bg-primary/90 hover:bg-primary text-primary-foreground px-4 py-2">
                {article.category}
              </Badge>
              {article.sentiment && (
                <Badge variant="outline" className={`sentiment-${article.sentiment} border-white/40 bg-white/10 backdrop-blur-sm px-3 py-1`}>
                  {article.sentiment}
                </Badge>
              )}
              <div className="flex items-center text-white/80 text-sm">
                <Clock className="h-4 w-4 mr-2" />
                {formatTime(article.publishedAt)}
              </div>
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-balance leading-tight">
              {article.title}
            </h2>
            <p className="text-xl text-white/90 line-clamp-3 mb-8 leading-relaxed">
              {article.description}
            </p>
            
            <div className="flex items-center justify-between">
              <Button variant="secondary" className="hover-lift bg-white/95 text-gray-900 hover:bg-white px-6 py-3 text-base font-medium">
                <Eye className="h-5 w-5 mr-2" />
                Read Full Article
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBookmark}
                className="text-white hover:text-white hover:bg-white/20 backdrop-blur-sm p-3"
              >
                {isBookmarked ? (
                  <BookmarkCheck className="h-6 w-6" />
                ) : (
                  <Bookmark className="h-6 w-6" />
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
        animationDelay: `${Math.random() * 300}ms`
      }}
    >
      <div className="relative aspect-video overflow-hidden">
        <img
          src={article.image}
          alt={article.title}
          className="article-image"
          loading="lazy"
        />
        <div className="absolute top-4 left-4">
          <Badge className="capitalize bg-primary/90 hover:bg-primary text-primary-foreground text-sm px-3 py-1">
            {article.category}
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBookmark}
          className="absolute top-4 right-4 bg-black/20 backdrop-blur-sm hover:bg-black/40 text-white border-0 h-9 w-9 p-0 rounded-full transition-all duration-300"
        >
          {isBookmarked ? (
            <BookmarkCheck className="h-4 w-4" />
          ) : (
            <Bookmark className="h-4 w-4" />
          )}
        </Button>
      </div>
      
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-center gap-3 mb-4">
          {article.sentiment && (
            <Badge variant="outline" className={`sentiment-${article.sentiment} text-xs px-2 py-1`}>
              {article.sentiment}
            </Badge>
          )}
          <div className="flex items-center text-muted-foreground text-sm">
            <Clock className="h-4 w-4 mr-2" />
            {formatTime(article.publishedAt)}
          </div>
        </div>
        
        <h3 className="text-subheadline mb-4 line-clamp-2 group-hover:text-primary transition-colors flex-shrink-0">
          {article.title}
        </h3>
        
        <p className="text-body line-clamp-3 mb-6 flex-1">
          {article.description}
        </p>
        
        {article.summary && (
          <div className="space-y-3 mb-6">
            <p className="text-sm font-medium text-muted-foreground">Key Points:</p>
            <ul className="space-y-2">
              {article.summary.slice(0, 2).map((point, index) => (
                <li key={index} className="text-sm text-muted-foreground flex items-start">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mr-3 mt-2 flex-shrink-0"></span>
                  <span className="line-clamp-2">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <Button 
          variant="ghost" 
          className="w-full justify-center premium-button mt-auto py-3 text-sm font-medium"
        >
          <Eye className="h-4 w-4 mr-2" />
          Read Full Story
        </Button>
      </div>
    </div>
  );
};

export default ArticleCard;
