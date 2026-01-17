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

const exampleScenarios = [
  { 
    title: "Regalo para papá",
    emoji: "👨‍🦳",
    description: "Es para mi padre, le gustan los vinos con cuerpo pero no muy fuertes. Suele tomar tinto con las comidas y prefiere vinos de España",
    image: "https://images.unsplash.com/photo-1560762484-813fc97650a0?w=400"
  },
  { 
    title: "Regalo ejecutivo",
    emoji: "💼",
    description: "Quiero regalar un vino a mi jefe, debe ser elegante y premium. Le gustan los tintos complejos y tiene experiencia catando vinos",
    image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400"
  },
  { 
    title: "Cena romántica",
    emoji: "💕",
    description: "Busco un vino para una cena romántica con pasta. No queremos algo muy pesado ni muy caro",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400"
  },
  { 
    title: "Vinos blancos",
    emoji: "🥂",
    description: "Mi novia prefiere vinos blancos frescos y frutales, nada muy seco. Le encanta el Sauvignon Blanc",
    image: "https://images.unsplash.com/photo-1510972527921-ce03766a1cf1?w=400"
  },
];

const getWineBottleImage = (type: string) => {
  const typeNormalized = type.toLowerCase();
  if (typeNormalized.includes('tinto') || typeNormalized.includes('red')) {
    return 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=200&h=300&fit=crop';
  }
  if (typeNormalized.includes('blanco') || typeNormalized.includes('white')) {
    return 'https://images.unsplash.com/photo-1474722883778-ab3a76404aa7?w=200&h=300&fit=crop';
  }
  if (typeNormalized.includes('rosado') || typeNormalized.includes('rosé') || typeNormalized.includes('rose')) {
    return 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=200&h=300&fit=crop';
  }
  if (typeNormalized.includes('espumoso') || typeNormalized.includes('cava') || typeNormalized.includes('champagne')) {
    return 'https://images.unsplash.com/photo-1547595628-c61a29f496f0?w=200&h=300&fit=crop';
  }
  return 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=200&h=300&fit=crop';
};

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

  const resetSearch = () => {
    setResult(null);
    setDescription("");
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {!result && (
            <>
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
                  className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 rounded-full"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Buscando recomendaciones perfectas...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      Consultar al sommelier
                    </>
                  )}
                </Button>

                <div className="pt-4 border-t border-border">
                  <p className="text-sm font-semibold text-foreground mb-4">O selecciona un escenario:</p>
                  <div className="grid grid-cols-2 gap-3">
                    {exampleScenarios.map((scenario, index) => (
                      <button
                        key={index}
                        onClick={() => setDescription(scenario.description)}
                        className="relative overflow-hidden rounded-2xl transition-all transform hover:scale-105 hover:shadow-lg group"
                      >
                        {/* Background Image */}
                        <div className="aspect-[4/3] relative">
                          <img 
                            src={scenario.image} 
                            alt={scenario.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent group-hover:from-primary/80 group-hover:via-primary/50 transition-all"></div>
                          
                          {/* Emoji Badge */}
                          <div className="absolute top-2 right-2 text-3xl drop-shadow-lg">
                            {scenario.emoji}
                          </div>
                          
                          {/* Scenario Title */}
                          <div className="absolute bottom-0 left-0 right-0 p-3">
                            <p className="text-white font-semibold text-sm leading-tight mb-1">
                              {scenario.title}
                            </p>
                            <p className="text-white/80 text-xs line-clamp-2">
                              {scenario.description}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
            </>
          )}

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
              {/* Header with Back Button */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl md:text-3xl font-serif font-bold text-foreground">
                    Tus Recomendaciones
                  </h1>
                  <p className="text-muted-foreground text-sm mt-1">
                    Selecciones personalizadas por tu sommelier
                  </p>
                </div>
                <Button
                  onClick={resetSearch}
                  variant="outline"
                  className="rounded-full"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Nueva búsqueda
                </Button>
              </div>

              {/* Sommelier Introduction */}
              {result.sommelierIntro && result.sommelierIntro.trim() !== "" && (
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
              )}


              <div className="space-y-6">
                {result.recommendations.map((rec, index) => (
                  <Card key={index} className="hover:shadow-xl transition-all duration-300 border-border/50 overflow-hidden group">
                    <CardHeader className="pb-4">
                      <div className="flex items-start gap-4">
                        <div className="w-20 h-28 rounded-lg overflow-hidden shrink-0 bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center relative shadow-md">
                          <img
                            src={getWineBottleImage(rec.type)}
                            alt={`Botella de ${rec.type}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.currentTarget;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent) {
                                parent.className = 'w-20 h-28 rounded-lg overflow-hidden shrink-0 bg-gradient-to-br from-primary/20 to-accent/30 flex items-center justify-center relative shadow-md';
                                const iconDiv = document.createElement('div');
                                iconDiv.className = 'flex flex-col items-center justify-center';
                                iconDiv.innerHTML = '<svg class="h-12 w-12 text-primary" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 22h8"/><path d="M7 10h10"/><path d="M12 15v7"/><path d="M12 15a5 5 0 0 0 5-5c0-2-.5-4-2-8H9c-1.5 4-2 6-2 8a5 5 0 0 0 5 5Z"/></svg><span class="text-[10px] font-bold text-primary/70 uppercase mt-1">' + rec.type + '</span>';
                                parent.appendChild(iconDiv);
                              }
                            }}
                          />
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
                            <p className="text-sm text-muted-foreground mb-2">
                              {rec.winery}
                            </p>
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
