import { useToast } from "@chakra-ui/react";
import { toGBP } from "@util/index";
import axios from "axios";
import { createContext, useContext, useMemo } from "react";
import { Product } from "../square-api";
import { useLocalStorage } from "./useLocalStorage";

export interface CartItem extends Product {
  variation: CartItemVariation;
}

export interface CartItemVariation {
  id: string;
  quantity: number;
}

interface CartContext {
  products: CartItem[];
  addToCart: (product: CartItem) => void;
  removeFromCart: (product: CartItem, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  total: string;
}

const CartContext = createContext<CartContext>({
  products: [],
  addToCart: (product) => null,
  removeFromCart: (product) => null,
  clearCart: () => null,
  cartCount: 0,
  total: "£0.00",
});

const CartProvider = ({ children }) => {
  const [products, setProducts] = useLocalStorage<CartItem[]>(
    "sufferundersorrow_cart",
    []
  );
  const toast = useToast();

  const addToCart = async (product: CartItem) => {
    const existingProduct = products.find(
      (p) => p.id === product.id && p.variation.id === product.variation.id
    );

    if (existingProduct) {
      existingProduct.variation.quantity++;
    }

    const isProductOutOfStockRes = await axios.post(
      "/api/products/check-stock",
      [existingProduct ? existingProduct : product]
    );

    if (isProductOutOfStockRes.data.length > 0) {
      toast({
        title: "Product out of stock",
        description: "Unable to add product to cart",
        status: "error",
        duration: 4000,
        isClosable: true,
      });

      return;
    }

    toast({
      title: "Hell Yeah!",
      description: `${product.name} has been added to your cart.`,
      status: "success",
      duration: 4000,
    });

    if (existingProduct) {
      return setProducts([...products]);
    }

    return setProducts([...products, product]);
  };

  const removeFromCart = (product: CartItem, quantity: number = 1) => {
    setProducts((state) => {
      const existingProduct = state.find(
        (p) => p.id === product.id && p.variation.id === product.variation.id
      );

      if (existingProduct) {
        existingProduct.variation.quantity =
          existingProduct.variation.quantity - quantity;

        if (existingProduct.variation.quantity < 1) {
          return [
            ...state.filter(
              (p) => p.variation.id !== existingProduct.variation.id
            ),
          ];
        }

        return [...state];
      }

      return [...state];
    });
  };

  const clearCart = () => setProducts([]);

  const cartCount = useMemo(
    () =>
      products.reduce((sum, product) => sum + product.variation.quantity, 0),
    [products]
  );

  const total = useMemo(
    () =>
      toGBP(
        products.reduce(
          (total, item) =>
            total + parseInt(item.price as string) * item.variation.quantity,
          0
        )
      ),
    [products]
  );

  return (
    <CartContext.Provider
      value={{
        products,
        addToCart,
        removeFromCart,
        clearCart,
        cartCount,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

const useCart = () => {
  const { products, addToCart, removeFromCart, clearCart, cartCount, total } =
    useContext(CartContext);

  return {
    products,
    addToCart,
    removeFromCart,
    clearCart,
    cartCount,
    total,
  };
};

export { useCart, CartProvider };
