import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import LegacyQuotes from '../LegacyQuotes';

describe('LegacyQuotes', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Rendering', () => {
    it('renders the first quote initially', () => {
      render(<LegacyQuotes />);
      expect(
        screen.getByText(
          /"Life's nothing but a game son and it's all how you play to get the life you want."/
        )
      ).toBeInTheDocument();
    });

    it('renders the first author', () => {
      render(<LegacyQuotes />);
      expect(screen.getByText('— R.L.A. Sr.')).toBeInTheDocument();
    });
  });

  describe('Quote Rotation', () => {
    it('transitions to the next quote after 8 seconds', () => {
      render(<LegacyQuotes />);

      // Initial quote
      expect(screen.getByText(/Life's nothing but a game/)).toBeInTheDocument();

      // Advance time to trigger transition
      act(() => {
        vi.advanceTimersByTime(8000);
      });

      // Wait for transition animation (500ms)
      act(() => {
        vi.advanceTimersByTime(500);
      });

      // Should now show second quote
      expect(
        screen.getByText(
          /"Your perception of your perspective is an illusion of your reality."/
        )
      ).toBeInTheDocument();
      expect(screen.getByText('— R.L.A. Jr.')).toBeInTheDocument();
    });

    it('cycles back to the first quote', () => {
      render(<LegacyQuotes />);

      // Advance through both quotes
      act(() => {
        vi.advanceTimersByTime(8000);
      });
      act(() => {
        vi.advanceTimersByTime(500);
      });
      act(() => {
        vi.advanceTimersByTime(8000);
      });
      act(() => {
        vi.advanceTimersByTime(500);
      });

      // Should be back to first quote
      expect(screen.getByText(/Life's nothing but a game/)).toBeInTheDocument();
      expect(screen.getByText('— R.L.A. Sr.')).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('has the correct container styling', () => {
      const { container } = render(<LegacyQuotes />);
      const quoteDiv = container.firstChild;

      expect(quoteDiv).toHaveClass('p-6');
      expect(quoteDiv).toHaveClass('text-center');
      expect(quoteDiv).toHaveClass('rounded-xl');
    });
  });
});
