'use client';

import React, { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, ListFilter, Trophy, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

type DataRow = Record<string, string | number | null>;

interface DataTableProps {
    data: DataRow[];
    headers: string[];
}

export function DataTable({ data, headers }: DataTableProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(() => {
        if (headers.includes('Rank')) return { key: 'Rank', direction: 'asc' };
        if (headers.includes('Total Points')) return { key: 'Total Points', direction: 'desc' };
        return null;
    });

    const filteredData = useMemo(() => {
        if (!searchTerm) return data;
        const lowerSearch = searchTerm.toLowerCase();
        return data.filter(row =>
            Object.values(row).some(val =>
                val?.toString().toLowerCase().includes(lowerSearch)
            )
        );
    }, [data, searchTerm]);

    const sortedData = useMemo(() => {
        const sortableItems = [...filteredData];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                const aVal = a[sortConfig.key];
                const bVal = b[sortConfig.key];

                if (aVal === null || aVal === undefined) return 1;
                if (bVal === null || bVal === undefined) return -1;

                if (aVal < bVal) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (aVal > bVal) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [filteredData, sortConfig]);

    const requestSort = (key: string) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    return (
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xl flex flex-col h-full">
            <div className="p-6 border-b border-slate-100 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-blue-50 rounded-xl">
                            <Trophy className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Leaderboard</h2>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-0.5">Performance Data</p>
                        </div>
                    </div>
                    <div className="hidden md:flex items-center text-slate-500 text-xs font-semibold bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                        <ListFilter className="w-3.5 h-3.5 mr-2 text-blue-600" />
                        {filteredData.length} entities
                    </div>
                </div>

                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search entities, scores, or ranks..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="block w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all font-medium"
                    />
                </div>
            </div>

            <div className="overflow-x-auto flex-1">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/50">
                            {headers.map((header) => (
                                <th
                                    key={header}
                                    onClick={() => requestSort(header)}
                                    className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em] cursor-pointer hover:bg-slate-50 transition-colors group select-none border-b border-slate-100"
                                >
                                    <div className="flex items-center gap-2">
                                        {header}
                                        <div className="flex flex-col">
                                            <ChevronUp className={cn("w-3 h-3 transition-colors", sortConfig?.key === header && sortConfig.direction === 'asc' ? "text-blue-600" : "text-slate-300 group-hover:text-slate-400")} />
                                            <ChevronDown className={cn("w-3 h-3 -mt-1.5 transition-colors", sortConfig?.key === header && sortConfig.direction === 'desc' ? "text-blue-600" : "text-slate-300 group-hover:text-slate-400")} />
                                        </div>
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {sortedData.map((row, i) => (
                            <tr
                                key={i}
                                className="hover:bg-blue-50/30 transition-colors group"
                            >
                                {headers.map((header, j) => (
                                    <td key={j} className="px-6 py-4">
                                        {header.toLowerCase().includes('rank') ? (
                                            <div className={cn(
                                                "inline-flex items-center justify-center w-8 h-8 rounded-lg text-xs font-black shadow-sm",
                                                row[header] === 1 ? "bg-amber-100 text-amber-700 border border-amber-200" :
                                                    row[header] === 2 ? "bg-slate-100 text-slate-600 border border-slate-200" :
                                                        row[header] === 3 ? "bg-orange-100 text-orange-700 border border-orange-200" :
                                                            "bg-slate-50 text-slate-400 border border-slate-200"
                                            )}>
                                                {row[header]}
                                            </div>
                                        ) : j === 0 ? (
                                            <span className="text-slate-900 font-bold group-hover:text-blue-700 transition-colors">
                                                {row[header]}
                                            </span>
                                        ) : (
                                            <span className="text-slate-600 text-sm font-semibold">
                                                {typeof row[header] === 'number' ?
                                                    (row[header] as number).toLocaleString(undefined, { maximumFractionDigits: 1 }) :
                                                    row[header]}
                                            </span>
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                        {sortedData.length === 0 && (
                            <tr>
                                <td colSpan={headers.length} className="px-6 py-20 text-center">
                                    <p className="text-slate-400 text-sm font-medium italic">No matching records found</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
