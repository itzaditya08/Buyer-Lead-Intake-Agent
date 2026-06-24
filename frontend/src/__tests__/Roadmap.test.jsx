import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Roadmap from '../views/Roadmap';

describe('Roadmap Component', () => {
    it('renders the fallback badge when is_fallback is true', () => {
        // Create dummy fallback data
        const mockFallbackData = {
            is_fallback: true,
            steps: [
                { phase: "Phase 1", description: "Test Description" }
            ]
        };

        // Render the component
        render(
            <Roadmap 
                roadmapData={mockFallbackData} 
                userProfile={{}} 
                targetJob={{}} 
                onNext={() => {}} 
                onBack={() => {}} 
                setIsGlobalLoading={() => {}} 
            />
        );

        // Assert that the UI explicitly tells the user this is the Standard Curriculum
        const fallbackBadge = screen.getByText(/Standard Curriculum/i);
        expect(fallbackBadge).toBeInTheDocument();
    });
});