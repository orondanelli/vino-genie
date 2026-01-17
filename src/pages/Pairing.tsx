import { useState } from "react";
import { Utensils, Loader2, Wine, Sparkles, ArrowLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface WinePairing {
  wine: string;
  type: string;
  reason: string;
}

interface PairingResult {
  dish: string;
  recommendations: WinePairing[];
}

const foodCategories = [
  { name: "Pasta cremosa", emoji: "🍝", image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400" },
  { name: "Pollo a la parrilla", emoji: "🍗", image: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400" },
  { name: "Langosta o cangrejo", emoji: "🦞", image: "https://images.unsplash.com/photo-1559737558-2f5a35f4523b?w=400" },
  { name: "Salsas mantecosas", emoji: "🧈", image: "https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?w=400" },
  { name: "Queso Brie", emoji: "🧀", image: "https://images.unsplash.com/photo-1452195100486-9cc805987862?w=400" },
  { name: "Quesos cremosos", emoji: "🧀", image: "https://images.unsplash.com/photo-1618164436241-4473940d1f5c?w=400" },
  { name: "Ensaladas cítricas", emoji: "🥗", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400" },
  { name: "Verduras asadas", emoji: "🥕", image: "https://images.unsplash.com/photo-1540914124281-342587941389?w=400" },
  { name: "Queso de cabra", emoji: "🐐", image: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400" },
  { name: "Mariscos ligeros", emoji: "🦐", image: "https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?w=400" },
  { name: "Platos picantes", emoji: "🌶️", image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400" },
  { name: "Ensaladas de frutas", emoji: "🍓", image: "https://images.unsplash.com/photo-1564093497595-593b96d80180?w=400" },
  { name: "Pollo asado", emoji: "🍗", image: "https://images.unsplash.com/photo-1594221708779-94832f4320d1?w=400" },
  { name: "Cerdo a la parrilla", emoji: "🥩", image: "https://images.unsplash.com/photo-1588168333986-5078d3ae3976?w=400" },
  { name: "Hongos", emoji: "🍄", image: "https://images.unsplash.com/photo-1576684171322-e3f6a3f74978?w=400" },
  { name: "Cordero", emoji: "🍖", image: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400" },
];

const Pairing = () => {
  const [dish, setDish] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PairingResult | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const { toast } = useToast();

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const searchPairing = async (searchDish?: string) => {
    const dishToSearch = searchDish || dish;
    const categoriesToSearch = selectedCategories.length > 0 ? selectedCategories.join(", ") : dishToSearch;
    
    if (!dishToSearch.trim() && selectedCategories.length === 0) return;

    setIsLoading(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke("wine-pairing", {
        body: { dish: categoriesToSearch },
      });

      if (error) {
        if (error.message?.includes("429")) {
          toast({
            title: "Límite alcanzado",
            description: "Has superado el límite de solicitudes. Por favor, espera un momento.",
            variant: "destructive",
          });
        } else {
          throw error;
        }
        return;
      }

      setResult(data);
    } catch (error) {
      console.error("Error getting pairing:", error);
      toast({
        title: "Error",
        description: "No pudimos encontrar maridajes. Por favor, intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickSelect = (selectedDish: string) => {
    setDish(selectedDish);
    searchPairing(selectedDish);
  };

  const resetSearch = () => {
    setResult(null);
    setDish("");
    setSelectedCategories([]);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6 max-w-3xl">
          {!result && (
            <>
              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mx-auto mb-4">
                  <Utensils className="h-8 w-8 text-primary" />
                </div>
                <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
                  Maridaje de Vinos
                </h1>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  Descubre el vino perfecto para tus platos favoritos
                </p>
              </div>

              {/* Search Bar */}
              <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                value={dish}
                onChange={(e) => setDish(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && searchPairing()}
                className="w-full pl-10 pr-4 py-3 rounded-full bg-card border border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            </div>
          </div>

          {/* Food Categories */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4">Selecciona tus platos favoritos</h2>
            <div className="grid grid-cols-2 gap-4">
              {foodCategories.map((category) => (
                <button
                  key={category.name}
                  onClick={() => toggleCategory(category.name)}
                  className={`relative overflow-hidden rounded-2xl transition-all transform hover:scale-105 ${
                    selectedCategories.includes(category.name)
                      ? 'ring-4 ring-primary shadow-lg'
                      : 'hover:shadow-md'
                  }`}
                >
                  {/* Background Image */}
                  <div className="aspect-[4/3] relative">
                    <img 
                      src={category.image} 
                      alt={category.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${
                      selectedCategories.includes(category.name)
                        ? 'from-primary/90 via-primary/60 to-transparent'
                        : 'from-black/70 via-black/40 to-transparent'
                    } transition-all`}></div>
                    
                    {/* Emoji Badge */}
                    <div className="absolute top-2 right-2 text-3xl drop-shadow-lg">
                      {category.emoji}
                    </div>
                    
                    {/* Category Name */}
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <p className="text-white font-semibold text-sm leading-tight">
                        {category.name}
                      </p>
                    </div>
                    
                    {/* Selected Check */}
                    {selectedCategories.includes(category.name) && (
                      <div className="absolute top-2 left-2 bg-white rounded-full p-1">
                        <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                        </svg>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

              {/* Apply Button */}
              <Button 
                onClick={() => searchPairing()} 
                disabled={isLoading || (selectedCategories.length === 0 && !dish.trim())}
                className="w-full rounded-full py-6 text-base font-semibold mb-6 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Buscando maridajes perfectos...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Encontrar maridajes
                  </>
                )}
              </Button>
            </>
          )}

          {isLoading && (
            <div className="text-center py-12">
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Buscando los mejores maridajes...</p>
            </div>
          )}

          {result && (
            <div className="space-y-4">
              {/* Header with Back Button */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex-1">
                  <h1 className="text-2xl md:text-3xl font-serif font-bold text-foreground">
                    Maridajes Perfectos
                  </h1>
                  <p className="text-muted-foreground text-sm mt-1">
                    Vinos recomendados para <span className="text-primary font-medium">{result.dish}</span>
                  </p>
                </div>
                <Button
                  onClick={resetSearch}
                  variant="outline"
                  className="rounded-full shrink-0"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Nueva búsqueda
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.recommendations.map((rec, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow border-border overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        {/* Wine Bottle */}
                        <div className="flex-shrink-0 w-20">
                          <div className="aspect-[3/4] bg-gradient-to-br from-muted/30 to-secondary/30 rounded-xl flex items-center justify-center overflow-hidden">
                            <img 
                              src={`https://images.vivino.com/thumbs/placeholder_pb_x600.png`}
                              alt={rec.wine}
                              className="w-full h-full object-contain p-1"
                              onError={(e) => {
                                e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 200"%3E%3Crect fill="%23701010" width="100" height="200"/%3E%3Ctext x="50" y="100" text-anchor="middle" fill="white" font-size="50"%3E🍷%3C/text%3E%3C/svg%3E';
                              }}
                            />
                          </div>
                        </div>
                        
                        {/* Wine Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-base mb-1 line-clamp-2">{rec.wine}</h3>
                          <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium mb-2">
                            {rec.type}
                          </span>
                          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">{rec.reason}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Pairing;
