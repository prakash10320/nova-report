
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

const ArticleModal: React.FC<ArticleModalProps> = ({ article, isOpen, onClose }) => {
  const { state, dispatch } = useNews();
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const isBookmarked = state.bookmarks.some(bookmark => bookmark.id === article.id);

  const handleBookmark = () => {
    if (isBookmarked) {
      dispatch({ type: 'REMOVE_BOOKMARK', payload: article.id });
    } else {
      dispatch({ type: 'ADD_BOOKMARK', payload: article });
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleImageError = () => {
    setImageError(true);
    console.log('Modal image failed to load for article:', article.title, 'URL:', article.image);
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

  const fallbackImage = `https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=400&fit=crop&auto=format&q=80`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto p-0 bg-card/95 backdrop-blur-xl border-border/50">
        <div className="relative">
          {/* Header Image with better error handling */}
          <div className="relative h-80 md:h-96 overflow-hidden">
            <div className="relative w-full h-full bg-muted/20">
              {!imageLoaded && !imageError && (
                <div className="absolute inset-0 flex items-center justify-center bg-muted/10 animate-pulse">
                  <ImageIcon className="h-16 w-16 text-muted-foreground/30" />
                </div>
              )}
              
              {imageError ? (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-muted/20 to-muted/40">
                  <div className="text-center text-muted-foreground">
                    <ImageIcon className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p>Image unavailable</p>
                  </div>
                </div>
              ) : (
                <img
                  src={article.image || fallbackImage}
                  alt={article.title}
                  className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                  onError={handleImageError}
                  onLoad={handleImageLoad}
                />
              )}
            </div>
            
            <div className="gradient-overlay absolute inset-0" />
            
            {/* Close button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="absolute top-6 right-6 bg-black/20 backdrop-blur-sm hover:bg-black/40 text-white border-0 h-10 w-10 p-0 rounded-full"
            >
              <X className="h-5 w-5" />
            </Button>

            {/* Article Meta in Overlay */}
            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <Badge className="capitalize bg-primary/90 text-primary-foreground">
                  {article.category}
                </Badge>
                {article.sentiment && (
                  <Badge variant="outline" className={`sentiment-${article.sentiment} border-white/30`}>
                    {article.sentiment}
                  </Badge>
                )}
                <div className="flex items-center text-white/80 text-sm">
                  <Clock className="h-4 w-4 mr-2" />
                  {formatTime(article.publishedAt)}
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 md:p-12">
            {/* Title */}
            <h1 className="text-headline mb-6 text-balance">
              {article.title}
            </h1>

            {/* Author and Source */}
            <div className="flex items-center gap-4 mb-8 text-muted-foreground">
              <span>By {article.author || 'NewsWire Team'}</span>
              <span>•</span>
              <span>{article.source || 'NewsWire'}</span>
            </div>

            {/* Description/Lead */}
            <p className="text-xl text-muted-foreground mb-10 leading-relaxed font-medium">
              {article.description}
            </p>

            {/* Full Article Content */}
            <div className="prose prose-lg prose-invert max-w-none mb-12">
              <div className="text-body whitespace-pre-line leading-relaxed space-y-6">
                {article.content.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="text-foreground leading-relaxed">
                    {paragraph.trim()}
                  </p>
                ))}
              </div>
            </div>

            {/* AI Summary Section - At the end of article */}
            {article.summary && (
              <div className="bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 rounded-2xl p-8 mb-8">
                <div className="flex items-center mb-6">
                  <div className="flex items-center justify-center w-12 h-12 bg-primary/20 rounded-xl mr-4">
                    <Bot className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground flex items-center">
                      AI Article Summary
                      <Sparkles className="h-5 w-5 ml-2 text-primary" />
                    </h3>
                    <p className="text-muted-foreground text-sm">Key insights and takeaways</p>
                  </div>
                </div>
                <ul className="space-y-4">
                  {article.summary.map((point, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center mr-4 mt-0.5 flex-shrink-0">
                        <span className="w-2 h-2 bg-primary rounded-full"></span>
                      </div>
                      <span className="text-body text-foreground leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 pt-8 border-t border-border/50">
              <Button
                onClick={handleBookmark}
                variant={isBookmarked ? "default" : "outline"}
                className="hover-lift premium-button"
              >
                {isBookmarked ? (
                  <>
                    <BookmarkCheck className="h-4 w-4 mr-2" />
                    Bookmarked
                  </>
                ) : (
                  <>
                    <Bookmark className="h-4 w-4 mr-2" />
                    Bookmark
                  </>
                )}
              </Button>
              
              <Button
                onClick={handleShare}
                variant="outline"
                className="hover-lift"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share Article
              </Button>
              
              <Button
                variant="outline"
                className="hover-lift"
                onClick={() => article.url && article.url !== '#' ? window.open(article.url, '_blank') : null}
                disabled={!article.url || article.url === '#'}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View Original Source
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ArticleModal;
