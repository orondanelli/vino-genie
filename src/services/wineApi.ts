export interface WineData {
  id: number;
  wine: string;
  winery: string;
  rating: {
    average: string;
    reviews: string;
  };
  location: string;
  image: string;
  type?: string;
}

export interface TransformedWineData {
  id: number;
  name: string;
  winery: string;
  region: string;
  type: string;
  rating: number;
  reviews: number;
  image: string;
  description?: string;
}

const WINE_API_BASE = 'https://api.sampleapis.com/wines';

const wineTypeEndpoints = {
  reds: '/reds',
  whites: '/whites',
  sparkling: '/sparkling',
  rose: '/rose',
  dessert: '/dessert',
  port: '/port',
};

class WineAPIService {
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private cacheDuration = 1000 * 60 * 30;

  private transformWineData(wine: WineData, category: string): TransformedWineData {
    return {
      id: wine.id,
      name: wine.wine || 'Vino sin nombre',
      winery: wine.winery || 'Bodega desconocida',
      region: wine.location || 'Región desconocida',
      type: this.getCategoryInSpanish(category),
      rating: parseFloat(wine.rating?.average || '0'),
      reviews: parseInt(wine.rating?.reviews?.replace(/[^\d]/g, '') || '0'),
      image: wine.image || '/placeholder.svg',
    };
  }

  private getCategoryInSpanish(category: string): string {
    const translations: Record<string, string> = {
      reds: 'Tinto',
      whites: 'Blanco',
      sparkling: 'Espumoso',
      rose: 'Rosado',
      dessert: 'Dulce',
      port: 'Oporto',
    };
    return translations[category] || category;
  }

  private async fetchWithCache(url: string): Promise<any> {
    const cached = this.cache.get(url);
    if (cached && Date.now() - cached.timestamp < this.cacheDuration) {
      return cached.data;
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error fetching wines: ${response.statusText}`);
    }

    const data = await response.json();
    this.cache.set(url, { data, timestamp: Date.now() });
    return data;
  }

  async getAllWines(): Promise<TransformedWineData[]> {
    const allWines: TransformedWineData[] = [];

    try {
      const promises = Object.entries(wineTypeEndpoints).map(async ([category, endpoint]) => {
        try {
          const wines: WineData[] = await this.fetchWithCache(`${WINE_API_BASE}${endpoint}`);
          return wines.map(wine => this.transformWineData(wine, category));
        } catch (error) {
          console.error(`Error fetching ${category}:`, error);
          return [];
        }
      });

      const results = await Promise.all(promises);
      results.forEach(wines => allWines.push(...wines));

      return allWines;
    } catch (error) {
      console.error('Error fetching all wines:', error);
      return [];
    }
  }

  async getWinesByType(type: string): Promise<TransformedWineData[]> {
    const typeMap: Record<string, string> = {
      'Tinto': 'reds',
      'Blanco': 'whites',
      'Espumoso': 'sparkling',
      'Rosado': 'rose',
      'Dulce': 'dessert',
      'Oporto': 'port',
    };

    const endpoint = typeMap[type];
    if (!endpoint) {
      return this.getAllWines();
    }

    try {
      const wines: WineData[] = await this.fetchWithCache(
        `${WINE_API_BASE}${wineTypeEndpoints[endpoint as keyof typeof wineTypeEndpoints]}`
      );
      return wines.map(wine => this.transformWineData(wine, endpoint));
    } catch (error) {
      console.error(`Error fetching wines of type ${type}:`, error);
      return [];
    }
  }

  async searchWines(query: string, type?: string): Promise<TransformedWineData[]> {
    const wines = type && type !== 'Todos' 
      ? await this.getWinesByType(type)
      : await this.getAllWines();

    const searchLower = query.toLowerCase();
    return wines.filter(wine =>
      wine.name.toLowerCase().includes(searchLower) ||
      wine.winery.toLowerCase().includes(searchLower) ||
      wine.region.toLowerCase().includes(searchLower)
    );
  }

  async getTopRatedWines(limit: number = 10): Promise<TransformedWineData[]> {
    const wines = await this.getAllWines();
    return wines
      .filter(wine => wine.rating > 0)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit);
  }

  async getWinesByRegion(region: string): Promise<TransformedWineData[]> {
    const wines = await this.getAllWines();
    return wines.filter(wine =>
      wine.region.toLowerCase().includes(region.toLowerCase())
    );
  }

  extractCountryFromRegion(region: string): string {
    // Extract country from region string (e.g., "Bordeaux, France" or "Spain · Empordà" -> "France" or "Spain")
    // Try both comma and middle dot separators
    let parts: string[];
    if (region.includes('·')) {
      parts = region.split('·').map(p => p.trim());
      // For middle dot format, country is first
      return parts[0] || region;
    } else if (region.includes(',')) {
      parts = region.split(',').map(p => p.trim());
      // For comma format, country is last
      return parts[parts.length - 1] || region;
    }
    return region;
  }

  async getUniqueCountries(): Promise<string[]> {
    const wines = await this.getAllWines();
    const countries = new Set<string>();
    
    wines.forEach(wine => {
      const country = this.extractCountryFromRegion(wine.region);
      if (country && country !== 'Región desconocida') {
        countries.add(country);
      }
    });
    
    return Array.from(countries).sort();
  }

  async getWinesByCountry(country: string): Promise<TransformedWineData[]> {
    const wines = await this.getAllWines();
    return wines.filter(wine => {
      const wineCountry = this.extractCountryFromRegion(wine.region);
      return wineCountry.toLowerCase() === country.toLowerCase();
    });
  }

  clearCache(): void {
    this.cache.clear();
  }
}

export const wineAPI = new WineAPIService();
