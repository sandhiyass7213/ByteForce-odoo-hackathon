'use client';

import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  LogIn, 
  LogOut, 
  Coffee, 
  Calendar, 
  CheckCircle2, 
  AlertCircle,
  Timer,
  ArrowRight
} from 'lucide-react';
import { AttendanceRecord } from '../types/hrms';

interface AttendanceWidgetProps {
  onStatusChange?: (status: 'PRESENT' | 'NOT CHECKED IN' | 'CHECKED OUT') => void;
}

export default function AttendanceWidget({ onStatusChange }: AttendanceWidgetProps) {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [status, setStatus] = useState<'PRESENT' | 'NOT CHECKED IN' | 'CHECKED OUT'>('NOT CHECKED IN');
  const [checkInTime, setCheckInTime] = useState<string | null>(null);
  const [checkOutTime, setCheckOutTime] = useState<string | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [isOnBreak, setIsOnBreak] = useState<boolean>(false);
  const [breakSeconds, setBreakSeconds] = useState<number>(0);

  // Synchronize initial render time on client to avoid hydration mismatch
  useEffect(() => {
    setCurrentTime(new Date());
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Work Duration Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (status === 'PRESENT' && !isOnBreak) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [status, isOnBreak]);

  // Break Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isOnBreak) {
      interval = setInterval(() => {
        setBreakSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOnBreak]);

  const handleCheckInOut = () => {
    const timeStr = new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });

    if (status === 'NOT CHECKED IN') {
      setStatus('PRESENT');
      setCheckInTime(timeStr);
      onStatusChange?.('PRESENT');
    } else if (status === 'PRESENT') {
      setStatus('CHECKED OUT');
      setCheckOutTime(timeStr);
      setIsOnBreak(false);
      onStatusChange?.('CHECKED OUT');
    } else {
      // Reset demo status back to Present or Not Checked in
      setStatus('PRESENT');
      setCheckOutTime(null);
      onStatusChange?.('PRESENT');
    }
  };

  const toggleBreak = () => {
    if (status === 'PRESENT') {
      setIsOnBreak(!isOnBreak);
    }
  };

  const formatSeconds = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${hrs.toString().padStart(2, '0')}h ${mins
      .toString()
      .padStart(2, '0')}m ${secs.toString().padStart(2, '0')}s`;
  };

  // Status Badge Configuration
  const getBadgeStyle = () => {
    switch (status) {
      case 'PRESENT':
        return {
          bg: 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300',
          dot: 'bg-emerald-500 animate-pulse',
          text: isOnBreak ? 'ON BREAK' : 'PRESENT (IN OFFICE)',
        };
      case 'CHECKED OUT':
        return {
          bg: 'bg-sky-50 dark:bg-sky-950/50 border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-300',
          dot: 'bg-sky-500',
          text: 'CHECKED OUT FOR THE DAY',
        };
      default:
        return {
          bg: 'bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300',
          dot: 'bg-rose-500',
          text: 'NOT CHECKED IN',
        };
    }
  };

  const badge = getBadgeStyle();

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-800 relative overflow-hidden transition-all">
      {/* Background Decorative Gradient */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-40 h-40 bg-gradient-to-br from-indigo-500/10 via-sky-500/5 to-transparent rounded-full blur-2xl pointer-events-none" />

      {/* Card Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-2xl">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg">
              Attendance & Shift Tracker
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Log daily work hours & break sessions
            </p>
          </div>
        </div>

        {/* Dynamic Status Badge */}
        <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-bold ${badge.bg}`}>
          <span className={`w-2.5 h-2.5 rounded-full ${badge.dot}`} />
          <span>{badge.text}</span>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 items-center">
        
        {/* Live Digital Clock Section */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-1">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
            <Calendar className="w-4 h-4 text-indigo-500" />
            <span>
              {currentTime
                ? currentTime.toLocaleDateString('en-US', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })
                : 'Loading date...'}
            </span>
          </div>

          <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white font-mono py-1">
            {currentTime
              ? currentTime.toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                  hour12: true,
                })
              : '00:00:00 AM'}
          </div>

          <div className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
            <span>Shift: <strong>09:00 AM - 05:00 PM</strong> (8h target)</span>
          </div>
        </div>

        {/* Working Duration Stats */}
        <div className="bg-slate-50/80 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col justify-center space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5">
              <Timer className="w-4 h-4 text-indigo-500" />
              Work Duration
            </span>
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 font-mono">
              {formatSeconds(elapsedSeconds)}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-500 to-sky-400 h-full transition-all duration-500 rounded-full"
              style={{
                width: `${Math.min(100, (elapsedSeconds / (8 * 3600)) * 100)}%`,
              }}
            />
          </div>

          <div className="flex justify-between items-center text-[11px] text-slate-500 dark:text-slate-400">
            <span>Break: <strong className="font-mono">{formatSeconds(breakSeconds)}</strong></span>
            <span>Target: 08h 00m</span>
          </div>
        </div>

        {/* Interactive Actions Area */}
        <div className="flex flex-col gap-3 justify-center">
          <button
            onClick={handleCheckInOut}
            className={`w-full flex items-center justify-center gap-2 py-3.5 px-5 rounded-2xl font-bold text-sm shadow-md transition-all active:scale-[0.98] ${
              status === 'NOT CHECKED IN'
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white shadow-indigo-600/30'
                : status === 'PRESENT'
                ? 'bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white shadow-rose-600/30'
                : 'bg-slate-800 hover:bg-slate-900 text-white dark:bg-slate-700 dark:hover:bg-slate-600'
            }`}
          >
            {status === 'NOT CHECKED IN' ? (
              <>
                <LogIn className="w-5 h-5" />
                <span>Clock In Now</span>
              </>
            ) : status === 'PRESENT' ? (
              <>
                <LogOut className="w-5 h-5" />
                <span>Clock Out</span>
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                <span>Clock In Again</span>
              </>
            )}
          </button>

          {/* Secondary Break Button */}
          {status === 'PRESENT' && (
            <button
              onClick={toggleBreak}
              className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold border transition-all ${
                isOnBreak
                  ? 'bg-amber-500 text-white border-amber-600 shadow-amber-500/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <Coffee className="w-4 h-4" />
              <span>{isOnBreak ? 'End Break Session' : 'Take a Break'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Activity Timeline Footer */}
      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Clock In:</span>
            <span className="font-mono text-slate-900 dark:text-slate-100">{checkInTime || '--:--'}</span>
          </div>
          <ArrowRight className="w-3 h-3 text-slate-400" />
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Clock Out:</span>
            <span className="font-mono text-slate-900 dark:text-slate-100">{checkOutTime || '--:--'}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          <span>IP Verified: Office Wi-Fi Network</span>
        </div>
      </div>
    </div>
  );
}
