import React, { useState } from 'react';
import { ArrowDownRight, ArrowUpRight, Table as TableIcon } from 'lucide-react';
import { formatNumber } from '../../utils/formatters';
import { Card } from './UIPrimitives';

export const KpiCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: number | string;
  unit?: string;
  trendText?: string;
  trendDirection?: 'up' | 'down' | 'neutral';
}> = ({ icon, label, value, unit, trendText, trendDirection = 'neutral' }) => {
  return (
    <Card padding="md" className="flex items-start justify-between gap-3">
      <div className="flex items-start gap-3.5">
        <div className="w-12 h-12 rounded-[var(--radius-md)] bg-[var(--color-light-teal)] text-[var(--color-dark-teal)] flex items-center justify-center shrink-0">
          {icon}
        </div>
        <div>
          <p className="text-[14px] text-[var(--color-secondary-text)] mb-1">{label}</p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-[28px] sm:text-[30px] font-bold tabular-nums leading-none text-[var(--color-primary-text)]">
              {typeof value === 'number' ? formatNumber(value) : value}
            </span>
            {unit && (
              <span className="text-[13px] font-semibold text-[var(--color-secondary-text)]">
                {unit}
              </span>
            )}
          </div>
          {trendText && (
            <div
              className={`inline-flex items-center gap-1 text-[13px] font-semibold mt-2 ${
                trendDirection === 'up'
                  ? 'text-[var(--color-green)]'
                  : trendDirection === 'down'
                  ? 'text-[var(--color-red)]'
                  : 'text-[var(--color-secondary-text)]'
              }`}
            >
              {trendDirection === 'up' && <ArrowUpRight className="w-4 h-4 shrink-0" />}
              {trendDirection === 'down' && <ArrowDownRight className="w-4 h-4 shrink-0" />}
              <span>{trendText}</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export const SegmentedStatusBar: React.FC<{
  title: string;
  items: { label: string; count: number; colorVar: string }[];
}> = ({ title, items }) => {
  const [showTable, setShowTable] = useState(false);
  const total = items.reduce((sum, item) => sum + item.count, 0) || 1;
  const summaryLabel = items.map((i) => `${i.label}: ${i.count}`).join('، ');

  return (
    <Card padding="md">
      <div className="flex items-center justify-between gap-2 mb-3">
        <h3 className="text-[16px] font-bold">{title}</h3>
        <button
          type="button"
          onClick={() => setShowTable((s) => !s)}
          className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[var(--color-dark-teal)] hover:underline cursor-pointer"
        >
          <TableIcon className="w-4 h-4" />
          <span>{showTable ? 'إخفاء الجدول' : 'عرض البيانات'}</span>
        </button>
      </div>

      <div
        role="img"
        aria-label={`${title} — ${summaryLabel}`}
        className="w-full h-3.5 rounded-full bg-[var(--color-muted)] overflow-hidden flex gap-0.5 mb-3"
      >
        {items.map((item) => {
          const widthPct = Math.max(4, Math.round((item.count / total) * 100));
          if (item.count === 0) return null;
          return (
            <div
              key={item.label}
              style={{
                width: `${widthPct}%`,
                backgroundColor: `var(${item.colorVar})`,
              }}
              title={`${item.label}: ${item.count}`}
            />
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-4 text-[13px] text-[var(--color-secondary-text)]">
        {items.map((item) => (
          <div key={item.label} className="inline-flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-sm shrink-0"
              style={{ backgroundColor: `var(${item.colorVar})` }}
            />
            <span>{item.label}:</span>
            <strong className="tabular-nums text-[var(--color-primary-text)]">
              {formatNumber(item.count)}
            </strong>
          </div>
        ))}
      </div>

      {showTable && (
        <table className="w-full mt-3 text-[13px] border-t border-[var(--color-border)]">
          <thead>
            <tr className="text-[var(--color-secondary-text)] border-b border-[var(--color-border)]">
              <th className="py-1.5 text-start">الحالة</th>
              <th className="py-1.5 text-end">العدد</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.label} className="border-b border-[var(--color-border)]/50">
                <td className="py-1.5 text-start">{item.label}</td>
                <td className="py-1.5 text-end tabular-nums font-bold">{item.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Card>
  );
};
