import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { Container, Button, Card } from '../styles/GlobalStyles';
import { loginUser } from '../utils/storage';
import { useApp } from '../contexts/AppContext';

const AuthContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 120px 20px 60px;
  background: linear-gradient(135deg, #FAFAFA, #F0F0F0);
`;

const AuthCard = styled(Card)`
  width: 100%;
  max-width: 480px;
  text-align: center;
`;

const AuthHeader = styled.div`
  margin-bottom: 40px;
`;

const AuthTitle = styled.h1`
  font-size: 32px;
  font-weight: 600;
  color: #2C2C2C;
  margin-bottom: 12px;
`;

const AuthSubtitle = styled.p`
  color: #666;
  font-size: 16px;
`;

const AuthForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-bottom: 32px;
`;

const InputGroup = styled.div`
  position: relative;
  text-align: left;
`;

const InputLabel = styled.label`
  display: block;
  font-weight: 500;
  color: #2C2C2C;
  margin-bottom: 8px;
`;

const InputWrapper = styled.div`
  position: relative;
`;

const InputIcon = styled.div`
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
  z-index: 1;
`;

const Input = styled.input`
  width: 100%;
  padding: 16px 16px 16px 48px;
  border: 2px solid #E0E0E0;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;
  background: #FFFFFF;
  
  &:focus {
    border-color: #D4AF37;
    box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
  }
  
  &::placeholder {
    color: #999;
  }
`;

const PasswordInput = styled(Input)`
  padding-right: 48px;
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  z-index: 1;
  
  &:hover {
    color: #666;
  }
`;

const ErrorMessage = styled.div`
  background: #FEE;
  color: #C53030;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  text-align: left;
  border: 1px solid #FED7D7;
`;

const SuccessMessage = styled.div`
  background: #F0FFF4;
  color: #22543D;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  text-align: left;
  border: 1px solid #C6F6D5;
`;

const ForgotPassword = styled(Link)`
  color: #D4AF37;
  text-decoration: none;
  font-size: 14px;
  
  &:hover {
    text-decoration: underline;
  }
`;

const AuthFooter = styled.div`
  text-align: center;
  padding-top: 24px;
  border-top: 1px solid #E0E0E0;
  color: #666;
`;

const AuthLink = styled(Link)`
  color: #D4AF37;
  text-decoration: none;
  font-weight: 500;
  
  &:hover {
    text-decoration: underline;
  }
`;

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { dispatch } = useApp();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Basic validation
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    // Simulate API delay
    setTimeout(() => {
      const success = loginUser(formData.email, formData.password);
      
      if (success) {
        // User is already saved in storage by loginUser function
        // We need to trigger a re-read of the user data
        const user = JSON.parse(localStorage.getItem('user') || 'null');
        dispatch({ type: 'SET_USER', payload: user });
        navigate('/');
      } else {
        setError('Invalid email or password');
      }
      
      setIsLoading(false);
    }, 1000);
  };

  return (
    <AuthContainer>
      <Container>
        <AuthCard>
          <AuthHeader>
            <AuthTitle>Welcome Back</AuthTitle>
            <AuthSubtitle>Sign in to your account to continue shopping</AuthSubtitle>
          </AuthHeader>

          <AuthForm onSubmit={handleSubmit}>
            {error && <ErrorMessage>{error}</ErrorMessage>}
            
            <InputGroup>
              <InputLabel>Email Address</InputLabel>
              <InputWrapper>
                <InputIcon>
                  <Mail size={20} />
                </InputIcon>
                <Input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </InputWrapper>
            </InputGroup>

            <InputGroup>
              <InputLabel>Password</InputLabel>
              <InputWrapper>
                <InputIcon>
                  <Lock size={20} />
                </InputIcon>
                <PasswordInput
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <PasswordToggle
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </PasswordToggle>
              </InputWrapper>
            </InputGroup>

            <Button type="submit" fullWidth size="large" disabled={isLoading}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </AuthForm>

          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <ForgotPassword to="/forgot-password">
              Forgot your password?
            </ForgotPassword>
          </div>

          <AuthFooter>
            Don't have an account?{' '}
            <AuthLink to="/register">Create one now</AuthLink>
          </AuthFooter>
        </AuthCard>
      </Container>
    </AuthContainer>
  );
};

export default Login;