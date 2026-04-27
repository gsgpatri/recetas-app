"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Food = {
  id: string;
  name: string;
  kcal_per_100: number;
  protein_per_100: number;
  carbs_per_100: number;
  fat_per_100: number;
  food_group_id: string | null;
};

type Group = {
  id: string;
  name: string;
};

export default function Alimentos() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);

  const [name, setName] = useState("");
  const [groupId, setGroupId] = useState<string | null>(null);
  const [kcal, setKcal] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");

  useEffect(() => {
    fetchFoods();
    fetchGroups();
  }, []);

  async function fetchFoods() {
    const { data } = await supabase.from("foods").select("*");
    setFoods(data || []);
  }

  async function fetchGroups() {
    const { data } = await supabase.from("food_groups").select("id,name");
    setGroups(data || []);
  }

  async function createFood() {
    const { data: user } = await supabase.auth.getUser();

    await supabase.from("foods").insert([
      {
        name,
        food_group_id: groupId,
        kcal_per_100: Number(kcal),
        protein_per_100: Number(protein),
        carbs_per_100: Number(carbs),
        fat_per_100: Number(fat),
        user_id: user.user?.id,
      },
    ]);

    setName("");
    setGroupId(null);
    setKcal("");
    setProtein("");
    setCarbs("");
    setFat("");

    fetchFoods();
  }

  async function deleteFood(id: string) {
    await supabase.from("foods").delete().eq("id", id);
    fetchFoods();
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold">Alimentos</h1>

      {/* Formulario */}
      <div className="bg-white p-6 rounded-xl shadow space-y-4">
        <input
          placeholder="Nombre"
          className="border p-2 w-full"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <select
          className="border p-2 w-full"
          value={groupId ?? ""}
          onChange={(e) => setGroupId(e.target.value || null)}
        >
          <option value="">Sin grupo</option>
          {groups.map((group) => (
            <option key={group.id} value={group.id}>
              {group.name}
            </option>
          ))}
        </select>

        <div className="grid grid-cols-4 gap-4">
          <input
            placeholder="Kcal"
            className="border p-2"
            value={kcal}
            onChange={(e) => setKcal(e.target.value)}
          />
          <input
            placeholder="Proteína"
            className="border p-2"
            value={protein}
            onChange={(e) => setProtein(e.target.value)}
          />
          <input
            placeholder="Carbs"
            className="border p-2"
            value={carbs}
            onChange={(e) => setCarbs(e.target.value)}
          />
          <input
            placeholder="Grasa"
            className="border p-2"
            value={fat}
            onChange={(e) => setFat(e.target.value)}
          />
        </div>

        <button
          onClick={createFood}
          className="bg-black text-white w-full py-2 rounded"
        >
          Crear alimento
        </button>
      </div>

      {/* Lista */}
      <div className="bg-white p-6 rounded-xl shadow">
        <ul className="space-y-3">
          {foods.map((food) => (
            <li
              key={food.id}
              className="flex justify-between items-center border p-3 rounded"
            >
              <div>
                <p className="font-semibold">{food.name}</p>
                <p className="text-sm text-gray-500">
                  {food.kcal_per_100} kcal | {food.protein_per_100}P |{" "}
                  {food.carbs_per_100}C | {food.fat_per_100}G
                </p>
              </div>

              <button
                onClick={() => deleteFood(food.id)}
                className="text-red-500"
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
