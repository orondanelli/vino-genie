import { useState } from "react";
import { Gift, Loader2, Wine, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface WineRecommendation {
  name: string;
  type: string;
  region: string;
  priceRange: string;
  reason: string;
}

interface RecommendResult {
  description: string;
  recommendations: WineRecommendation[];
}

const exampleDescriptions = [
  "Le gustan los vinos suaves, no muy secos, para ocasiones especiales",
  "Prefiere vinos tintos con cuerpo, que combinen bien con carnes rojas",
  "Busca algo refrescante para el verano, no muy dulce pero fácil de beber",
];

const Recommend = () => {
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<RecommendResult | null>(null);
  const { toast } = useToast();

  const getRecommendations = async () => {
    if (!description.trim()) return;

    setIsLoading(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke("wine-recommend", {
        body: { description },
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
      console.error("Error getting recommendations:", error);
      toast({
        title: "Error",
        description: "No pudimos encontrar recomendaciones. Por favor, intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mx-auto mb-4">
              <Gift className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
              Recomendar Vino
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Describe los gustos de una persona o la ocasión y te recomendaremos los vinos ideales.
            </p>
          </div>

          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="description" className="text-base font-medium">
                    Describe los gustos o la ocasión
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Ej: Es para mi padre, le gustan los vinos con cuerpo pero no muy fuertes. Suele tomar tinto con las comidas y prefiere vinos españoles..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mt-2 min-h-32 text-base resize-none"
                  />
                </div>

                <Button
                  onClick={getRecommendations}
                  disabled={isLoading || !description.trim()}
                  className="w-full"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Buscando recomendaciones...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      Obtener recomendaciones
                    </>
                  )}
                </Button>

                <div className="pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-3">Ejemplos de descripciones:</p>
                  <div className="space-y-2">
                    {exampleDescriptions.map((example, index) => (
                      <button
                        key={index}
                        onClick={() => setDescription(example)}
                        className="block w-full text-left p-3 rounded-lg bg-accent/50 text-muted-foreground text-sm hover:bg-accent hover:text-foreground transition-colors"
                      >
                        "{example}"
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {isLoading && (
            <div className="text-center py-12">
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Analizando gustos y buscando el vino perfecto...</p>
            </div>
          )}

          {result && (
            <div className="space-y-6">
              <Card className="bg-accent/30 border-primary/20">
                <CardContent className="p-6">
                  <p className="text-foreground italic">"{result.description}"</p>
                </CardContent>
              </Card>

              <h2 className="text-xl font-serif font-semibold text-foreground text-center">
                Vinos recomendados
              </h2>

              <div className="space-y-4">
                {result.recommendations.map((rec, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow border-border/50">
                    <CardHeader className="pb-3">
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-primary/20 to-accent flex items-center justify-center shrink-0">
                          <Wine className="h-7 w-7 text-primary" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-xl font-serif">{rec.name}</CardTitle>
                          <CardDescription className="text-sm flex flex-wrap gap-2 mt-1">
                            <span className="px-2 py-0.5 bg-primary/10 text-primary rounded text-xs">
                              {rec.type}
                            </span>
                            <span className="px-2 py-0.5 bg-muted text-muted-foreground rounded text-xs">
                              {rec.region}
                            </span>
                            <span className="px-2 py-0.5 bg-accent text-accent-foreground rounded text-xs">
                              {rec.priceRange}
                            </span>
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-muted-foreground">{rec.reason}</p>
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

export default Recommend;
