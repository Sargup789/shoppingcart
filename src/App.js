import { useEffect, useState } from 'react';
import './App.css';

const PRODUCTS = [
  { id: 1, name: "Laptop", price: 500 },
  { id: 2, name: "Smartphone", price: 300 },
  { id: 3, name: "Headphones", price: 100 },
  { id: 4, name: "Smartwatch", price: 150 },
];

const FREE_GIFT = { id: 99, name: "Wireless Mouse", price: 0 };
const THRESHOLD = 1000;

function App() {

  const [cart, setCart] = useState([]);
  const [showGiftMessage, setShowGiftMessage] = useState(false);

  console.log(showGiftMessage, "showmessage");

  const subTotal = cart.filter((item) => item.id !== FREE_GIFT.id).reduce((sum, item) => sum + item.price*item.quantity, 0);

  const progress = Math.min((subTotal/THRESHOLD)*100, 100);

  const hasFreeGift = cart.some((item) => item.id === FREE_GIFT.id);

  useEffect(() => {
    if(subTotal >= THRESHOLD && !hasFreeGift) {
      setCart((prev) => [...prev, {...FREE_GIFT, quantity: 1}]);
      setShowGiftMessage(true);
      setTimeout(() => 
      setShowGiftMessage(false), 3000);
    } else if (subTotal < THRESHOLD && hasFreeGift) {
      setCart((prev) => prev.filter((item) => item.id !== FREE_GIFT.id))
    }
  }, [subTotal, hasFreeGift]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existingItem = prev.find((item) => item.id === product.id);
      if(existingItem) {
        return prev.map((item) => item.id === product.id ? {...item, quantity: item.quantity + 1} : item)
      }
      return [...prev, {...product, quantity: 1}]
    })
  };

  const updateQuantity = (productId, delta) => {
    setCart((prev) => {
      const item = prev.find(
        (item) => item.id === productId
      )
      if(!item) return prev;
      const newQunatity = item.quantity + delta;
      if (newQunatity <= 0) {
        return prev.filter((item) => item.id !== productId)
      }
      return prev.map((item) => item.id === productId ? { ...item, quantity: newQunatity} : item)
    })
  }

  return (
    <div className='app-bg'>
      <div className='app-container'>
       <h1 className='main-title'>Shopping Cart</h1>
       {/* Products Section */}
       <h2 className='section-title'>Products</h2>
       <div className='products-grid'>
        {PRODUCTS.map((product) => ( <div key={product.id} className='product-card'>
           <span className='product-name'>{product.name}</span>
           <span className='product-price'>{product.price}</span>
           <button onClick={() => addToCart(product)} className='add-button'>Add to Cart</button>
        </div>))}
       </div>
       <h2 className='section-title'>Cart Summary</h2>
       <div className='cart-summary-card'>
         <div className='cart-summary-row'>
          <span className='cart-summary-label'>SubTotal:</span>
          <span>₹{subTotal}</span>
         </div>
         <hr className='cart-summary-divider'/>
         <div className='cart-summary-infobox'>
          {hasFreeGift ? (<span className='cart-summary-gift'>You got a free Wireless Mouse!</span>) : 
          (
            <>
            <span className='cart-summary-progress'>Add ₹{THRESHOLD - subTotal} more to get a FREE Wireless Mouse!</span>
            <div className='progress-bar'>
             <div className='progress-bar-fill' style={{ width: `${progress}%`}}></div>
            </div>
            </>
          )}
         </div>
       </div>
       <h2 className='section-title'>Cart Items</h2>
       <div className='cart-item-list'>
       {cart.length === 0 ?
       (<div className='cart-empty'>
        <div className='cart-empty-title'>Your cart is empty</div>
        <div className='cart-empty-title'>Add some poducts to see them here!</div>
       </div>) :
       (
        cart.map((item) => (
          <div key={item.id} className='cart-item-card'>
            <div className='cart-item-info'>
              <div className='cart-item-name'>
                {item.name}
                {item.id === FREE_GIFT.id && (
                  <span className='free-gift-badge'>FREE GIFT</span>
                )}
              </div>
              <div className='cart-item-breakdown'>
              ₹{item.price} * {item.quantity} = ₹{item.price * item.quantity}
              </div>
            </div>
            {item.id !== FREE_GIFT.id ? (
              <div className='cart-item-controls'>
                <button onClick={() => updateQuantity(item.id, - 1)} 
                  className='qty-btn-minus'
                  >
                   -
                </button>
                <span className='cart-item-qty'>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.i, 1)} 
                  className='qty-btn-plus'
                  >
                   +
                </button>
              </div>
            ): ('')}
          </div>
        ))
       )}
      </div>
      </div>
    </div>
  );
}

export default App;
