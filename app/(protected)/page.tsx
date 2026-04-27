"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type MealType = "desayuno" | "comida" | "snack" | "cena";

export default function RecipesPage() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<MealType>("desayuno");
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecipes();
  }, [activeTab]);

  async function fetchRecipes() {
    setLoading(true);

    const { data, error } = await supabase
      .from("recipes")
      .select("*")
      .eq("meal_type", activeTab)
      .order("created_at", { ascending: false });

    if (!error) setRecipes(data || []);
    setLoading(false);
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Mis recetas</h1>
        <button
          onClick={() => router.push("/recetas/formulario")}
          className="bg-black text-white px-4 py-2 rounded-xl"
        >
          + Nueva receta
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-8">
        {(["desayuno", "comida", "snack", "cena"] as MealType[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl capitalize ${
              activeTab === tab ? "bg-black text-white" : "bg-gray-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Cards */}
      {loading ? (
        <p>Cargando...</p>
      ) : recipes.length === 0 ? (
        <p>No tienes recetas en esta categoría.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <div
              key={recipe.id}
              onClick={() => router.push(`/recetas/${recipe.id}`)}
              className="bg-white shadow-md rounded-2xl p-6 border cursor-pointer hover:shadow-lg transition"
            >
              <h2 className="text-lg font-semibold mb-2">{recipe.name}</h2>

              <div className="text-sm text-gray-600 mb-4">
                {recipe.kcal} kcal
              </div>

              <div className="text-xs text-gray-500 space-y-1">
                <p>Proteínas: {recipe.protein}g</p>
                <p>Carbohidratos: {recipe.carbs}g</p>
                <p>Grasas: {recipe.fat}g</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
