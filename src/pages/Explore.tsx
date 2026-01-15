import { useState, useEffect } from "react";
import { Search, Wine, Filter, Loader2, Star } from "lucide-react";

interface WineImageProps {
  src: string;
  alt: string;
}

const WineImage = ({ src, alt }: WineImageProps) => {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent">
        <Wine className="h-8 w-8 text-primary" />
      </div>
    );
  }

  return (
    <img 
      src={src} 
      alt={alt}
      className="w-full h-full object-cover"
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
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("Todos");
  const [selectedCountry, setSelectedCountry] = useState("Todos");
  const [wines, setWines] = useState<TransformedWineData[]>([]);
  const [countries, setCountries] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadWines();
  }, []);

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
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
              Explorar Vinos
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Descubre nuestra selección de vinos y encuentra tu próximo favorito.
            </p>
          </div>

          {/* Filters */}
          <Card className="mb-8">
            <CardContent className="p-4">
              <div className="flex flex-col gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por nombre, bodega o región..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="text-sm text-muted-foreground">Filtros:</span>
                  </div>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="w-full sm:w-40">
                      <SelectValue placeholder="Tipo de vino" />
                    </SelectTrigger>
                    <SelectContent>
                      {wineTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                    <SelectTrigger className="w-full sm:w-40">
                      <SelectValue placeholder="País" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Todos">Todos los países</SelectItem>
                      {countries.map((country) => (
                        <SelectItem key={country} value={country}>
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {(selectedType !== "Todos" || selectedCountry !== "Todos" || searchTerm) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSearchTerm("");
                        setSelectedType("Todos");
                        setSelectedCountry("Todos");
                      }}
                      className="text-xs"
                    >
                      Limpiar filtros
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

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
            <div className="grid md:grid-cols-2 gap-4">
              {filteredWines.map((wine, index) => (
                <Card key={`${wine.type}-${wine.id}-${index}`} className="hover:shadow-md transition-shadow border-border/50 group overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-20 rounded-lg overflow-hidden shrink-0 bg-muted">
                        <WineImage src={wine.image} alt={wine.name} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg font-serif truncate group-hover:text-primary transition-colors">
                          {wine.name}
                        </CardTitle>
                        <CardDescription className="text-sm">
                          {wine.winery}
                        </CardDescription>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className={`px-2 py-0.5 rounded text-xs ${getTypeColor(wine.type)}`}>
                            {wine.type}
                          </span>
                          {wine.rating > 0 && (
                            <span className="px-2 py-0.5 bg-amber-500/10 text-amber-700 dark:text-amber-400 rounded text-xs flex items-center gap-1">
                              <Star className="h-3 w-3 fill-current" />
                              {wine.rating.toFixed(1)}
                            </span>
                          )}
                          <span className="px-2 py-0.5 bg-accent/50 text-foreground rounded text-xs truncate max-w-[150px]">
                            {wine.region}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
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
