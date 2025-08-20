
import React, { useState } from 'react';
import { Search, Moon, Sun, Bookmark, Menu, X, Home } from 'lucide-react';
import { useNews } from '../contexts/NewsContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const categories = [
  { id: 'general', name: 'Home', icon: Home },
  { id: 'technology', name: 'Technology' },
  { id: 'world', name: 'World' },
  { id: 'business', name: 'Business' },
  { id: 'health', name: 'Health' },
  { id: 'sports', name: 'Sports' },
  { id: 'entertainment', name: 'Entertainment' },
  { id: 'science', name: 'Science' }
];

const Navbar: React.FC = () => {
  const { state, dispatch } = useNews();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showBookmarks, setShowBookmarks] = useState(false);

  const handleCategoryChange = (category: string) => {
    dispatch({ type: 'SET_CATEGORY', payload: category });
    setIsMenuOpen(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // TODO: Implement search functionality
      console.log('Searching for:', searchQuery);
    }
  };

  const handleBookmarksToggle = () => {
    setShowBookmarks(!showBookmarks);
    // TODO: Navigate to bookmarks page
  };

  return (
    <>
      <nav className="sticky top-0 z-50 navbar-glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="text-2xl">📰</div>
              <h1 className="text-xl font-medium text-primary">
                NewsPro
              </h1>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {categories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryChange(category.id)}
                    className={`nav-button ${
                      state.selectedCategory === category.id ? 'active' : ''
                    }`}
                  >
                    {IconComponent && <IconComponent className="h-4 w-4 mr-2" />}
                    {category.name}
                  </button>
                );
              })}
            </div>

            {/* Search and Actions */}
            <div className="flex items-center space-x-2">
              {/* Search */}
              <form onSubmit={handleSearch} className="hidden sm:block">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search news..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-64 h-9 bg-secondary/50 border-border/50 focus:bg-background"
                  />
                </div>
              </form>

              {/* Actions */}
              <button
                onClick={handleBookmarksToggle}
                className="icon-button relative"
                title="Bookmarks"
              >
                <Bookmark className="h-5 w-5" />
                {state.bookmarks.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                    {state.bookmarks.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => dispatch({ type: 'TOGGLE_DARK_MODE' })}
                className="icon-button"
                title="Toggle theme"
              >
                {state.darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>

              {/* Mobile menu button */}
              <button
                className="icon-button lg:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {isMenuOpen && (
            <div className="lg:hidden py-4 border-t border-border/50 animate-fade-in">
              <div className="grid grid-cols-2 gap-2 mb-4">
                {categories.map((category) => {
                  const IconComponent = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => handleCategoryChange(category.id)}
                      className={`nav-button justify-start ${
                        state.selectedCategory === category.id ? 'active' : ''
                      }`}
                    >
                      {IconComponent && <IconComponent className="h-4 w-4 mr-2" />}
                      {category.name}
                    </button>
                  );
                })}
              </div>
              
              {/* Mobile search */}
              <form onSubmit={handleSearch} className="sm:hidden">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search news..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-full h-9 bg-secondary/50 border-border/50"
                  />
                </div>
              </form>
            </div>
          )}
        </div>
      </nav>

      {/* Bookmarks overlay */}
      {showBookmarks && (
        <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm animate-fade-in">
          <div className="fixed right-0 top-14 w-80 h-[calc(100vh-3.5rem)] bg-card border-l border-border shadow-lg p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium">Bookmarks</h2>
              <button
                onClick={() => setShowBookmarks(false)}
                className="icon-button"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            
            {state.bookmarks.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No bookmarks yet
              </p>
            ) : (
              <div className="space-y-3">
                {state.bookmarks.map((article) => (
                  <div key={article.id} className="news-card p-3 cursor-pointer">
                    <h3 className="font-medium text-sm line-clamp-2 mb-2">
                      {article.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {article.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
