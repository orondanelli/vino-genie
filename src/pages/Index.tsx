import { Wine, Camera, Utensils, Gift, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

const features = [
  {
    icon: Camera,
    title: "Escanear Etiqueta",
    description: "Sube una foto de la etiqueta y la IA extraerá toda la información del vino",
    href: "/scan",
    color: "text-primary",
  },
  {
    icon: Utensils,
    title: "Maridajes",
    description: "Descubre qué vinos combinan perfectamente con tu plato favorito",
    href: "/pairing",
    color: "text-accent-foreground",
  },
  {
    icon: Gift,
    title: "Recomendar Vino",
    description: "Describe los gustos de alguien y encontraremos el vino ideal",
    href: "/recommend",
    color: "text-primary",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Wine className="h-8 w-8 text-primary" />
            <span className="text-2xl font-serif font-bold text-foreground">WineWise</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/scan" className="text-muted-foreground hover:text-foreground transition-colors">
              Escanear
            </Link>
            <Link to="/pairing" className="text-muted-foreground hover:text-foreground transition-colors">
              Maridajes
            </Link>
            <Link to="/recommend" className="text-muted-foreground hover:text-foreground transition-colors">
              Recomendar
            </Link>
            <Link to="/explore" className="text-muted-foreground hover:text-foreground transition-colors">
              Explorar
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/20" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-foreground mb-6">
              Tu asistente inteligente del
              <span className="text-primary"> vino</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Escanea etiquetas, descubre maridajes perfectos y encuentra el vino ideal para cada ocasión con el poder de la inteligencia artificial.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg px-8">
                <Link to="/scan">
                  <Camera className="mr-2 h-5 w-5" />
                  Escanear etiqueta
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8">
                <Link to="/explore">
                  <Search className="mr-2 h-5 w-5" />
                  Explorar vinos
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
              ¿Qué puedes hacer?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              WineWise combina inteligencia artificial con una base de conocimiento sobre vinos para ofrecerte la mejor experiencia.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {features.map((feature) => (
              <Card key={feature.title} className="group hover:shadow-lg transition-all duration-300 border-border/50 bg-card">
                <CardHeader>
                  <div className="w-14 h-14 rounded-lg bg-accent flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <feature.icon className={`h-7 w-7 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-xl font-serif">{feature.title}</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="ghost" className="group-hover:text-primary">
                    <Link to={feature.href}>
                      Comenzar →
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto bg-gradient-to-br from-primary/10 via-card to-accent/10 border-primary/20">
            <CardContent className="p-8 md:p-12 text-center">
              <Wine className="h-16 w-16 text-primary mx-auto mb-6" />
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-4">
                ¿Buscas el regalo perfecto?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                Cuéntanos sobre los gustos de esa persona especial y te recomendaremos el vino ideal para sorprenderla.
              </p>
              <Button asChild size="lg">
                <Link to="/recommend">
                  <Gift className="mr-2 h-5 w-5" />
                  Encontrar el vino perfecto
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 bg-card/30">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Wine className="h-6 w-6 text-primary" />
            <span className="text-xl font-serif font-bold text-foreground">WineWise</span>
          </div>
          <p className="text-muted-foreground text-sm">
            Tu asistente inteligente del mundo del vino
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
