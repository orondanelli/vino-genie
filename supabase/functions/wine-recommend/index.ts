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
            content: `Eres un sommelier personal experto que ayuda a encontrar el vino perfecto basándose en descripciones de gustos, preferencias o situaciones.

Responde SIEMPRE en formato JSON válido con esta estructura exacta:
{
  "description": "resumen breve de lo que entendiste sobre los gustos/necesidades",
  "recommendations": [
    {
      "name": "nombre específico del vino o tipo recomendado",
      "type": "Tinto/Blanco/Rosado/Espumoso/Dulce",
      "region": "región o denominación de origen",
      "priceRange": "€/€€/€€€ (económico/medio/premium)",
      "reason": "explicación personalizada de por qué este vino es ideal para esta persona/ocasión"
    }
  ]
}

Proporciona entre 3 y 4 recomendaciones variadas en precio y estilo.
Sé empático y personaliza las explicaciones según lo que la persona describió.`,
          },
          {
            role: "user",
            content: `Necesito recomendaciones de vino para esta situación: ${description}`,
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
        description: description,
        recommendations: [
          {
            name: "Rioja Crianza",
            type: "Tinto",
            region: "Rioja, España",
            priceRange: "€€",
            reason: "Un clásico equilibrado perfecto para empezar a explorar vinos tintos.",
          },
          {
            name: "Verdejo Rueda",
            type: "Blanco",
            region: "Rueda, España",
            priceRange: "€",
            reason: "Fresco y aromático, ideal para quienes prefieren vinos ligeros.",
          },
          {
            name: "Ribera del Duero Reserva",
            type: "Tinto",
            region: "Ribera del Duero, España",
            priceRange: "€€€",
            reason: "Para ocasiones especiales, un vino con carácter y elegancia.",
          },
        ],
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
