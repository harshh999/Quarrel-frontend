import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { ArrowRight, Star, Truck, Shield, RefreshCcw } from 'lucide-react';
import { Container, Button, Card } from '../styles/GlobalStyles';
import ProductCard from '../components/ProductCard';
import { products } from '../data/products';

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const HeroSection = styled.section`
  position: relative;
  height: 100vh;
  min-height: 600px;
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.7),
    rgba(0, 0, 0, 0.5)
  ),
  url('/tshirt-9-couple.jpg');
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  color: #FFFFFF;
  overflow: hidden;
`;

const HeroContent = styled.div`
  max-width: 600px;
  animation: ${fadeInUp} 1s ease-out;
  
  @media (max-width: 768px) {
    text-align: center;
  }
`;

const HeroTitle = styled.h1`
  font-size: clamp(3rem, 8vw, 5rem);
  font-weight: 700;
  line-height: 1.1;
  margin-bottom: 24px;
  letter-spacing: -0.02em;
  
  span {
    color: #FF6B35;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 20px;
  opacity: 0.9;
  line-height: 1.6;
  margin-bottom: 32px;
  
  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

const HeroActions = styled.div`
  display: flex;
  gap: 20px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const FeaturesSection = styled.section`
  padding: 100px 0;
  background: #FFFFFF;
`;

const SectionTitle = styled.h2`
  font-size: 42px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 16px;
  color: #2C2C2C;
  
  @media (max-width: 768px) {
    font-size: 32px;
  }
`;

const SectionSubtitle = styled.p`
  font-size: 18px;
  text-align: center;
  margin-bottom: 60px;
  color: #666;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 40px;
  margin-top: 60px;
`;

const FeatureCard = styled(Card)`
  text-align: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    transform: translateY(-8px);
  }
`;

const FeatureIcon = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, #FF6B35, #E55A30);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #FFFFFF;
  margin-bottom: 24px;
`;

const FeatureTitle = styled.h3`
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #2C2C2C;
`;

const FeatureDescription = styled.p`
  color: #666;
  line-height: 1.6;
`;

const ProductsSection = styled.section`
  padding: 100px 0;
  background: #FAFAFA;
`;

const ProductsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 60px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 24px;
    text-align: center;
  }
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 32px;
  margin-bottom: 60px;
`;

const ViewAllButton = styled(Button)`
  margin: 0 auto;
  display: flex;
`;

const CategorySection = styled.section`
  padding: 100px 0;
  background: #FFFFFF;
`;

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 32px;
`;

const CategoryCard = styled(Link)`
  position: relative;
  height: 400px;
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  align-items: end;
  padding: 40px;
  color: #FFFFFF;
  background-size: cover;
  background-position: center;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
    transition: background 0.3s ease;
  }
  
  &:hover {
    transform: translateY(-8px);
    
    &::before {
      background: linear-gradient(to top, rgba(0, 0, 0, 0.5), transparent);
    }
  }
`;

const CategoryContent = styled.div`
  position: relative;
  z-index: 2;
`;

const CategoryName = styled.h3`
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 12px;
`;

const CategoryDescription = styled.p`
  font-size: 16px;
  opacity: 0.9;
  margin-bottom: 20px;
`;

const CategoryLink = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  color: #FF6B35;
  transition: gap 0.3s ease;
  
  ${CategoryCard}:hover & {
    gap: 12px;
  }
`;

const TestimonialSection = styled.section`
  padding: 100px 0;
  background: linear-gradient(135deg, #2C2C2C, #1A1A1A);
  color: #FFFFFF;
`;

const TestimonialGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 40px;
`;

const TestimonialCard = styled(Card)`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #FFFFFF;
  text-align: center;
`;

const TestimonialQuote = styled.p`
  font-size: 18px;
  line-height: 1.6;
  margin-bottom: 24px;
  font-style: italic;
`;

const TestimonialAuthor = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
`;

const AuthorAvatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #FF6B35, #E55A30);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
`;

const AuthorInfo = styled.div`
  text-align: left;
`;

const AuthorName = styled.div`
  font-weight: 600;
  margin-bottom: 4px;
`;

const AuthorRole = styled.div`
  font-size: 14px;
  opacity: 0.7;
`;

const StarRating = styled.div`
  display: flex;
  gap: 4px;
  margin-bottom: 20px;
  justify-content: center;
`;

const Home: React.FC = () => {
  const [featuredProducts] = useState(() => 
    products.filter(p => p.featured).slice(0, 6)
  );

  const features = [
    {
      icon: <Truck size={32} />,
      title: 'Free Shipping',
      description: 'Free shipping on orders over $100. Fast, reliable delivery to your doorstep.'
    },
    {
      icon: <Shield size={32} />,
      title: 'Secure Payment',
      description: 'Your payment information is secure with our encrypted checkout process.'
    },
    {
      icon: <RefreshCcw size={32} />,
      title: '30-Day Returns',
      description: 'Not satisfied? Return any item within 30 days for a full refund.'
    }
  ];

  const testimonials = [
    {
      quote: "The quality and unique designs of Quarrel's t-shirts are absolutely amazing. Each piece tells a story.",
      author: "Arjun Patel",
      role: "Graphic Designer",
      rating: 5
    },
    {
      quote: "Finally found a brand that matches my style. The prints are bold and the fabric quality is top-notch.",
      author: "Rohan Singh",
      role: "Creative Director", 
      rating: 5
    },
    {
      quote: "Love how Quarrel encourages me to express my individuality. See yourself unique - that's exactly what I do!",
      author: "Meera Sharma",
      role: "Fashion Blogger",
      rating: 5
    }
  ];

  return (
    <>
      <HeroSection>
        <Container>
          <HeroContent>
            <HeroTitle>
              See Yourself <span>Unique</span>
            </HeroTitle>
            <HeroSubtitle>
              Discover Quarrel's premium collection of unique printed t-shirts. Express your individuality with our bold designs and superior quality craftsmanship.
            </HeroSubtitle>
            <HeroActions>
              <Button size="large" as={Link} to="/products">
                Shop Collection
                <ArrowRight size={20} />
              </Button>
              <Button variant="outline" size="large" as={Link} to="/products?category=men">
                Explore Men's
              </Button>
            </HeroActions>
          </HeroContent>
        </Container>
      </HeroSection>

      <FeaturesSection>
        <Container>
          <FeaturesGrid>
            {features.map((feature, index) => (
              <FeatureCard key={index}>
                <FeatureIcon>
                  {feature.icon}
                </FeatureIcon>
                <FeatureTitle>{feature.title}</FeatureTitle>
                <FeatureDescription>{feature.description}</FeatureDescription>
              </FeatureCard>
            ))}
          </FeaturesGrid>
        </Container>
      </FeaturesSection>

      <ProductsSection>
        <Container>
          <ProductsHeader>
            <div>
              <SectionTitle>Featured Collection</SectionTitle>
              <SectionSubtitle>
                Handpicked pieces that define contemporary elegance and timeless appeal
              </SectionSubtitle>
            </div>
          </ProductsHeader>
          
          <ProductsGrid>
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </ProductsGrid>
          
          <ViewAllButton as={Link} to="/products">
            View All Products
            <ArrowRight size={18} />
          </ViewAllButton>
        </Container>
      </ProductsSection>

      <CategorySection>
        <Container>
          <SectionTitle>Shop by Category</SectionTitle>
          <SectionSubtitle>
            Explore our carefully curated collections for every occasion
          </SectionSubtitle>
          <CategoryGrid>
            <CategoryCard 
              to="/products?category=men"
              style={{
                backgroundImage: 'url(https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg)'
              }}
            >
              <CategoryContent>
                <CategoryName>Men's Collection</CategoryName>
                <CategoryDescription>
                  Modern essentials and timeless classics for him
                </CategoryDescription>
                <CategoryLink>
                  Explore Collection <ArrowRight size={16} />
                </CategoryLink>
              </CategoryContent>
            </CategoryCard>
            <CategoryCard 
              to="/products?category=women"
              style={{
                backgroundImage: 'url(https://images.pexels.com/photos/1707828/pexels-photo-1707828.jpeg)'
              }}
            >
              <CategoryContent>
                <CategoryName>Women's Collection</CategoryName>
                <CategoryDescription>
                  Elegant designs that celebrate femininity
                </CategoryDescription>
                <CategoryLink>
                  Explore Collection <ArrowRight size={16} />
                </CategoryLink>
              </CategoryContent>
            </CategoryCard>
          </CategoryGrid>
        </Container>
      </CategorySection>

      <TestimonialSection>
        <Container>
          <SectionTitle style={{ color: '#FFFFFF' }}>What Our Customers Say</SectionTitle>
          <SectionSubtitle style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            Join thousands of satisfied customers who choose Quarrel for unique, premium printed t-shirts
          </SectionSubtitle>
          
          <TestimonialGrid>
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index}>
                <StarRating>
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={20} fill="#FF6B35" color="#FF6B35" />
                  ))}
                </StarRating>
                <TestimonialQuote>"{testimonial.quote}"</TestimonialQuote>
                <TestimonialAuthor>
                  <AuthorAvatar>
                    {testimonial.author.split(' ').map(n => n[0]).join('')}
                  </AuthorAvatar>
                  <AuthorInfo>
                    <AuthorName>{testimonial.author}</AuthorName>
                    <AuthorRole>{testimonial.role}</AuthorRole>
                  </AuthorInfo>
                </TestimonialAuthor>
              </TestimonialCard>
            ))}
          </TestimonialGrid>
        </Container>
      </TestimonialSection>
    </>
  );
};

export default Home;