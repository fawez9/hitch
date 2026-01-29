'use client';
import { GitPullRequest, Terminal } from 'lucide-react';
import Link from 'next/link';

export function Header() {
  return (
    <header className="border-b border-border border-slate-500 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and title section */}
          <div className="flex items-center gap-3">
            <Link href="/">
              <div className="w-10 h-10 rounded-lg bg-cyan-500 flex items-center justify-center">
                <GitPullRequest className="w-5 h-5 text-black" />
              </div>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-foreground tracking-tight">HITCH</h1>
              <p className="text-xs text-slate-400">Helping Issue-To-Contribution Handoffs</p>
            </div>
          </div>

          {/* Version badge */}
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-900/50 px-3 py-1.5 rounded-lg border border-slate-800">
            <Terminal className="w-3.5 h-3.5" />
            <span>v1.0.1-Beta</span>
          </div>
        </div>
      </div>
    </header>
  );
}
