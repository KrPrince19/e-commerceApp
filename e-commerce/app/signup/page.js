"use client";
import { useState } from "react";


export default function SignUp() {
const [form, setForm] = useState({ email: "", password: "", confirm: "" });
const handleSubmit = (e) => {
e.preventDefault();
if (form.password !== form.confirm) return alert("Passwords don't match!");
alert(`Account created for ${form.email}`);
};


return (
<div className="flex justify-center items-center h-screen bg-gray-50">
<form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-80">
<h1 className="text-2xl font-bold mb-4 text-center">Sign Up</h1>
<input type="email" placeholder="Email" className="border p-2 rounded-md w-full mb-3" onChange={e => setForm({...form, email: e.target.value})} />
<input type="password" placeholder="Password" className="border p-2 rounded-md w-full mb-3" onChange={e => setForm({...form, password: e.target.value})} />
<input type="password" placeholder="Confirm Password" className="border p-2 rounded-md w-full mb-4" onChange={e => setForm({...form, confirm: e.target.value})} />
<button className="bg-purple-600 w-full text-white py-2 rounded-md">Sign Up</button>
</form>
</div>
);
}