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
    '#60a5fa', // blue-400
    '#93c5fd', // blue-300
    '#2563eb', // blue-600
    '#1d4ed8', // blue-700
];

export function Charts({ data, numericColumns, labelColumn }: ChartsProps) {
    // Filter out columns that look like 'Rank' from charts
    const chartColumns = numericColumns.filter(col => !col.toLowerCase().includes('rank'));

    // Sort data for each chart to show highest at the top
    const getSortedData = (column: string) => {
        return [...data].sort((a, b) => (Number(b[column]) || 0) - (Number(a[column]) || 0)).slice(0, 10);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {chartColumns.map((col) => (
                <div key={col} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xl flex flex-col group hover:border-blue-500/20 transition-all duration-300">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-50 rounded-2xl group-hover:bg-blue-100 transition-colors">
                                <BarChart3 className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-slate-900 tracking-tight">{col}</h2>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-0.5">Top 10 Performance Race</p>
                            </div>
                        </div>
                    </div>

                    <div className="h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                layout="vertical"
                                data={getSortedData(col)}
                                margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                                barSize={20}
                            >
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                                <XAxis type="number" hide />
                                <YAxis
                                    dataKey={labelColumn}
                                    type="category"
                                    width={100}
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#475569', fontSize: 11, fontWeight: 700 }}
                                />
                                <Tooltip
                                    cursor={{ fill: 'rgba(59, 130, 246, 0.05)', radius: 4 }}
                                    contentStyle={{
                                        backgroundColor: '#ffffff',
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '12px',
                                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                                        padding: '12px'
                                    }}
                                    itemStyle={{ color: '#0f172a', fontWeight: 800, fontSize: '13px' }}
                                    labelStyle={{ color: '#64748b', marginBottom: '4px', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' }}
                                />
                                <Bar
                                    dataKey={col}
                                    radius={[0, 10, 10, 0]}
                                    animationDuration={1500}
                                >
                                    {getSortedData(col).map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={COLORS[index % COLORS.length]}
                                            fillOpacity={0.9}
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
