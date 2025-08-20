
import React, { useState } from 'react';
import { Search, Moon, Sun, Bookmark, Menu, X } from 'lucide-react';
import { useNews } from '../contexts/NewsContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const categories = [
  'technology', 'world', 'business', 'health', 'sports', 'entertainment', 'science'
];

const Navbar: React.FC = () => {
  const { state, dispatch } = useNews();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleCategoryChange = (category: string) => {
    dispatch({ type: 'SET_CATEGORY', payload: category });
    setIsMenuOpen(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Implement search functionality
      console.log('Searching for:', searchQuery);
    }
  };

  return (
    <nav className="sticky top-0 z-50 glass border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="text-2xl">📰</div>
            <h1 className="text-xl font-bold hero-gradient bg-clip-text text-transparent">
              NewsPro
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="flex space-x-4">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={state.selectedCategory === category ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handleCategoryChange(category)}
                  className="capitalize hover-lift"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Search and Actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="hidden sm:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search news..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64 bg-muted/50"
                />
              </div>
            </form>

            {/* Actions */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => console.log('Show bookmarks')}
              className="hover-lift"
            >
              <Bookmark className="h-4 w-4" />
              <span className="hidden sm:inline ml-2">
                Bookmarks ({state.bookmarks.length})
              </span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => dispatch({ type: 'TOGGLE_DARK_MODE' })}
              className="hover-lift"
            >
              {state.darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border/50">
            <div className="flex flex-wrap gap-2 mb-4">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={state.selectedCategory === category ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handleCategoryChange(category)}
                  className="capitalize"
                >
                  {category}
                </Button>
              ))}
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
                  className="pl-10 w-full bg-muted/50"
                />
              </div>
            </form>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
