
import React, { useState } from 'react';
import { Clock, Bookmark, BookmarkCheck, Eye, ImageIcon, TrendingUp } from 'lucide-react';
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
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const isBookmarked = state.bookmarks.some(bookmark => bookmark.id === article.id);

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isBookmarked) {
      dispatch({ type: 'REMOVE_BOOKMARK', payload: article.id });
    } else {
      dispatch({ type: 'ADD_BOOKMARK', payload: article });
    }
  };

  const handleImageError = () => {
    setImageError(true);
    console.log('Image failed to load for article:', article.title);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
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

  const getCategoryFallback = (category: string) => {
    const fallbacks = {
      technology: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=600&h=400&fit=crop',
      business: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop',
      sports: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&h=400&fit=crop',
      health: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=400&fit=crop',
      science: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&h=400&fit=crop',
      entertainment: 'https://images.unsplash.com/photo-1489599375274-055414489dfb?w=600&h=400&fit=crop',
      world: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
      general: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&h=400&fit=crop'
    };
    return fallbacks[category] || fallbacks.general;
  };

  if (variant === 'hero') {
    return (
      <div 
        className="relative cursor-pointer overflow-hidden rounded-3xl group animate-fade-in shadow-2xl"
        onClick={onClick}
      >
        <div className="relative h-[60vh] sm:h-[70vh] md:h-[80vh] w-full">
          {/* Enhanced Image Display */}
          <div className="absolute inset-0">
            {!imageLoaded && !imageError && (
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/30 animate-pulse flex items-center justify-center">
                <ImageIcon className="h-16 w-16 text-primary/40" />
              </div>
            )}
            
            {imageError ? (
              <div 
                className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/40 flex items-center justify-center"
                style={{ 
                  backgroundImage: `url(${getCategoryFallback(article.category)})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                <div className="absolute inset-0 bg-black/40" />
              </div>
            ) : (
              <img
                src={article.image || getCategoryFallback(article.category)}
                alt={article.title}
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                onError={handleImageError}
                onLoad={handleImageLoad}
              />
            )}
          </div>
          
          {/* Enhanced Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
          
          {/* Content overlay - Better mobile positioning */}
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8 lg:p-12 text-white">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-4 md:mb-6">
              <Badge className="capitalize bg-primary/90 hover:bg-primary text-primary-foreground px-2 py-1 sm:px-3 sm:py-1 text-xs sm:text-sm rounded-full">
                <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                {article.category}
              </Badge>
              {article.sentiment && (
                <Badge variant="outline" className={`sentiment-${article.sentiment} border-white/40 bg-white/10 backdrop-blur-sm px-2 py-1 text-xs rounded-full`}>
                  {article.sentiment}
                </Badge>
              )}
              <div className="flex items-center text-white/80 text-xs sm:text-sm">
                <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                {formatTime(article.publishedAt)}
              </div>
            </div>
            
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-3 sm:mb-4 md:mb-6 leading-tight">
              {article.title}
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 line-clamp-2 sm:line-clamp-3 mb-4 sm:mb-6 md:mb-8 leading-relaxed">
              {article.description}
            </p>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
              <Button 
                variant="secondary" 
                className="w-full sm:w-auto bg-white/95 text-gray-900 hover:bg-white px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base font-medium rounded-xl"
              >
                <Eye className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Read Article
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBookmark}
                className="self-end sm:self-auto text-white hover:text-white hover:bg-white/20 backdrop-blur-sm p-2 sm:p-3 rounded-xl"
              >
                {isBookmarked ? (
                  <BookmarkCheck className="h-5 w-5 sm:h-6 sm:w-6" />
                ) : (
                  <Bookmark className="h-5 w-5 sm:h-6 sm:w-6" />
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
      className="bg-card/90 backdrop-blur-xl rounded-2xl border border-border/50 cursor-pointer overflow-hidden animate-fade-in group h-full flex flex-col shadow-xl hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1"
      onClick={onClick}
    >
      <div className="relative aspect-video overflow-hidden">
        {/* Enhanced Image Display */}
        <div className="relative w-full h-full">
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/30 animate-pulse flex items-center justify-center">
              <ImageIcon className="h-8 w-8 text-primary/40" />
            </div>
          )}
          
          {imageError ? (
            <div 
              className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/40 flex items-center justify-center"
              style={{ 
                backgroundImage: `url(${getCategoryFallback(article.category)})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className="absolute inset-0 bg-black/20" />
            </div>
          ) : (
            <img
              src={article.image || getCategoryFallback(article.category)}
              alt={article.title}
              className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onError={handleImageError}
              onLoad={handleImageLoad}
            />
          )}
        </div>
        
        <div className="absolute top-3 left-3">
          <Badge className="capitalize bg-primary/90 hover:bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full shadow-lg">
            {article.category}
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBookmark}
          className="absolute top-3 right-3 bg-black/30 backdrop-blur-sm hover:bg-black/50 text-white border-0 h-8 w-8 p-0 rounded-full transition-all duration-300"
        >
          {isBookmarked ? (
            <BookmarkCheck className="h-4 w-4" />
          ) : (
            <Bookmark className="h-4 w-4" />
          )}
        </Button>
      </div>
      
      <div className="p-4 sm:p-5 md:p-6 flex-1 flex flex-col">
        <div className="flex items-center gap-3 mb-3 sm:mb-4">
          {article.sentiment && (
            <Badge variant="outline" className={`sentiment-${article.sentiment} text-xs px-2 py-1 rounded-full`}>
              {article.sentiment}
            </Badge>
          )}
          <div className="flex items-center text-muted-foreground text-xs sm:text-sm">
            <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            {formatTime(article.publishedAt)}
          </div>
        </div>
        
        <h3 className="text-base sm:text-lg md:text-xl font-bold mb-3 sm:mb-4 line-clamp-2 group-hover:text-primary transition-colors leading-tight">
          {article.title}
        </h3>
        
        <p className="text-sm sm:text-base text-muted-foreground line-clamp-3 mb-4 sm:mb-6 flex-1 leading-relaxed">
          {article.description}
        </p>
        
        {article.summary && (
          <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
            <p className="text-xs sm:text-sm font-medium text-muted-foreground">Key Points:</p>
            <ul className="space-y-1 sm:space-y-2">
              {article.summary.slice(0, 2).map((point, index) => (
                <li key={index} className="text-xs sm:text-sm text-muted-foreground flex items-start">
                  <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-primary rounded-full mr-2 sm:mr-3 mt-1.5 sm:mt-2 flex-shrink-0"></span>
                  <span className="line-clamp-2">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <Button 
          variant="ghost" 
          className="w-full justify-center bg-gradient-to-r from-primary/10 to-accent/10 hover:from-primary/20 hover:to-accent/20 border border-primary/20 hover:border-primary/40 mt-auto py-2 sm:py-3 text-sm font-medium rounded-xl transition-all duration-300"
        >
          <Eye className="h-4 w-4 mr-2" />
          Read Full Story
        </Button>
      </div>
    </div>
  );
};

export default ArticleCard;
