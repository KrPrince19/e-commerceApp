"use client";
import { useCart } from "../store/useCart";

export default function ProductCard({ product }) {
  const addItem = useCart((s) => s.addItem);

  return (
    <div className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition">
      <img src={product.image} alt={product.title} className="w-full h-56 object-cover" />
      <div className="p-4">
        <h2 className="font-semibold text-lg">{product.title}</h2>
        <p className="text-primary font-bold">${product.price}</p>
        <button
          onClick={() => addItem(product)}
          className="mt-3 w-full bg-primary text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
