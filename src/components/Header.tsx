import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { Search, ShoppingBag, User, Menu, X } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { Container } from '../styles/GlobalStyles';
import { removeUser } from '../utils/storage';

const HeaderWrapper = styled.header<{ scrolled: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: ${props => props.scrolled ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.9)'};
  backdrop-filter: blur(20px);
  border-bottom: 1px solid ${props => props.scrolled ? '#E0E0E0' : 'transparent'};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 80px;
  
  @media (max-width: 768px) {
    height: 70px;
  }
`;


const Logo = styled(Link)`
  display: flex;
  align-items: center;
  height: 64px;
  /* Remove font styles since we use an image */
`;

const LogoImg = styled.img`
  height: 64px;
  width: 64px;
  object-fit: contain;
  transform: scale(1.25); /* Zoom in effect */
  @media (max-width: 768px) {
    height: 48px;
    width: 48px;
  }
`;

const Nav = styled.nav<{ isOpen: boolean }>`
  display: flex;
  align-items: center;
  gap: 40px;
  
  @media (max-width: 768px) {
    position: fixed;
    top: 70px;
    left: 0;
    right: 0;
    background: rgba(255, 255, 255, 0.98);
    backdrop-filter: blur(20px);
    flex-direction: column;
    padding: 40px 20px;
    transform: translateY(${props => props.isOpen ? '0' : '-100%'});
    opacity: ${props => props.isOpen ? '1' : '0'};
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    gap: 30px;
  }
`;

const NavLink = styled(Link)<{ active: boolean }>`
  font-weight: 500;
  color: ${props => props.active ? '#D4AF37' : '#2C2C2C'};
  transition: color 0.3s ease;
  position: relative;
  cursor: pointer;
  text-decoration: none;
  display: block;
  padding: 8px 0;
  
  &:hover {
    color: #D4AF37;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: ${props => props.active ? '100%' : '0'};
    height: 2px;
    background-color: #D4AF37;
    transition: width 0.3s ease;
  }
  
  &:hover::after {
    width: 100%;
  }
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const SearchContainer = styled.div<{ isOpen: boolean }>`
  position: relative;
  
  @media (max-width: 768px) {
    position: ${props => props.isOpen ? 'fixed' : 'relative'};
    top: ${props => props.isOpen ? '80px' : 'auto'};
    left: ${props => props.isOpen ? '20px' : 'auto'};
    right: ${props => props.isOpen ? '20px' : 'auto'};
    z-index: ${props => props.isOpen ? '1001' : 'auto'};
  }
`;

const SearchInput = styled.input<{ isOpen: boolean }>`
  width: ${props => props.isOpen ? '300px' : '0'};
  padding: ${props => props.isOpen ? '12px 40px 12px 16px' : '0'};
  border: 2px solid ${props => props.isOpen ? '#E0E0E0' : 'transparent'};
  border-radius: 25px;
  background: #FFFFFF;
  font-size: 14px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: ${props => props.isOpen ? '1' : '0'};
  
  &:focus {
    border-color: #D4AF37;
  }
  
  @media (max-width: 768px) {
    width: ${props => props.isOpen ? '100%' : '0'};
  }
`;

const SearchButton = styled.button`
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  padding: 12px;
  color: #666;
  transition: color 0.3s ease;
  
  &:hover {
    color: #D4AF37;
  }
`;

const CartButton = styled.button`
  position: relative;
  background: none;
  padding: 12px;
  color: #2C2C2C;
  transition: all 0.3s ease;
  border-radius: 8px;
  
  &:hover {
    background-color: #F5F5F5;
    color: #D4AF37;
  }
`;

const CartBadge = styled.span`
  position: absolute;
  top: 6px;
  right: 6px;
  background: #D4AF37;
  color: #FFFFFF;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
`;

const UserMenu = styled.div`
  position: relative;
`;

const UserButton = styled.button`
  background: none;
  padding: 12px;
  color: #2C2C2C;
  transition: all 0.3s ease;
  border-radius: 8px;
  
  &:hover {
    background-color: #F5F5F5;
    color: #D4AF37;
  }
`;

const UserDropdown = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  background: #FFFFFF;
  border-radius: 12px;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.12);
  min-width: 200px;
  opacity: ${props => props.isOpen ? '1' : '0'};
  transform: translateY(${props => props.isOpen ? '0' : '-10px'});
  pointer-events: ${props => props.isOpen ? 'auto' : 'none'};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1002;
  
  a, button {
    display: block;
    width: 100%;
    padding: 12px 20px;
    text-align: left;
    color: #2C2C2C;
    transition: background-color 0.3s ease;
    
    &:hover {
      background-color: #F5F5F5;
    }
    
    &:first-child {
      border-radius: 12px 12px 0 0;
    }
    
    &:last-child {
      border-radius: 0 0 12px 12px;
    }
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  padding: 12px;
  color: #2C2C2C;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const Header: React.FC = () => {
  const { state, dispatch } = useApp();
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (userMenuOpen && !target.closest('[data-user-menu]')) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [userMenuOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (state.searchQuery.trim()) {
      navigate('/products');
      setSearchOpen(false);
    }
  };

  const handleLogout = () => {
    removeUser();
    dispatch({ type: 'SET_USER', payload: null });
    dispatch({ type: 'CLEAR_CART' });
    setUserMenuOpen(false);
    navigate('/');
  };

  const cartItemCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);

  // Get current category from URL params
  const searchParams = new URLSearchParams(location.search);
  const currentCategory = searchParams.get('category');

  return (
    <HeaderWrapper scrolled={isScrolled}>
      <Container>
        <HeaderContent>
          <Logo to="/">
            <LogoImg src="/quarrel-logo.png" alt="Quarrel Logo" />
          </Logo>
          
          <Nav isOpen={mobileMenuOpen}>
            <NavLink to="/" active={location.pathname === '/'}>
              Home
            </NavLink>
            <NavLink 
              to="/products?category=men" 
              active={location.pathname === '/products' && currentCategory === 'men'}
              onClick={() => {
                setMobileMenuOpen(false);
                console.log('Men link clicked');
              }}
            >
              Men
            </NavLink>
            <NavLink 
              to="/products?category=women" 
              active={location.pathname === '/products' && currentCategory === 'women'}
              onClick={() => {
                setMobileMenuOpen(false);
                console.log('Women link clicked');
              }}
            >
              Women
            </NavLink>
            
          </Nav>

          <Actions>
            <SearchContainer isOpen={searchOpen}>
              <form onSubmit={handleSearch}>
                <SearchInput
                  isOpen={searchOpen}
                  value={state.searchQuery}
                  onChange={(e) => dispatch({ type: 'SET_SEARCH_QUERY', payload: e.target.value })}
                  placeholder="Search products..."
                />
              </form>
              <SearchButton
                type="button"
                onClick={() => setSearchOpen(!searchOpen)}
              >
                <Search size={20} />
              </SearchButton>
            </SearchContainer>

            <CartButton onClick={() => dispatch({ type: 'TOGGLE_CART' })}>
              <ShoppingBag size={24} />
              {cartItemCount > 0 && <CartBadge>{cartItemCount}</CartBadge>}
            </CartButton>

            <UserMenu data-user-menu>
              <UserButton onClick={() => setUserMenuOpen(!userMenuOpen)}>
                <User size={24} />
              </UserButton>
              <UserDropdown isOpen={userMenuOpen}>
                {state.user ? (
                  <>
                    <Link to="/profile" onClick={() => setUserMenuOpen(false)}>
                      My Profile
                    </Link>
                    <Link to="/orders" onClick={() => setUserMenuOpen(false)}>
                      My Orders
                    </Link>
                    <button onClick={handleLogout}>
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setUserMenuOpen(false)}>
                      Login
                    </Link>
                    <Link to="/register" onClick={() => setUserMenuOpen(false)}>
                      Sign Up
                    </Link>
                  </>
                )}
              </UserDropdown>
            </UserMenu>

            <MobileMenuButton onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </MobileMenuButton>
          </Actions>
        </HeaderContent>
      </Container>
    </HeaderWrapper>
  );
};

export default Header;