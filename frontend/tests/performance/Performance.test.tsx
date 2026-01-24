import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PerformanceCoach } from '@/src/components/PerformanceCoach';
import { MetabolicDashboard } from '@/src/components/MetabolicDashboard';
import React from 'react';

// Mock Recharts to avoid DOM issues in JSDOM
vi.mock('recharts', () => ({
    ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
    AreaChart: ({ children }: any) => <div>{children}</div>,
    Area: () => <div />,
    XAxis: () => <div />,
    YAxis: () => <div />,
    CartesianGrid: () => <div />,
    Tooltip: () => <div />,
    BarChart: () => <div />,
    Bar: () => <div />,
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    },
}));

// Mock lucide-react
vi.mock('lucide-react', () => ({
    Activity: () => <div />,
    Target: () => <div />,
    Sparkles: () => <div />,
    ChevronRight: () => <div />,
    Heart: () => <div />,
    Clock: () => <div />,
    Droplets: () => <div />,
}));

describe('PerformanceCoach Component', () => {
    it('renders advice correctly', () => {
        const mockAdvice = {
            coach_directive: "Train harder",
            next_optimal_workout: "HIIT",
            nutrient_recommendation: "Proteins"
        };
        render(<PerformanceCoach advice={mockAdvice} />);
        expect(screen.getByText(/Train harder/i)).toBeInTheDocument();
        expect(screen.getByText(/HIIT/i)).toBeInTheDocument();
        expect(screen.getByText(/Proteins/i)).toBeInTheDocument();
    });
});

describe('MetabolicDashboard Component', () => {
    it('renders biometric metrics', () => {
        const mockMetrics = {
            vo2Max: 55,
            restingHeartRate: 60,
            hydrationLevel: 90,
            trainingLoad: 'Optimal'
        };
        render(<MetabolicDashboard metrics={mockMetrics} recovery={85} />);
        expect(screen.getByText(/55/)).toBeInTheDocument();
        expect(screen.getByText(/VO2 Max/i)).toBeInTheDocument();
        expect(screen.getByText(/85/)).toBeInTheDocument(); // Recovery
        expect(screen.getByText(/Resting HR/i)).toBeInTheDocument();
    });
});
