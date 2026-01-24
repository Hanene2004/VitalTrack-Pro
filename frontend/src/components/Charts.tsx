import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  AreaChart, Area
} from 'recharts';
import { Meal } from '../models/types';

export const NutritionRadar: React.FC<{ meals: Meal[] }> = ({ meals }) => {
  const data = [
    { subject: 'Protein', A: meals.reduce((acc, m) => acc + m.ingredients.reduce((a, i) => a + (i.protein || 0), 0), 0), fullMark: 150 },
    { subject: 'Carbs', A: meals.reduce((acc, m) => acc + m.ingredients.reduce((a, i) => a + (i.carbs || 0), 0), 0), fullMark: 250 },
    { subject: 'Fat', A: meals.reduce((acc, m) => acc + m.ingredients.reduce((a, i) => a + (i.fat || 0), 0), 0), fullMark: 100 }
  ];

  return (
    <div className="h-[300px] w-full items-center justify-center flex">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke="#334155" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
          <Radar
            name="Nutrients"
            dataKey="A"
            stroke="#10b981"
            fill="#10b981"
            fillOpacity={0.5}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const CalorieTrend: React.FC<{ meals: Meal[] }> = ({ meals }) => {
  const data = meals.map(m => ({
    name: m.date,
    calories: m.ingredients.reduce((acc, i) => acc + (i.calories || 0), 0)
  })).reverse();

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorCal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
          <XAxis dataKey="name" stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px' }}
            itemStyle={{ color: '#10b981' }}
          />
          <Area type="monotone" dataKey="calories" stroke="#10b981" fillOpacity={1} fill="url(#colorCal)" strokeWidth={3} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
