import { createContext, useReducer, } from "react";
import Cookies from "js-cookie";

export const Store = createContext();

const initialState = {
   cart: {
      cartItems: Cookies.get('cartItems') ? JSON.parse(Cookies.get('cartItems')) : [],
      shippingAddress: Cookies.get('shippingAddress') ? JSON.parse(Cookies.get('shippingAddress')) : {},
      paymentMethod: Cookies.get('paymentMethod') ? Cookies.get('paymentMethod') : ''
   },
   userInfo: Cookies.get('userInfo') ? JSON.parse(Cookies.get('userInfo')) : '',
   favorites: Cookies.get('favorites') ? JSON.parse(Cookies.get('favorites')) : [],
};


function reducer(state, action) {
   switch (action.type) {
      case 'CART_ADD_ITEM': {
         const newItem = action.payload;
         const existItem = state.cart.cartItems.find((item) => item._id == newItem._id);
         const cartItems = existItem ? state.cart.cartItems.map((item) => item.name == existItem.name ? newItem : item)
            : [...state.cart.cartItems, newItem];
         Cookies.set('cartItems', JSON.stringify(cartItems))
         return { ...state, cart: { ...state.cart, cartItems } };
      }
      case 'ADD_FAVORITES': {
         const newItem = action.payload;
         const existItem = state.favorites.find((item) => item._id == newItem._id);
         const cartItems = existItem ? state.favorites.filter(item => item._id !== existItem._id) : [...state.favorites, newItem];
         Cookies.set('favorites', JSON.stringify(cartItems))
         return { ...state, favorites:  cartItems};
      }
      case 'CART_REMOVE_ITEM': {
         const cartItems = state.cart.cartItems.filter(item => item._id !== action.payload._id);
         Cookies.set('cartItems', JSON.stringify(cartItems))
         return { ...state, cart: { ...state.cart, cartItems } };
      }
      case "CART_CLEAR": {
         return { ...state, cart: { ...state.cart, cartItems: [] } }
      }
      case "SAVE_SHIPPING_ADDRESS": {
         return { ...state, cart: { ...state.cart, shippingAddress: action.payload } };
      }
      case "SAVE_PAYMENT_METHOD": {
         return { ...state, cart: { ...state.cart, paymentMethod: action.payload } };
      }
      case "USER_LOGIN": {
         return { ...state, userInfo: action.payload };
      }
      case 'USER_LOGOUT': {
         return { ...state, userInfo: '', cart: { cartItems: [], shippingAddress: {}, paymentMethod: '' } };
      }
      default: return state;
   };
};

export function StoreProvider(props) {
   const [state, dispatch] = useReducer(reducer, initialState);
   const value = { state, dispatch }
   return <Store.Provider value={value}> {props.children}</Store.Provider>
}