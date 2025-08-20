
import React from 'react';

const SkeletonCard: React.FC = () => {
  return (
    <div className="news-card animate-pulse">
      <div className="relative aspect-video bg-muted rounded-t-2xl">
        <div className="absolute top-4 left-4 bg-muted-foreground/20 rounded px-2 py-1 w-16 h-6"></div>
        <div className="absolute top-4 right-4 bg-muted-foreground/20 rounded w-8 h-8"></div>
      </div>
      <div className="p-6 space-y-4">
        <div className="flex items-center gap-2">
          <div className="bg-muted-foreground/20 rounded px-2 py-1 w-16 h-5"></div>
          <div className="bg-muted-foreground/20 rounded px-2 py-1 w-20 h-5"></div>
        </div>
        <div className="space-y-2">
          <div className="bg-muted-foreground/20 rounded h-6 w-full"></div>
          <div className="bg-muted-foreground/20 rounded h-6 w-3/4"></div>
        </div>
        <div className="space-y-2">
          <div className="bg-muted-foreground/20 rounded h-4 w-full"></div>
          <div className="bg-muted-foreground/20 rounded h-4 w-full"></div>
          <div className="bg-muted-foreground/20 rounded h-4 w-2/3"></div>
        </div>
        <div className="space-y-2">
          <div className="bg-muted-foreground/20 rounded h-3 w-20"></div>
          <div className="bg-muted-foreground/20 rounded h-3 w-full"></div>
          <div className="bg-muted-foreground/20 rounded h-3 w-full"></div>
        </div>
        <div className="bg-muted-foreground/20 rounded h-6 w-24"></div>
      </div>
    </div>
  );
};

export default SkeletonCard;
