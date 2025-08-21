import React, { useState } from 'react';
import { Search, Bookmark, Menu, X, Home } from 'lucide-react';
import { useNews } from '../contexts/NewsContext';
import { searchNews } from '../services/newsApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
const categories = [{
  id: 'general',
  name: 'Home',
  icon: Home
}, {
  id: 'technology',
  name: 'Technology'
}, {
  id: 'world',
  name: 'World'
}, {
  id: 'business',
  name: 'Business'
}, {
  id: 'health',
  name: 'Health'
}, {
  id: 'sports',
  name: 'Sports'
}, {
  id: 'entertainment',
  name: 'Entertainment'
}, {
  id: 'science',
  name: 'Science'
}];
const Navbar: React.FC = () => {
  const {
    state,
    dispatch
  } = useNews();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const handleCategoryChange = (category: string) => {
    dispatch({
      type: 'SET_CATEGORY',
      payload: category
    });
    setIsMenuOpen(false);
  };
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      toast({
        title: "Search Error",
        description: "Please enter a search term",
        variant: "destructive"
      });
      return;
    }
    setIsSearching(true);
    dispatch({
      type: 'SET_LOADING',
      payload: true
    });
    try {
      const results = await searchNews(searchQuery.trim());
      dispatch({
        type: 'SET_ARTICLES',
        payload: results
      });
      dispatch({
        type: 'SET_CATEGORY',
        payload: 'search'
      });
      toast({
        title: "Search Complete",
        description: `Found ${results.length} articles for "${searchQuery}"`
      });
      setSearchQuery('');
      setIsMenuOpen(false);
    } catch (error) {
      toast({
        title: "Search Failed",
        description: "Unable to search articles. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
      dispatch({
        type: 'SET_LOADING',
        payload: false
      });
    }
  };
  const handleBookmarksToggle = () => {
    setShowBookmarks(!showBookmarks);
  };
  return <>
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mx-0 px-[9px]">
                NewsPro
              </h1>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {categories.map(category => {
              const IconComponent = category.icon;
              return <button key={category.id} onClick={() => handleCategoryChange(category.id)} className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${state.selectedCategory === category.id ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'}`}>
                    {IconComponent && <IconComponent className="h-4 w-4 mr-2 inline" />}
                    {category.name}
                  </button>;
            })}
            </div>

            {/* Search and Actions */}
            <div className="flex items-center space-x-2">
              {/* Search */}
              <form onSubmit={handleSearch} className="hidden sm:block">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input type="text" placeholder="Search news..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} disabled={isSearching} className="pl-10 w-64 h-10 bg-secondary/50 border-border/50 focus:bg-background rounded-xl" />
                  {isSearching && <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
                    </div>}
                </div>
              </form>

              {/* Bookmarks */}
              <button onClick={handleBookmarksToggle} className="relative p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors" title="Bookmarks">
                <Bookmark className="h-5 w-5" />
                {state.bookmarks.length > 0 && <span className="absolute -top-1 -right-1 h-5 w-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-medium">
                    {state.bookmarks.length > 9 ? '9+' : state.bookmarks.length}
                  </span>}
              </button>

              {/* Mobile menu button */}
              <button className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors lg:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {isMenuOpen && <div className="lg:hidden py-4 border-t border-border/50 animate-fade-in">
              {/* Mobile search */}
              <form onSubmit={handleSearch} className="sm:hidden mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input type="text" placeholder="Search news..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} disabled={isSearching} className="pl-10 w-full h-10 bg-secondary/50 border-border/50 rounded-xl" />
                  {isSearching && <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
                    </div>}
                </div>
              </form>
              
              <div className="grid grid-cols-2 gap-2">
                {categories.map(category => {
              const IconComponent = category.icon;
              return <button key={category.id} onClick={() => handleCategoryChange(category.id)} className={`flex items-center justify-start px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${state.selectedCategory === category.id ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'}`}>
                      {IconComponent && <IconComponent className="h-4 w-4 mr-2" />}
                      {category.name}
                    </button>;
            })}
              </div>
            </div>}
        </div>
      </nav>

      {/* Bookmarks overlay */}
      {showBookmarks && <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm animate-fade-in">
          <div className="fixed right-0 top-16 w-80 max-w-[90vw] h-[calc(100vh-4rem)] bg-card/95 backdrop-blur-xl border-l border-border shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-border/50">
              <h2 className="text-lg font-bold">Bookmarks</h2>
              <button onClick={() => setShowBookmarks(false)} className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>
            
            <div className="p-4 h-full overflow-y-auto">
              {state.bookmarks.length === 0 ? <div className="text-center py-12">
                  <Bookmark className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No bookmarks yet</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Save articles by clicking the bookmark icon
                  </p>
                </div> : <div className="space-y-3">
                  {state.bookmarks.map(article => <div key={article.id} className="bg-secondary/30 rounded-xl p-3 cursor-pointer hover:bg-secondary/50 transition-colors">
                      <h3 className="font-medium text-sm line-clamp-2 mb-2">
                        {article.title}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                        {article.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full capitalize">
                          {article.category}
                        </span>
                        <button onClick={e => {
                  e.stopPropagation();
                  dispatch({
                    type: 'REMOVE_BOOKMARK',
                    payload: article.id
                  });
                }} className="text-destructive hover:bg-destructive/10 p-1 rounded-lg transition-colors">
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    </div>)}
                </div>}
            </div>
          </div>
        </div>}
    </>;
};
export default Navbar;