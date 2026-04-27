"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useParams, useRouter } from "next/navigation";

export default function RecipeDetail() {
  const { id } = useParams();
  const router = useRouter();

  const [recipe, setRecipe] = useState<any>(null);
  const [ingredients, setIngredients] = useState<any[]>([]);

  useEffect(() => {
    fetchRecipe();
  }, []);

  async function fetchRecipe() {
    const { data: recipeData } = await supabase
      .from("recipes")
      .select("*")
      .eq("id", id)
      .single();

    const { data: ingredientsData } = await supabase
      .from("recipe_ingredients")
      .select("*")
      .eq("recipe_id", id);

    setRecipe(recipeData);
    setIngredients(ingredientsData || []);
  }

  async function deleteRecipe() {
    await supabase.from("recipes").delete().eq("id", id);
    router.push("/");
  }

  if (!recipe) return <p className="p-8">Cargando...</p>;

  return (
    <div className="p-8 max-w-3xl space-y-6">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">{recipe.name}</h1>

        <button onClick={deleteRecipe} className="text-red-500">
          Eliminar
        </button>

        <button
          type="button"
          onClick={() => router.push(`/recetas/formulario/${recipe.id}`)}
          className="bg-gray-800 text-white rounded-lg"
        >
          Editar
        </button>
      </div>

      <div className="text-sm text-gray-600">{recipe.kcal} kcal</div>

      <div className="space-y-1 text-sm">
        <p>Proteínas: {recipe.protein}g</p>
        <p>Carbohidratos: {recipe.carbs}g</p>
        <p>Grasas: {recipe.fat}g</p>
      </div>

      <div>
        <h2 className="font-semibold mb-2">Ingredientes</h2>
        <ul className="list-disc ml-6">
          {ingredients.map((i) => (
            <li key={i.id}>
              {i.quantity} {i.unit} {i.ingredient_name}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="font-semibold mb-2">Pasos</h2>
        <p className="whitespace-pre-line">{recipe.steps}</p>
      </div>
    </div>
  );
}
