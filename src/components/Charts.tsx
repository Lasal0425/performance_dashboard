'use client';

import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';
import { BarChart3 } from 'lucide-react';

interface ChartsProps {
    data: Record<string, string | number | null>[];
    numericColumns: string[];
    labelColumn: string;
}

const COLORS = [
    '#3b82f6', // blue-500
    '#6366f1', // indigo-500
    '#8b5cf6', // violet-500
    '#a855f7', // purple-500
    '#d946ef', // pink-500
    '#ec4899', // rose-500
    '#f43f5e'  // rose-500
];

export function Charts({ data, numericColumns, labelColumn }: ChartsProps) {
    // Filter out columns that look like 'Rank' from charts
    const chartColumns = numericColumns.filter(col => !col.toLowerCase().includes('rank'));

    return (
        <div className="flex flex-col gap-10">
            {chartColumns.map((col) => (
                <div key={col} className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xl h-[450px] flex flex-col group hover:border-blue-500/20 transition-colors">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-50 rounded-2xl group-hover:bg-blue-100 transition-colors">
                                <BarChart3 className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-slate-900 tracking-tight">{col}</h2>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1">Comparison by {labelColumn}</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 w-full min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={data}
                                margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
                                barSize={32}
                            >
                                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey={labelColumn}
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }}
                                />
                                <Tooltip
                                    cursor={{ fill: 'rgba(59, 130, 246, 0.05)', radius: 8 }}
                                    contentStyle={{
                                        backgroundColor: '#ffffff',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '16px',
                                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                                        padding: '16px'
                                    }}
                                    itemStyle={{ color: '#0f172a', fontWeight: 800, fontSize: '14px' }}
                                    labelStyle={{ color: '#64748b', marginBottom: '8px', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}
                                    formatter={(value: number | string | (string | number)[] | undefined) => {
                                        if (value === undefined) return ['', col];
                                        return [value.toLocaleString(), col] as [string, string];
                                    }}
                                />
                                <Bar
                                    dataKey={col}
                                    radius={[8, 8, 8, 8]}
                                    animationDuration={1500}
                                >
                                    {data.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={COLORS[index % COLORS.length]}
                                            fillOpacity={0.8}
                                            className="transition-all duration-300 hover:fill-opacity-100"
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            ))}
        </div>
    );
}
