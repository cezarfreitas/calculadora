'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ResultSectionProps {
  resultText: string;
}

export default function ResultSection({ resultText }: ResultSectionProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium text-slate-800">
          Resultado
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-slate-50 p-4 rounded border border-slate-200 max-h-80 overflow-y-auto">
          <pre className="whitespace-pre-wrap font-mono text-sm text-slate-700">
            {resultText}
          </pre>
        </div>
      </CardContent>
    </Card>
  );
}
