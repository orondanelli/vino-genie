import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { description } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Finding wine recommendations for:", description);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `Eres un sommelier profesional con años de experiencia en el mundo del vino. Tu objetivo es ayudar a las personas a encontrar el vino perfecto basándote en sus gustos, preferencias, presupuesto y ocasión.

CARACTERÍSTICAS DE TU PERSONALIDAD:
- Eres cálido, empático y educado
- Haces recomendaciones basadas en el conocimiento real de vinos
- Consideras el presupuesto sin juzgar
- Explicas de forma accesible, sin ser pretencioso
- Personalizas cada recomendación al contexto específico

Responde SIEMPRE en formato JSON válido con esta estructura exacta:
{
  "sommelierIntro": "Una introducción personalizada de 2-3 oraciones donde muestras que entendiste sus necesidades y introduces tus recomendaciones de forma cálida",
  "recommendations": [
    {
      "name": "Nombre específico del vino (real preferentemente) o estilo muy específico",
      "winery": "Nombre de la bodega",
      "type": "Tinto/Blanco/Rosado/Espumoso/Dulce/Oporto",
      "region": "Región o denominación de origen específica",
      "priceRange": "€ (10-15€) / €€ (15-30€) / €€€ (30-60€) / €€€€ (60€+)",
      "rating": 4.2,
      "reason": "Explicación detallada y personalizada de por qué este vino es perfecto para esta persona/ocasión específica (3-4 oraciones)",
      "pairingNotes": "Sugerencias de maridaje si es relevante",
      "servingTemp": "Temperatura de servicio recomendada (ej: 16-18°C)"
    }
  ],
  "personalNotes": "Una nota final opcional con consejos adicionales, alternativas o información útil"
}

INSTRUCCIONES IMPORTANTES:
1. Proporciona entre 3 y 4 recomendaciones variadas
2. Varía en precio según el presupuesto mencionado (si no se menciona, ofrece variedad)
3. Sé específico con nombres de vinos reales cuando sea posible (ej: Marqués de Riscal Reserva, no solo "un Rioja")
4. Adapta el tono según la ocasión (regalo formal vs. cena casual)
5. Si mencionan preferencias específicas, respétalas estrictamente
6. Incluye al menos una opción "segura" y una más aventurera
7. Las explicaciones deben conectar directamente con lo que el usuario describió

Ejemplo de buen "sommelierIntro":
"He analizado tus preferencias y entiendo que buscas un vino para tu padre, alguien con un paladar desarrollado que aprecia los tintos con cuerpo pero equilibrados. He seleccionado tres opciones españolas que creo que le encantarán, con diferentes perfiles pero todas con la elegancia y estructura que describes."

Nunca uses frases genéricas. Cada recomendación debe sentirse personal y pensada específicamente para esa persona.`,
          },
          {
            role: "user",
            content: `Como sommelier, necesito tu ayuda para encontrar el vino perfecto. Aquí está mi situación:

${description}

Por favor, dame tus mejores recomendaciones considerando todos estos detalles.`,
          },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limits exceeded, please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required, please add funds to your workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    console.log("AI response:", content);

    let result;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      console.error("Error parsing AI response:", parseError);
      result = {
        sommelierIntro: "He analizado tu solicitud y he seleccionado algunos vinos que creo que se ajustarán perfectamente a tus necesidades. Estas son opciones versátiles y bien valoradas que ofrecen excelente relación calidad-precio.",
        recommendations: [
          {
            name: "Marqués de Riscal Reserva",
            winery: "Marqués de Riscal",
            type: "Tinto",
            region: "Rioja, España",
            priceRange: "€€ (18-25€)",
            rating: 4.3,
            reason: "Un clásico de Rioja con equilibrio perfecto entre fruta y crianza en barrica. Sus taninos suaves y notas de vainilla lo hacen muy versátil para acompañar comidas o disfrutar solo. Es una opción segura que rara vez decepciona.",
            pairingNotes: "Carnes rojas, cordero, quesos semicurados",
            servingTemp: "16-18°C",
          },
          {
            name: "Albariño Martín Códax",
            winery: "Martín Códax",
            type: "Blanco",
            region: "Rías Baixas, España",
            priceRange: "€ (12-15€)",
            rating: 4.1,
            reason: "Un blanco gallego fresco y aromático, perfecto para quienes buscan algo ligero pero con personalidad. Sus notas cítricas y toque mineral lo hacen muy refrescante y fácil de beber, ideal para el aperitivo o pescados.",
            pairingNotes: "Mariscos, pescados blancos, ensaladas",
            servingTemp: "8-10°C",
          },
          {
            name: "Protos Crianza",
            winery: "Bodegas Protos",
            type: "Tinto",
            region: "Ribera del Duero, España",
            priceRange: "€€ (15-20€)",
            rating: 4.4,
            reason: "Si buscas un tinto con más estructura y carácter, esta es tu opción. La Ribera del Duero ofrece vinos más intensos que Rioja, con frutos negros y notas especiadas. Perfecto para ocasiones especiales sin llegar a precios elevados.",
            pairingNotes: "Carnes a la brasa, guisos, quesos curados",
            servingTemp: "16-18°C",
          },
        ],
        personalNotes: "Si encuentras alguno de estos agotado, busca otras añadas del mismo vino o pregunta en la tienda por alternativas similares de la misma región. El sommelier de la tienda podrá guiarte con opciones comparables.",
      };
    }

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in wine-recommend:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
