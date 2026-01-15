import { Wine, Camera, Utensils, Gift, Search, Menu, X, Sparkles, ArrowRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useState } from "react";

const features = [
  {
    icon: Camera,
    title: "Escanear Etiqueta",
    description: "Sube una foto de la etiqueta y la IA extraerá toda la información del vino",
    href: "/scan",
    color: "text-primary",
    gradient: "from-primary/20 to-primary/5",
  },
  {
    icon: Utensils,
    title: "Maridajes",
    description: "Descubre qué vinos combinan perfectamente con tu plato favorito",
    href: "/pairing",
    color: "text-accent-foreground",
    gradient: "from-accent/20 to-accent/5",
  },
  {
    icon: Gift,
    title: "Recomendar Vino",
    description: "Describe los gustos de alguien y encontraremos el vino ideal",
    href: "/recommend",
    color: "text-primary",
    gradient: "from-primary/20 to-primary/5",
  },
];

const Index = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [fabOpen, setFabOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <Wine className="h-8 w-8 text-primary transition-transform group-hover:scale-110" />
            <span className="text-2xl font-serif font-bold text-foreground">WineWise</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/scan" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group">
              Escanear
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
            </Link>
            <Link to="/pairing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group">
              Maridajes
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
            </Link>
            <Link to="/recommend" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group">
              Recomendar
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
            </Link>
            <Link to="/explore" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group">
              Explorar
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-card/95 backdrop-blur-md animate-in slide-in-from-top-2">
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-3">
              <Link 
                to="/scan" 
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-lg transition-all"
              >
                Escanear
              </Link>
              <Link 
                to="/pairing" 
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-lg transition-all"
              >
                Maridajes
              </Link>
              <Link 
                to="/recommend" 
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-lg transition-all"
              >
                Recomendar
              </Link>
              <Link 
                to="/explore" 
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-lg transition-all"
              >
                Explorar
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative py-16 sm:py-24 md:py-32 lg:py-40 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-in fade-in slide-in-from-bottom-3 duration-700">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Impulsado por IA</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-foreground mb-6 leading-tight animate-in fade-in slide-in-from-bottom-4 duration-700">
              Tu asistente inteligente del
              <span className="text-primary block sm:inline"> vino</span>
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-5 duration-700">
              Escanea etiquetas, descubre maridajes perfectos y encuentra el vino ideal para cada ocasión con el poder de la inteligencia artificial.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-6 duration-700">
              <Button asChild size="lg" className="text-base sm:text-lg px-6 sm:px-8 py-6 shadow-lg hover:shadow-xl transition-all">
                <Link to="/scan">
                  <Camera className="mr-2 h-5 w-5" />
                  Escanear etiqueta
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-base sm:text-lg px-6 sm:px-8 py-6 hover:bg-accent/50 transition-all">
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
      <section className="py-16 sm:py-20 md:py-28 bg-card/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-foreground mb-4 md:mb-6">
              ¿Qué puedes hacer?
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              WineWise combina inteligencia artificial con una base de conocimiento sobre vinos para ofrecerte la mejor experiencia.
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <Link 
                key={feature.title} 
                to={feature.href}
                className="group block"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Card className="h-full hover:shadow-xl hover:scale-[1.02] transition-all duration-300 border-border/50 bg-card cursor-pointer">
                  <CardHeader className="space-y-4 pb-4">
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                      <feature.icon className={`h-8 w-8 ${feature.color}`} />
                    </div>
                    <CardTitle className="text-xl sm:text-2xl font-serif group-hover:text-primary transition-colors">
                      {feature.title}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <div className="flex items-center text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
                      Comenzar
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 md:py-28">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="max-w-4xl mx-auto bg-gradient-to-br from-primary/10 via-card to-accent/10 border-primary/20 shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <CardContent className="p-8 sm:p-10 md:p-14 text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                <Wine className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-foreground mb-4 md:mb-6">
                ¿Buscas el regalo perfecto?
              </h2>
              <p className="text-muted-foreground text-base sm:text-lg mb-8 md:mb-10 max-w-xl mx-auto leading-relaxed">
                Cuéntanos sobre los gustos de esa persona especial y te recomendaremos el vino ideal para sorprenderla.
              </p>
              <Button asChild size="lg" className="text-base sm:text-lg px-6 sm:px-8 py-6 shadow-lg hover:shadow-xl transition-all">
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
      <footer className="border-t border-border py-10 md:py-12 bg-card/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Wine className="h-6 w-6 text-primary" />
            <span className="text-xl font-serif font-bold text-foreground">WineWise</span>
          </div>
          <p className="text-muted-foreground text-sm">
            Tu asistente inteligente del mundo del vino
          </p>
          <p className="text-muted-foreground/60 text-xs mt-4">
            © 2024 WineWise. Todos los derechos reservados.
          </p>
        </div>
      </footer>

      {/* Floating Action Menu */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col-reverse items-end gap-3">
        {/* Action Buttons */}
        {fabOpen && (
          <div className="flex flex-col-reverse gap-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <Link to="/scan">
              <button 
                className="flex items-center gap-3 bg-card hover:bg-accent text-foreground px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all border border-border group"
                onClick={() => setFabOpen(false)}
              >
                <Camera className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium pr-1">Escanear</span>
              </button>
            </Link>
            <Link to="/pairing">
              <button 
                className="flex items-center gap-3 bg-card hover:bg-accent text-foreground px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all border border-border group"
                onClick={() => setFabOpen(false)}
              >
                <Utensils className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium pr-1">Maridajes</span>
              </button>
            </Link>
            <Link to="/recommend">
              <button 
                className="flex items-center gap-3 bg-card hover:bg-accent text-foreground px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all border border-border group"
                onClick={() => setFabOpen(false)}
              >
                <Gift className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium pr-1">Recomendar</span>
              </button>
            </Link>
            <Link to="/explore">
              <button 
                className="flex items-center gap-3 bg-card hover:bg-accent text-foreground px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all border border-border group"
                onClick={() => setFabOpen(false)}
              >
                <Search className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium pr-1">Explorar</span>
              </button>
            </Link>
          </div>
        )}

        {/* Main FAB Button */}
        <button
          onClick={() => setFabOpen(!fabOpen)}
          className={`w-14 h-14 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl hover:shadow-2xl transition-all flex items-center justify-center ${
            fabOpen ? 'rotate-45' : 'rotate-0'
          }`}
          aria-label="Menú de acciones"
        >
          <Plus className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};

export default Index;
