import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    carts: []
}

const cartSlice = createSlice({
    name: "cartslice",
    initialState,
    reducers: {
        addToCart: (state, action) => {

            const ItemIndex = state.carts.findIndex((item) => item.id === action.payload.id);

            if (ItemIndex >= 0) {
                state.carts[ItemIndex].qnty += 1;
            } else {
                const temp = { ...action.payload, qnty: 1 }
                state.carts = [...state.carts, temp]
            }
        },
        //Delete items from cart
        removeToCart: (state, action) => {
            const data = state.carts.filter((ele) => ele.id !== action.payload);
            state.carts = data
        },
        //for decrementation of single item 
        removeSingleItem:(state, action) => {
            const ItemIndex_dec = state.carts.findIndex((item) => item.id === action.payload.id);
            if (state.carts[ItemIndex_dec].qnty >= 1) {
                state.carts[ItemIndex_dec].qnty -= 1;
            }
        },
        //empty cart
        emptyCartItems : (state, action) => {
            state.carts = []
        }

    }
});

export const { addToCart, removeToCart, removeSingleItem, emptyCartItems } = cartSlice.actions;

export default cartSlice.reducer;