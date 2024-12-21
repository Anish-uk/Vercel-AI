import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";

const google = createGoogleGenerativeAI({ apiKey: process.env.apiKey });
export const maxDuration = 30;

export async function POST(req) {
  const { dishName } = await req.json();

  if (!dishName) {
    return new Response(JSON.stringify({ error: "Dish name is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const recipeSchema = z.object({
    recipeName: z.string(),
    dishName: z.string(),
    ingredients: z.array(z.string()),
    steps: z.array(z.string()),
  });

  const result = await generateObject({
    model: google("gemini-1.5-pro-latest", {
      structuredOutputs: false,
    }),
    schema: recipeSchema,
    prompt: `Generate a detailed recipe for the dish: ${dishName}`,
    system:
      "Only generate a recipe if the provided dish name is recognized and exists. If the dish is not recognized, respond with a message such as: 'Sorry, we couldn't find a recipe for this dish. Please check the dish name or try a different one.'",
  });

  if (result.object?.recipeName?.includes("Sorry")) {
    return new Response(JSON.stringify({ message: result.object.recipeName }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ recipe: result.object }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
