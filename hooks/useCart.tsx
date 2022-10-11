import { createContext, useContext } from "react";
import { Product } from "../square-api";
import { useLocalStorage } from "./useLocalStorage";

export interface CartItem extends Product {
  variation: string;
}

interface CartContext {
  products: CartItem[];
  addToCart: (product: CartItem) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContext>({
  products: [],
  addToCart: (product) => null,
  clearCart: () => null,
});

const CartProvider = ({ children }) => {
  const [products, setProducts] = useLocalStorage<CartItem[]>(
    "sufferundersorrow_cart",
    []
  );

  const addToCart = (product: CartItem) =>
    setProducts((state) => [...state, product]);

  const clearCart = () => setProducts([]);

  return (
    <CartContext.Provider value={{ products, addToCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

const useCart = () => {
  const { products, addToCart, clearCart } = useContext(CartContext);

  return {
    products,
    addToCart,
    clearCart,
  };
};

export { useCart, CartProvider };
