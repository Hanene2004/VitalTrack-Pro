import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '@/src/App';
import React from 'react';

vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
        main: ({ children, ...props }: any) => <main {...props}>{children}</main>,
        header: ({ children, ...props }: any) => <header {...props}>{children}</header>,
        button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
    Leaf: () => <div data-testid="leaf-icon" />,
    Utensils: () => <div />,
    CloudUpload: () => <div />,
    Settings: () => <div />,
    Plus: () => <div />,
    X: () => <div />,
    TrendingUp: () => <div />,
    Zap: () => <div />,
    Target: () => <div />,
    Sparkles: () => <div />,
    ChevronRight: () => <div />,
    Camera: () => <div />,
    CheckCircle2: () => <div />,
    Mic: () => <div />,
    MicOff: () => <div />,
    User: () => <div />,
    Award: () => <div />,
    AlertTriangle: () => <div />,
    BarChart3: () => <div />,
    History: () => <div />,
    Flame: () => <div />,
    Trophy: () => <div />,
    Info: () => <div />,
    Save: () => <div />,
    ChevronDown: () => <div />,
    Dumbbell: () => <div />,
    HeartPulse: () => <div />,
    Timer: () => <div />,
    ZapIcon: () => <div />,
    Activity: () => <div />,
    Heart: () => <div />,
    Droplets: () => <div />,
    Scale: () => <div />,
}));

// Mock canvas-confetti
vi.mock('canvas-confetti', () => ({
    default: vi.fn(),
}));

// Mock Charts
vi.mock('@/src/components/Charts', () => ({
    NutritionRadar: () => <div data-testid="nutrition-radar" />,
    CalorieTrend: () => <div data-testid="calorie-trend" />,
}));

describe('App Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        global.fetch = vi.fn().mockImplementation(() =>
            Promise.resolve({
                json: () => Promise.resolve({ score_next_week: 85, projection: "Good trend" }),
            })
        );
    });

    it('renders the main title', () => {
        render(<App />);
        expect(screen.getAllByText(/Vital/i)[0]).toBeInTheDocument();
    });

    it('navigates between tabs', async () => {
        render(<App />);

        // Check initial state (Insight tab active)
        expect(screen.getByTestId('nutrition-radar')).toBeInTheDocument();

        // Click Profile tab via its test-id
        const profileBtn = screen.getByTestId('nav-profile');
        fireEvent.click(profileBtn);

        // Check if profile specific text is present
        expect(screen.getByText(/Theodore Pro/i)).toBeInTheDocument();
        expect(screen.queryByTestId('nutrition-radar')).not.toBeInTheDocument();
    });

    it('opens the meal capture modal', () => {
        render(<App />);
        const captureBtn = screen.getByText(/Meal/i);
        fireEvent.click(captureBtn);

        expect(screen.getByPlaceholderText(/Ex: Salmon Bowl/i)).toBeInTheDocument();
    });
});
