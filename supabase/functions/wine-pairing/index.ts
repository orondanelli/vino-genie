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
    const { dish } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Finding wine pairings for:", dish);

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
            content: `Eres un sommelier experto especializado en maridajes de vinos. Tu tarea es recomendar vinos que combinen perfectamente con platos específicos.

Responde SIEMPRE en formato JSON válido con esta estructura exacta:
{
  "dish": "nombre del plato",
  "recommendations": [
    {
      "wine": "nombre o tipo de vino específico",
      "type": "Tinto/Blanco/Rosado/Espumoso",
      "reason": "explicación breve de por qué este vino marida bien con el plato"
    }
  ]
}

Proporciona entre 3 y 5 recomendaciones variadas, incluyendo opciones de diferentes tipos de vino cuando sea apropiado.
Sé específico con los tipos de uva o denominaciones de origen cuando sea relevante.`,
          },
          {
            role: "user",
            content: `¿Qué vinos recomiendas para maridar con: ${dish}?`,
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
        dish: dish,
        recommendations: [
          { wine: "Rioja Reserva", type: "Tinto", reason: "Vino versátil que complementa muchos platos." },
          { wine: "Albariño", type: "Blanco", reason: "Fresco y aromático, ideal para platos ligeros." },
          { wine: "Cava Brut", type: "Espumoso", reason: "La efervescencia limpia el paladar entre bocados." },
        ],
      };
    }

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in wine-pairing:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
