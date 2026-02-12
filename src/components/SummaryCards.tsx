'use client';

import React from 'react';
import { TrendingUp, Award, BarChart3, Target } from 'lucide-react';

interface SummaryCardsProps {
    data: Record<string, string | number | null>[];
    numericColumns: string[];
}

export function SummaryCards({ data, numericColumns }: SummaryCardsProps) {
    const getSum = (column: string) => {
        return data.reduce((acc, row) => acc + (Number(row[column]) || 0), 0);
    };

    const icons = [Award, Target, BarChart3, TrendingUp];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {numericColumns.map((col, idx) => {
                const Icon = icons[idx % icons.length];
                const sum = getSum(col);
                const isRank = col.toLowerCase().includes('rank');
                const formattedSum = isRank
                    ? 'N/A'
                    : sum.toLocaleString(undefined, { maximumFractionDigits: 0 });

                if (isRank) return null;

                return (
                    <div
                        key={col}
                        className="group p-6 rounded-3xl bg-white border border-slate-200 hover:border-blue-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/5"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-blue-50 rounded-2xl group-hover:scale-110 group-hover:bg-blue-100 transition-all duration-300">
                                <Icon className="w-6 h-6 text-blue-600" />
                            </div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Collective Metric</span>
                        </div>
                        <h3 className="text-slate-500 text-sm font-semibold mb-1 truncate" title={col}>
                            Total {col.replace('#', '').replace('_', ' ')}
                        </h3>
                        <div className="flex items-baseline gap-2">
                            <p className="text-3xl font-bold text-slate-900 tracking-tight">
                                {formattedSum}
                            </p>
                            <span className="text-xs font-bold text-blue-600/80">pts</span>
                        </div>
                    </div>
                );
            }).filter(Boolean)}
        </div>
    );
}
