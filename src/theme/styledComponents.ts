import styled, { createGlobalStyle } from 'styled-components';
import { victorianTheme } from './victorianTheme';

// Global styles with Victorian inspiration
export const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Crimson+Text:wght@400;600&family=Cinzel:wght@400;500;600&family=Libre+Baskerville:wght@400;700&display=swap');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    font-family: ${victorianTheme.typography.bodyFont};
    background: linear-gradient(135deg, ${victorianTheme.colors.background} 0%, ${victorianTheme.colors.primary} 100%);
    color: ${victorianTheme.colors.textPrimary};
    line-height: 1.6;
    min-height: 100vh;
    overflow-x: hidden;
    
    // Victorian-style background pattern
    background-image: 
      radial-gradient(circle at 1px 1px, ${victorianTheme.colors.accent}20 1px, transparent 0);
    background-size: 40px 40px;
  }

  // Custom scrollbar with Victorian style
  ::-webkit-scrollbar {
    width: 12px;
  }

  ::-webkit-scrollbar-track {
    background: ${victorianTheme.colors.background};
    border-radius: 6px;
  }

  ::-webkit-scrollbar-thumb {
    background: linear-gradient(${victorianTheme.colors.secondary}, ${victorianTheme.colors.accent});
    border-radius: 6px;
    border: 2px solid ${victorianTheme.colors.background};
  }

  ::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(${victorianTheme.colors.accent}, ${victorianTheme.colors.gold});
  }

  // Selection color
  ::selection {
    background: ${victorianTheme.colors.accent}40;
    color: ${victorianTheme.colors.textPrimary};
  }
`;

// Victorian-style card component
export const VictorianCard = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'elevated',
})<{ elevated?: boolean }>`
  background: ${victorianTheme.colors.cardBg};
  border: 2px solid ${victorianTheme.colors.border};
  border-radius: ${victorianTheme.borderRadius.medium};
  padding: ${victorianTheme.spacing.lg};
  position: relative;
  transition: all ${victorianTheme.transitions.normal};
  
  // Victorian-style border decoration
  &::before {
    content: '';
    position: absolute;
    top: -1px;
    left: -1px;
    right: -1px;
    bottom: -1px;
    background: linear-gradient(45deg, ${victorianTheme.colors.accent}, ${victorianTheme.colors.gold});
    border-radius: ${victorianTheme.borderRadius.medium};
    z-index: -1;
    opacity: 0;
    transition: opacity ${victorianTheme.transitions.normal};
  }
  
  &:hover::before {
    opacity: ${props => props.elevated ? '0.3' : '0.1'};
  }
  
  box-shadow: ${props => props.elevated ? victorianTheme.shadows.large : victorianTheme.shadows.medium};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${victorianTheme.shadows.large}, ${victorianTheme.shadows.glow};
  }
`;

// Victorian-style button
export const VictorianButton = styled.button.withConfig({
  shouldForwardProp: (prop) => !['variant', 'size'].includes(prop),
})<{ 
  variant?: 'primary' | 'secondary' | 'accent' | 'outline';
  size?: 'small' | 'medium' | 'large';
}>`
  font-family: ${victorianTheme.typography.decorativeFont};
  font-weight: ${victorianTheme.typography.semibold};
  font-size: ${props => {
    switch (props.size) {
      case 'small': return victorianTheme.typography.small;
      case 'large': return victorianTheme.typography.h5;
      default: return victorianTheme.typography.body;
    }
  }};
  
  padding: ${props => {
    switch (props.size) {
      case 'small': return `${victorianTheme.spacing.sm} ${victorianTheme.spacing.md}`;
      case 'large': return `${victorianTheme.spacing.lg} ${victorianTheme.spacing.xl}`;
      default: return `${victorianTheme.spacing.md} ${victorianTheme.spacing.lg}`;
    }
  }};
  
  border: 2px solid;
  border-radius: ${victorianTheme.borderRadius.medium};
  cursor: pointer;
  position: relative;
  transition: all ${victorianTheme.transitions.normal};
  text-transform: uppercase;
  letter-spacing: 1px;
  
  ${props => {
    switch (props.variant) {
      case 'secondary':
        return `
          background: ${victorianTheme.colors.secondary};
          color: ${victorianTheme.colors.textPrimary};
          border-color: ${victorianTheme.colors.secondary};
          
          &:hover {
            background: ${victorianTheme.colors.accent};
            border-color: ${victorianTheme.colors.accent};
            box-shadow: ${victorianTheme.shadows.glow};
          }
        `;
      case 'accent':
        return `
          background: ${victorianTheme.colors.accent};
          color: ${victorianTheme.colors.primary};
          border-color: ${victorianTheme.colors.accent};
          
          &:hover {
            background: ${victorianTheme.colors.gold};
            border-color: ${victorianTheme.colors.gold};
            box-shadow: ${victorianTheme.shadows.glow};
          }
        `;
      case 'outline':
        return `
          background: transparent;
          color: ${victorianTheme.colors.accent};
          border-color: ${victorianTheme.colors.accent};
          
          &:hover {
            background: ${victorianTheme.colors.accent};
            color: ${victorianTheme.colors.primary};
            box-shadow: ${victorianTheme.shadows.glow};
          }
        `;
      default: // primary
        return `
          background: linear-gradient(135deg, ${victorianTheme.colors.primary}, ${victorianTheme.colors.secondary});
          color: ${victorianTheme.colors.textPrimary};
          border-color: ${victorianTheme.colors.border};
          
          &:hover {
            background: linear-gradient(135deg, ${victorianTheme.colors.secondary}, ${victorianTheme.colors.accent});
            border-color: ${victorianTheme.colors.accent};
            box-shadow: ${victorianTheme.shadows.glow};
          }
        `;
    }
  }}
  
  &:active {
    transform: translateY(1px);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    
    &:hover {
      transform: none;
      box-shadow: none;
    }
  }
`;

// Victorian-style input
export const VictorianInput = styled.input`
  font-family: ${victorianTheme.typography.bodyFont};
  font-size: ${victorianTheme.typography.body};
  padding: ${victorianTheme.spacing.md};
  border: 2px solid ${victorianTheme.colors.border};
  border-radius: ${victorianTheme.borderRadius.medium};
  background: ${victorianTheme.colors.surface};
  color: ${victorianTheme.colors.textPrimary};
  width: 100%;
  transition: all ${victorianTheme.transitions.normal};
  
  &::placeholder {
    color: ${victorianTheme.colors.textMuted};
    font-style: italic;
  }
  
  &:focus {
    outline: none;
    border-color: ${victorianTheme.colors.accent};
    box-shadow: 0 0 0 3px ${victorianTheme.colors.accent}20;
    background: ${victorianTheme.colors.cardBg};
  }
  
  &:hover:not(:focus) {
    border-color: ${victorianTheme.colors.secondary};
  }
`;

// Victorian-style textarea
export const VictorianTextarea = styled.textarea`
  font-family: ${victorianTheme.typography.bodyFont};
  font-size: ${victorianTheme.typography.body};
  padding: ${victorianTheme.spacing.md};
  border: 2px solid ${victorianTheme.colors.border};
  border-radius: ${victorianTheme.borderRadius.medium};
  background: ${victorianTheme.colors.surface};
  color: ${victorianTheme.colors.textPrimary};
  width: 100%;
  min-height: 120px;
  resize: vertical;
  transition: all ${victorianTheme.transitions.normal};
  
  &::placeholder {
    color: ${victorianTheme.colors.textMuted};
    font-style: italic;
  }
  
  &:focus {
    outline: none;
    border-color: ${victorianTheme.colors.accent};
    box-shadow: 0 0 0 3px ${victorianTheme.colors.accent}20;
    background: ${victorianTheme.colors.cardBg};
  }
  
  &:hover:not(:focus) {
    border-color: ${victorianTheme.colors.secondary};
  }
`;

// Victorian-style heading
export const VictorianHeading = styled.h1.withConfig({
  shouldForwardProp: (prop) => !['level', 'decorative'].includes(prop),
})<{ level?: 1 | 2 | 3 | 4 | 5 | 6; decorative?: boolean }>`
  font-family: ${props => props.decorative ? victorianTheme.typography.decorativeFont : victorianTheme.typography.primaryFont};
  font-weight: ${victorianTheme.typography.bold};
  color: ${victorianTheme.colors.textPrimary};
  margin-bottom: ${victorianTheme.spacing.md};
  text-shadow: 2px 2px 4px ${victorianTheme.colors.shadow};
  
  font-size: ${props => {
    switch (props.level) {
      case 2: return victorianTheme.typography.h2;
      case 3: return victorianTheme.typography.h3;
      case 4: return victorianTheme.typography.h4;
      case 5: return victorianTheme.typography.h5;
      case 6: return victorianTheme.typography.h6;
      default: return victorianTheme.typography.h1;
    }
  }};
  
  ${props => props.decorative && `
    background: linear-gradient(135deg, ${victorianTheme.colors.accent}, ${victorianTheme.colors.gold});
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-align: center;
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      bottom: -8px;
      left: 50%;
      transform: translateX(-50%);
      width: 100px;
      height: 2px;
      background: linear-gradient(90deg, transparent, ${victorianTheme.colors.accent}, transparent);
    }
  `}
`;

// Victorian-style container
export const VictorianContainer = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'maxWidth',
})<{ maxWidth?: string }>`
  max-width: ${props => props.maxWidth || '1200px'};
  margin: 0 auto;
  padding: 0 ${victorianTheme.spacing.lg};
  
  @media (max-width: ${victorianTheme.breakpoints.mobile}) {
    padding: 0 ${victorianTheme.spacing.md};
  }
`;

// Loading spinner with Victorian style
export const VictorianSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid ${victorianTheme.colors.border};
  border-top: 3px solid ${victorianTheme.colors.accent};
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: ${victorianTheme.spacing.lg} auto;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

// Victorian-style modal overlay
export const VictorianModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: ${victorianTheme.spacing.lg};
`;

export const VictorianModal = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'maxWidth',
})<{ maxWidth?: string }>`
  background: ${victorianTheme.colors.cardBg};
  border: 2px solid ${victorianTheme.colors.accent};
  border-radius: ${victorianTheme.borderRadius.large};
  padding: ${victorianTheme.spacing.xl};
  max-width: ${props => props.maxWidth || '500px'};
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: ${victorianTheme.shadows.large}, ${victorianTheme.shadows.glow};
`;
