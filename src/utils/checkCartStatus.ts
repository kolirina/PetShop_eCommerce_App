const getCartStatus = () => {
  const cartStatus = localStorage.getItem('anonymous_cart_id')
    ? 'anonymous_cart'
    : 'registered_user_cart';
  return cartStatus;
};

export default getCartStatus;
