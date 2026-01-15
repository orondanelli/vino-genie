import { useState } from "react";
import { Gift, Loader2, Wine, Sparkles, Star, TrendingUp, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface WineRecommendation {
  name: string;
  type: string;
  region: string;
  priceRange: string;
  reason: string;
  winery?: string;
  rating?: number;
  image?: string;
  pairingNotes?: string;
  servingTemp?: string;
}

interface RecommendResult {
  sommelierIntro: string;
  recommendations: WineRecommendation[];
  personalNotes?: string;
}

const exampleDescriptions = [
  "Es para mi padre, le gustan los vinos con cuerpo pero no muy fuertes. Suele tomar tinto con las comidas y prefiere vinos de España",
  "Quiero regalar un vino a mi jefe, debe ser elegante y premium. Le gustan los tintos complejos y tiene experiencia catando vinos",
  "Busco un vino para una cena romántica con pasta. No queremos algo muy pesado ni muy caro",
  "Mi novia prefiere vinos blancos frescos y frutales, nada muy seco. Le encanta el Sauvignon Blanc",
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
              Tu Sommelier Personal
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Cuéntame sobre los gustos, la ocasión o la persona para quien buscas el vino. 
              Como sommelier, te guiaré hacia las mejores opciones de nuestro catálogo.
            </p>
          </div>

          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="description" className="text-base font-medium mb-2 block">
                    <span className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-primary" />
                      Cuéntame sobre tu necesidad
                    </span>
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Ej: Busco un vino para regalar a mi padre. Le gustan los tintos con cuerpo, no muy fuertes. Suele tomarlo con carnes y prefiere vinos españoles. Mi presupuesto es moderado..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mt-2 min-h-40 text-base resize-none"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    💡 Cuanto más detalles, mejores recomendaciones podrá hacerte el sommelier
                  </p>
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
                      Consultar al sommelier
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
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
              </div>
              <p className="text-lg font-medium text-foreground mb-2">Consultando con el sommelier...</p>
              <p className="text-muted-foreground">Analizando tus preferencias y seleccionando los mejores vinos del catálogo</p>
            </div>
          )}

          {result && (
            <div className="space-y-6">
              {/* Sommelier Introduction */}
              <Card className="bg-gradient-to-br from-primary/5 via-background to-accent/5 border-primary/20 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Sparkles className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-2">Recomendación del Sommelier</h3>
                      <p className="text-muted-foreground leading-relaxed italic">"{result.sommelierIntro}"</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="text-center">
                <h2 className="text-2xl font-serif font-semibold text-foreground mb-2">
                  Mis selecciones para ti
                </h2>
                <p className="text-muted-foreground text-sm">
                  {result.recommendations.length} vino{result.recommendations.length !== 1 ? 's' : ''} cuidadosamente seleccionado{result.recommendations.length !== 1 ? 's' : ''}
                </p>
              </div>

              <div className="space-y-6">
                {result.recommendations.map((rec, index) => (
                  <Card key={index} className="hover:shadow-xl transition-all duration-300 border-border/50 overflow-hidden group">
                    <CardHeader className="pb-4">
                      <div className="flex items-start gap-4">
                        <div className="w-20 h-28 rounded-lg overflow-hidden shrink-0 bg-muted flex items-center justify-center">
                          {rec.image ? (
                            <img 
                              src={rec.image} 
                              alt={rec.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.parentElement!.innerHTML = '<div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent"><svg class="h-10 w-10 text-primary" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 22h8"/><path d="M7 10h10"/><path d="M12 15v7"/><path d="M12 15c-1.3 0-2.4-.3-3.3-.9a5 5 0 0 1-1.7-2.1 4 4 0 0 1-.6-2c0-1.3.5-2.4 1.4-3.3S10.7 5.3 12 5.3s2.4.3 3.3.9a5 5 0 0 1 1.7 2.1c.4.6.6 1.3.6 2 0 1.3-.5 2.4-1.4 3.3s-2 1.4-3.2 1.4z"/></svg></div>';
                              }}
                            />
                          ) : (
                            <Wine className="h-10 w-10 text-primary" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <CardTitle className="text-xl md:text-2xl font-serif group-hover:text-primary transition-colors">
                              {rec.name}
                            </CardTitle>
                            {index === 0 && (
                              <Badge variant="secondary" className="shrink-0">
                                <TrendingUp className="h-3 w-3 mr-1" />
                                Top Pick
                              </Badge>
                            )}
                          </div>
                          {rec.winery && (
                            <CardDescription className="text-sm mb-3">
                              {rec.winery}
                            </CardDescription>
                          )}
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="outline" className="text-xs">
                              {rec.type}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {rec.region}
                            </Badge>
                            <Badge variant="outline" className="text-xs flex items-center gap-1">
                              <DollarSign className="h-3 w-3" />
                              {rec.priceRange}
                            </Badge>
                            {rec.rating && rec.rating > 0 && (
                              <Badge variant="outline" className="text-xs flex items-center gap-1 bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20">
                                <Star className="h-3 w-3 fill-current" />
                                {rec.rating.toFixed(1)}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0 space-y-3">
                      <div className="bg-accent/30 rounded-lg p-4">
                        <p className="text-sm font-medium text-foreground mb-1">Por qué este vino:</p>
                        <p className="text-sm text-muted-foreground leading-relaxed">{rec.reason}</p>
                      </div>
                      {rec.pairingNotes && (
                        <div className="text-xs text-muted-foreground">
                          <span className="font-medium">Maridaje sugerido:</span> {rec.pairingNotes}
                        </div>
                      )}
                      {rec.servingTemp && (
                        <div className="text-xs text-muted-foreground">
                          <span className="font-medium">Temperatura de servicio:</span> {rec.servingTemp}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {result.personalNotes && (
                <Card className="bg-muted/30">
                  <CardContent className="p-5">
                    <p className="text-sm text-muted-foreground italic">
                      💡 <span className="font-medium">Nota del sommelier:</span> {result.personalNotes}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Recommend;
