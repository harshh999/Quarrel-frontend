import styled, { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
  
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    background-color: #FAFAFA;
    color: #2C2C2C;
    line-height: 1.6;
    overflow-x: hidden;
  }

  html {
    scroll-behavior: smooth;
  }

  button {
    font-family: inherit;
    cursor: pointer;
    border: none;
    outline: none;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  input, textarea {
    font-family: inherit;
    border: none;
    outline: none;
  }

  // Scrollbar styles
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: #F5F5F5;
  }

  ::-webkit-scrollbar-thumb {
    background: #FF6B35;
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #E55A30;
  }
`;

export const Container = styled.div<{ maxWidth?: string }>`
  max-width: ${props => props.maxWidth || '1200px'};
  margin: 0 auto;
  padding: 0 20px;
  
  @media (max-width: 768px) {
    padding: 0 16px;
  }
`;

export const Button = styled.button<{ 
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  
  ${props => {
    switch (props.size) {
      case 'small':
        return 'padding: 8px 16px; font-size: 14px;';
      case 'large':
        return 'padding: 16px 32px; font-size: 16px;';
      default:
        return 'padding: 12px 24px; font-size: 15px;';
    }
  }}

  ${props => {
    switch (props.variant) {
      case 'secondary':
        return `
          background-color: #F5F5F5;
          color: #2C2C2C;
          
          &:hover {
            background-color: #EEEEEE;
            transform: translateY(-2px);
          }
        `;
      case 'outline':
        return `
          background-color: transparent;
          color: #FFFFFF;
          border: 2px solid #FF6B35;
          
          &:hover {
            background-color: #FF6B35;
            color: #FFFFFF;
            transform: translateY(-2px);
          }
        `;
      case 'ghost':
        return `
          background-color: transparent;
          color: #2C2C2C;
          
          &:hover {
            background-color: #F5F5F5;
          }
        `;
      default:
        return `
          background-color: #FF6B35;
          color: #FFFFFF;
          
          &:hover {
            background-color: #E55A30;
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(255, 107, 53, 0.3);
          }
        `;
    }
  }}

  ${props => props.fullWidth && 'width: 100%;'}

  &:active {
    transform: translateY(0);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }

  &:hover::before {
    left: 100%;
  }
`;

export const LoadingSpinner = styled.div<{ size?: number }>`
  width: ${props => props.size || 24}px;
  height: ${props => props.size || 24}px;
  border: 2px solid #E0E0E0;
  border-top: 2px solid #D4AF37;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

export const SkeletonLoader = styled.div<{ width?: string; height?: string; borderRadius?: string }>`
  background: linear-gradient(90deg, #F0F0F0 25%, #E0E0E0 50%, #F0F0F0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: ${props => props.borderRadius || '4px'};
  width: ${props => props.width || '100%'};
  height: ${props => props.height || '20px'};

  @keyframes loading {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`;

export const Card = styled.div<{ padding?: string; hover?: boolean }>`
  background: #FFFFFF;
  border-radius: 12px;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.08);
  padding: ${props => props.padding || '20px'};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  ${props => props.hover && `
    &:hover {
      transform: translateY(-8px);
      box-shadow: 0 8px 40px rgba(0, 0, 0, 0.12);
    }
  `}
`;

export const Badge = styled.span<{ variant?: 'primary' | 'secondary' | 'success' | 'warning' }>`
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  ${props => {
    switch (props.variant) {
      case 'secondary':
        return 'background-color: #F5F5F5; color: #2C2C2C;';
      case 'success':
        return 'background-color: #E8F5E8; color: #2D5A2D;';
      case 'warning':
        return 'background-color: #FFF4E6; color: #CC7A00;';
      default:
        return 'background-color: #D4AF37; color: #FFFFFF;';
    }
  }}
`;