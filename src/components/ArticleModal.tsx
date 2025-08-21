import React, { useState } from 'react';
import { X, Clock, Share2, Bookmark, BookmarkCheck, ExternalLink, Bot, Sparkles, ImageIcon } from 'lucide-react';
import { Article, useNews } from '../contexts/NewsContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent } from '@/components/ui/dialog';
interface ArticleModalProps {
  article: Article;
  isOpen: boolean;
  onClose: () => void;
}
const ArticleModal: React.FC<ArticleModalProps> = ({
  article,
  isOpen,
  onClose
}) => {
  const {
    state,
    dispatch
  } = useNews();
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const isBookmarked = state.bookmarks.some(bookmark => bookmark.id === article.id);
  const handleBookmark = () => {
    if (isBookmarked) {
      dispatch({
        type: 'REMOVE_BOOKMARK',
        payload: article.id
      });
    } else {
      dispatch({
        type: 'ADD_BOOKMARK',
        payload: article
      });
    }
  };
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };
  const handleImageError = () => {
    setImageError(true);
  };
  const handleImageLoad = () => {
    setImageLoaded(true);
  };
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  const getCategoryFallback = (category: string) => {
    const fallbacks = {
      technology: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=400&fit=crop',
      business: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=400&fit=crop',
      sports: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=400&fit=crop',
      health: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop',
      science: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&h=400&fit=crop',
      entertainment: 'https://images.unsplash.com/photo-1489599375274-055414489dfb?w=800&h=400&fit=crop',
      world: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop',
      general: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=400&fit=crop'
    };
    return fallbacks[category] || fallbacks.general;
  };
  return <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-[95vw] sm:w-full max-h-[95vh] overflow-y-auto p-0 bg-card/95 backdrop-blur-xl border-border/50 rounded-3xl">
        <div className="relative">
          {/* Header Image - Enhanced Mobile Display */}
          <div className="relative h-48 sm:h-64 md:h-80 lg:h-96 overflow-hidden rounded-t-3xl">
            <div className="relative w-full h-full">
              {!imageLoaded && !imageError && <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/30 animate-pulse flex items-center justify-center">
                  <ImageIcon className="h-12 w-12 sm:h-16 sm:w-16 text-primary/40" />
                </div>}
              
              {imageError ? <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/40 flex items-center justify-center" style={{
              backgroundImage: `url(${getCategoryFallback(article.category)})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}>
                  <div className="absolute inset-0 bg-black/20" />
                </div> : <img src={article.image || getCategoryFallback(article.category)} alt={article.title} className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`} onError={handleImageError} onLoad={handleImageLoad} />}
            </div>
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            
            {/* Close button */}
            <Button variant="ghost" size="sm" onClick={onClose} className="absolute top-3 right-3 sm:top-4 sm:right-4 md:top-6 md:right-6 bg-black/30 backdrop-blur-sm hover:bg-black/50 text-white border-0 h-8 w-8 sm:h-10 sm:w-10 p-0 rounded-full">
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>

            {/* Article Meta in Overlay */}
            <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 md:bottom-6 md:left-6 md:right-6">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2 sm:mb-3 md:mb-4">
                <Badge className="capitalize bg-primary/90 text-primary-foreground text-xs sm:text-sm px-2 py-1 rounded-full">
                  {article.category}
                </Badge>
                {article.sentiment && <Badge variant="outline" className={`sentiment-${article.sentiment} border-white/30 text-xs px-2 py-1 rounded-full`}>
                    {article.sentiment}
                  </Badge>}
                <div className="flex items-center text-white/80 text-xs sm:text-sm">
                  <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  {formatTime(article.publishedAt)}
                </div>
              </div>
            </div>
          </div>

          {/* Content - Enhanced Mobile Layout */}
          <div className="p-4 sm:p-6 md:p-8 lg:p-12">
            {/* Title */}
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 leading-tight text-balance">
              {article.title}
            </h1>

            {/* Author and Source */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-6 sm:mb-8 text-sm sm:text-base text-muted-foreground">
              <span>By {article.author || 'NewsWire Team'}</span>
              <span className="hidden sm:inline">•</span>
              <span>{article.source || 'NewsWire'}</span>
            </div>

            {/* Description/Lead */}
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 sm:mb-10 leading-relaxed font-medium">
              {article.description}
            </p>

            {/* Full Article Content */}
            <div className="prose prose-sm sm:prose-base lg:prose-lg prose-invert max-w-none mb-8 sm:mb-12">
              <div className="text-foreground leading-relaxed space-y-4 sm:space-y-6">
                {article.content.split('\n\n').map((paragraph, index) => <p key={index} className="text-sm sm:text-base leading-relaxed">
                    {paragraph.trim()}
                  </p>)}
              </div>
            </div>

            {/* AI Summary Section */}
            {article.summary && <div className="bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 rounded-2xl p-4 sm:p-6 md:p-8 mb-6 sm:mb-8">
                <div className="flex items-center mb-4 sm:mb-6">
                  <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-primary/20 rounded-xl mr-3 sm:mr-4">
                    <Bot className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-foreground flex items-center">
                      AI Article Summary
                      <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 ml-2 text-primary" />
                    </h3>
                    <p className="text-muted-foreground text-xs sm:text-sm">Key insights and takeaways</p>
                  </div>
                </div>
                <ul className="space-y-3 sm:space-y-4">
                  {article.summary.map((point, index) => <li key={index} className="flex items-start">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 bg-primary/20 rounded-full flex items-center justify-center mr-3 sm:mr-4 mt-0.5 flex-shrink-0">
                        <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary rounded-full"></span>
                      </div>
                      <span className="text-sm sm:text-base text-foreground leading-relaxed">{point}</span>
                    </li>)}
                </ul>
              </div>}

            {/* Action Buttons - Mobile-First Layout */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-6 sm:pt-8 border-t border-border/50">
              <Button onClick={handleBookmark} variant={isBookmarked ? "default" : "outline"} className="w-full sm:w-auto bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 rounded-xl text-slate-600">
                {isBookmarked ? <>
                    <BookmarkCheck className="h-4 w-4 mr-2" />
                    Bookmarked
                  </> : <>
                    <Bookmark className="h-4 w-4 mr-2" />
                    Bookmark
                  </>}
              </Button>
              
              <Button onClick={handleShare} variant="outline" className="w-full sm:w-auto rounded-xl">
                <Share2 className="h-4 w-4 mr-2" />
                Share Article
              </Button>
              
              <Button variant="outline" className="w-full sm:w-auto rounded-xl" onClick={() => article.url && article.url !== '#' ? window.open(article.url, '_blank') : null} disabled={!article.url || article.url === '#'}>
                <ExternalLink className="h-4 w-4 mr-2" />
                View Original Source
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>;
};
export default ArticleModal;