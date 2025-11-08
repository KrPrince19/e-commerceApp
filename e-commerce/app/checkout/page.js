"use client";
import { useState } from "react";
import { useCart } from "../store/useCart";

export default function Checkout() {
  const items = useCart((s) => s.items);
  const subtotal = useCart((s) => s.subtotal)();
  const clear = useCart((s) => s.clear);
  const [form, setForm] = useState({ name: "", email: "", address: "" });
  const [msg, setMsg] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ form, items, subtotal }),
    });
    const data = await res.json();
    if (res.ok) {
      clear();
      setMsg(`✅ Order placed successfully! Order ID: ${data.id}`);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Checkout 🧾</h1>
      {msg && <div className="bg-green-100 p-3 mb-4 rounded">{msg}</div>}
      <form onSubmit={submit} className="space-y-3">
        <input placeholder="Name" className="border p-2 w-full rounded" onChange={(e)=>setForm({...form,name:e.target.value})}/>
        <input placeholder="Email" className="border p-2 w-full rounded" onChange={(e)=>setForm({...form,email:e.target.value})}/>
        <textarea placeholder="Address" className="border p-2 w-full rounded" onChange={(e)=>setForm({...form,address:e.target.value})}/>
        <div className="font-semibold flex justify-between">
          <span>Total:</span> <span>${subtotal.toFixed(2)}</span>
        </div>
        <button type="submit" className="w-full bg-primary text-white py-2 rounded hover:bg-blue-700 transition">
          Place Order
        </button>
      </form>
    </div>
  );
}
