import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Wine, Camera, Utensils, Gift, Search, Menu, X, ArrowRight, Plus, MapPin, MessageCircle, Loader2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { wineAPI, TransformedWineData } from "@/services/wineApi";
import { useToast } from "@/hooks/use-toast";

const features = [
  {
    icon: Camera,
    title: "Escanear Etiqueta",
    description: "Sube una foto de la etiqueta y la IA extraerá toda la información del vino",
    href: "/scan",
    badge: "Get 50% off",
  },
  {
    icon: Utensils,
    title: "Maridajes",
    description: "Descubre qué vinos combinan perfectamente con tu plato favorito",
    href: "/pairing",
  },
  {
    icon: Gift,
    title: "Recomendar Vino",
    description: "Describe los gustos de alguien y encontraremos el vino ideal",
    href: "/recommend",
  },
];

const Index = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [fabOpen, setFabOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [featuredWines, setFeaturedWines] = useState<TransformedWineData[]>([]);
  const [topWine, setTopWine] = useState<TransformedWineData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadWines();
  }, []);

  const loadWines = async () => {
    setIsLoading(true);
    try {
      const topRated = await wineAPI.getTopRatedWines(5);
      if (topRated.length > 0) {
        setTopWine(topRated[0]);
        setFeaturedWines(topRated.slice(1, 5));
      }
    } catch (error) {
      console.error('Error loading wines:', error);
      toast({
        title: "Error al cargar vinos",
        description: "No pudimos cargar los vinos destacados.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/explore?search=${encodeURIComponent(searchTerm)}`);
    } else {
      navigate('/explore');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Hey, Merry Cooper 👋</p>
              <p className="text-sm font-medium">Tu ubicación</p>
            </div>
          </div>
          <Link to="/" className="flex items-center gap-2 group absolute left-1/2 -translate-x-1/2">
            <Wine className="h-7 w-7 text-primary transition-transform group-hover:scale-110" />
            <span className="text-xl font-serif font-bold text-foreground">WineWise</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/scan" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group">
              Escanear
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
            </Link>
            <Link to="/pairing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group">
              Maridajes
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
            </Link>
            <Link to="/recommend" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group">
              Recomendar
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
            </Link>
            <Link to="/explore" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group">
              Explorar
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
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
          <div className="md:hidden border-t border-border bg-card/95 backdrop-blur-md animate-in slide-in-from-top-2">
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-3">
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

      {/* Search Bar */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <form onSubmit={handleSearch}>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search wines, wineries, regions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-full bg-card border border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </form>
      </section>

      {/* Featured Banner - Best Rated of the Week */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 pb-6">
        <h2 className="text-2xl font-bold mb-4">Picked for you</h2>
        {isLoading ? (
          <div className="bg-secondary rounded-3xl p-12 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : topWine ? (
          <div className="relative bg-gradient-to-br from-[#8B5A5A] via-[#A67B7B] to-[#B89090] rounded-3xl p-6 overflow-hidden">
            <div className="absolute inset-0 opacity-30">
              <img 
                src="https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=800&auto=format&fit=crop" 
                alt="vineyard background"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="relative z-10 flex items-center gap-6">
              <div className="flex-shrink-0">
                <img 
                  src={topWine.image}
                  alt={topWine.name}
                  className="w-24 h-32 object-contain drop-shadow-2xl"
                  onError={(e) => {
                    e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 200"%3E%3Crect fill="%23701010" width="100" height="200"/%3E%3C/svg%3E';
                  }}
                />
              </div>
              <div className="flex-1 text-white">
                <p className="text-xs uppercase tracking-wide mb-1 opacity-90">{wineAPI.extractCountryFromRegion(topWine.region)}</p>
                <h3 className="text-xl font-bold mb-2">Best rated of the week</h3>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl font-bold">{topWine.rating.toFixed(1)}</span>
                  <div className="flex items-center gap-0.5">
                    {[1,2,3,4,5].map(i => (
                      <span key={i} className={i <= Math.round(topWine.rating) ? "text-yellow-400" : "text-white/40"}>★</span>
                    ))}
                  </div>
                  <span className="text-xs opacity-75">{topWine.reviews} reviews</span>
                </div>
                <Link to="/explore">
                  <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-6">
                    Explore wines
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative z-10 mt-4 pt-4 border-t border-white/20">
              <p className="text-sm font-semibold text-white mb-1">{topWine.winery}</p>
              <p className="text-sm text-white/90">{topWine.name}</p>
              <p className="text-xs text-white/70 mt-1">📍 {topWine.region}</p>
            </div>
          </div>
        ) : null}
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 pb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">Featured Wines</h3>
          <Link to="/explore" className="text-sm text-primary hover:underline">View All</Link>
        </div>
        {isLoading ? (
          <div className="grid grid-cols-2 gap-4">
            {[1,2,3,4].map(i => (
              <Card key={i} className="overflow-hidden border-border bg-card">
                <CardContent className="p-4">
                  <div className="aspect-[3/4] bg-secondary rounded-2xl animate-pulse mb-3" />
                  <div className="h-4 bg-secondary rounded animate-pulse mb-2" />
                  <div className="h-3 bg-secondary/50 rounded animate-pulse w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {featuredWines.map((wine, index) => (
              <Link key={wine.id} to="/explore">
                <Card className="overflow-hidden border-border hover:shadow-lg transition-shadow bg-card">
                  <CardContent className="p-4">
                    <div className="relative aspect-[3/4] bg-gradient-to-br from-muted/30 to-secondary/30 rounded-2xl flex items-center justify-center mb-3 overflow-hidden">
                      <img 
                        src={wine.image}
                        alt={wine.name}
                        className="w-full h-full object-contain p-2"
                        onError={(e) => {
                          e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 200"%3E%3Crect fill="%23701010" width="100" height="200"/%3E%3Ctext x="50" y="100" text-anchor="middle" fill="white" font-size="60"%3E🍷%3C/text%3E%3C/svg%3E';
                        }}
                      />
                      <button 
                        className="absolute top-2 right-2 w-8 h-8 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center hover:bg-card transition-colors shadow-sm"
                        onClick={(e) => e.preventDefault()}
                      >
                        <span className="text-red-500 text-lg">♡</span>
                      </button>
                      {wine.rating > 0 && (
                        <div className="absolute top-2 left-2 bg-card/90 backdrop-blur-sm rounded-lg px-2 py-1 shadow-sm">
                          <div className="flex items-center gap-1">
                            <span className="text-sm font-bold">{wine.rating.toFixed(1)}</span>
                            <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                          </div>
                          <p className="text-[10px] text-muted-foreground leading-tight">{wine.reviews}</p>
                        </div>
                      )}
                    </div>
                    <h4 className="font-semibold text-sm mb-0.5 line-clamp-1">{wine.name}</h4>
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-1">{wine.winery}</p>
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-1">📍 {wine.region}</p>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">{wine.type}</span>
                      <Button size="sm" className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-4 h-8">
                        View
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Quick Actions */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 pb-6">
        <div className="grid grid-cols-3 gap-3">
          {features.map((feature) => (
            <Link key={feature.title} to={feature.href}>
              <Card className="hover:shadow-md transition-shadow border-border">
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-secondary flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <p className="text-xs font-medium line-clamp-2">{feature.title}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Chat with Expert */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 pb-6">
        <Card className="bg-gradient-to-br from-primary to-primary/80 border-0 text-primary-foreground overflow-hidden relative">
          <CardContent className="p-6 relative z-10">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-primary-foreground/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                <span className="text-3xl">💬</span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold mb-2">Chat with one of our wine experts</h3>
                <p className="text-sm text-primary-foreground/90 mb-4">Get personalized recommendations and expert advice</p>
                <Button variant="secondary" size="sm" className="rounded-full bg-primary-foreground text-primary hover:bg-primary-foreground/90">
                  Start Chat
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-10 md:py-12 bg-card/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Wine className="h-6 w-6 text-primary" />
            <span className="text-xl font-serif font-bold text-foreground">WineWise</span>
          </div>
          <p className="text-muted-foreground text-sm">
            Tu asistente inteligente del mundo del vino
          </p>
          <p className="text-muted-foreground/60 text-xs mt-4">
            © 2024 WineWise. Todos los derechos reservados.
          </p>
        </div>
      </footer>

      {/* Floating Action Menu */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col-reverse items-end gap-3">
        {/* Action Buttons */}
        {fabOpen && (
          <div className="flex flex-col-reverse gap-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <Link to="/scan">
              <button 
                className="flex items-center gap-3 bg-card hover:bg-accent text-foreground px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all border border-border group"
                onClick={() => setFabOpen(false)}
              >
                <Camera className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium pr-1">Escanear</span>
              </button>
            </Link>
            <Link to="/pairing">
              <button 
                className="flex items-center gap-3 bg-card hover:bg-accent text-foreground px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all border border-border group"
                onClick={() => setFabOpen(false)}
              >
                <Utensils className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium pr-1">Maridajes</span>
              </button>
            </Link>
            <Link to="/recommend">
              <button 
                className="flex items-center gap-3 bg-card hover:bg-accent text-foreground px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all border border-border group"
                onClick={() => setFabOpen(false)}
              >
                <Gift className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium pr-1">Recomendar</span>
              </button>
            </Link>
            <Link to="/explore">
              <button 
                className="flex items-center gap-3 bg-card hover:bg-accent text-foreground px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all border border-border group"
                onClick={() => setFabOpen(false)}
              >
                <Search className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium pr-1">Explorar</span>
              </button>
            </Link>
          </div>
        )}

        {/* Main FAB Button */}
        <button
          onClick={() => setFabOpen(!fabOpen)}
          className={`w-14 h-14 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl hover:shadow-2xl transition-all flex items-center justify-center ${
            fabOpen ? 'rotate-45' : 'rotate-0'
          }`}
          aria-label="Menú de acciones"
        >
          <Plus className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};

export default Index;
