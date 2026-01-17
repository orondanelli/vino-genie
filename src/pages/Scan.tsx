import { useState, useRef } from "react";
import { Camera, Upload, Loader2, Wine, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface WineInfo {
  name: string;
  winery: string;
  region: string;
  year: string;
  type: string;
  description: string;
  pairings: string[];
}

const Scan = () => {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [wineInfo, setWineInfo] = useState<WineInfo | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setWineInfo(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!image) return;

    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke("analyze-wine-label", {
        body: { image },
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

      setWineInfo(data.wineInfo);
    } catch (error) {
      console.error("Error analyzing image:", error);
      toast({
        title: "Error",
        description: "No pudimos analizar la etiqueta. Por favor, intenta con otra imagen.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetScan = () => {
    setImage(null);
    setWineInfo(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mx-auto mb-4">
              <Camera className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
              Escanear Etiqueta
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Sube una foto de la etiqueta de un vino y nuestra IA extraerá toda la información relevante.
            </p>
          </div>

          {!image ? (
            <Card className="border-dashed border-2 border-border bg-card/50 hover:border-primary/50 transition-colors">
              <CardContent className="p-12">
                <div
                  className="flex flex-col items-center justify-center cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center mb-6">
                    <Upload className="h-10 w-10 text-accent-foreground" />
                  </div>
                  <p className="text-lg font-medium text-foreground mb-2">
                    Haz clic para subir una imagen
                  </p>
                  <p className="text-muted-foreground text-sm">
                    O arrastra y suelta una foto de la etiqueta
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              <Card className="overflow-hidden">
                <div className="relative">
                  <img
                    src={image}
                    alt="Etiqueta del vino"
                    className="w-full max-h-96 object-contain bg-muted"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="flex gap-4 justify-center">
                    {!wineInfo && (
                      <Button onClick={analyzeImage} disabled={isAnalyzing} size="lg">
                        {isAnalyzing ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Analizando...
                          </>
                        ) : (
                          <>
                            <Sparkles className="mr-2 h-5 w-5" />
                            Analizar etiqueta
                          </>
                        )}
                      </Button>
                    )}
                    <Button variant="outline" onClick={resetScan} size="lg">
                      Nueva imagen
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {wineInfo && (
                <Card className="bg-card border-border overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Wine Bottle Image */}
                      <div className="flex-shrink-0 w-full md:w-48">
                        <div className="aspect-[3/4] bg-gradient-to-br from-muted/30 to-secondary/30 rounded-2xl flex items-center justify-center overflow-hidden">
                          <img 
                            src={`https://images.vivino.com/thumbs/placeholder_pb_x600.png`}
                            alt={wineInfo.name}
                            className="w-full h-full object-contain p-4"
                            onError={(e) => {
                              e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 200"%3E%3Crect fill="%23701010" width="100" height="200"/%3E%3Ctext x="50" y="100" text-anchor="middle" fill="white" font-size="60"%3E🍷%3C/text%3E%3C/svg%3E';
                            }}
                          />
                        </div>
                      </div>
                      
                      {/* Wine Info */}
                      <div className="flex-1 space-y-4">
                        <div>
                          <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-2">{wineInfo.name}</h2>
                          <p className="text-base text-muted-foreground mb-1">{wineInfo.winery}</p>
                          <p className="text-sm text-muted-foreground">🌍 {wineInfo.region}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-secondary rounded-xl p-3">
                            <p className="text-xs text-muted-foreground mb-1">Añada</p>
                            <p className="text-xl font-bold text-foreground">{wineInfo.year}</p>
                          </div>
                          <div className="bg-secondary rounded-xl p-3">
                            <p className="text-xs text-muted-foreground mb-1">Tipo</p>
                            <p className="text-xl font-bold text-foreground">{wineInfo.type}</p>
                          </div>
                        </div>

                        <div className="bg-accent/30 rounded-xl p-4">
                          <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                            <Wine className="h-4 w-4" />
                            Descripción
                          </h3>
                          <p className="text-sm text-muted-foreground leading-relaxed">{wineInfo.description}</p>
                        </div>

                        <div>
                          <h3 className="font-semibold text-foreground mb-3">Maridajes sugeridos</h3>
                          <div className="flex flex-wrap gap-2">
                            {wineInfo.pairings.map((pairing, index) => (
                              <span
                                key={index}
                                className="px-4 py-2 bg-primary text-primary-foreground rounded-full text-sm font-medium"
                              >
                                {pairing}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
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

export default Scan;
