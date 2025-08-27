import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { ArrowLeft, Star, Heart, ShoppingBag, Truck, Shield, RefreshCcw } from 'lucide-react';
import { Container, Button, Badge } from '../styles/GlobalStyles';
import { products } from '../data/products';
import { Product } from '../types';
import { useApp } from '../contexts/AppContext';
import ProductCard from '../components/ProductCard';

const ProductContainer = styled.div`
  padding: 120px 0 100px;
`;

const BackButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #666;
  font-weight: 500;
  margin-bottom: 32px;
  transition: color 0.3s ease;
  
  &:hover {
    color: #D4AF37;
  }
`;

const ProductLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  margin-bottom: 100px;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 40px;
  }
`;

const ImageSection = styled.div`
  position: sticky;
  top: 120px;
  height: fit-content;
`;

const MainImage = styled.img`
  width: 100%;
  aspect-ratio: 3/4;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 20px;
  cursor: zoom-in;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.02);
  }
`;

const ThumbnailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 12px;
`;

const Thumbnail = styled.img<{ active: boolean }>`
  aspect-ratio: 3/4;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
  border: 3px solid ${props => props.active ? '#D4AF37' : 'transparent'};
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #D4AF37;
    transform: scale(1.05);
  }
`;

const ProductInfo = styled.div``;

const ProductHeader = styled.div`
  margin-bottom: 32px;
`;

const ProductCategory = styled.span`
  font-size: 14px;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 12px;
  display: block;
`;

const ProductTitle = styled.h1`
  font-size: 36px;
  font-weight: 600;
  color: #2C2C2C;
  margin-bottom: 16px;
  line-height: 1.2;
  
  @media (max-width: 768px) {
    font-size: 28px;
  }
`;

const ProductBadges = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

const RatingSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
`;

const Stars = styled.div`
  display: flex;
  gap: 4px;
`;

const RatingText = styled.span`
  color: #666;
  font-size: 14px;
`;

const PriceSection = styled.div`
  margin-bottom: 32px;
`;

const CurrentPrice = styled.span`
  font-size: 32px;
  font-weight: 700;
  color: #2C2C2C;
  margin-right: 16px;
`;

const OriginalPrice = styled.span`
  font-size: 24px;
  color: #999;
  text-decoration: line-through;
  margin-right: 16px;
`;

const Discount = styled.span`
  background: #E74C3C;
  color: #FFFFFF;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
`;

const Description = styled.div`
  color: #666;
  line-height: 1.6;
  margin-bottom: 40px;
  font-size: 16px;
`;

const OptionsSection = styled.div`
  margin-bottom: 40px;
`;

const OptionGroup = styled.div`
  margin-bottom: 24px;
`;

const OptionLabel = styled.label`
  display: block;
  font-weight: 600;
  color: #2C2C2C;
  margin-bottom: 12px;
  font-size: 16px;
`;

const OptionGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;

const OptionButton = styled.button<{ selected: boolean; variant?: 'size' | 'color' }>`
  padding: ${props => props.variant === 'size' ? '12px 20px' : '16px'};
  border: 2px solid ${props => props.selected ? '#D4AF37' : '#E0E0E0'};
  border-radius: 8px;
  background: ${props => props.selected ? '#D4AF37' : '#FFFFFF'};
  color: ${props => props.selected ? '#FFFFFF' : '#2C2C2C'};
  font-weight: 500;
  transition: all 0.3s ease;
  min-width: ${props => props.variant === 'size' ? '60px' : '40px'};
  cursor: pointer;
  
  &:hover {
    border-color: #D4AF37;
    transform: translateY(-2px);
  }
`;

const QuantitySection = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 32px;
`;

const QuantityLabel = styled.span`
  font-weight: 600;
  color: #2C2C2C;
`;

const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  border: 2px solid #E0E0E0;
  border-radius: 8px;
  padding: 8px 16px;
`;

const QuantityButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  font-weight: 600;
  color: #666;
  cursor: pointer;
  transition: color 0.3s ease;
  
  &:hover {
    color: #D4AF37;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const QuantityValue = styled.span`
  font-weight: 600;
  color: #2C2C2C;
  min-width: 30px;
  text-align: center;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 40px;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const AddToCartButton = styled(Button)`
  flex: 1;
`;

const WishlistButton = styled(Button)`
  flex: 0 0 auto;
  padding: 14px;
`;

const Features = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
  padding: 24px;
  background: #FAFAFA;
  border-radius: 12px;
`;

const Feature = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  color: #666;
`;

const FeatureIcon = styled.div`
  color: #D4AF37;
`;

const RelatedSection = styled.section`
  padding: 60px 0;
  border-top: 1px solid #E0E0E0;
`;

const SectionTitle = styled.h2`
  font-size: 32px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 40px;
  color: #2C2C2C;
`;

const RelatedGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 32px;
`;

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { dispatch } = useApp();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const foundProduct = products.find(p => p.id === id);
    if (foundProduct) {
      setProduct(foundProduct);
      setSelectedSize(foundProduct.sizes[0]);
      setSelectedColor(foundProduct.colors[0]);
    }
  }, [id]);

  if (!product) {
    return (
      <Container>
        <div style={{ padding: '120px 0', textAlign: 'center' }}>
          <h2>Product not found</h2>
          <Link to="/products">Back to Products</Link>
        </div>
      </Container>
    );
  }

  const handleAddToCart = () => {
    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        product,
        size: selectedSize,
        color: selectedColor,
        quantity
      }
    });
    
    dispatch({ type: 'TOGGLE_CART', payload: true });
  };

  const relatedProducts = products
    .filter(p => p.id !== product.id && p.category === product.category)
    .slice(0, 4);

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={20}
        fill={i < rating ? '#D4AF37' : 'none'}
        color={i < rating ? '#D4AF37' : '#E0E0E0'}
      />
    ));
  };

  return (
    <ProductContainer>
      <Container>
        <BackButton to="/products">
          <ArrowLeft size={20} />
          Back to Products
        </BackButton>

        <ProductLayout>
          <ImageSection>
            <MainImage 
              src={product.images[selectedImage]} 
              alt={product.name}
            />
            {product.images.length > 1 && (
              <ThumbnailGrid>
                {product.images.map((image, index) => (
                  <Thumbnail
                    key={index}
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    active={selectedImage === index}
                    onClick={() => setSelectedImage(index)}
                  />
                ))}
              </ThumbnailGrid>
            )}
          </ImageSection>

          <ProductInfo>
            <ProductHeader>
              <ProductCategory>{product.subcategory}</ProductCategory>
              <ProductTitle>{product.name}</ProductTitle>
              
              <ProductBadges>
                {product.newArrival && <Badge variant="primary">New Arrival</Badge>}
                {product.featured && <Badge variant="secondary">Featured</Badge>}
                {!product.inStock && <Badge variant="warning">Out of Stock</Badge>}
              </ProductBadges>

              <RatingSection>
                <Stars>{renderStars(Math.floor(product.rating))}</Stars>
                <RatingText>
                  {product.rating} ({product.reviews} reviews)
                </RatingText>
              </RatingSection>
            </ProductHeader>

            <PriceSection>
              <CurrentPrice>${product.price}</CurrentPrice>
              {product.originalPrice && (
                <>
                  <OriginalPrice>${product.originalPrice}</OriginalPrice>
                  <Discount>-{discountPercentage}% OFF</Discount>
                </>
              )}
            </PriceSection>

            <Description>
              {product.description}
            </Description>

            <OptionsSection>
              <OptionGroup>
                <OptionLabel>Size</OptionLabel>
                <OptionGrid>
                  {product.sizes.map(size => (
                    <OptionButton
                      key={size}
                      variant="size"
                      selected={selectedSize === size}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </OptionButton>
                  ))}
                </OptionGrid>
              </OptionGroup>

              <OptionGroup>
                <OptionLabel>Color</OptionLabel>
                <OptionGrid>
                  {product.colors.map(color => (
                    <OptionButton
                      key={color}
                      variant="color"
                      selected={selectedColor === color}
                      onClick={() => setSelectedColor(color)}
                      title={color}
                      style={{
                        background: selectedColor === color ? '#D4AF37' : '#E0E0E0',
                        minHeight: '40px'
                      }}
                    >
                      {color}
                    </OptionButton>
                  ))}
                </OptionGrid>
              </OptionGroup>
            </OptionsSection>

            <QuantitySection>
              <QuantityLabel>Quantity</QuantityLabel>
              <QuantityControl>
                <QuantityButton
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  −
                </QuantityButton>
                <QuantityValue>{quantity}</QuantityValue>
                <QuantityButton
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </QuantityButton>
              </QuantityControl>
            </QuantitySection>

            <ActionButtons>
              <AddToCartButton 
                onClick={handleAddToCart}
                disabled={!product.inStock}
              >
                <ShoppingBag size={20} />
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </AddToCartButton>
              <WishlistButton
                variant="outline"
                onClick={() => setIsWishlisted(!isWishlisted)}
              >
                <Heart 
                  size={20} 
                  fill={isWishlisted ? 'currentColor' : 'none'} 
                />
              </WishlistButton>
            </ActionButtons>

            <Features>
              <Feature>
                <FeatureIcon><Truck size={20} /></FeatureIcon>
                <span>Free shipping over $100</span>
              </Feature>
              <Feature>
                <FeatureIcon><RefreshCcw size={20} /></FeatureIcon>
                <span>30-day returns</span>
              </Feature>
              <Feature>
                <FeatureIcon><Shield size={20} /></FeatureIcon>
                <span>Secure payment</span>
              </Feature>
            </Features>
          </ProductInfo>
        </ProductLayout>

        {relatedProducts.length > 0 && (
          <RelatedSection>
            <SectionTitle>You May Also Like</SectionTitle>
            <RelatedGrid>
              {relatedProducts.map(relatedProduct => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </RelatedGrid>
          </RelatedSection>
        )}
      </Container>
    </ProductContainer>
  );
};

export default ProductDetail;