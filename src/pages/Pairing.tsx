import { useState } from "react";
import { Utensils, Loader2, Wine, Sparkles } from "lucide-react";
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

const popularDishes = [
  "Pasta carbonara",
  "Salmón a la plancha",
  "Carne asada",
  "Quesos curados",
  "Paella",
  "Pizza margarita",
];

const Pairing = () => {
  const [dish, setDish] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PairingResult | null>(null);
  const { toast } = useToast();

  const searchPairing = async (searchDish?: string) => {
    const dishToSearch = searchDish || dish;
    if (!dishToSearch.trim()) return;

    setIsLoading(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke("wine-pairing", {
        body: { dish: dishToSearch },
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

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mx-auto mb-4">
              <Utensils className="h-8 w-8 text-accent-foreground" />
            </div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
              Maridajes
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Dinos qué vas a comer y te recomendaremos los vinos que mejor combinan con tu plato.
            </p>
          </div>

          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="dish" className="text-base font-medium">
                    ¿Qué plato vas a disfrutar?
                  </Label>
                  <div className="flex gap-3 mt-2">
                    <Input
                      id="dish"
                      placeholder="Ej: Risotto de setas, Cordero asado..."
                      value={dish}
                      onChange={(e) => setDish(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && searchPairing()}
                      className="text-base"
                    />
                    <Button onClick={() => searchPairing()} disabled={isLoading || !dish.trim()}>
                      {isLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Sparkles className="h-5 w-5" />
                      )}
                    </Button>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-3">O selecciona un plato popular:</p>
                  <div className="flex flex-wrap gap-2">
                    {popularDishes.map((popularDish) => (
                      <Button
                        key={popularDish}
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuickSelect(popularDish)}
                        disabled={isLoading}
                        className="hover:bg-primary/10 hover:text-primary hover:border-primary"
                      >
                        {popularDish}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {isLoading && (
            <div className="text-center py-12">
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Buscando los mejores maridajes...</p>
            </div>
          )}

          {result && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h2 className="text-xl font-serif font-semibold text-foreground">
                  Vinos recomendados para <span className="text-primary">{result.dish}</span>
                </h2>
              </div>

              {result.recommendations.map((rec, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow border-border/50">
                  <CardHeader className="pb-3">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center shrink-0">
                        <Wine className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-serif">{rec.wine}</CardTitle>
                        <CardDescription className="text-sm">
                          <span className="px-2 py-0.5 bg-primary/10 text-primary rounded text-xs">
                            {rec.type}
                          </span>
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-muted-foreground text-sm">{rec.reason}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Pairing;
