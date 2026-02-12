'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Papa from 'papaparse';
import { UrlInput } from './UrlInput';
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

export function Dashboard() {
    const [csvUrl, setCsvUrl] = useState('https://docs.google.com/spreadsheets/d/e/2PACX-1vRXL8IwCtWhGJ3B3iHIxIeRQ8UP7b3msCzEkhKiimSRM3hmVAYE3Lx9iqOZlQ0mgoxTVLVhXXdQQjZ5/pub?gid=929949898&single=true&output=csv');
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async (url: string) => {
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
                        // Check if at least one row has a number for this column
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
        <div className="min-h-screen bg-slate-50 text-slate-900 p-4 md:p-8 space-y-8 selection:bg-blue-100">
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
                            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
                                B2B Performance Dashboard
                            </h1>
                            <p className="text-slate-500 mt-1 max-w-lg font-medium">
                                Dynamic competition leaderboard tracking real-time performance across all entities.
                            </p>
                        </div>
                    </div>
                    <div className="w-full lg:w-auto">
                        <UrlInput currentUrl={csvUrl} onUrlSubmit={setCsvUrl} />
                    </div>
                </div>
            </header>

            {loading && (
                <div className="flex flex-col items-center justify-center py-32 animate-in fade-in duration-500">
                    <div className="relative w-16 h-16">
                        <div className="absolute inset-0 rounded-full border-4 border-blue-100"></div>
                        <div className="absolute inset-0 rounded-full border-4 border-t-blue-600 animate-spin"></div>
                    </div>
                    <p className="text-slate-500 font-semibold mt-6 tracking-wide">Syncing data from source...</p>
                </div>
            )}

            {error && (
                <div className="max-w-2xl mx-auto flex flex-col items-center justify-center py-16 px-6 bg-white rounded-3xl border border-red-100 text-center animate-in zoom-in-95 duration-500 shadow-xl shadow-red-500/5">
                    <div className="p-4 bg-red-50 rounded-full mb-4">
                        <AlertCircle className="w-10 h-10 text-red-500" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 mb-2">Something went wrong</h2>
                    <p className="text-slate-500 mb-6 font-medium">{error}</p>
                    <div className="flex gap-3">
                        <button
                            onClick={() => fetchData(csvUrl)}
                            className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold rounded-xl transition-all active:scale-95 flex items-center gap-2 border border-slate-200"
                        >
                            Try Again
                        </button>
                        <button
                            onClick={() => setCsvUrl('https://docs.google.com/spreadsheets/d/e/2PACX-1vRXL8IwCtWhGJ3B3iHIxIeRQ8UP7b3msCzEkhKiimSRM3hmVAYE3Lx9iqOZlQ0mgoxTVLVhXXdQQjZ5/pub?gid=929949898&single=true&output=csv')}
                            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all active:scale-95 shadow-lg shadow-blue-600/20"
                        >
                            Reset to Default
                        </button>
                    </div>
                </div>
            )}

            {data && !loading && !error && (
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
                    <section>
                        <SummaryCards data={data.data} numericColumns={data.numericColumns} />
                    </section>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 items-start">
                        <section className="space-y-10 order-2 xl:order-1">
                            <Charts data={data.data} numericColumns={data.numericColumns} labelColumn={data.labelColumn} />
                        </section>
                        <section className="order-1 xl:order-2 sticky top-8">
                            <DataTable data={data.data} headers={data.headers} />
                        </section>
                    </div>
                </div>
            )}
        </div>
    );
}
