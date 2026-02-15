import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from '../App';

// Mock window.open
const mockWindowOpen = vi.fn();
Object.defineProperty(window, 'open', {
  value: mockWindowOpen,
  writable: true,
});

describe('App', () => {
  beforeEach(() => {
    mockWindowOpen.mockClear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Rendering', () => {
    it('renders the app header', () => {
      render(<App />);
      expect(screen.getByText(/EchoMe Resonance/i)).toBeInTheDocument();
    });

    it('renders the tagline', () => {
      render(<App />);
      expect(screen.getByText(/QRFT-powered audio-to-visual AI for creators/i)).toBeInTheDocument();
    });

    it('renders the footer', () => {
      render(<App />);
      expect(screen.getByText(/Rod's AI Consulting LLC/i)).toBeInTheDocument();
    });

    it('renders LegacyQuotes component', () => {
      render(<App />);
      expect(screen.getByText(/Life's nothing but a game/i)).toBeInTheDocument();
    });
  });

  describe('Tab Navigation', () => {
    it('renders all main navigation tabs', () => {
      render(<App />);
      expect(screen.getByText('Conversation Hub')).toBeInTheDocument();
      expect(screen.getByText('Echo Feed')).toBeInTheDocument();
      expect(screen.getByText('FlipTok')).toBeInTheDocument();
    });

    it('shows ConversationHub by default', () => {
      render(<App />);
      // ConversationHub has AI Model selector
      expect(screen.getByText('AI Model')).toBeInTheDocument();
    });

    it('switches to Echo Feed when tab is clicked', () => {
      render(<App />);
      fireEvent.click(screen.getByText('Echo Feed'));
      expect(screen.getByText('@quantum_observer')).toBeInTheDocument();
    });

    it('switches to FlipTok when tab is clicked', () => {
      render(<App />);
      fireEvent.click(screen.getByText('FlipTok'));
      // FlipTok variant shows the FlipTok badge
      expect(screen.getAllByText('FlipTok').length).toBeGreaterThan(0);
    });
  });

  describe('Free Tier Behavior', () => {
    it('does not show trial complete message initially', () => {
      render(<App />);
      expect(screen.queryByText(/Free trial complete/i)).not.toBeInTheDocument();
    });

    it('shows ConversationHub when exports used is less than 3', () => {
      render(<App />);
      expect(screen.getByText('AI Model')).toBeInTheDocument();
      expect(screen.queryByText(/Go Pro for Unlimited/i)).not.toBeInTheDocument();
    });
  });

  describe('Pro Upgrade Flow', () => {
    it('initially does not show Pro upgrade prompt', () => {
      render(<App />);
      expect(screen.queryByText(/Unlock Pro/i)).not.toBeInTheDocument();
    });
  });

  describe('Gradient and Styling', () => {
    it('renders with proper container structure', () => {
      const { container } = render(<App />);
      const gradientDiv = container.querySelector('.bg-gradient-to-br');
      expect(gradientDiv).toBeInTheDocument();
    });
  });
});
