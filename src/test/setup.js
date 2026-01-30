import '@testing-library/jest-dom';

// Mock URL.createObjectURL and URL.revokeObjectURL for export tests
global.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
global.URL.revokeObjectURL = vi.fn();
