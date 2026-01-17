import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Wine, Filter, Loader2, Star, Heart } from "lucide-react";

interface WineImageProps {
  src: string;
  alt: string;
  className?: string;
}

const WineImage = ({ src, alt, className = "w-full h-full object-contain" }: WineImageProps) => {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent">
        <Wine className="h-12 w-12 text-primary" />
      </div>
    );
  }

  return (
    <img 
      src={src} 
      alt={alt}
      className={className}
      onError={() => setHasError(true)}
    />
  );
};
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Layout from "@/components/Layout";
import { wineAPI, TransformedWineData } from "@/services/wineApi";
import { useToast } from "@/hooks/use-toast";

const wineTypes = ["Todos", "Tinto", "Blanco", "Rosado", "Espumoso", "Dulce", "Oporto"];

const Explore = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [selectedType, setSelectedType] = useState("Todos");
  const [selectedCountry, setSelectedCountry] = useState("Todos");
  const [wines, setWines] = useState<TransformedWineData[]>([]);
  const [countries, setCountries] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadWines();
  }, []);

  useEffect(() => {
    const searchParam = searchParams.get("search");
    if (searchParam) {
      setSearchTerm(searchParam);
    }
  }, [searchParams]);

  const loadWines = async () => {
    setIsLoading(true);
    try {
      const data = await wineAPI.getAllWines();
      setWines(data);
      
      const availableCountries = await wineAPI.getUniqueCountries();
      setCountries(availableCountries);
    } catch (error) {
      console.error('Error loading wines:', error);
      toast({
        title: "Error al cargar vinos",
        description: "No pudimos cargar el catálogo. Por favor, intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredWines = wines.filter((wine) => {
    const matchesSearch =
      wine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wine.winery.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wine.region.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "Todos" || wine.type === selectedType;
    
    const wineCountry = wineAPI.extractCountryFromRegion(wine.region);
    const matchesCountry = selectedCountry === "Todos" || wineCountry === selectedCountry;
    
    return matchesSearch && matchesType && matchesCountry;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Tinto":
        return "bg-destructive/10 text-destructive";
      case "Blanco":
        return "bg-accent text-accent-foreground";
      case "Rosado":
        return "bg-primary/10 text-primary";
      case "Espumoso":
        return "bg-muted text-muted-foreground";
      case "Dulce":
        return "bg-pink-500/10 text-pink-700 dark:text-pink-400";
      case "Oporto":
        return "bg-purple-500/10 text-purple-700 dark:text-purple-400";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Hero Image */}
        <div className="relative h-48 bg-gradient-to-br from-primary/20 to-accent/20 overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=1200&auto=format&fit=crop"
            alt="Wine barrels"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-2">
                Browse wines
              </h1>
              <p className="text-muted-foreground">
                Discover our wine collection
              </p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6 max-w-6xl">

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Find wines or people"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  if (e.target.value) {
                    setSearchParams({ search: e.target.value });
                  } else {
                    setSearchParams({});
                  }
                }}
                className="pl-10 py-6 rounded-full"
              />
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="mb-6">
            <div className="flex items-center justify-between border-b border-border">
              <div className="flex gap-6">
                <button className="pb-3 border-b-2 border-primary text-sm font-semibold text-foreground">
                  TYPE
                </button>
                <button className="pb-3 border-b-2 border-transparent text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  PAIRING
                </button>
                <button className="pb-3 border-b-2 border-transparent text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  STYLE
                </button>
              </div>
            </div>
          </div>

          {/* Type Filter Pills */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-3">
              {wineTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-6 py-3 rounded-full text-sm font-medium transition-all ${
                    selectedType === type
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-foreground hover:bg-secondary/80'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Results count */}
          {!isLoading && (
            <p className="text-sm text-muted-foreground mb-4">
              {filteredWines.length} vino{filteredWines.length !== 1 ? "s" : ""} encontrado
              {filteredWines.length !== 1 ? "s" : ""}
            </p>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Cargando catálogo de vinos...</p>
            </div>
          )}

          {/* Wine Grid */}
          {!isLoading && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredWines.map((wine, index) => (
                <Card key={`${wine.type}-${wine.id}-${index}`} className="hover:shadow-lg transition-shadow border-border group overflow-hidden bg-card">
                  <CardContent className="p-4">
                    <div className="relative aspect-[3/4] bg-gradient-to-br from-muted/30 to-secondary/30 rounded-2xl flex items-center justify-center mb-3 overflow-hidden">
                      <WineImage 
                        src={wine.image || `https://images.vivino.com/thumbs/placeholder_pb_x600.png`} 
                        alt={wine.name}
                        className="w-full h-full object-contain p-2"
                      />
                      <button className="absolute top-2 right-2 w-8 h-8 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center hover:bg-card transition-colors shadow-sm">
                        <Heart className="h-4 w-4 text-muted-foreground" />
                      </button>
                      {wine.rating > 0 && (
                        <div className="absolute top-2 left-2 bg-card/90 backdrop-blur-sm rounded-lg px-2 py-1 shadow-sm">
                          <div className="flex items-center gap-1">
                            <span className="text-sm font-bold">{wine.rating.toFixed(1)}</span>
                            <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                          </div>
                        </div>
                      )}
                    </div>
                    <h4 className="font-semibold text-sm mb-0.5 line-clamp-2 min-h-[2.5rem]">{wine.name}</h4>
                    <p className="text-xs text-muted-foreground mb-1 line-clamp-1">{wine.winery}</p>
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-1">{wine.region}</p>
                    <div className="flex items-center justify-between mt-auto">
                      <span className={`px-2 py-0.5 rounded-full text-xs ${getTypeColor(wine.type)}`}>
                        {wine.type}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!isLoading && filteredWines.length === 0 && (
            <div className="text-center py-12">
              <Wine className="h-12 w-12 text-muted mx-auto mb-4" />
              <p className="text-muted-foreground">No se encontraron vinos con esos criterios.</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedType("Todos");
                  setSelectedCountry("Todos");
                }}
              >
                Limpiar filtros
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Explore;
