import { Wine, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <Wine className="h-7 w-7 sm:h-8 sm:w-8 text-primary transition-transform group-hover:scale-110" />
            <span className="text-xl sm:text-2xl font-serif font-bold text-foreground">WineWise</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/scan" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Escanear
            </Link>
            <Link to="/pairing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Maridajes
            </Link>
            <Link to="/recommend" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Recomendar
            </Link>
            <Link to="/explore" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Explorar
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-card/95 backdrop-blur-md">
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
              <Link 
                to="/scan" 
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-lg transition-all"
              >
                Escanear
              </Link>
              <Link 
                to="/pairing" 
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-lg transition-all"
              >
                Maridajes
              </Link>
              <Link 
                to="/recommend" 
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-lg transition-all"
              >
                Recomendar
              </Link>
              <Link 
                to="/explore" 
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-lg transition-all"
              >
                Explorar
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8 md:py-10 bg-card/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Wine className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            <span className="text-lg sm:text-xl font-serif font-bold text-foreground">WineWise</span>
          </div>
          <p className="text-muted-foreground text-xs sm:text-sm">
            Tu asistente inteligente del mundo del vino
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
