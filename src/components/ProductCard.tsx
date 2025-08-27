import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { ShoppingBag, Heart, Star } from 'lucide-react';
import { Product } from '../types';
import { useApp } from '../contexts/AppContext';
import { Button, Badge } from '../styles/GlobalStyles';

const CardWrapper = styled.div`
  position: relative;
  background: #FFFFFF;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.06);
  
  &:hover {
    transform: translateY(-12px);
    box-shadow: 0 12px 50px rgba(0, 0, 0, 0.15);
  }
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 3/4;
  overflow: hidden;
  background: #F8F8F8;
`;

const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  
  ${CardWrapper}:hover & {
    transform: scale(1.08);
  }
`;

const ImageOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  opacity: 0;
  transition: opacity 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  
  ${CardWrapper}:hover & {
    opacity: 1;
  }
`;

const QuickActions = styled.div`
  display: flex;
  gap: 12px;
`;

const ActionButton = styled.button`
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #2C2C2C;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  
  &:hover {
    background: #FFFFFF;
    transform: scale(1.1);
    color: #D4AF37;
  }
`;

const ProductBadges = styled.div`
  position: absolute;
  top: 12px;
  left: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 2;
`;

const WishlistButton = styled.button<{ active: boolean }>`
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.active ? '#E74C3C' : '#2C2C2C'};
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  z-index: 2;
  
  &:hover {
    background: #FFFFFF;
    transform: scale(1.1);
    color: #E74C3C;
  }
`;

const ProductInfo = styled.div`
  padding: 20px;
`;

const ProductName = styled(Link)`
  font-size: 18px;
  font-weight: 600;
  color: #2C2C2C;
  margin-bottom: 8px;
  display: block;
  line-height: 1.4;
  transition: color 0.3s ease;
  
  &:hover {
    color: #D4AF37;
  }
`;

const ProductCategory = styled.span`
  font-size: 13px;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 12px;
  display: block;
`;

const PriceContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
`;

const CurrentPrice = styled.span`
  font-size: 20px;
  font-weight: 700;
  color: #2C2C2C;
`;

const OriginalPrice = styled.span`
  font-size: 16px;
  color: #999;
  text-decoration: line-through;
`;

const DiscountBadge = styled.span`
  background: #E74C3C;
  color: #FFFFFF;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
`;

const RatingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
`;

const Stars = styled.div`
  display: flex;
  gap: 2px;
`;

const ReviewCount = styled.span`
  font-size: 13px;
  color: #888;
`;

const AddToCartButton = styled(Button)`
  width: 100%;
`;

interface ProductCardProps {
  product: Product;
  onAddToCart?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const { dispatch } = useApp();
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Add to cart with default size and color
    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        product,
        size: product.sizes[0],
        color: product.colors[0],
        quantity: 1
      }
    });

    // Show cart
    dispatch({ type: 'TOGGLE_CART', payload: true });
    
    onAddToCart?.();
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={14}
        fill={i < rating ? '#D4AF37' : 'none'}
        color={i < rating ? '#D4AF37' : '#E0E0E0'}
      />
    ));
  };

  return (
    <CardWrapper>
      <ImageContainer>
        <ProductImage src={product.images[0]} alt={product.name} />
        
        <ProductBadges>
          {product.newArrival && <Badge variant="primary">New</Badge>}
          {product.featured && <Badge variant="secondary">Featured</Badge>}
          {discountPercentage > 0 && (
            <DiscountBadge>-{discountPercentage}%</DiscountBadge>
          )}
        </ProductBadges>

        <WishlistButton active={isWishlisted} onClick={handleWishlist}>
          <Heart size={18} fill={isWishlisted ? 'currentColor' : 'none'} />
        </WishlistButton>

        <ImageOverlay>
          <QuickActions>
            <ActionButton onClick={handleAddToCart}>
              <ShoppingBag size={20} />
            </ActionButton>
          </QuickActions>
        </ImageOverlay>
      </ImageContainer>

      <ProductInfo>
        <ProductCategory>{product.subcategory}</ProductCategory>
        <ProductName to={`/product/${product.id}`}>
          {product.name}
        </ProductName>

        <RatingContainer>
          <Stars>{renderStars(Math.floor(product.rating))}</Stars>
          <ReviewCount>({product.reviews})</ReviewCount>
        </RatingContainer>

        <PriceContainer>
          <CurrentPrice>${product.price}</CurrentPrice>
          {product.originalPrice && (
            <OriginalPrice>${product.originalPrice}</OriginalPrice>
          )}
        </PriceContainer>

        <AddToCartButton onClick={handleAddToCart}>
          Add to Cart
        </AddToCartButton>
      </ProductInfo>
    </CardWrapper>
  );
};

export default ProductCard;