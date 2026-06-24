import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ProfileSetup from '../views/ProfileSetup';

// 1. Mock the API client so our component doesn't actually try to hit the backend during tests
vi.mock('../api/apiClient', () => ({
    api: {
        getJobs: vi.fn().mockResolvedValue([
            { id: 'jd_001', role_title: 'Test Developer', req_tech_stack: ['React'] }
        ]),
        getResumes: vi.fn(),
        getGapAnalysis: vi.fn()
    }
}));

describe('ProfileSetup Component (Zod Validation)', () => {
    
    beforeEach(() => {
        // Clear mocks before each test to ensure a clean slate
        vi.clearAllMocks();
    });

    it('catches empty form submissions and displays the Zod Full Name error', async () => {
        // Render the component
        render(<ProfileSetup onNext={vi.fn()} setIsGlobalLoading={vi.fn()} />);
        
        // Wait for the mocked API call to finish so the component is fully rendered
        await waitFor(() => {
            expect(screen.getByText(/Your Profile/i)).toBeInTheDocument();
        });

        // Find the "Next Step" button and click it immediately (leaving the form completely blank)
        const nextButton = screen.getByText(/Next Step/i);
        fireEvent.click(nextButton);
        
        // Assert that Zod caught the empty name and rendered the exact error string from our schema
        const errorMessage = await screen.findByText(/Full Name is required./i);
        expect(errorMessage).toBeInTheDocument();
    });
});