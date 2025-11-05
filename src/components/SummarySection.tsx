'use client';

import { Summary } from '@/app/page';
import { Card, CardContent } from '@/components/ui/card';

interface SummarySectionProps {
  summary: Summary;
  formatCurrency: (value: number) => string;
}

export default function SummarySection({ summary, formatCurrency }: SummarySectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <label className="block text-sm font-medium text-slate-600 mb-1">
              Subtotal
            </label>
            <div className="text-xl font-bold text-slate-800">
              {formatCurrency(summary.subtotal)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <label className="block text-sm font-medium text-slate-600 mb-1">
              Desconto
            </label>
            <div className="text-xl font-bold text-slate-800">
              {formatCurrency(summary.financialDiscount)}
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-2 border-green-200 bg-green-50">
          <CardContent className="p-4 text-center">
            <label className="block text-sm font-medium text-green-600 mb-1">
              Total
            </label>
            <div className="text-xl font-bold text-green-800">
              {formatCurrency(summary.total)}
            </div>
          </CardContent>
        </Card>
    </div>
  );
}
