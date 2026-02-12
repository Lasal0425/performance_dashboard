'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Papa from 'papaparse';
import { SummaryCards } from './SummaryCards';
import { DataTable } from './DataTable';
import { Charts } from './Charts';
import { AlertCircle } from 'lucide-react';
import Image from 'next/image';

type DataRow = Record<string, string | number | null>;

interface DashboardData {
    headers: string[];
    numericColumns: string[];
    labelColumn: string;
    data: DataRow[];
}

import { Podium } from './Podium';

export function Dashboard() {
    // ... existing state and logic ...
    const [csvUrl] = useState(process.env.NEXT_PUBLIC_CSV_URL || 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRXL8IwCtWhGJ3B3iHIxIeRQ8UP7b3msCzEkhKiimSRM3hmVAYE3Lx9iqOZlQ0mgoxTVLVhXXdQQjZ5/pub?gid=929949898&single=true&output=csv');
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async (url: string) => {
        // ... same fetchData logic ...
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Failed to fetch data: ${response.statusText}`);
            const csvText = await response.text();

            Papa.parse<DataRow>(csvText, {
                header: true,
                dynamicTyping: true,
                skipEmptyLines: true,
                complete: (results) => {
                    if (results.errors.length > 0) {
                        console.error('CSV Parsing Errors:', results.errors);
                        setError('Error parsing CSV data. Please check the URL and format.');
                        setLoading(false);
                        return;
                    }

                    const headers = results.meta.fields || [];
                    if (headers.length === 0) {
                        setError('No headers found in the CSV. Please ensure the first row contains column names.');
                        setLoading(false);
                        return;
                    }

                    if (results.data.length === 0) {
                        setError('The CSV appears to be empty.');
                        setLoading(false);
                        return;
                    }

                    const labelColumn = headers[0];
                    const numericColumns = headers.filter((header, index) => {
                        if (index === 0) return false;
                        return results.data.some((row) => typeof row[header] === 'number');
                    });

                    setData({
                        headers,
                        numericColumns,
                        labelColumn,
                        data: results.data
                    });
                    setLoading(false);
                },
                error: (err: Error) => {
                    setError(`File reading error: ${err.message}`);
                    setLoading(false);
                }
            });
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
            setError(errorMessage);
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData(csvUrl);
    }, [csvUrl, fetchData]);

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 p-4 md:p-8 space-y-12 selection:bg-blue-100">
            <header className="flex flex-col gap-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-4">
                        <div className="relative w-[180px] h-[50px]">
                            <Image
                                src="/Icons/Blue-Logo.png"
                                alt="AIESEC Logo"
                                fill
                                style={{ objectFit: 'contain', objectPosition: 'left' }}
                                priority
                            />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black tracking-tight text-slate-900">
                                 Performance Dashboard
                            </h1>
                            <p className="text-slate-500 mt-1 max-w-lg font-medium">
                                Real-time competition tracker and entity performance analytics.
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            {loading && (
                <div className="flex flex-col items-center justify-center py-32">
                    <div className="relative w-16 h-16">
                        <div className="absolute inset-0 rounded-full border-4 border-blue-100"></div>
                        <div className="absolute inset-0 rounded-full border-4 border-t-blue-600 animate-spin"></div>
                    </div>
                    <p className="text-slate-500 font-semibold mt-6 tracking-wide">Syncing performance data...</p>
                </div>
            )}

            {error && (
                <div className="max-w-2xl mx-auto flex flex-col items-center justify-center py-16 px-6 bg-white rounded-3xl border border-red-100 text-center shadow-xl shadow-red-500/5">
                    <div className="p-4 bg-red-50 rounded-full mb-4">
                        <AlertCircle className="w-10 h-10 text-red-500" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 mb-2">Sync Error</h2>
                    <p className="text-slate-500 mb-6 font-medium">{error}</p>
                    <button
                        onClick={() => fetchData(csvUrl)}
                        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all"
                    >
                        Retry Sync
                    </button>
                </div>
            )}

            {data && !loading && !error && (
                <div className="space-y-16 animate-in fade-in slide-in-from-bottom-6 duration-1000">
                    <section>
                        <Podium data={data.data} labelColumn={data.labelColumn} />
                    </section>

                    <section className="space-y-6">
                        <div className="flex items-center gap-3 px-2">
                            <div className="w-2 h-8 bg-blue-600 rounded-full"></div>
                            <h2 className="text-2xl font-black text-slate-900">Full Leaderboard</h2>
                        </div>
                        <DataTable data={data.data} headers={data.headers} />
                    </section>

                    <section className="space-y-8 bg-white/50 backdrop-blur-sm border border-slate-200/60 rounded-[40px] p-8 md:p-12">
                        <div className="space-y-2 mb-10 text-center">
                            <h2 className="text-3xl font-black text-slate-900">Performance Breakdown</h2>
                            <p className="text-slate-500 font-medium">Detailed metrics and category comparisons</p>
                        </div>

                        <SummaryCards data={data.data} numericColumns={data.numericColumns} />
                        <div className="pt-8">
                            <Charts data={data.data} numericColumns={data.numericColumns} labelColumn={data.labelColumn} />
                        </div>
                    </section>
                </div>
            )}
        </div>
    );
}
