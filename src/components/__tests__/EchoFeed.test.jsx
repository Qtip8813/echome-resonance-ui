import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import EchoFeed from '../EchoFeed';

describe('EchoFeed', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Rendering', () => {
    it('renders the feed header', () => {
      render(<EchoFeed />);
      expect(screen.getByText('Echo Feed')).toBeInTheDocument();
    });

    it('renders tab navigation', () => {
      render(<EchoFeed />);
      expect(screen.getByText('Feed')).toBeInTheDocument();
      expect(screen.getByText('Profile')).toBeInTheDocument();
    });

    it('renders initial echo signals', () => {
      render(<EchoFeed />);
      expect(screen.getByText('@quantum_observer')).toBeInTheDocument();
      expect(screen.getByText('@field_walker')).toBeInTheDocument();
      expect(screen.getByText('@void_dancer')).toBeInTheDocument();
      expect(screen.getByText('@echo_present')).toBeInTheDocument();
    });

    it('renders input area', () => {
      render(<EchoFeed />);
      expect(screen.getByPlaceholderText('Transmit your resonance...')).toBeInTheDocument();
    });

    it('shows FlipTok badge when variant is fliptok', () => {
      render(<EchoFeed variant="fliptok" />);
      expect(screen.getByText('FlipTok')).toBeInTheDocument();
    });

    it('does not show FlipTok badge for classic variant', () => {
      render(<EchoFeed variant="classic" />);
      expect(screen.queryByText('FlipTok')).not.toBeInTheDocument();
    });
  });

  describe('Field Sync', () => {
    it('displays field sync status', () => {
      render(<EchoFeed />);
      // Use getAllByText since "Field Sync" appears in both header and content
      expect(screen.getAllByText(/Field Sync:/i).length).toBeGreaterThan(0);
    });

    it('toggles field sync status', () => {
      render(<EchoFeed />);
      expect(screen.getByText('Field Sync: Active')).toBeInTheDocument();

      act(() => {
        vi.advanceTimersByTime(2000);
      });

      expect(screen.getByText('Field Sync: Syncing...')).toBeInTheDocument();
    });
  });

  describe('Signal Interactions', () => {
    it('reveals hidden content when clicking Reveal button', () => {
      render(<EchoFeed />);

      // First signal is hidden by default
      const revealButtons = screen.getAllByText('Reveal');
      fireEvent.click(revealButtons[0]);

      // Should now show Hide button
      expect(screen.getAllByText('Hide').length).toBeGreaterThan(0);
    });

    it('increments resonance when clicking Resonate button', () => {
      render(<EchoFeed />);

      // Get initial resonance count for first signal (42)
      expect(screen.getByText('⚡ 42')).toBeInTheDocument();

      const resonateButtons = screen.getAllByText('Resonate');
      fireEvent.click(resonateButtons[0]);

      // Should now show 43
      expect(screen.getByText('⚡ 43')).toBeInTheDocument();
    });
  });

  describe('Creating Signals', () => {
    it('clears input after creating a signal', () => {
      render(<EchoFeed />);

      const input = screen.getByPlaceholderText('Transmit your resonance...');
      fireEvent.change(input, { target: { value: 'Test signal' } });

      const buttons = document.querySelectorAll('button');
      const sendBtn = buttons[buttons.length - 1];
      fireEvent.click(sendBtn);

      expect(input.value).toBe('');
    });

    it('disables send button when input is empty', () => {
      render(<EchoFeed />);

      const buttons = document.querySelectorAll('button');
      const sendBtn = buttons[buttons.length - 1];

      expect(sendBtn).toBeDisabled();
    });
  });

  describe('Recording', () => {
    it('toggles recording state', () => {
      render(<EchoFeed />);

      // Find the mic button (second to last button)
      const buttons = document.querySelectorAll('button');
      const micBtn = buttons[buttons.length - 2];

      fireEvent.click(micBtn);

      // After 2 seconds, recording should stop and text should appear
      act(() => {
        vi.advanceTimersByTime(2000);
      });

      const input = screen.getByPlaceholderText('Transmit your resonance...');
      expect(input.value).toBe('Quantum thought captured...');
    });
  });

  describe('Tab Navigation', () => {
    it('switches to profile tab when clicked', () => {
      render(<EchoFeed />);

      fireEvent.click(screen.getByText('Profile'));

      expect(screen.getByText('Original Signal Source')).toBeInTheDocument();
    });

    it('shows profile stats', () => {
      render(<EchoFeed />);

      fireEvent.click(screen.getByText('Profile'));

      expect(screen.getByText('Resonance')).toBeInTheDocument();
      expect(screen.getByText('Signals')).toBeInTheDocument();
      expect(screen.getByText('Field Sync')).toBeInTheDocument();
    });
  });

  describe('Resonance Score', () => {
    it('displays initial resonance score', () => {
      render(<EchoFeed />);
      expect(screen.getByText('Resonance: 42')).toBeInTheDocument();
    });

    it('may increment resonance score over time', () => {
      // Mock Math.random to always return > 0.7
      vi.spyOn(Math, 'random').mockReturnValue(0.8);

      render(<EchoFeed />);

      act(() => {
        vi.advanceTimersByTime(3000);
      });

      expect(screen.getByText('Resonance: 43')).toBeInTheDocument();

      vi.spyOn(Math, 'random').mockRestore();
    });
  });
});
