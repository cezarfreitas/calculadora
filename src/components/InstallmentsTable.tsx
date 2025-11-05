'use client';

import { Installment } from '@/app/page';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface InstallmentsTableProps {
  installments: Installment[];
  setInstallments: (installments: Installment[]) => void;
  formatCurrency: (value: number) => string;
  formatDateBR: (dateString: string) => string;
}

export default function InstallmentsTable({ installments, setInstallments, formatCurrency }: InstallmentsTableProps) {
  const handleValueChange = (id: string, value: string) => {
    const numericValue = parseFloat(value.replace(/[^\d,-]/g, '').replace(',', '.')) || 0;
    
    setInstallments(
      installments.map(installment =>
        installment.id === id
          ? { ...installment, value: numericValue }
          : installment
      )
    );
  };

  const handleDateChange = (id: string, date: string) => {
    setInstallments(
      installments.map(installment =>
        installment.id === id
          ? { ...installment, dueDate: date }
          : installment
      )
    );
  };

  const handlePaymentMethodChange = (id: string, method: string) => {
    setInstallments(
      installments.map(installment =>
        installment.id === id
          ? { ...installment, paymentMethod: method }
          : installment
      )
    );
  };

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-medium text-slate-800">Parcelas</h3>
      <div className="rounded-lg border border-slate-200">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Parcela</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Data de vencimento</TableHead>
              <TableHead>Meio de pagamento</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {installments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-slate-500 py-8">
                  Nenhuma parcela calculada. Digite um valor de referência e configure as parcelas.
                </TableCell>
              </TableRow>
            ) : (
              installments.map((installment) => (
                <TableRow key={installment.id}>
                  <TableCell>
                    <Input
                      type="text"
                      value={installment.description}
                      readOnly
                      className="bg-slate-50 text-slate-600"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="text"
                      value={formatCurrency(installment.value)}
                      onChange={(e) => handleValueChange(installment.id, e.target.value)}
                      onBlur={(e) => {
                        const value = e.target.value;
                        if (!value.includes('R$') && value) {
                          e.target.value = formatCurrency(parseFloat(value) || 0);
                        }
                      }}
                      className="text-right"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="date"
                      value={installment.dueDate}
                      onChange={(e) => handleDateChange(installment.id, e.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <Select
                      value={installment.paymentMethod}
                      onValueChange={(value) => handlePaymentMethodChange(installment.id, value)}
                    >
                      <SelectTrigger className="bg-white border-gray-300">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-300">
                        <SelectItem value="Boleto">Boleto</SelectItem>
                        <SelectItem value="Cartão">Cartão</SelectItem>
                        <SelectItem value="PIX">PIX</SelectItem>
                        <SelectItem value="Transferência">Transferência</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
