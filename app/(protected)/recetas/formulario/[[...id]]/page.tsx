"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function RecipeFormPage() {
  const router = useRouter();
  const params = useParams();

  // Extraemos el string si es un array, o lo dejamos como está si fuera string
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const isEditing = Boolean(id);

  const [name, setName] = useState("");
  const [mealType, setMealType] = useState("desayuno");
  const [kcal, setKcal] = useState(0);
  const [protein, setProtein] = useState(0);
  const [carbs, setCarbs] = useState(0);
  const [fat, setFat] = useState(0);
  const [steps, setSteps] = useState("");

  const [ingredients, setIngredients] = useState([
    { name: "", quantity: 0, unit: "" },
  ]);

  // 1. Si estamos editando, cargamos los datos al montar el componente
  useEffect(() => {
    if (isEditing) {
      fetchRecipeData();
    }
  }, [id]);

  async function fetchRecipeData() {
    // Cargar receta
    const { data: recipe } = await supabase
      .from("recipes")
      .select("*")
      .eq("id", id)
      .single();
    if (recipe) {
      setName(recipe.name);
      setMealType(recipe.meal_type);
      setKcal(recipe.kcal);
      setProtein(recipe.protein);
      setCarbs(recipe.carbs);
      setFat(recipe.fat);
      setSteps(recipe.steps);
    }

    // Cargar ingredientes
    const { data: ingData } = await supabase
      .from("recipe_ingredients")
      .select("*")
      .eq("recipe_id", id);
    if (ingData) {
      setIngredients(
        ingData.map((i) => ({
          name: i.ingredient_name,
          quantity: i.quantity,
          unit: i.unit,
        })),
      );
    }
  }

  function addIngredient() {
    setIngredients([...ingredients, { name: "", quantity: 0, unit: "" }]);
  }

  function updateIngredient(index: number, field: string, value: any) {
    const updated = [...ingredients];
    updated[index][field as keyof (typeof updated)[0]] = value;
    setIngredients(updated);
  }

  async function handleSubmit() {
    let recipeId = id;

    const recipePayload = {
      name,
      meal_type: mealType,
      kcal,
      protein,
      carbs,
      fat,
      steps,
    };

    if (isEditing) {
      // ACTUALIZAR
      await supabase.from("recipes").update(recipePayload).eq("id", id);
      // Para ingredientes en edición, lo más sencillo es borrar los viejos y reinsertar
      await supabase.from("recipe_ingredients").delete().eq("recipe_id", id);
    } else {
      // CREAR
      const { data: newRecipe } = await supabase
        .from("recipes")
        .insert(recipePayload)
        .select()
        .single();
      recipeId = newRecipe?.id;
    }

    if (!recipeId) return;

    const ingredientsToInsert = ingredients.map((i) => ({
      recipe_id: recipeId,
      ingredient_name: i.name,
      quantity: i.quantity,
      unit: i.unit,
    }));

    await supabase.from("recipe_ingredients").insert(ingredientsToInsert);
    router.push(`/recetas/${recipeId}`); // Volver al detalle
    router.refresh();
  }

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">
        {isEditing ? "Editar receta" : "Nueva receta"}
      </h1>

      <div className="space-y-4">
        <input
          value={name} // Importante: añadir value para que se rellene al editar
          placeholder="Nombre"
          className="w-full border p-2 rounded"
          onChange={(e) => setName(e.target.value)}
        />

        <select
          value={mealType} // Importante: añadir value para que se rellene al editar
          className="w-full border p-2 rounded"
          onChange={(e) => setMealType(e.target.value)}
        >
          <option value="desayuno">Desayuno</option>
          <option value="comida">Comida</option>
          <option value="snack">Snack</option>
          <option value="cena">Cena</option>
        </select>

        <input
          type="number"
          placeholder="Kcal"
          className="w-full border p-2 rounded"
          value={kcal} // Importante: añadir value para que se rellene al editar
          onChange={(e) => setKcal(Number(e.target.value))}
        />

        <input
          type="number"
          placeholder="Proteínas"
          className="w-full border p-2 rounded"
          value={protein} // Importante: añadir value para que se rellene al editar
          onChange={(e) => setProtein(Number(e.target.value))}
        />

        <input
          type="number"
          placeholder="Carbohidratos"
          className="w-full border p-2 rounded"
          value={carbs} // Importante: añadir value para que se rellene al editar
          onChange={(e) => setCarbs(Number(e.target.value))}
        />

        <input
          type="number"
          placeholder="Grasas"
          className="w-full border p-2 rounded"
          value={fat} // Importante: añadir value para que se rellene al editar
          onChange={(e) => setFat(Number(e.target.value))}
        />

        <textarea
          value={steps} // Importante: añadir value para que se rellene al editar
          className="w-full border p-2 rounded h-32"
          onChange={(e) => setSteps(e.target.value)}
        />

        <div>
          <h2 className="font-semibold mb-2">Ingredientes</h2>

          {ingredients.map((ingredient, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                value={ingredient.name} // Importante: añadir value para que se rellene al editar
                placeholder="Nombre"
                className="border p-2 rounded w-1/3"
                onChange={(e) =>
                  updateIngredient(index, "name", e.target.value)
                }
              />
              <input
                value={ingredient.quantity} // Importante: añadir value para que se rellene al editar
                type="number"
                placeholder="Cantidad"
                className="border p-2 rounded w-1/3"
                onChange={(e) =>
                  updateIngredient(index, "quantity", Number(e.target.value))
                }
              />
              <input
                value={ingredient.unit} // Importante: añadir value para que se rellene al editar
                placeholder="Unidad"
                className="border p-2 rounded w-1/3"
                onChange={(e) =>
                  updateIngredient(index, "unit", e.target.value)
                }
              />
            </div>
          ))}

          <button
            type="button"
            onClick={addIngredient}
            className="mt-2 text-sm underline"
          >
            + Añadir ingrediente
          </button>
        </div>

        <button
          onClick={handleSubmit}
          className="bg-black text-white px-6 py-2 rounded-xl mt-4"
        >
          {isEditing ? "Guardar cambios" : "Crear receta"}
        </button>
      </div>
    </div>
  );
}
