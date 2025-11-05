'use client';

import { PaymentData } from '@/app/page';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PaymentFormProps {
  paymentData: PaymentData;
  setPaymentData: (data: PaymentData) => void;
  formatCurrency: (value: number) => string;
  validationErrors?: Record<string, string>;
}

export default function PaymentForm({ paymentData, setPaymentData, formatCurrency, validationErrors = {} }: PaymentFormProps) {
  const handleInputChange = (field: keyof PaymentData, value: string | number) => {
    setPaymentData({ ...paymentData, [field]: value });
  };

  const handleCurrencyInput = (field: keyof PaymentData, value: string) => {
    // Permitir digitação livre, só processar quando sair do campo
    setPaymentData({ ...paymentData, [field]: value as string | number });
  };

  const handleCurrencyBlur = (field: keyof PaymentData, value: string) => {
    // Extrair valor numérico apenas no blur
    let numericValue = 0;
    if (value.includes('R$')) {
      numericValue = parseFloat(value.replace(/[^\d,-]/g, '').replace(',', '.')) || 0;
    } else {
      numericValue = parseFloat(value.replace(',', '.')) || 0;
    }
    
    setPaymentData({ ...paymentData, [field]: numericValue });
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
          <div className="space-y-1">
            <Label htmlFor="paymentMethod" className="text-sm text-black">Forma de pagamento</Label>
            <Select
              value={paymentData.paymentMethod}
              onValueChange={(value) => handleInputChange('paymentMethod', value)}
            >
              <SelectTrigger className="border-gray-300 bg-white">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-300">
                <SelectItem value="PARCELADO">Parcelado</SelectItem>
                <SelectItem value="A_VISTA">À vista</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label htmlFor="referenceValue" className="text-sm text-black">Valor</Label>
            <Input
              id="referenceValue"
              type="text"
              value={typeof paymentData.referenceValue === 'string' ? paymentData.referenceValue : (paymentData.referenceValue > 0 ? formatCurrency(paymentData.referenceValue) : '')}
              onChange={(e) => handleCurrencyInput('referenceValue', e.target.value)}
              onBlur={(e) => handleCurrencyBlur('referenceValue', e.target.value)}
              placeholder="Ex: 2970"
              className={`border-gray-300 ${validationErrors.referenceValue ? 'border-red-500' : ''}`}
              aria-invalid={!!validationErrors.referenceValue}
              aria-describedby={validationErrors.referenceValue ? 'referenceValue-error' : undefined}
            />
            {validationErrors.referenceValue && (
              <p id="referenceValue-error" className="text-xs text-red-600 mt-1">
                {validationErrors.referenceValue}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="installments" className="text-sm text-black">Parcelas</Label>
            <Input
              id="installments"
              type="number"
              value={paymentData.installments}
              onChange={(e) => handleInputChange('installments', parseInt(e.target.value) || 0)}
              min="0"
              max="360"
              className={`border-gray-300 ${validationErrors.installments ? 'border-red-500' : ''}`}
              aria-invalid={!!validationErrors.installments}
              aria-describedby={validationErrors.installments ? 'installments-error' : undefined}
            />
            {validationErrors.installments && (
              <p id="installments-error" className="text-xs text-red-600 mt-1">
                {validationErrors.installments}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="firstInstallmentTerm" className="text-sm text-black">Prazo 1ª parcela</Label>
            <Input
              id="firstInstallmentTerm"
              type="number"
              value={paymentData.firstInstallmentTerm}
              onChange={(e) => handleInputChange('firstInstallmentTerm', parseInt(e.target.value) || 0)}
              placeholder="Dias"
              className="border-gray-300"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="space-y-1">
            <Label htmlFor="entryDate" className="text-sm text-black">Data entrada</Label>
            <Input
              id="entryDate"
              type="date"
              value={paymentData.entryDate}
              onChange={(e) => handleInputChange('entryDate', e.target.value)}
              className="border-gray-300"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="downPayment" className="text-sm text-black">Entrada (%)</Label>
            <Input
              id="downPayment"
              type="number"
              value={paymentData.downPayment}
              onChange={(e) => handleInputChange('downPayment', parseFloat(e.target.value) || 0)}
              min="0"
              max="100"
              step="0.01"
              className={`border-gray-300 ${validationErrors.downPayment ? 'border-red-500' : ''}`}
              aria-invalid={!!validationErrors.downPayment}
              aria-describedby={validationErrors.downPayment ? 'downPayment-error' : undefined}
            />
            {validationErrors.downPayment && (
              <p id="downPayment-error" className="text-xs text-red-600 mt-1">
                {validationErrors.downPayment}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="discount" className="text-sm text-black">Desconto (%)</Label>
            <Input
              id="discount"
              type="number"
              value={paymentData.discount}
              onChange={(e) => handleInputChange('discount', parseFloat(e.target.value) || 0)}
              min="0"
              max="100"
              step="0.01"
              className={`border-gray-300 ${validationErrors.discount ? 'border-red-500' : ''}`}
              aria-invalid={!!validationErrors.discount}
              aria-describedby={validationErrors.discount ? 'discount-error' : undefined}
            />
            {validationErrors.discount && (
              <p id="discount-error" className="text-xs text-red-600 mt-1">
                {validationErrors.discount}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="installmentInterval" className="text-sm text-black">Intervalo</Label>
            <Input
              id="installmentInterval"
              type="number"
              value={paymentData.installmentInterval}
              onChange={(e) => handleInputChange('installmentInterval', parseInt(e.target.value) || 0)}
              placeholder="Dias"
              className="border-gray-300"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="dueDay" className="text-sm text-black">Dia vencimento</Label>
            <Input
              id="dueDay"
              type="number"
              value={paymentData.dueDay}
              onChange={(e) => handleInputChange('dueDay', parseInt(e.target.value) || 0)}
              min="1"
              max="31"
              className="border-gray-300"
            />
          </div>
        </div>
    </div>
  );
}
