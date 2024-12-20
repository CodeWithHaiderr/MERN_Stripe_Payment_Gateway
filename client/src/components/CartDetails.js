import React, { useEffect, useState } from "react";
import "./cartstyle.css";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  removeToCart,
  removeSingleItem,
  emptyCartItems,
} from "../redux/features/cartSlice";
import toast from "react-hot-toast";
import {loadStripe} from '@stripe/stripe-js';


const CartDetails = () => {
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);

  const { carts } = useSelector((state) => state.allCart);

  const dispatch = useDispatch();

  // cart incrementation
  const handleIncrement = (e) => {
    dispatch(addToCart(e));
  };
  //delete items from cart
  const handleDecrement = (e) => {
    dispatch(removeToCart(e));
    toast.success("Item removed from Cart");
  };
  //cart decrementation
  const handleSingleDecrement = (e) => {
    dispatch(removeSingleItem(e));
  };
  //empty cart
  const handleEmptyCart = () => {
    dispatch(emptyCartItems());
    toast.success("Your cart is empty");
  };
  //sum total price of cart items
  const total = () => {
    let totalprice = 0;
    carts.map((ele, index) => {
      totalprice = ele.price * ele.qnty + totalprice;
    });
    setTotalPrice(totalprice);
  };
  useEffect(() => {
    total();
  }, [total]);

  //sum of total items in cart
  const countCart = () => {
    let totalquantity = 0;
    carts.map((ele, index) => {
      totalquantity = ele.qnty + totalquantity;
    });
    setTotalQuantity(totalquantity);
  };
  useEffect(() => {
    countCart();
  }, [countCart]);

  //checkout button , Make payment
  const makePayment = async () => {
    const stripe = await loadStripe("pk_test_51QSd2dFs25x7V0waoxeezUP7IgpeYLFFkYnaLhyswcWGpsqylGc7roBMIYUd55tSAgDc3O3ahxLwJT5nlp0DGu8000buSr8zAj");

    const body = {
        products: carts
    }
    const headers = {
        "Content-Type": "application/json"
    }
    const response = await fetch("http://localhost:7000/api/create-checkout-session",{
        method: "POST",
        headers: headers,
        body: JSON.stringify(body)
    });
    const session = await response.json();
    const result = stripe.redirectToCheckout({
        sessionId: session.id
    });
    if (result.error) {
        console.log(result.error);
        
    }
  }

  return (
    <>
      <div className="row justify-content-center m-0">
        <div className="col-md-8 mt-5 mb-5 cardsdetails">
          <div className="card">
            <div className="card-header bg-dark p-3">
              <div className="card-header-flex ">
                <h5 className="text-white m-0">
                  Cart Collection{carts.length > 0 ? `(${carts.length})` : ""}
                </h5>
                {carts.length > 0 ? (
                  <button
                    className="btn btn-danger mt-0 btn-sm"
                    onClick={handleEmptyCart}
                  >
                    <i className="fa fa-trash-alt mr-2"></i>
                    <span>Empty Cart</span>
                  </button>
                ) : (
                  ""
                )}
              </div>
            </div>
            <div className="card-body p-0">
              {carts.length === 0 ? (
                <table className="table cart-table mb-0">
                  <tbody>
                    <tr>
                      <td colSpan={6}>
                        <div className="cart-empty">
                          <i className="fa fa-shopping-cart"></i>
                          <p>Yout Cart is Empty</p>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              ) : (
                <table className="table cart-table mb-0 table-responsive-sm">
                  <thead>
                    <tr>
                      <th>Action</th>
                      <th>Product</th>
                      <th>Name</th>
                      <th>Price</th>
                      <th>Qty</th>
                      <th className="text-right">
                        <span id="amount" className="amount">
                          Total Amount
                        </span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {carts.map((data, index) => {
                      return (
                        <>
                          <tr>
                            <td>
                              <button
                                className="prdct-delete"
                                onClick={() => handleDecrement(data.id)}
                              >
                                <i className="fa fa-trash-alt mr-2"></i>
                              </button>
                            </td>
                            <td>
                              <div className="product-img">
                                <img src={data.imgdata} alt="" />
                              </div>
                            </td>
                            <td>
                              <div className="product-name">
                                <p>{data.dish}</p>
                              </div>
                            </td>
                            <td>{data.price}</td>
                            <td>
                              <div className="prdct-qty-container">
                                <button
                                  className="prdct-qty-btn"
                                  type="button"
                                  onClick={
                                    data.qnty <= 1
                                      ? () => handleDecrement(data.id)
                                      : () => handleSingleDecrement(data)
                                  }
                                >
                                  <i className="fa fa-minus"></i>
                                </button>
                                <input
                                  type="text"
                                  className="qty-input-box"
                                  value={data.qnty}
                                  disabled
                                  name=""
                                  id=""
                                />
                                <button
                                  className="prdct-qty-btn"
                                  type="button"
                                  onClick={() => handleIncrement(data)}
                                >
                                  <i className="fa fa-plus"></i>
                                </button>
                              </div>
                            </td>
                            <td className="text-right">
                              {data.qnty * data.price}
                            </td>
                          </tr>
                        </>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr>
                      <th>&nbsp;</th>
                      <th colSpan={2}>&nbsp;</th>
                      <th>
                        Items in cart<span className="ml-2 mr-2">:</span>
                        <span className="text-danger">{totalQuantity}</span>
                      </th>
                      <th className="text-right">
                        Total Price<span className="ml-2 mr-2">:</span>
                        <span className="text-danger">{totalPrice}</span>
                      </th>
                      <th className="text-right">
                        <button className="btn btn-success" type="button" onClick={makePayment}>
                            Checkout
                        </button>
                      </th>
                    </tr>
                  </tfoot>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartDetails;
