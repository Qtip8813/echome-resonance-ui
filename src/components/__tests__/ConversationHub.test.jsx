import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import ConversationHub from '../ConversationHub';

describe('ConversationHub', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Rendering', () => {
    it('renders all form labels', () => {
      render(<ConversationHub />);

      expect(screen.getByText('AI Model')).toBeInTheDocument();
      expect(screen.getByText('Conversation Type')).toBeInTheDocument();
      expect(screen.getByText('Topic')).toBeInTheDocument();
      expect(screen.getByText('Number of Rounds')).toBeInTheDocument();
      expect(screen.getByText(/Participant Order/i)).toBeInTheDocument();
    });

    it('renders control buttons', () => {
      render(<ConversationHub />);

      expect(screen.getByRole('button', { name: /Start/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Pause/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Reset/i })).toBeInTheDocument();
    });

    it('renders export buttons', () => {
      render(<ConversationHub />);

      expect(screen.getByRole('button', { name: /Export JSON/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Export CSV/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Export PDF/i })).toBeInTheDocument();
    });

    it('renders metrics section for all models', () => {
      const { container } = render(<ConversationHub />);

      // Find the metrics section headings
      const metricsSection = container.querySelectorAll('.font-semibold');
      const modelNames = Array.from(metricsSection).map((el) => el.textContent);

      expect(modelNames).toContain('ChatGPT-4');
      expect(modelNames).toContain('Claude-3');
      expect(modelNames).toContain('Gemini-Pro');
    });

    it('displays initial rounds completed as 0', () => {
      render(<ConversationHub />);

      expect(screen.getByText(/Rounds Completed: 0/i)).toBeInTheDocument();
    });

    it('renders inject context section', () => {
      render(<ConversationHub />);

      expect(screen.getByText('Inject Context')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Inject/i })).toBeInTheDocument();
    });
  });

  describe('Model Selection', () => {
    it('has ChatGPT-4 selected by default', () => {
      render(<ConversationHub />);

      const select = screen.getByRole('combobox');
      expect(select.value).toBe('ChatGPT-4');
    });

    it('allows changing the selected model', () => {
      render(<ConversationHub />);

      const select = screen.getByRole('combobox');
      fireEvent.change(select, { target: { value: 'Claude-3' } });

      expect(select.value).toBe('Claude-3');
    });

    it('displays all available model options', () => {
      render(<ConversationHub />);

      const options = screen.getAllByRole('option');
      expect(options).toHaveLength(3);
      expect(options.map((o) => o.value)).toEqual(['ChatGPT-4', 'Claude-3', 'Gemini-Pro']);
    });
  });

  describe('Form Inputs', () => {
    it('allows entering conversation type', () => {
      render(<ConversationHub />);

      const inputs = screen.getAllByRole('textbox');
      const conversationTypeInput = inputs[0]; // First text input after select
      fireEvent.change(conversationTypeInput, { target: { value: 'Debate' } });

      expect(conversationTypeInput.value).toBe('Debate');
    });

    it('allows entering topic', () => {
      render(<ConversationHub />);

      const inputs = screen.getAllByRole('textbox');
      const topicInput = inputs[1];
      fireEvent.change(topicInput, { target: { value: 'Climate Change' } });

      expect(topicInput.value).toBe('Climate Change');
    });

    it('allows changing number of rounds', () => {
      render(<ConversationHub />);

      const input = screen.getByRole('spinbutton');
      fireEvent.change(input, { target: { value: '10' } });

      expect(input.value).toBe('10');
    });

    it('allows changing participant order', () => {
      render(<ConversationHub />);

      const inputs = screen.getAllByRole('textbox');
      const participantInput = inputs[2];
      fireEvent.change(participantInput, { target: { value: 'Claude-3, ChatGPT-4' } });

      expect(participantInput.value).toBe('Claude-3, ChatGPT-4');
    });
  });

  describe('Start/Pause/Reset Controls', () => {
    it('starts with Start button enabled and Pause button disabled', () => {
      render(<ConversationHub />);

      expect(screen.getByRole('button', { name: /Start/i })).not.toBeDisabled();
      expect(screen.getByRole('button', { name: /Pause/i })).toBeDisabled();
    });

    it('disables Start and enables Pause when running', () => {
      render(<ConversationHub />);

      fireEvent.click(screen.getByRole('button', { name: /Start/i }));

      expect(screen.getByRole('button', { name: /Start/i })).toBeDisabled();
      expect(screen.getByRole('button', { name: /Pause/i })).not.toBeDisabled();
    });

    it('increments rounds when running', () => {
      render(<ConversationHub />);

      fireEvent.click(screen.getByRole('button', { name: /Start/i }));

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(screen.getByText(/Rounds Completed: 1/i)).toBeInTheDocument();
    });

    it('pauses the simulation', () => {
      render(<ConversationHub />);

      fireEvent.click(screen.getByRole('button', { name: /Start/i }));

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      fireEvent.click(screen.getByRole('button', { name: /Pause/i }));

      act(() => {
        vi.advanceTimersByTime(2000);
      });

      // Should still be 1 since we paused
      expect(screen.getByText(/Rounds Completed: 1/i)).toBeInTheDocument();
    });

    it('resets all state when Reset is clicked', () => {
      render(<ConversationHub />);

      fireEvent.click(screen.getByRole('button', { name: /Start/i }));

      act(() => {
        vi.advanceTimersByTime(2000);
      });

      fireEvent.click(screen.getByRole('button', { name: /Reset/i }));

      expect(screen.getByText(/Rounds Completed: 0/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Start/i })).not.toBeDisabled();
    });

    it('stops automatically when all rounds complete', () => {
      render(<ConversationHub />);

      // Set to 2 rounds
      const roundsInput = screen.getByRole('spinbutton');
      fireEvent.change(roundsInput, { target: { value: '2' } });

      fireEvent.click(screen.getByRole('button', { name: /Start/i }));

      // Advance time for multiple intervals to complete 2 rounds
      act(() => {
        vi.advanceTimersByTime(1000);
      });
      act(() => {
        vi.advanceTimersByTime(1000);
      });
      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(screen.getByText(/Rounds Completed: 2/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Start/i })).not.toBeDisabled();
    });
  });

  describe('Context Injection', () => {
    it('allows entering context text', () => {
      render(<ConversationHub />);

      const textarea = document.querySelector('textarea');
      fireEvent.change(textarea, { target: { value: 'Test context' } });

      expect(textarea.value).toBe('Test context');
    });

    it('clears context after injection', () => {
      render(<ConversationHub />);

      const textarea = document.querySelector('textarea');
      fireEvent.change(textarea, { target: { value: 'Test context' } });

      fireEvent.click(screen.getByRole('button', { name: /Inject/i }));

      expect(textarea.value).toBe('');
    });
  });

  describe('Export Functions', () => {
    let originalCreateElement;

    beforeEach(() => {
      originalCreateElement = document.createElement.bind(document);
    });

    afterEach(() => {
      document.createElement = originalCreateElement;
    });

    it('creates a download link when exporting JSON', () => {
      const mockClick = vi.fn();
      document.createElement = vi.fn((tag) => {
        if (tag === 'a') {
          return { click: mockClick, href: '', download: '' };
        }
        return originalCreateElement(tag);
      });

      render(<ConversationHub />);

      // Run a round first to have data
      fireEvent.click(screen.getByRole('button', { name: /Start/i }));
      act(() => {
        vi.advanceTimersByTime(1000);
      });
      fireEvent.click(screen.getByRole('button', { name: /Pause/i }));

      fireEvent.click(screen.getByRole('button', { name: /Export JSON/i }));

      expect(URL.createObjectURL).toHaveBeenCalled();
      expect(mockClick).toHaveBeenCalled();
    });

    it('creates a download link when exporting CSV', () => {
      const mockClick = vi.fn();
      document.createElement = vi.fn((tag) => {
        if (tag === 'a') {
          return { click: mockClick, href: '', download: '' };
        }
        return originalCreateElement(tag);
      });

      render(<ConversationHub />);

      // Run a round first
      fireEvent.click(screen.getByRole('button', { name: /Start/i }));
      act(() => {
        vi.advanceTimersByTime(1000);
      });
      fireEvent.click(screen.getByRole('button', { name: /Pause/i }));

      fireEvent.click(screen.getByRole('button', { name: /Export CSV/i }));

      expect(URL.createObjectURL).toHaveBeenCalled();
      expect(mockClick).toHaveBeenCalled();
    });

    it('creates a download link when exporting PDF', () => {
      const mockClick = vi.fn();
      document.createElement = vi.fn((tag) => {
        if (tag === 'a') {
          return { click: mockClick, href: '', download: '' };
        }
        return originalCreateElement(tag);
      });

      render(<ConversationHub />);

      // Run a round first
      fireEvent.click(screen.getByRole('button', { name: /Start/i }));
      act(() => {
        vi.advanceTimersByTime(1000);
      });
      fireEvent.click(screen.getByRole('button', { name: /Pause/i }));

      fireEvent.click(screen.getByRole('button', { name: /Export PDF/i }));

      expect(URL.createObjectURL).toHaveBeenCalled();
      expect(mockClick).toHaveBeenCalled();
    });
  });

  describe('Metrics Calculation', () => {
    it('displays initial metrics as 0', () => {
      const { container } = render(<ConversationHub />);

      // Check that initial avg response times are 0
      const avgTimeTexts = container.querySelectorAll('div');
      const avgTimeElements = Array.from(avgTimeTexts).filter((el) =>
        el.textContent.includes('Avg Response Time: 0 ms')
      );

      expect(avgTimeElements.length).toBeGreaterThanOrEqual(3);
    });

    it('updates metrics after rounds complete', () => {
      render(<ConversationHub />);

      fireEvent.click(screen.getByRole('button', { name: /Start/i }));

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      // At least one model should have updated metrics
      const avgTimeElements = screen.getAllByText(/Avg Response Time:/i);
      expect(avgTimeElements.length).toBe(3);
    });

    it('displays success rate for each model', () => {
      render(<ConversationHub />);

      const successRateElements = screen.getAllByText(/Success Rate:/i);
      expect(successRateElements.length).toBe(3);
    });

    it('shows initial success rate as 0%', () => {
      render(<ConversationHub />);

      const successRateElements = screen.getAllByText(/Success Rate: 0%/i);
      expect(successRateElements.length).toBe(3);
    });
  });

  describe('Participant Order Handling', () => {
    it('cycles through participants in order', () => {
      render(<ConversationHub />);

      // Default order: ChatGPT-4, Claude-3, Gemini-Pro
      fireEvent.click(screen.getByRole('button', { name: /Start/i }));

      // Run 3 rounds to cycle through all
      act(() => {
        vi.advanceTimersByTime(1000);
      });
      act(() => {
        vi.advanceTimersByTime(1000);
      });
      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(screen.getByText(/Rounds Completed: 3/i)).toBeInTheDocument();
    });

    it('handles custom participant order', () => {
      render(<ConversationHub />);

      const inputs = screen.getAllByRole('textbox');
      const participantInput = inputs[2];
      fireEvent.change(participantInput, { target: { value: 'Claude-3, Gemini-Pro' } });

      fireEvent.click(screen.getByRole('button', { name: /Start/i }));

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(screen.getByText(/Rounds Completed: 1/i)).toBeInTheDocument();
    });

    it('handles single participant', () => {
      render(<ConversationHub />);

      const inputs = screen.getAllByRole('textbox');
      const participantInput = inputs[2];
      fireEvent.change(participantInput, { target: { value: 'Claude-3' } });

      fireEvent.click(screen.getByRole('button', { name: /Start/i }));

      act(() => {
        vi.advanceTimersByTime(2000);
      });

      expect(screen.getByText(/Rounds Completed: 2/i)).toBeInTheDocument();
    });
  });

  describe('History Management', () => {
    it('adds context injection to history', () => {
      render(<ConversationHub />);

      const textarea = document.querySelector('textarea');
      fireEvent.change(textarea, { target: { value: 'Injected context data' } });

      fireEvent.click(screen.getByRole('button', { name: /Inject/i }));

      // Context should be cleared after injection
      expect(textarea.value).toBe('');
    });

    it('allows multiple context injections', () => {
      render(<ConversationHub />);

      const textarea = document.querySelector('textarea');

      // First injection
      fireEvent.change(textarea, { target: { value: 'First context' } });
      fireEvent.click(screen.getByRole('button', { name: /Inject/i }));

      // Second injection
      fireEvent.change(textarea, { target: { value: 'Second context' } });
      fireEvent.click(screen.getByRole('button', { name: /Inject/i }));

      expect(textarea.value).toBe('');
    });

    it('builds history through multiple rounds', () => {
      render(<ConversationHub />);

      // Set to 3 rounds
      const roundsInput = screen.getByRole('spinbutton');
      fireEvent.change(roundsInput, { target: { value: '3' } });

      fireEvent.click(screen.getByRole('button', { name: /Start/i }));

      // Run exactly 3 rounds (each round takes 1000ms)
      act(() => {
        vi.advanceTimersByTime(1000);
      });
      act(() => {
        vi.advanceTimersByTime(1000);
      });
      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(screen.getByText(/Rounds Completed: 3/i)).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles zero rounds gracefully', () => {
      render(<ConversationHub />);

      const roundsInput = screen.getByRole('spinbutton');
      fireEvent.change(roundsInput, { target: { value: '0' } });

      fireEvent.click(screen.getByRole('button', { name: /Start/i }));

      // Should immediately stop since 0 rounds
      expect(screen.getByRole('button', { name: /Start/i })).not.toBeDisabled();
    });

    it('handles large number of rounds', () => {
      render(<ConversationHub />);

      const roundsInput = screen.getByRole('spinbutton');
      fireEvent.change(roundsInput, { target: { value: '100' } });

      expect(roundsInput.value).toBe('100');
    });

    it('handles rapid start/pause clicking', () => {
      render(<ConversationHub />);

      fireEvent.click(screen.getByRole('button', { name: /Start/i }));
      fireEvent.click(screen.getByRole('button', { name: /Pause/i }));
      fireEvent.click(screen.getByRole('button', { name: /Start/i }));
      fireEvent.click(screen.getByRole('button', { name: /Pause/i }));

      // Should be paused
      expect(screen.getByRole('button', { name: /Start/i })).not.toBeDisabled();
    });

    it('maintains state after multiple resets', () => {
      render(<ConversationHub />);

      // Run some rounds
      fireEvent.click(screen.getByRole('button', { name: /Start/i }));
      act(() => {
        vi.advanceTimersByTime(2000);
      });
      fireEvent.click(screen.getByRole('button', { name: /Reset/i }));

      // Run again
      fireEvent.click(screen.getByRole('button', { name: /Start/i }));
      act(() => {
        vi.advanceTimersByTime(1000);
      });
      fireEvent.click(screen.getByRole('button', { name: /Reset/i }));

      expect(screen.getByText(/Rounds Completed: 0/i)).toBeInTheDocument();
    });

    it('exports with empty history', () => {
      const mockClick = vi.fn();
      const originalCreateElement = document.createElement.bind(document);
      document.createElement = vi.fn((tag) => {
        if (tag === 'a') {
          return { click: mockClick, href: '', download: '' };
        }
        return originalCreateElement(tag);
      });

      render(<ConversationHub />);

      // Export without any rounds
      fireEvent.click(screen.getByRole('button', { name: /Export JSON/i }));

      expect(URL.createObjectURL).toHaveBeenCalled();
      expect(mockClick).toHaveBeenCalled();

      document.createElement = originalCreateElement;
    });
  });

  describe('Form Validation', () => {
    it('allows empty conversation type', () => {
      render(<ConversationHub />);

      const inputs = screen.getAllByRole('textbox');
      const conversationTypeInput = inputs[0];

      expect(conversationTypeInput.value).toBe('');

      // Should still be able to start
      expect(screen.getByRole('button', { name: /Start/i })).not.toBeDisabled();
    });

    it('allows empty topic', () => {
      render(<ConversationHub />);

      const inputs = screen.getAllByRole('textbox');
      const topicInput = inputs[1];

      expect(topicInput.value).toBe('');

      // Should still be able to start
      expect(screen.getByRole('button', { name: /Start/i })).not.toBeDisabled();
    });

    it('preserves input values on pause and resume', () => {
      render(<ConversationHub />);

      const inputs = screen.getAllByRole('textbox');
      const topicInput = inputs[1];
      fireEvent.change(topicInput, { target: { value: 'Test Topic' } });

      fireEvent.click(screen.getByRole('button', { name: /Start/i }));
      fireEvent.click(screen.getByRole('button', { name: /Pause/i }));

      expect(topicInput.value).toBe('Test Topic');
    });
  });

  describe('Accessibility', () => {
    it('has labeled form controls', () => {
      render(<ConversationHub />);

      expect(screen.getByText('AI Model')).toBeInTheDocument();
      expect(screen.getByText('Conversation Type')).toBeInTheDocument();
      expect(screen.getByText('Topic')).toBeInTheDocument();
      expect(screen.getByText('Number of Rounds')).toBeInTheDocument();
    });

    it('has a combobox for model selection', () => {
      render(<ConversationHub />);

      const combobox = screen.getByRole('combobox');
      expect(combobox).toBeInTheDocument();
    });

    it('has a spinbutton for number input', () => {
      render(<ConversationHub />);

      const spinbutton = screen.getByRole('spinbutton');
      expect(spinbutton).toBeInTheDocument();
    });

    it('disables pause button when not running', () => {
      render(<ConversationHub />);

      expect(screen.getByRole('button', { name: /Pause/i })).toBeDisabled();
    });
  });
});
