import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { ArrowLeft, CreditCard, Truck, MapPin, CheckCircle } from 'lucide-react';
import { Container, Button, Card } from '../styles/GlobalStyles';
import { useApp } from '../contexts/AppContext';
import { saveOrder, clearCart } from '../utils/storage';
import { Order } from '../types';

const CheckoutContainer = styled.div`
  padding: 120px 0 100px;
  min-height: 100vh;
`;

const CheckoutLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 60px;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 40px;
  }
`;

const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #666;
  font-weight: 500;
  margin-bottom: 32px;
  transition: color 0.3s ease;
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  
  &:hover {
    color: #D4AF37;
  }
`;

const CheckoutMain = styled.div``;

const CheckoutSection = styled(Card)`
  margin-bottom: 32px;
`;

const SectionTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: #2C2C2C;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
`;

const FormGroup = styled.div<{ span?: number }>`
  grid-column: ${props => props.span ? `span ${props.span}` : 'auto'};
`;

const Label = styled.label`
  display: block;
  font-weight: 500;
  color: #2C2C2C;
  margin-bottom: 8px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #E0E0E0;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;
  
  &:focus {
    border-color: #D4AF37;
    outline: none;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #E0E0E0;
  border-radius: 8px;
  font-size: 16px;
  background: #FFFFFF;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:focus {
    border-color: #D4AF37;
    outline: none;
  }
`;

const ShippingOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ShippingOption = styled.label<{ selected: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border: 2px solid ${props => props.selected ? '#D4AF37' : '#E0E0E0'};
  border-radius: 8px;
  background: ${props => props.selected ? '#FFFBF0' : '#FFFFFF'};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #D4AF37;
  }
`;

const ShippingInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ShippingDetails = styled.div``;

const ShippingName = styled.div`
  font-weight: 500;
  color: #2C2C2C;
  margin-bottom: 4px;
`;

const ShippingTime = styled.div`
  font-size: 14px;
  color: #666;
`;

const ShippingPrice = styled.div`
  font-weight: 600;
  color: #2C2C2C;
`;

const ShippingRadio = styled.input`
  margin-right: 0;
  accent-color: #D4AF37;
`;

const PaymentOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
`;

const PaymentOption = styled.label<{ selected: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border: 2px solid ${props => props.selected ? '#D4AF37' : '#E0E0E0'};
  border-radius: 8px;
  background: ${props => props.selected ? '#FFFBF0' : '#FFFFFF'};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #D4AF37;
  }
`;

const PaymentDetails = styled.div<{ show: boolean }>`
  display: ${props => props.show ? 'block' : 'none'};
  margin-top: 20px;
`;

const OrderSummary = styled.div`
  position: sticky;
  top: 120px;
  height: fit-content;
`;

const SummaryCard = styled(Card)``;

const SummaryTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: #2C2C2C;
  margin-bottom: 24px;
`;

const OrderItems = styled.div`
  margin-bottom: 24px;
`;

const OrderItem = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const ItemImage = styled.img`
  width: 60px;
  height: 75px;
  object-fit: cover;
  border-radius: 6px;
`;

const ItemDetails = styled.div`
  flex: 1;
`;

const ItemName = styled.div`
  font-weight: 500;
  color: #2C2C2C;
  margin-bottom: 4px;
  font-size: 14px;
  line-height: 1.4;
`;

const ItemOptions = styled.div`
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
`;

const ItemPrice = styled.div`
  font-weight: 600;
  color: #2C2C2C;
  font-size: 14px;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SummaryLabel = styled.span`
  color: #666;
`;

const SummaryValue = styled.span`
  font-weight: 500;
  color: #2C2C2C;
`;

const TotalRow = styled(SummaryRow)`
  padding-top: 16px;
  border-top: 1px solid #E0E0E0;
  margin-top: 16px;
  margin-bottom: 24px;
`;

const TotalLabel = styled.span`
  font-size: 18px;
  font-weight: 600;
  color: #2C2C2C;
`;

const TotalValue = styled.span`
  font-size: 20px;
  font-weight: 700;
  color: #2C2C2C;
`;

const PlaceOrderButton = styled(Button)`
  width: 100%;
`;

const Checkout: React.FC = () => {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  const [shippingInfo, setShippingInfo] = useState({
    firstName: state.user?.firstName || '',
    lastName: state.user?.lastName || '',
    email: state.user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  });

  const [shippingMethod, setShippingMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('card');

  const [cardInfo, setCardInfo] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: ''
  });

  const shippingOptions = [
    {
      id: 'standard',
      name: 'Standard Shipping',
      time: '5-7 business days',
      price: 0
    },
    {
      id: 'express',
      name: 'Express Shipping',
      time: '2-3 business days',
      price: 15.99
    },
    {
      id: 'overnight',
      name: 'Overnight Shipping',
      time: 'Next business day',
      price: 29.99
    }
  ];

  const subtotal = state.cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const shippingCost = shippingOptions.find(option => option.id === shippingMethod)?.price || 0;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shippingCost + tax;

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;
    
    if (name === 'number') {
      // Format card number with spaces
      formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
    } else if (name === 'expiry') {
      // Format expiry as MM/YY
      formattedValue = value.replace(/\D/g, '').replace(/(\d{2})(\d{0,2})/, '$1/$2').substr(0, 5);
    } else if (name === 'cvc') {
      // Limit CVC to 3 digits
      formattedValue = value.replace(/\D/g, '').substr(0, 3);
    }
    
    setCardInfo(prev => ({
      ...prev,
      [name]: formattedValue
    }));
  };

  const handlePlaceOrder = async () => {
    if (!state.user) {
      navigate('/login');
      return;
    }

    setIsLoading(true);

    // Simulate payment processing
    setTimeout(() => {
      const order: Order = {
        id: Date.now().toString(),
        userId: state.user!.id,
        items: state.cart,
        total: total,
        status: 'processing',
        createdAt: new Date().toISOString(),
        shippingAddress: {
          name: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
          street: shippingInfo.address,
          city: shippingInfo.city,
          state: shippingInfo.state,
          zipCode: shippingInfo.zipCode
        }
      };

      saveOrder(order);
      clearCart();
      dispatch({ type: 'CLEAR_CART' });
      
      setIsLoading(false);
      navigate('/order-confirmation', { state: { order } });
    }, 2000);
  };

  if (state.cart.length === 0) {
    return (
      <CheckoutContainer>
        <Container>
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <h2>Your cart is empty</h2>
            <p style={{ marginBottom: '32px', color: '#666' }}>
              Add some items to your cart before checking out
            </p>
            <Button onClick={() => navigate('/products')}>
              Continue Shopping
            </Button>
          </div>
        </Container>
      </CheckoutContainer>
    );
  }

  return (
    <CheckoutContainer>
      <Container>
        <BackButton onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
          Back
        </BackButton>

        <CheckoutLayout>
          <CheckoutMain>
            <CheckoutSection>
              <SectionTitle>
                <MapPin size={24} />
                Shipping Information
              </SectionTitle>
              
              <FormGrid>
                <FormGroup>
                  <Label>First Name</Label>
                  <Input
                    name="firstName"
                    value={shippingInfo.firstName}
                    onChange={handleShippingChange}
                    required
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label>Last Name</Label>
                  <Input
                    name="lastName"
                    value={shippingInfo.lastName}
                    onChange={handleShippingChange}
                    required
                  />
                </FormGroup>
                
                <FormGroup span={2}>
                  <Label>Email Address</Label>
                  <Input
                    type="email"
                    name="email"
                    value={shippingInfo.email}
                    onChange={handleShippingChange}
                    required
                  />
                </FormGroup>
                
                <FormGroup span={2}>
                  <Label>Phone Number</Label>
                  <Input
                    type="tel"
                    name="phone"
                    value={shippingInfo.phone}
                    onChange={handleShippingChange}
                    required
                  />
                </FormGroup>
                
                <FormGroup span={2}>
                  <Label>Street Address</Label>
                  <Input
                    name="address"
                    value={shippingInfo.address}
                    onChange={handleShippingChange}
                    required
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label>City</Label>
                  <Input
                    name="city"
                    value={shippingInfo.city}
                    onChange={handleShippingChange}
                    required
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label>State</Label>
                  <Select
                    name="state"
                    value={shippingInfo.state}
                    onChange={(e) => handleShippingChange(e as any)}
                    required
                  >
                    <option value="">Select State</option>
                    <option value="CA">California</option>
                    <option value="NY">New York</option>
                    <option value="TX">Texas</option>
                    <option value="FL">Florida</option>
                    {/* Add more states as needed */}
                  </Select>
                </FormGroup>
                
                <FormGroup>
                  <Label>ZIP Code</Label>
                  <Input
                    name="zipCode"
                    value={shippingInfo.zipCode}
                    onChange={handleShippingChange}
                    required
                  />
                </FormGroup>
              </FormGrid>
            </CheckoutSection>

            <CheckoutSection>
              <SectionTitle>
                <Truck size={24} />
                Shipping Method
              </SectionTitle>
              
              <ShippingOptions>
                {shippingOptions.map(option => (
                  <ShippingOption
                    key={option.id}
                    selected={shippingMethod === option.id}
                  >
                    <ShippingInfo>
                      <ShippingRadio
                        type="radio"
                        name="shipping"
                        value={option.id}
                        checked={shippingMethod === option.id}
                        onChange={(e) => setShippingMethod(e.target.value)}
                      />
                      <ShippingDetails>
                        <ShippingName>{option.name}</ShippingName>
                        <ShippingTime>{option.time}</ShippingTime>
                      </ShippingDetails>
                    </ShippingInfo>
                    <ShippingPrice>
                      {option.price === 0 ? 'Free' : `$${option.price}`}
                    </ShippingPrice>
                  </ShippingOption>
                ))}
              </ShippingOptions>
            </CheckoutSection>

            <CheckoutSection>
              <SectionTitle>
                <CreditCard size={24} />
                Payment Information
              </SectionTitle>
              
              <PaymentOptions>
                <PaymentOption selected={paymentMethod === 'card'}>
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    style={{ accentColor: '#D4AF37' }}
                  />
                  <CreditCard size={20} />
                  Credit / Debit Card
                </PaymentOption>
              </PaymentOptions>

              <PaymentDetails show={paymentMethod === 'card'}>
                <FormGrid>
                  <FormGroup span={2}>
                    <Label>Card Number</Label>
                    <Input
                      name="number"
                      placeholder="1234 5678 9012 3456"
                      value={cardInfo.number}
                      onChange={handleCardChange}
                      maxLength={19}
                      required
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <Label>Expiry Date</Label>
                    <Input
                      name="expiry"
                      placeholder="MM/YY"
                      value={cardInfo.expiry}
                      onChange={handleCardChange}
                      maxLength={5}
                      required
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <Label>CVC</Label>
                    <Input
                      name="cvc"
                      placeholder="123"
                      value={cardInfo.cvc}
                      onChange={handleCardChange}
                      maxLength={3}
                      required
                    />
                  </FormGroup>
                  
                  <FormGroup span={2}>
                    <Label>Cardholder Name</Label>
                    <Input
                      name="name"
                      placeholder="John Doe"
                      value={cardInfo.name}
                      onChange={handleCardChange}
                      required
                    />
                  </FormGroup>
                </FormGrid>
              </PaymentDetails>
            </CheckoutSection>
          </CheckoutMain>

          <OrderSummary>
            <SummaryCard>
              <SummaryTitle>Order Summary</SummaryTitle>
              
              <OrderItems>
                {state.cart.map((item, index) => (
                  <OrderItem key={`${item.product.id}-${index}`}>
                    <ItemImage src={item.product.images[0]} alt={item.product.name} />
                    <ItemDetails>
                      <ItemName>{item.product.name}</ItemName>
                      <ItemOptions>
                        Size: {item.size} • Color: {item.color} • Qty: {item.quantity}
                      </ItemOptions>
                      <ItemPrice>${(item.product.price * item.quantity).toFixed(2)}</ItemPrice>
                    </ItemDetails>
                  </OrderItem>
                ))}
              </OrderItems>

              <div>
                <SummaryRow>
                  <SummaryLabel>Subtotal</SummaryLabel>
                  <SummaryValue>${subtotal.toFixed(2)}</SummaryValue>
                </SummaryRow>
                
                <SummaryRow>
                  <SummaryLabel>Shipping</SummaryLabel>
                  <SummaryValue>
                    {shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}
                  </SummaryValue>
                </SummaryRow>
                
                <SummaryRow>
                  <SummaryLabel>Tax</SummaryLabel>
                  <SummaryValue>${tax.toFixed(2)}</SummaryValue>
                </SummaryRow>
                
                <TotalRow>
                  <TotalLabel>Total</TotalLabel>
                  <TotalValue>${total.toFixed(2)}</TotalValue>
                </TotalRow>
              </div>

              <PlaceOrderButton
                onClick={handlePlaceOrder}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>Processing...</>
                ) : (
                  <>
                    <CheckCircle size={20} />
                    Place Order
                  </>
                )}
              </PlaceOrderButton>
            </SummaryCard>
          </OrderSummary>
        </CheckoutLayout>
      </Container>
    </CheckoutContainer>
  );
};

export default Checkout;