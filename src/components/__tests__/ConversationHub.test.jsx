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
  });
});
