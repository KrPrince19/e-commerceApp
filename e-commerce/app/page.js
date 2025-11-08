"use client"
import React, { useState, useEffect, useContext, createContext, useMemo } from 'react';
import { ShoppingCart, Package, Search, X, History, User, CreditCard, ArrowLeft, LogIn, UserPlus } from 'lucide-react';

// --- MOCK PRODUCT DATA (Local Frontend Source) ---
const MOCK_PRODUCTS = [
    { id: 'p1', name: 'Wireless Mechanical Keyboard', description: 'RGB backlight, tactile brown switches. Ultra-low latency.', price: 129.99, image: 'https://placehold.co/300x200/4F46E5/FFFFFF?text=Keyboard' },
    { id: 'p2', name: 'Noise-Cancelling Headphones', description: 'Industry-leading noise cancellation, 30-hour battery life.', price: 249.00, image: 'https://placehold.co/300x200/10B981/FFFFFF?text=Headphones' },
    { id: 'p3', name: '4K Ultra HD Monitor', description: '27-inch display with HDR support and 144Hz refresh rate.', price: 499.50, image: 'https://placehold.co/300x200/F97316/FFFFFF?text=Monitor' },
    { id: 'p4', name: 'Ergonomic Desk Chair', description: 'Full lumbar support, breathable mesh, and adjustable height.', price: 315.75, image: 'https://placehold.co/300x200/EF4444/FFFFFF?text=Chair' },
    { id: 'p5', name: 'Smart Home Speaker', description: 'Voice assistant built-in with premium 360-degree sound quality.', price: 89.99, image: 'https://placehold.co/300x200/06B6D4/FFFFFF?text=Speaker' },
    { id: 'p6', name: 'Portable SSD 1TB', description: 'Blazing fast external storage for creative professionals.', price: 159.99, image: 'https://placehold.co/300x200/6366F1/FFFFFF?text=SSD' },
];

// --- MOCK CUSTOMER REVIEW DATA ---
const MOCK_REVIEWS = [
    { id: 1, name: 'Alex T.', rating: 5, comment: 'The keyboard is fantastic! The tactile switches feel great and the low latency is noticeable.', product: 'Wireless Mechanical Keyboard' },
    { id: 2, name: 'Sarah L.', rating: 4, comment: 'Headphones are excellent for travel, amazing noise cancellation.', product: 'Noise-Cancelling Headphones' },
    { id: 3, name: 'Mike R.', rating: 5, comment: 'The monitor resolution is stunning. Perfect for gaming and work.', product: '4K Ultra HD Monitor' },
];

// --- CONTEXT SETUP ---
const StoreContext = createContext();

// --- COMPONENTS ---

/**
 * Product Card Component
 */
const ProductCard = ({ product, addToCart, cartItems }) => {
    const itemInCart = cartItems.find(item => item.id === product.id);
    const quantity = itemInCart ? itemInCart.quantity : 0;

    return (
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden transform transition duration-300 hover:shadow-3xl hover:scale-[1.03] flex flex-col border-t-4 border-indigo-500">
            <img src={product.image} alt={product.name} className="w-full h-48 object-cover transition-opacity duration-300 hover:opacity-90" onError={(e) => e.target.src='https://placehold.co/300x200/3B82F6/FFFFFF?text=Product'} />
            <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-gray-900 line-clamp-2 min-h-14">{product.name}</h3>
                <p className="text-sm text-gray-500 mb-4 flex-grow">{product.description}</p>
                <div className="mt-auto flex justify-between items-center pt-3 border-t border-gray-100">
                    <span className="text-2xl font-extrabold text-indigo-700">${product.price.toFixed(2)}</span>
                    <button
                        onClick={() => addToCart(product)}
                        className={`px-5 py-2 text-base font-semibold rounded-full transition-all duration-300 shadow-md
                            ${quantity > 0 ? 'bg-green-500 text-white hover:bg-green-600 shadow-green-300/50' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-400/50'}
                            focus:outline-none focus:ring-4 focus:ring-indigo-300`}
                    >
                        {quantity > 0 ? `+${quantity} Added` : 'Add to Cart'}
                    </button>
                </div>
            </div>
        </div>
    );
};

/**
 * Star Rating Component
 */
const StarRating = ({ rating }) => (
    <div className="flex items-center text-yellow-400">
        {[...Array(5)].map((_, i) => (
            <svg key={i} className={`w-5 h-5 fill-current ${i < rating ? 'opacity-100' : 'opacity-30'}`} viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 15l-5.878 3.09 1.123-6.545L.487 7.21l6.568-.955L10 1l2.945 5.255 6.568.955-4.758 4.335 1.123 6.545z" />
            </svg>
        ))}
    </div>
);

/**
 * Customer Review Section Component
 */
const CustomerReviews = () => (
    <section className="p-4 sm:p-8 pt-0 max-w-7xl mx-auto">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-8 border-b pb-3">Top Customer Reviews</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {MOCK_REVIEWS.map(review => (
                <div key={review.id} className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-red-500 transform transition duration-300 hover:shadow-xl">
                    <StarRating rating={review.rating} />
                    <p className="text-gray-800 italic mt-3 mb-4 leading-relaxed">"{review.comment}"</p>
                    <p className="text-sm font-bold text-gray-700">{review.name}</p>
                    <p className="text-xs text-indigo-500 mt-1">Reviewed: {review.product}</p>
                </div>
            ))}
        </div>
    </section>
);


/**
 * Product Listing Component
 */
const ProductList = () => {
    const { products, searchQuery, setSearchQuery, addToCart, cartItems, sortOption, setSortOption } = useContext(StoreContext);

    const filteredAndSortedProducts = useMemo(() => {
        let currentProducts = [...products]; // Create a copy for sorting
        const query = searchQuery.toLowerCase();

        // 1. Filtering by Search
        currentProducts = currentProducts.filter(product =>
            product.name.toLowerCase().includes(query) ||
            product.description.toLowerCase().includes(query)
        );

        // 2. Sorting by Price
        if (sortOption === 'price_asc') {
            currentProducts.sort((a, b) => a.price - b.price);
        } else if (sortOption === 'price_desc') {
            currentProducts.sort((a, b) => b.price - a.price);
        }
        // 'default' maintains the initial MOCK_PRODUCTS order

        return currentProducts;
    }, [products, searchQuery, sortOption]);

    return (
        <div className="p-4 sm:p-8 pb-10 max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-10 gap-4 bg-white p-5 rounded-xl shadow-lg">
                <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight flex-shrink-0">Tech Showcase</h2>
                
                <div className="flex items-center space-x-4 w-full sm:w-auto">
                    {/* Search Input */}
                    <div className="relative flex-grow">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search keyboards, monitors, etc..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-full shadow-inner text-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                        />
                    </div>
                    
                    {/* Sort Dropdown */}
                    <select
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                        className="p-3 border-2 border-gray-200 rounded-full shadow-inner text-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 cursor-pointer"
                    >
                        <option value="default">Default Order</option>
                        <option value="price_asc">Price: Low to High</option>
                        <option value="price_desc">Price: High to Low</option>
                    </select>
                </div>
            </div>

            {filteredAndSortedProducts.length === 0 && (
                <div className="text-center py-20 text-gray-500 bg-white rounded-xl shadow-lg">
                    <p className="text-2xl font-medium">No products found matching "{searchQuery}".</p>
                    <p className="text-md mt-2">Try searching for common terms like 'keyboard' or 'headphone'.</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
                {filteredAndSortedProducts.map(product => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        addToCart={addToCart}
                        cartItems={cartItems}
                    />
                ))}
            </div>
            
            <div className="mt-16">
                <CustomerReviews />
            </div>
        </div>
    );
};

/**
 * Cart Item Component
 */
const CartItem = ({ item, updateQuantity, removeFromCart }) => (
    <div className="flex items-center justify-between py-5 px-4 bg-white rounded-xl shadow-lg mb-4 transform transition duration-200 hover:shadow-xl hover:scale-[1.01]">
        <div className="flex items-center space-x-6 flex-grow">
            <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-xl border border-gray-100" onError={(e) => e.target.src='https://placehold.co/100x100/3B82F6/FFFFFF?text=Item'} />
            <div className="flex flex-col min-w-0">
                <h4 className="text-lg font-bold text-gray-900 truncate">{item.name}</h4>
                <p className="text-md text-indigo-700 font-extrabold mt-1">${(item.price * item.quantity).toFixed(2)}</p>
                <p className="text-sm text-gray-500">@ ${item.price.toFixed(2)} each</p>
            </div>
        </div>

        <div className="flex items-center space-x-3">
            <button
                onClick={() => updateQuantity(item.id, -1)}
                disabled={item.quantity <= 1}
                className="w-9 h-9 flex items-center justify-center bg-gray-200 text-gray-800 rounded-full text-xl hover:bg-gray-300 transition duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Decrease quantity"
            >
                -
            </button>
            <span className="w-8 text-center text-lg font-bold text-gray-900">{item.quantity}</span>
            <button
                onClick={() => updateQuantity(item.id, 1)}
                className="w-9 h-9 flex items-center justify-center bg-indigo-500 text-white rounded-full text-xl hover:bg-indigo-600 transition duration-150"
                aria-label="Increase quantity"
            >
                +
            </button>
            <button
                onClick={() => removeFromCart(item.id)}
                className="ml-5 text-red-500 hover:text-red-700 transition duration-150 p-2 rounded-full hover:bg-red-50"
                aria-label="Remove item"
            >
                <X className="w-5 h-5" />
            </button>
        </div>
    </div>
);

/**
 * Cart View Component
 */
const Cart = () => {
    const { cartItems, updateQuantity, removeFromCart, setPage } = useContext(StoreContext);

    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const shipping = subtotal > 0 ? 15.00 : 0.00;
    const total = subtotal + shipping;

    return (
        <div className="p-4 sm:p-8 pb-24 max-w-5xl mx-auto">
            <div className="flex items-center mb-8">
                <button onClick={() => setPage('products')} className="text-gray-600 hover:text-indigo-600 transition p-2 rounded-full hover:bg-gray-200">
                    <ArrowLeft className="w-6 h-6 mr-2 inline-block" />
                </button>
                <h2 className="text-4xl font-extrabold text-gray-900 ml-4">Your Shopping Cart</h2>
            </div>


            {cartItems.length === 0 ? (
                <div className="text-center py-20 border-4 border-dashed border-gray-300 rounded-3xl bg-white shadow-xl">
                    <ShoppingCart className="w-16 h-16 mx-auto text-gray-400 mb-6" />
                    <p className="text-2xl text-gray-600 font-semibold">Your cart is currently empty.</p>
                    <button onClick={() => setPage('products')} className="mt-6 text-xl px-6 py-3 bg-indigo-600 text-white font-bold rounded-full hover:bg-indigo-700 transition duration-200 shadow-lg shadow-indigo-300/50">
                        Go Shopping Now
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-4">
                        {cartItems.map(item => (
                            <CartItem
                                key={item.id}
                                item={item}
                                updateQuantity={updateQuantity}
                                removeFromCart={removeFromCart}
                            />
                        ))}
                    </div>
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-2xl shadow-2xl sticky top-24 border border-indigo-100">
                            <h3 className="text-2xl font-bold mb-5 text-gray-900 border-b pb-3">Order Summary</h3>
                            <div className="space-y-3 text-gray-700">
                                <div className="flex justify-between text-lg">
                                    <span>Subtotal ({cartItems.length} items):</span>
                                    <span className="font-semibold text-gray-800">${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-lg">
                                    <span>Shipping (Flat Rate):</span>
                                    <span className="font-semibold text-gray-800">${shipping.toFixed(2)}</span>
                                </div>
                                <div className="border-t-2 border-indigo-200 pt-4 flex justify-between text-2xl font-extrabold text-indigo-700">
                                    <span>Order Total:</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                            </div>
                            <button
                                onClick={() => setPage('checkout')}
                                className="mt-8 w-full py-4 bg-indigo-600 text-white text-xl font-extrabold rounded-full hover:bg-indigo-700 transition duration-200 shadow-xl shadow-indigo-400/60"
                            >
                                Secure Checkout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

/**
 * Checkout Form Component
 */
const CheckoutForm = () => {
    const { cartItems, placeOrderSimulation, setPage } = useContext(StoreContext);
    const [formData, setFormData] = useState({ name: '', email: '', address: '', city: '', zip: '', card: '' });
    const [errors, setErrors] = useState({});
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    // Calculate totals
    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const shipping = subtotal > 0 ? 15.00 : 0.00;
    const finalTotal = subtotal + shipping;

    useEffect(() => {
        if (cartItems.length === 0 && !paymentSuccess) {
            setPage('products');
        }
    }, [cartItems, paymentSuccess, setPage]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validate = () => {
        let newErrors = {};
        if (!formData.name) newErrors.name = 'Full name is required';
        if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Valid email is required';
        if (!formData.address) newErrors.address = 'Address is required';
        if (!formData.city) newErrors.city = 'City is required';
        if (!formData.zip || !/^\d{6}$/.test(formData.zip)) newErrors.zip = 'Valid 6-digit zip code is required';
        // Note: Card validation is simplified for UI simulation
        if (!formData.card || !/^\d{16}$/.test(formData.card)) newErrors.card = 'Valid 16-digit card number is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setIsProcessing(true);

        // --- Checkout Simulation ---
        setTimeout(() => {
            placeOrderSimulation(); // Clear cart state
            setPaymentSuccess(true);
            setIsProcessing(false);
            // Simulate redirect to a "Confirmation" view
            setTimeout(() => {
                setPage('products'); // Return to shop after 3 seconds
            }, 3000);
        }, 1500); // Simulate network delay
    };

    const renderInput = (label, name, type = 'text', placeholder) => (
        <div className="mb-5">
            <label htmlFor={name} className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
            <input
                type={type}
                name={name}
                id={name}
                placeholder={placeholder}
                value={formData[name]}
                onChange={handleChange}
                className={`w-full p-4 border-2 rounded-xl text-lg transition ${errors[name] ? 'border-red-500 ring-red-100' : 'border-gray-200 focus:border-indigo-500 focus:ring-indigo-100'} focus:ring-4 focus:outline-none`}
                required
            />
            {errors[name] && <p className="mt-2 text-xs text-red-600 font-medium flex items-center"><X className="w-4 h-4 mr-1"/>{errors[name]}</p>}
        </div>
    );

    if (paymentSuccess) {
        return (
            <div className="max-w-xl mx-auto p-10 my-20 bg-white shadow-3xl rounded-3xl text-center border-t-8 border-green-500 animate-fadeIn">
                <Package className="w-16 h-16 text-green-500 mx-auto mb-6 animate-bounceOnce" />
                <h2 className="text-4xl font-extrabold text-gray-900 mb-3">Order Placed!</h2>
                <p className="text-xl text-gray-600 mb-8">Thank you for your simulated purchase of **${finalTotal.toFixed(2)}**.</p>
                <div className="w-full h-2 bg-gray-200 rounded-full mb-4">
                    <div className="h-full bg-green-500 rounded-full animate-progress" style={{ width: '100%' }}></div>
                </div>
                <p className="text-sm text-gray-500">Returning to the shop...</p>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-8 pb-24 max-w-5xl mx-auto">
            <div className="flex items-center mb-8">
                <button onClick={() => setPage('cart')} className="text-gray-600 hover:text-indigo-600 transition p-2 rounded-full hover:bg-gray-200">
                    <ArrowLeft className="w-6 h-6 mr-2 inline-block" />
                </button>
                <h2 className="text-4xl font-extrabold text-gray-900 ml-4">Secure Checkout</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Shipping Details */}
                <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-3xl border border-gray-100">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center"><User className="w-6 h-6 mr-3 text-indigo-500" /> Shipping & Payment</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {renderInput('Full Name', 'name', 'text', 'John Doe')}
                            {renderInput('Email Address', 'email', 'email', 'john.doe@example.com')}
                        </div>
                        {renderInput('Street Address', 'address', 'text', '123 Commerce St')}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {renderInput('City', 'city', 'text', 'Anytown')}
                            {renderInput('Zip Code', 'zip', 'text', '12345')}
                        </div>

                        <h4 className="text-xl font-bold text-gray-800 mt-8 mb-5 flex items-center"><CreditCard className="w-6 h-6 mr-3 text-indigo-500" /> Payment Details</h4>
                        {renderInput('Card Number', 'card', 'text', '1111222233334444')}

                        <button
                            type="submit"
                            disabled={isProcessing || cartItems.length === 0}
                            className="mt-8 w-full py-4 flex items-center justify-center bg-indigo-600 text-white text-xl font-extrabold rounded-full hover:bg-indigo-700 transition duration-300 shadow-xl shadow-indigo-400/60 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isProcessing ? (
                                <>
                                    <div className="w-6 h-6 border-4 border-white border-t-indigo-400 rounded-full animate-spin mr-3"></div>
                                    Processing Payment...
                                </>
                            ) : `Pay $${finalTotal.toFixed(2)} & Place Order`}
                        </button>
                    </form>
                </div>

                {/* Order Summary (Checkout Side) */}
                <div className="lg:col-span-1">
                    <div className="bg-indigo-50 p-6 rounded-2xl shadow-inner sticky top-24 border border-indigo-200">
                        <h3 className="text-2xl font-bold mb-4 text-indigo-800">Review Order</h3>
                        <ul className="space-y-3 max-h-80 overflow-y-auto pr-2 mb-4">
                            {cartItems.map(item => (
                                <li key={item.id} className="flex justify-between text-base text-gray-700 border-b border-indigo-100 pb-2 last:border-b-0">
                                    <span className="truncate">{item.quantity}x {item.name}</span>
                                    <span className="font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                                </li>
                            ))}
                        </ul>
                        <div className="space-y-3 text-gray-700 border-t pt-4">
                            <div className="flex justify-between text-md"><span>Subtotal:</span><span className="font-semibold">${subtotal.toFixed(2)}</span></div>
                            <div className="flex justify-between text-md"><span>Shipping:</span><span className="font-semibold">${shipping.toFixed(2)}</span></div>
                            <div className="border-t border-indigo-300 pt-3 flex justify-between text-xl font-extrabold text-indigo-800"><span>Total:</span><span>${finalTotal.toFixed(2)}</span></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

/**
 * Main Application Component
 */
const App = () => {
    const [products] = useState(MOCK_PRODUCTS);
    const [cartItems, setCartItems] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState('products'); // 'products', 'cart', 'checkout'
    const [sortOption, setSortOption] = useState('default'); // NEW: State for sorting

    // --- CART ACTIONS (Local State Management) ---

    const addToCart = (product) => {
        const existingItemIndex = cartItems.findIndex(item => item.id === product.id);
        let newCartItems;

        if (existingItemIndex > -1) {
            newCartItems = cartItems.map((item, index) =>
                index === existingItemIndex
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            );
        } else {
            newCartItems = [...cartItems, {
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1,
            }];
        }
        setCartItems(newCartItems);
    };

    const updateQuantity = (productId, change) => {
        const newCartItems = cartItems.map(item =>
            item.id === productId
                ? { ...item, quantity: Math.max(1, item.quantity + change) }
                : item
        );
        setCartItems(newCartItems);
    };

    const removeFromCart = (productId) => {
        const newCartItems = cartItems.filter(item => item.id !== productId);
        setCartItems(newCartItems);
    };

    // Clears the cart after simulated checkout
    const placeOrderSimulation = () => {
        setCartItems([]);
    };

    // --- RENDERING LOGIC ---

    const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    const renderPage = () => {
        switch (page) {
            case 'products':
                return <ProductList />;
            case 'cart':
                return <Cart />;
            case 'checkout':
                return <CheckoutForm />;
            default:
                return <ProductList />;
        }
    };

    const storeContextValue = {
        products,
        cartItems,
        searchQuery,
        setSearchQuery,
        setPage,
        addToCart,
        updateQuantity,
        removeFromCart,
        placeOrderSimulation,
        sortOption, // Pass new state
        setSortOption, // Pass new state setter
    };

    return (
        <StoreContext.Provider value={storeContextValue}>
            <div className="min-h-screen bg-gray-50 font-inter">
                {/* Header/Navigation with Sign In/Up */}
                <header className="fixed top-0 left-0 w-full bg-white shadow-xl z-30 border-b-2 border-indigo-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-20">
                        {/* Logo / Home Button */}
                        <button onClick={() => setPage('products')} className="text-3xl font-black text-indigo-700 hover:text-indigo-900 transition tracking-wider">
                            MiniShop
                        </button>

                        {/* Auth & Cart Navigation */}
                        <nav className="flex items-center space-x-2 sm:space-x-4">
                             {/* Sign Up Button (UI Only) */}
                            <button
                                className="hidden sm:flex items-center px-4 py-2 text-sm font-semibold rounded-full text-indigo-600 border-2 border-indigo-600 hover:bg-indigo-50 transition duration-200"
                            >
                                <UserPlus className="w-5 h-5 mr-1" /> Sign Up
                            </button>
                            {/* Sign In Button (UI Only) */}
                            <button
                                className="flex items-center px-4 py-2 text-sm font-semibold rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition duration-200 shadow-lg shadow-indigo-300/50"
                            >
                                <LogIn className="w-5 h-5 mr-1" /> Sign In
                            </button>

                            {/* Cart Button */}
                            <button
                                onClick={() => setPage('cart')}
                                className={`relative text-gray-700 hover:text-indigo-700 p-3 rounded-full transition duration-150 hover:bg-gray-100 ${page === 'cart' || page === 'checkout' ? 'text-indigo-700 bg-indigo-50 font-semibold' : ''}`}
                                aria-label="View shopping cart"
                            >
                                <ShoppingCart className="w-6 h-6" />
                                {totalItems > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-white animate-pingOnce">
                                        {totalItems}
                                    </span>
                                )}
                            </button>
                        </nav>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="pt-20">
                    {renderPage()}
                </main>
                
                {/* NEW: Footer */}
                <footer className="bg-gray-900 text-white mt-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-b border-gray-700 pb-8 mb-6">
                            <div>
                                <h4 className="text-2xl font-bold mb-4 text-indigo-400">MiniShop</h4>
                                <p className="text-sm text-gray-400">Your destination for premium tech accessories.</p>
                            </div>
                            <div>
                                <h5 className="font-extrabold mb-4 text-gray-200 uppercase tracking-wider text-sm">Shop</h5>
                                <ul className="space-y-2 text-sm text-gray-400">
                                    <li><button onClick={() => setPage('products')} className="hover:text-indigo-400 transition">All Products</button></li>
                                    <li><a href="#" className="hover:text-indigo-400 transition">New Arrivals</a></li>
                                    <li><a href="#" className="hover:text-indigo-400 transition">Sale Items</a></li>
                                </ul>
                            </div>
                            <div>
                                <h5 className="font-extrabold mb-4 text-gray-200 uppercase tracking-wider text-sm">Support</h5>
                                <ul className="space-y-2 text-sm text-gray-400">
                                    <li><a href="#" className="hover:text-indigo-400 transition">Contact Us</a></li>
                                    <li><a href="#" className="hover:text-indigo-400 transition">Shipping Info</a></li>
                                    <li><a href="#" className="hover:text-indigo-400 transition">Returns Policy</a></li>
                                </ul>
                            </div>
                            <div>
                                <h5 className="font-extrabold mb-4 text-gray-200 uppercase tracking-wider text-sm">Connect</h5>
                                <div className="flex space-x-3">
                                    {/* Mock Social Icons */}
                                    <span className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-indigo-600 cursor-pointer transition">F</span>
                                    <span className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-indigo-600 cursor-pointer transition">T</span>
                                    <span className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center hover:bg-indigo-600 cursor-pointer transition">I</span>
                                </div>
                            </div>
                        </div>
                        <div className="text-center text-sm text-gray-500 pt-4">
                            &copy; {new Date().getFullYear()} MiniShop. All rights reserved. UI Simulation.
                        </div>
                    </div>
                </footer>
            </div>
        </StoreContext.Provider>
    );
};

export default App;