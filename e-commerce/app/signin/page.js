"use client";
import { useState } from "react";


export default function SignIn() {
const [form, setForm] = useState({ email: "", password: "" });
const handleSubmit = (e) => {
e.preventDefault();
alert(`Welcome back, ${form.email}`);
};


return (
<div className="flex justify-center items-center h-screen bg-gray-50">
<form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-80">
<h1 className="text-2xl font-bold mb-4 text-center">Sign In</h1>
<input type="email" placeholder="Email" className="border p-2 rounded-md w-full mb-3" onChange={e => setForm({...form, email: e.target.value})} />
<input type="password" placeholder="Password" className="border p-2 rounded-md w-full mb-3" onChange={e => setForm({...form, password: e.target.value})} />
<button className="bg-indigo-600 w-full text-white py-2 rounded-md">Sign In</button>
</form>
</div>
);
}