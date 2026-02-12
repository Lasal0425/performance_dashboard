'use client';

import React, { useState } from 'react';
import { Search, RotateCcw } from 'lucide-react';

interface UrlInputProps {
    currentUrl: string;
    onUrlSubmit: (url: string) => void;
}

export function UrlInput({ currentUrl, onUrlSubmit }: UrlInputProps) {
    const [url, setUrl] = useState(currentUrl);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (url.trim()) {
            onUrlSubmit(url.trim());
        }
    };

    return (
        <form onSubmit={handleSubmit} className="relative group max-w-xl w-full">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
            </div>
            <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste Google Sheets CSV URL..."
                className="block w-full pl-11 pr-36 py-3.5 bg-white border border-slate-200 rounded-2xl leading-5 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500/40 sm:text-sm transition-all shadow-sm font-medium"
            />
            <div className="absolute inset-y-1.5 right-1.5 flex gap-2">
                <button
                    type="button"
                    onClick={() => {
                        const defaultUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRXL8IwCtWhGJ3B3iHIxIeRQ8UP7b3msCzEkhKiimSRM3hmVAYE3Lx9iqOZlQ0mgoxTVLVhXXdQQjZ5/pub?gid=929949898&single=true&output=csv';
                        setUrl(defaultUrl);
                        onUrlSubmit(defaultUrl);
                    }}
                    className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                    title="Reset to default"
                >
                    <RotateCcw className="h-4 w-4" />
                </button>
                <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-95"
                >
                    Load Data
                </button>
            </div>
        </form>
    );
}
