import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { X, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { Button } from '../styles/GlobalStyles';

const CartOverlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 2000;
  opacity: ${props => props.isOpen ? '1' : '0'};
  pointer-events: ${props => props.isOpen ? 'auto' : 'none'};
  transition: opacity 0.3s ease;
`;

const CartPanel = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  max-width: 480px;
  height: 100vh;
  background: #FFFFFF;
  transform: translateX(${props => props.isOpen ? '0' : '100%'});
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  z-index: 2001;
  
  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const CartHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px;
  border-bottom: 1px solid #E0E0E0;
`;

const CartTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: #2C2C2C;
`;

const CloseButton = styled.button`
  background: none;
  padding: 8px;
  color: #666;
  transition: color 0.3s ease;
  border-radius: 8px;
  
  &:hover {
    color: #2C2C2C;
    background: #F5F5F5;
  }
`;

const CartContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0;
`;

const EmptyCart = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 40px 24px;
  text-align: center;
`;

const EmptyCartIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #F5F5F5;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  color: #999;
`;

const EmptyCartText = styled.p`
  font-size: 18px;
  color: #666;
  margin-bottom: 8px;
`;

const EmptyCartSubtext = styled.p`
  font-size: 14px;
  color: #999;
  margin-bottom: 24px;
`;

const CartItem = styled.div`
  display: flex;
  gap: 16px;
  padding: 24px;
  border-bottom: 1px solid #F0F0F0;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: #FAFAFA;
  }
`;

const ItemImage = styled.img`
  width: 80px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
  background: #F8F8F8;
`;

const ItemDetails = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const ItemName = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #2C2C2C;
  margin-bottom: 8px;
  line-height: 1.4;
`;

const ItemOptions = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
`;

const ItemOption = styled.span`
  font-size: 14px;
  color: #666;
`;

const ItemPrice = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #2C2C2C;
  margin-bottom: 12px;
`;

const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const QuantityButton = styled.button`
  background: #F5F5F5;
  border: none;
  border-radius: 6px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #2C2C2C;
  transition: all 0.3s ease;
  
  &:hover {
    background: #E0E0E0;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const QuantityValue = styled.span`
  font-weight: 500;
  color: #2C2C2C;
  min-width: 20px;
  text-align: center;
`;

const RemoveButton = styled.button`
  background: none;
  color: #999;
  font-size: 13px;
  text-decoration: underline;
  margin-top: 8px;
  transition: color 0.3s ease;
  
  &:hover {
    color: #E74C3C;
  }
`;

const CartFooter = styled.div`
  padding: 24px;
  border-top: 1px solid #E0E0E0;
  background: #FAFAFA;
`;

const CartTotal = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const TotalLabel = styled.span`
  font-size: 18px;
  font-weight: 600;
  color: #2C2C2C;
`;

const TotalAmount = styled.span`
  font-size: 24px;
  font-weight: 700;
  color: #2C2C2C;
`;

const CheckoutButton = styled(Button)`
  width: 100%;
  margin-bottom: 12px;
`;

const ContinueShoppingLink = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #666;
  font-size: 14px;
  font-weight: 500;
  text-decoration: underline;
  transition: color 0.3s ease;
  
  &:hover {
    color: #D4AF37;
  }
`;

const Cart: React.FC = () => {
  const { state, dispatch } = useApp();

  const handleQuantityChange = (index: number, newQuantity: number) => {
    if (newQuantity === 0) {
      dispatch({ type: 'REMOVE_FROM_CART', payload: index.toString() });
    } else {
      const item = state.cart[index];
      dispatch({
        type: 'UPDATE_CART_QUANTITY',
        payload: {
          productId: item.product.id,
          size: item.size,
          color: item.color,
          quantity: newQuantity
        }
      });
    }
  };

  const handleRemoveItem = (index: number) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: index.toString() });
  };

  const total = state.cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const itemCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <CartOverlay 
        isOpen={state.cartVisible}
        onClick={() => dispatch({ type: 'TOGGLE_CART', payload: false })}
      />
      
      <CartPanel isOpen={state.cartVisible}>
        <CartHeader>
          <CartTitle>Shopping Cart ({itemCount})</CartTitle>
          <CloseButton onClick={() => dispatch({ type: 'TOGGLE_CART', payload: false })}>
            <X size={24} />
          </CloseButton>
        </CartHeader>

        <CartContent>
          {state.cart.length === 0 ? (
            <EmptyCart>
              <EmptyCartIcon>
                <ShoppingBag size={32} />
              </EmptyCartIcon>
              <EmptyCartText>Your cart is empty</EmptyCartText>
              <EmptyCartSubtext>Add some items to get started</EmptyCartSubtext>
              <Button 
                variant="outline"
                onClick={() => dispatch({ type: 'TOGGLE_CART', payload: false })}
              >
                Continue Shopping
              </Button>
            </EmptyCart>
          ) : (
            <>
              {state.cart.map((item, index) => (
                <CartItem key={`${item.product.id}-${item.size}-${item.color}-${index}`}>
                  <ItemImage src={item.product.images[0]} alt={item.product.name} />
                  <ItemDetails>
                    <ItemName>{item.product.name}</ItemName>
                    <ItemOptions>
                      <ItemOption>Size: {item.size}</ItemOption>
                      <ItemOption>Color: {item.color}</ItemOption>
                    </ItemOptions>
                    <ItemPrice>${item.product.price}</ItemPrice>
                    <QuantityControl>
                      <QuantityButton
                        onClick={() => handleQuantityChange(index, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={16} />
                      </QuantityButton>
                      <QuantityValue>{item.quantity}</QuantityValue>
                      <QuantityButton
                        onClick={() => handleQuantityChange(index, item.quantity + 1)}
                      >
                        <Plus size={16} />
                      </QuantityButton>
                    </QuantityControl>
                    <RemoveButton onClick={() => handleRemoveItem(index)}>
                      Remove
                    </RemoveButton>
                  </ItemDetails>
                </CartItem>
              ))}
            </>
          )}
        </CartContent>

        {state.cart.length > 0 && (
          <CartFooter>
            <CartTotal>
              <TotalLabel>Total:</TotalLabel>
              <TotalAmount>${total.toFixed(2)}</TotalAmount>
            </CartTotal>
            <CheckoutButton as={Link} to="/checkout">
              Proceed to Checkout
              <ArrowRight size={18} />
            </CheckoutButton>
            <ContinueShoppingLink 
              to="/products"
              onClick={() => dispatch({ type: 'TOGGLE_CART', payload: false })}
            >
              Continue Shopping
            </ContinueShoppingLink>
          </CartFooter>
        )}
      </CartPanel>
    </>
  );
};

export default Cart;