
import React from 'react';
import { X, Clock, Share2, Bookmark, BookmarkCheck, ExternalLink } from 'lucide-react';
import { Article, useNews } from '../contexts/NewsContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';

interface ArticleModalProps {
  article: Article;
  isOpen: boolean;
  onClose: () => void;
}

const ArticleModal: React.FC<ArticleModalProps> = ({ article, isOpen, onClose }) => {
  const { state, dispatch } = useNews();
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        <div className="relative">
          {/* Header Image */}
          <div className="relative h-64 md:h-80 overflow-hidden rounded-t-lg">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=400&fit=crop&auto=format';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            
            {/* Close button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="absolute top-4 right-4 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8">
            {/* Meta information */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <Badge className="capitalize">
                {article.category}
              </Badge>
              {article.sentiment && (
                <Badge variant="outline" className={`sentiment-${article.sentiment}`}>
                  {article.sentiment}
                </Badge>
              )}
              <div className="flex items-center text-muted-foreground text-sm">
                <Clock className="h-4 w-4 mr-2" />
                {formatTime(article.publishedAt)}
              </div>
            </div>

            {/* Title */}
            <h1 className="text-headline mb-6 text-balance">
              {article.title}
            </h1>

            {/* Description */}
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              {article.description}
            </p>

            {/* AI Summary */}
            {article.summary && (
              <div className="bg-muted/50 rounded-2xl p-6 mb-8">
                <h3 className="font-semibold mb-4 flex items-center">
                  🤖 AI Summary
                </h3>
                <ul className="space-y-3">
                  {article.summary.map((point, index) => (
                    <li key={index} className="flex items-start">
                      <span className="w-2 h-2 bg-primary rounded-full mr-3 mt-2 flex-shrink-0"></span>
                      <span className="text-body">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Article Content */}
            <div className="prose prose-lg max-w-none mb-8">
              <div className="text-body whitespace-pre-line leading-relaxed">
                {article.content}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 pt-6 border-t">
              <Button
                onClick={handleBookmark}
                variant={isBookmarked ? "default" : "outline"}
                className="hover-lift"
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
                Share
              </Button>
              
              <Button
                variant="outline"
                className="hover-lift"
                onClick={() => window.open('#', '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View Source
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ArticleModal;
