"use client";
import { useState } from "react";


export default function FilterBar({ setFilter }) {
const [min, setMin] = useState(0);
const [max, setMax] = useState(5000);


const applyFilter = () => setFilter({ min, max });


return (
<div className="flex items-center justify-center gap-4 py-4 bg-white shadow">
<input type="number" placeholder="Min" value={min} onChange={e => setMin(Number(e.target.value))} className="border p-2 rounded-md w-24" />
<input type="number" placeholder="Max" value={max} onChange={e => setMax(Number(e.target.value))} className="border p-2 rounded-md w-24" />
<button onClick={applyFilter} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Apply</button>
</div>
);
}