'use client';

import { useEffect, useRef } from 'react';
import { createChart, ColorType, AreaSeries } from 'lightweight-charts';
import type { MonthlyGrowthData } from '../types/dashboard.types';

interface MonthlyGrowthChartProps {
  data: MonthlyGrowthData[];
  growthPercentage: number;
}

export function MonthlyGrowthChart({ data, growthPercentage }: MonthlyGrowthChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);

  useEffect(() => {
    if (!chartContainerRef.current || data.length === 0) return;
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#9ca3af',
      },
      grid: {
        vertLines: { color: '#1f2937' },
        horzLines: { color: '#1f2937' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 300,
      timeScale: {
        borderColor: '#1f2937',
        timeVisible: false,
        secondsVisible: false,
      },
      rightPriceScale: {
        borderColor: '#1f2937',
      },
      crosshair: {
        vertLine: {
          color: '#fe6b24',
          width: 1,
          style: 1,
          labelBackgroundColor: '#fe6b24',
        },
        horzLine: {
          color: '#fe6b24',
          width: 1,
          style: 1,
          labelBackgroundColor: '#fe6b24',
        },
      },
    });

    chartRef.current = chart;


    const now = new Date();
    const chartData = data.map((item, index) => {
      const date = new Date(now.getFullYear(), now.getMonth() - (data.length - 1 - index), 1);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = '01';
      
      return {
        time: `${year}-${month}-${day}`,
        value: item.tenants + item.requests,
      };
    });

    const areaSeries = chart.addSeries(AreaSeries, {
      lineColor: '#fe6b24',
      topColor: 'rgba(254, 107, 36, 0.4)',
      bottomColor: 'rgba(254, 107, 36, 0.0)',
      lineWidth: 2,
    });

    areaSeries.setData(chartData);
    chart.timeScale().fitContent();
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [data]);

  const isPositiveGrowth = growthPercentage > 0;
  const growthColor = isPositiveGrowth ? 'text-green-400' : growthPercentage < 0 ? 'text-red-400' : 'text-gray-400';
  const growthSign = isPositiveGrowth ? '+' : '';

  return (
    <div className="rounded-xl border border-gray-800 bg-[#1a1a1b] p-6">
      <div className="mb-6">
        <div className="flex items-baseline justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">Monthly Growth</h3>
            <p className="text-sm text-gray-400 mt-1">
              Received Requests vs. Activated Tenants
            </p>
          </div>
          <div className="text-right">
            <p className={`text-3xl font-bold ${growthColor}`}>
              {growthSign}{growthPercentage}%
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {isPositiveGrowth ? '+' : ''}{Math.abs(growthPercentage / 4).toFixed(1)}% vs last month
            </p>
          </div>
        </div>
      </div>
      <div ref={chartContainerRef} className="w-full" />
      <div className="mt-4 flex items-center justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-[#fe6b24]" />
          <span className="text-gray-400">Combined Growth</span>
        </div>
      </div>
    </div>
  );
}
