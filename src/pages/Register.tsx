import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { Container, Button, Card } from '../styles/GlobalStyles';
import { registerUser } from '../utils/storage';
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

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
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

const PasswordStrength = styled.div<{ strength: number }>`
  margin-top: 8px;
`;

const StrengthBar = styled.div`
  height: 4px;
  background: #E0E0E0;
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 4px;
`;

const StrengthFill = styled.div<{ width: number; color: string }>`
  height: 100%;
  width: ${props => props.width}%;
  background: ${props => props.color};
  transition: all 0.3s ease;
`;

const StrengthText = styled.span<{ color: string }>`
  font-size: 12px;
  color: ${props => props.color};
  font-weight: 500;
`;

const TermsText = styled.div`
  font-size: 14px;
  color: #666;
  text-align: left;
  line-height: 1.5;
  
  a {
    color: #D4AF37;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
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

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
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
    setSuccess('');
  };

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    let feedback = '';
    let color = '#E53E3E';

    if (password.length >= 8) strength += 25;
    if (password.match(/[a-z]/)) strength += 25;
    if (password.match(/[A-Z]/)) strength += 25;
    if (password.match(/[0-9]/) || password.match(/[^a-zA-Z0-9]/)) strength += 25;

    if (strength < 25) {
      feedback = 'Weak';
      color = '#E53E3E';
    } else if (strength < 50) {
      feedback = 'Fair';
      color = '#DD6B20';
    } else if (strength < 75) {
      feedback = 'Good';
      color = '#D69E2E';
    } else {
      feedback = 'Strong';
      color = '#38A169';
    }

    return { strength, feedback, color };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    // Validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      setIsLoading(false);
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    // Simulate API delay
    setTimeout(() => {
      const success = registerUser(
        formData.email,
        formData.password,
        formData.firstName,
        formData.lastName
      );
      
      if (success) {
        setSuccess('Account created successfully! Redirecting...');
        // User is already saved in storage by registerUser function
        const user = JSON.parse(localStorage.getItem('user') || 'null');
        dispatch({ type: 'SET_USER', payload: user });
        
        setTimeout(() => {
          navigate('/');
        }, 1500);
      } else {
        setError('An account with this email already exists');
      }
      
      setIsLoading(false);
    }, 1000);
  };

  return (
    <AuthContainer>
      <Container>
        <AuthCard>
          <AuthHeader>
            <AuthTitle>Create Account</AuthTitle>
            <AuthSubtitle>Join LUXE and discover premium fashion</AuthSubtitle>
          </AuthHeader>

          <AuthForm onSubmit={handleSubmit}>
            {error && <ErrorMessage>{error}</ErrorMessage>}
            {success && <SuccessMessage>{success}</SuccessMessage>}
            
            <FormRow>
              <InputGroup>
                <InputLabel>First Name</InputLabel>
                <InputWrapper>
                  <InputIcon>
                    <User size={20} />
                  </InputIcon>
                  <Input
                    type="text"
                    name="firstName"
                    placeholder="First name"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </InputWrapper>
              </InputGroup>

              <InputGroup>
                <InputLabel>Last Name</InputLabel>
                <InputWrapper>
                  <InputIcon>
                    <User size={20} />
                  </InputIcon>
                  <Input
                    type="text"
                    name="lastName"
                    placeholder="Last name"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </InputWrapper>
              </InputGroup>
            </FormRow>

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
                  placeholder="Create a password"
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
              {formData.password && (
                <PasswordStrength strength={passwordStrength.strength}>
                  <StrengthBar>
                    <StrengthFill width={passwordStrength.strength} color={passwordStrength.color} />
                  </StrengthBar>
                  <StrengthText color={passwordStrength.color}>
                    {passwordStrength.feedback}
                  </StrengthText>
                </PasswordStrength>
              )}
            </InputGroup>

            <InputGroup>
              <InputLabel>Confirm Password</InputLabel>
              <InputWrapper>
                <InputIcon>
                  <Lock size={20} />
                </InputIcon>
                <PasswordInput
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <PasswordToggle
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </PasswordToggle>
              </InputWrapper>
            </InputGroup>

            <TermsText>
              By creating an account, you agree to our{' '}
              <Link to="/terms">Terms of Service</Link> and{' '}
              <Link to="/privacy">Privacy Policy</Link>.
            </TermsText>

            <Button type="submit" fullWidth size="large" disabled={isLoading}>
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </AuthForm>

          <AuthFooter>
            Already have an account?{' '}
            <AuthLink to="/login">Sign in instead</AuthLink>
          </AuthFooter>
        </AuthCard>
      </Container>
    </AuthContainer>
  );
};

export default Register;