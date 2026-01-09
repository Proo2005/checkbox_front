"use client";

import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import FloatingNavbar from "../components/FloatingNavbar";
import { FiPlus, FiTrash2 } from "react-icons/fi";

interface ChecklistItem {
  _id: string;
  name: string;
  completed: boolean;
}

export default function ChecklistPage() {
  const [userId, setUserId] = useState("");
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [newItemName, setNewItemName] = useState("");

  /* ---------------- GROUP KEY LOGIC ---------------- */
  const getGroupKey = (name: string) => {
    return name
      .replace(/\d+/g, "") // remove numbers
      .replace(/\bEasy|Medium|Hard\b/gi, "")
      .trim()
      .split(" ")
      .slice(0, 3)
      .join(" ");
  };

  /* ---------------- GROUP ITEMS ---------------- */
  const groupedItems = items.reduce<Record<string, ChecklistItem[]>>(
    (acc, item) => {
      const key = getGroupKey(item.name);
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    },
    {}
  );

  /* ---------------- LOAD USER ---------------- */
  useEffect(() => {
    const storedId = localStorage.getItem("currentUserId");
    if (storedId) setUserId(storedId);
  }, []);

  /* ---------------- FETCH ITEMS ---------------- */
  useEffect(() => {
    if (!userId) return;

    const fetchItems = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/checklist/${userId}`
        );
        if (!res.ok) throw new Error("Failed to fetch checklist");

        const data = await res.json();
        setItems(Array.isArray(data) ? data : []);
      } catch (err: any) {
        toast.error(err.message || "Server error");
        setItems([]);
      }
    };

    fetchItems();
  }, [userId]);

  /* ---------------- ADD ITEM ---------------- */
  const addItem = async () => {
    if (!newItemName.trim() || !userId) return;

    try {
      const res = await fetch("http://localhost:5000/api/checklist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, name: newItemName }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setItems(prev => [...prev, data]);
      setNewItemName("");
      toast.success("Item added");
    } catch (err: any) {
      toast.error(err.message || "Add failed");
    }
  };

  /* ---------------- DELETE ITEM ---------------- */
  const deleteItem = async (id: string) => {
    try {
      await fetch(`http://localhost:5000/api/checklist/${id}`, {
        method: "DELETE",
      });
      setItems(prev => prev.filter(i => i._id !== id));
      toast.success("Item deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  /* ---------------- TOGGLE ITEM ---------------- */
  const toggleItem = async (item: ChecklistItem) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/checklist/toggle/${item._id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ completed: !item.completed }),
        }
      );

      const updated = await res.json();
      setItems(prev =>
        prev.map(i => (i._id === item._id ? updated : i))
      );
    } catch {
      toast.error("Update failed");
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <>
      <FloatingNavbar />
      <Toaster position="top-center" />

      <div className="min-h-screen bg-black px-4 pt-20">
        <div className="max-w-xl mx-auto bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
          <h1 className="text-2xl font-semibold text-white mb-4">
            Checklist
          </h1>

          {/* Add Item */}
          <div className="flex gap-2 mb-6">
            <input
              value={newItemName}
              onChange={e => setNewItemName(e.target.value)}
              placeholder="Add new item"
              className="flex-1 px-4 py-2 rounded-xl bg-zinc-800 text-white"
            />
            <button
              onClick={addItem}
              className="bg-cyan-500 p-2 rounded-xl text-black"
            >
              <FiPlus size={20} />
            </button>
          </div>

          {/* Grouped Checklist */}
          <div className="space-y-6">
            {Object.keys(groupedItems).length > 0 ? (
              Object.entries(groupedItems).map(
                ([groupName, groupItems]) => (
                  <div
                    key={groupName}
                    className="bg-zinc-800 p-4 rounded-2xl border border-zinc-700"
                  >
                    <h2 className="text-cyan-400 font-semibold mb-3">
                      {groupName}
                    </h2>

                    <ul className="space-y-2">
                      {groupItems.map(item => (
                        <li
                          key={item._id}
                          className="flex items-center gap-3 bg-zinc-900 p-2 rounded-xl"
                        >
                          <input
                            type="checkbox"
                            checked={item.completed}
                            onChange={() => toggleItem(item)}
                            className="w-5 h-5 accent-cyan-500"
                          />

                          <span
                            className={`flex-1 text-sm ${
                              item.completed
                                ? "line-through text-zinc-500"
                                : "text-white"
                            }`}
                          >
                            {item.name}
                          </span>

                          <button
                            onClick={() => deleteItem(item._id)}
                            className="text-red-400"
                          >
                            <FiTrash2 />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              )
            ) : (
              <p className="text-zinc-400 text-center">
                No items yet
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
