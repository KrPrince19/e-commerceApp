"use client";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";


export default function Navbar({ cartCount }) {
return (
<nav className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg">
<Link href="/" className="text-2xl font-bold">ShopZone</Link>
<div className="flex items-center gap-4">
<Link href="/signin" className="hover:underline">Sign In</Link>
<Link href="/signup" className="hover:underline">Sign Up</Link>
<Link href="/cart" className="flex items-center">
<ShoppingCart className="mr-1" /> ({cartCount})
</Link>
</div>
</nav>
);
}