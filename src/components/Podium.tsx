'use client';

import React from 'react';
import { Trophy, Medal, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PodiumProps {
    data: Record<string, string | number | null>[];
    labelColumn: string;
}

export function Podium({ data, labelColumn }: PodiumProps) {
    // Determine the primary score column (look for 'point', 'total', 'score' or first number)
    const scoreKey = React.useMemo(() => {
        if (data.length === 0) return '';
        const keys = Object.keys(data[0]);
        return keys.find(k => (k.toLowerCase().includes('point') || k.toLowerCase().includes('total')) && typeof data[0][k] === 'number') ||
            keys.find(k => typeof data[0][k] === 'number' && !k.toLowerCase().includes('rank')) ||
            '';
    }, [data]);

    // Sort by the identified score column descending
    const sortedData = React.useMemo(() => {
        return [...data].sort((a, b) => {
            const aVal = Number(a[scoreKey]) || 0;
            const bVal = Number(b[scoreKey]) || 0;
            return bVal - aVal;
        });
    }, [data, scoreKey]);

    const top3 = sortedData.slice(0, 3);

    // Display order: 2nd, 1st, 3rd
    const displayOrder = React.useMemo(() => {
        const order = [];
        if (top3[1]) order.push(top3[1]);
        if (top3[0]) order.push(top3[0]);
        if (top3[2]) order.push(top3[2]);
        return order;
    }, [top3]);

    if (top3.length === 0) return null;

    return (
        <div className="flex flex-col items-center justify-center py-12 px-4">
            <div className="flex items-end justify-center gap-2 md:gap-8 w-full max-w-4xl h-[360px]">
                {displayOrder.map((winner, index) => {
                    const isFirst = winner === top3[0];
                    const isSecond = winner === top3[1];
                    const isThird = winner === top3[2];

                    const score = winner[scoreKey];

                    return (
                        <div
                            key={index}
                            className={cn(
                                "flex flex-col items-center group transition-all duration-500 animate-in slide-in-from-bottom-10",
                                isFirst ? "w-1/3 z-10 scale-110" : "w-1/4 opacity-90 hover:opacity-100"
                            )}
                            style={{ animationDelay: `${index * 150}ms` }}
                        >
                            {/* Entity Name & Score */}
                            <div className="text-center mb-10 space-y-2">
                                <p className={cn(
                                    "font-black truncate w-full px-2",
                                    isFirst ? "text-xl text-slate-900" : "text-sm text-slate-600"
                                )}>
                                    {winner[labelColumn]}
                                </p>
                                <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 rounded-full shadow-lg shadow-blue-500/20 ring-4 ring-white">
                                    <span className="text-xs font-black text-white tracking-tight">
                                        {score?.toLocaleString()}
                                    </span>
                                    <span className="text-[9px] font-black text-blue-100 uppercase">pts</span>
                                </div>
                            </div>

                            {/* The Column */}
                            <div className={cn(
                                "relative w-full rounded-t-3xl shadow-2xl flex flex-col items-center pt-10 border-x border-t transition-all duration-300",
                                isFirst
                                    ? "h-[200px] bg-gradient-to-b from-blue-600 to-blue-700 border-blue-500"
                                    : isSecond
                                        ? "h-[150px] bg-gradient-to-b from-slate-400 to-slate-500 border-slate-300"
                                        : "h-[110px] bg-gradient-to-b from-orange-400 to-orange-500 border-orange-300"
                            )}>
                                {/* Achievement Icon */}
                                <div className={cn(
                                    "absolute -top-7 p-3.5 rounded-2xl shadow-xl ring-4 ring-white transform group-hover:-translate-y-1 transition-transform",
                                    isFirst ? "bg-amber-400 text-amber-900" :
                                        isSecond ? "bg-slate-200 text-slate-600" : "bg-orange-200 text-orange-700"
                                )}>
                                    {isFirst ? <Trophy className="w-6 h-6" /> : isSecond ? <Medal className="w-5 h-5" /> : <Star className="w-5 h-5" />}
                                </div>

                                <span className="text-5xl font-black text-white/40 select-none">
                                    {isFirst ? '1' : isSecond ? '2' : '3'}
                                </span>
                                <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest mt-2">
                                    {isFirst ? 'Champion' : isSecond ? 'Runner Up' : '3rd Place'}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
