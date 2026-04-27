"use client";

import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

export default function EquivalencesPage() {
  const [groups, setGroups] = useState<any[]>([]);
  const [macroType, setMacroType] = useState("carbohidratos");
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(0);

  useEffect(() => {
    fetchGroups();
  }, []);

  async function fetchGroups() {
    const { data } = await supabase
      .from("equivalence_groups")
      .select("*")
      .order("created_at", { ascending: false });

    setGroups(data || []);
  }

  async function createGroup() {
    await supabase.from("equivalence_groups").insert({
      macro_type: macroType,
      macro_min: min,
      macro_max: max,
    });

    fetchGroups();
  }

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Equivalencias</h1>

      <div className="border p-4 rounded-xl mb-8 space-y-2">
        <select
          className="border p-2 rounded w-full"
          onChange={(e) => setMacroType(e.target.value)}
        >
          <option value="carbohidratos">Carbohidratos</option>
          <option value="proteina">Proteína</option>
          <option value="grasa">Grasa</option>
        </select>

        <input
          type="number"
          placeholder="Valor mínimo"
          className="border p-2 rounded w-full"
          onChange={(e) => setMin(Number(e.target.value))}
        />

        <input
          type="number"
          placeholder="Valor máximo"
          className="border p-2 rounded w-full"
          onChange={(e) => setMax(Number(e.target.value))}
        />

        <button
          onClick={createGroup}
          className="bg-black text-white px-4 py-2 rounded-xl"
        >
          Crear grupo
        </button>
      </div>

      <div className="space-y-4">
        {groups.map((group) => (
          <div key={group.id} className="border p-4 rounded-xl">
            <p className="font-semibold capitalize">{group.macro_type}</p>
            <p className="text-sm text-gray-600">
              {group.macro_min} - {group.macro_max} g
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
