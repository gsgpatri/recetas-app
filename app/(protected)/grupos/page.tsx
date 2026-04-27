"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Group = {
  id: string;
  name: string;
  macro_type: string;
};

export default function Grupos() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [name, setName] = useState("");
  const [macroType, setMacroType] = useState("carbs");

  useEffect(() => {
    fetchGroups();
  }, []);

  async function fetchGroups() {
    const { data } = await supabase.from("food_groups").select("*");
    setGroups(data || []);
  }

  async function createGroup() {
    const { data: user } = await supabase.auth.getUser();

    await supabase.from("food_groups").insert([
      {
        name,
        macro_type: macroType,
        user_id: user.user?.id,
      },
    ]);

    setName("");
    fetchGroups();
  }

  async function deleteGroup(id: string) {
    await supabase.from("food_groups").delete().eq("id", id);
    fetchGroups();
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow">
        <h1 className="text-2xl font-bold mb-6">Grupos de alimentos</h1>

        <div className="space-y-3 mb-6">
          <input
            className="border p-2 w-full"
            placeholder="Nombre grupo"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <select
            className="border p-2 w-full"
            value={macroType}
            onChange={(e) => setMacroType(e.target.value)}
          >
            <option value="carbs">Carbohidratos</option>
            <option value="protein">Proteína</option>
            <option value="fat">Grasa</option>
          </select>

          <button
            onClick={createGroup}
            className="bg-black text-white w-full py-2 rounded"
          >
            Crear grupo
          </button>
        </div>

        <ul className="space-y-2">
          {groups.map((group) => (
            <li
              key={group.id}
              className="flex justify-between border p-2 rounded"
            >
              <span>
                {group.name} ({group.macro_type})
              </span>

              <button
                onClick={() => deleteGroup(group.id)}
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
