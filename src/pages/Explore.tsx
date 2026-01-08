import { useState } from "react";
import { Search, Wine, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Layout from "@/components/Layout";

interface WineData {
  id: number;
  name: string;
  winery: string;
  region: string;
  type: string;
  year: number;
  description: string;
}

const sampleWines: WineData[] = [
  {
    id: 1,
    name: "Marqués de Riscal Reserva",
    winery: "Marqués de Riscal",
    region: "Rioja, España",
    type: "Tinto",
    year: 2018,
    description: "Vino elegante con aromas de frutas rojas maduras, vainilla y especias. Taninos suaves y final largo.",
  },
  {
    id: 2,
    name: "Albariño Pazo de Señorans",
    winery: "Pazo de Señorans",
    region: "Rías Baixas, España",
    type: "Blanco",
    year: 2022,
    description: "Fresco y aromático con notas de frutas blancas, cítricos y un toque mineral característico.",
  },
  {
    id: 3,
    name: "Protos Crianza",
    winery: "Bodegas Protos",
    region: "Ribera del Duero, España",
    type: "Tinto",
    year: 2019,
    description: "Intenso y estructurado, con aromas de frutos negros, regaliz y notas tostadas de la barrica.",
  },
  {
    id: 4,
    name: "Cava Gramona Imperial",
    winery: "Gramona",
    region: "Penedès, España",
    type: "Espumoso",
    year: 2017,
    description: "Elegante y cremoso, con burbujas finas y aromas de brioche, manzana y frutos secos.",
  },
  {
    id: 5,
    name: "Muga Rosado",
    winery: "Bodegas Muga",
    region: "Rioja, España",
    type: "Rosado",
    year: 2023,
    description: "Delicado y frutal con notas de fresa, frambuesa y un final fresco y equilibrado.",
  },
  {
    id: 6,
    name: "Vega Sicilia Único",
    winery: "Vega Sicilia",
    region: "Ribera del Duero, España",
    type: "Tinto",
    year: 2013,
    description: "Icónico vino español de guarda, complejo con capas de frutas, especias, cuero y minerales.",
  },
  {
    id: 7,
    name: "Terras Gauda",
    winery: "Terras Gauda",
    region: "Rías Baixas, España",
    type: "Blanco",
    year: 2022,
    description: "Blend atlántico con Albariño, Caíño y Loureiro. Aromático con notas herbáceas y cítricas.",
  },
  {
    id: 8,
    name: "Torres Mas La Plana",
    winery: "Torres",
    region: "Penedès, España",
    type: "Tinto",
    year: 2017,
    description: "Cabernet Sauvignon de alta expresión con aromas de cassis, cedro y notas mediterráneas.",
  },
];

const wineTypes = ["Todos", "Tinto", "Blanco", "Rosado", "Espumoso"];

const Explore = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("Todos");

  const filteredWines = sampleWines.filter((wine) => {
    const matchesSearch =
      wine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wine.winery.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wine.region.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "Todos" || wine.type === selectedType;
    return matchesSearch && matchesType;
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
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por nombre, bodega o región..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="w-40">
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
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results count */}
          <p className="text-sm text-muted-foreground mb-4">
            {filteredWines.length} vino{filteredWines.length !== 1 ? "s" : ""} encontrado
            {filteredWines.length !== 1 ? "s" : ""}
          </p>

          {/* Wine Grid */}
          <div className="grid md:grid-cols-2 gap-4">
            {filteredWines.map((wine) => (
              <Card key={wine.id} className="hover:shadow-md transition-shadow border-border/50 group">
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-16 rounded-lg bg-gradient-to-br from-primary/20 to-accent flex items-center justify-center shrink-0">
                      <Wine className="h-6 w-6 text-primary" />
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
                        <span className="px-2 py-0.5 bg-muted text-muted-foreground rounded text-xs">
                          {wine.year}
                        </span>
                        <span className="px-2 py-0.5 bg-accent/50 text-foreground rounded text-xs">
                          {wine.region}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-muted-foreground text-sm line-clamp-2">{wine.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredWines.length === 0 && (
            <div className="text-center py-12">
              <Wine className="h-12 w-12 text-muted mx-auto mb-4" />
              <p className="text-muted-foreground">No se encontraron vinos con esos criterios.</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedType("Todos");
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
