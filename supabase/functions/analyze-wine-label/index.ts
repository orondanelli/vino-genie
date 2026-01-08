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
    const { image } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Analyzing wine label image...");

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
            content: `Eres un experto sommelier y especialista en vinos. Tu tarea es analizar imágenes de etiquetas de vino y extraer información.

Responde SIEMPRE en formato JSON válido con esta estructura exacta:
{
  "name": "nombre del vino",
  "winery": "nombre de la bodega",
  "region": "región de origen",
  "year": "añada (año)",
  "type": "tipo de vino (Tinto, Blanco, Rosado, Espumoso, etc.)",
  "description": "descripción breve del vino basada en lo visible y tu conocimiento",
  "pairings": ["maridaje 1", "maridaje 2", "maridaje 3", "maridaje 4"]
}

Si no puedes identificar algún dato, usa "Desconocido" o haz tu mejor estimación basándote en el contexto visual.`,
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Analiza esta etiqueta de vino y extrae toda la información que puedas ver. Proporciona también maridajes sugeridos.",
              },
              {
                type: "image_url",
                image_url: {
                  url: image,
                },
              },
            ],
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

    // Parse the JSON from the response
    let wineInfo;
    try {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        wineInfo = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      console.error("Error parsing AI response:", parseError);
      wineInfo = {
        name: "Vino detectado",
        winery: "Bodega desconocida",
        region: "Región desconocida",
        year: "Desconocido",
        type: "Tinto",
        description: content || "No se pudo extraer información detallada de la etiqueta.",
        pairings: ["Carnes rojas", "Quesos curados", "Pasta", "Embutidos"],
      };
    }

    return new Response(
      JSON.stringify({ wineInfo }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in analyze-wine-label:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
