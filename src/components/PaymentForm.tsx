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
    // Se mudar para À VISTA, zerar entrada e setar 1 parcela
    if (field === 'paymentMethod' && value === 'A_VISTA') {
      setPaymentData({ 
        ...paymentData, 
        [field]: value,
        downPayment: 0,
        installments: 1
      });
    } else {
      setPaymentData({ ...paymentData, [field]: value });
    }
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
    <div className="space-y-4">
      {/* Linha 1: Dados Principais do Valor */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="space-y-1">
          <Label htmlFor="referenceValue" className="text-xs text-black">Valor</Label>
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
          <Label htmlFor="discount" className="text-xs text-black">Desconto (%)</Label>
          <Input
            id="discount"
            type="number"
            value={paymentData.discount}
            onChange={(e) => handleInputChange('discount', parseFloat(e.target.value) || 0)}
            min="0"
            max="100"
            step="0.01"
            placeholder="0"
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
          <Label htmlFor="downPayment" className="text-xs text-black">Entrada (%)</Label>
          <Input
            id="downPayment"
            type="number"
            value={paymentData.downPayment}
            onChange={(e) => handleInputChange('downPayment', parseFloat(e.target.value) || 0)}
            min="0"
            max="100"
            step="0.01"
            placeholder="0"
            disabled={paymentData.paymentMethod === 'A_VISTA'}
            className={`border-gray-300 ${validationErrors.downPayment ? 'border-red-500' : ''} ${paymentData.paymentMethod === 'A_VISTA' ? 'bg-gray-100 cursor-not-allowed' : ''}`}
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
          <Label htmlFor="installments" className="text-xs text-black">Parcelas</Label>
          <Input
            id="installments"
            type="number"
            value={paymentData.installments}
            onChange={(e) => handleInputChange('installments', parseInt(e.target.value) || 0)}
            min="0"
            max="360"
            placeholder="1"
            disabled={paymentData.paymentMethod === 'A_VISTA'}
            className={`border-gray-300 ${validationErrors.installments ? 'border-red-500' : ''} ${paymentData.paymentMethod === 'A_VISTA' ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            aria-invalid={!!validationErrors.installments}
            aria-describedby={validationErrors.installments ? 'installments-error' : undefined}
          />
          {validationErrors.installments && (
            <p id="installments-error" className="text-xs text-red-600 mt-1">
              {validationErrors.installments}
            </p>
          )}
        </div>
      </div>

      {/* Linha 2: Formas de Pagamento e Data */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <div className="space-y-1">
          <Label htmlFor="paymentMethod" className="text-xs text-black">Forma de Pgto</Label>
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
          <Label htmlFor="defaultPaymentMethod" className="text-xs text-black">Meio de Pgto</Label>
          <Select
            value={paymentData.defaultPaymentMethod}
            onValueChange={(value) => handleInputChange('defaultPaymentMethod', value)}
          >
            <SelectTrigger className="border-gray-300 bg-white">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent className="bg-white border-gray-300">
              <SelectItem value="Boleto">Boleto</SelectItem>
              <SelectItem value="Cartão">Cartão</SelectItem>
              <SelectItem value="PIX">PIX</SelectItem>
              <SelectItem value="Transferência">Transferência</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label htmlFor="entryDate" className="text-xs text-black">Data Entrada</Label>
          <Input
            id="entryDate"
            type="date"
            value={paymentData.entryDate}
            onChange={(e) => handleInputChange('entryDate', e.target.value)}
            className="border-gray-300 cursor-pointer date-input"
            lang="pt-BR"
          />
        </div>
      </div>

      {/* Linha 3: Configurações de Vencimento */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <div className="space-y-1">
          <Label htmlFor="firstInstallmentTerm" className="text-xs text-black">Prazo 1ª (dias)</Label>
          <Input
            id="firstInstallmentTerm"
            type="number"
            value={paymentData.firstInstallmentTerm}
            onChange={(e) => handleInputChange('firstInstallmentTerm', parseInt(e.target.value) || 0)}
            placeholder="0"
            min="0"
            className="border-gray-300"
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="installmentInterval" className="text-xs text-black">Intervalo (dias)</Label>
          <Input
            id="installmentInterval"
            type="number"
            value={paymentData.installmentInterval}
            onChange={(e) => handleInputChange('installmentInterval', parseInt(e.target.value) || 0)}
            placeholder="30"
            min="1"
            className="border-gray-300"
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="dueDay" className="text-xs text-black">Dia Vencimento</Label>
          <Input
            id="dueDay"
            type="number"
            value={paymentData.dueDay}
            onChange={(e) => handleInputChange('dueDay', parseInt(e.target.value) || 0)}
            min="0"
            max="31"
            placeholder="0 = auto"
            className="border-gray-300"
          />
        </div>
      </div>
    </div>
  );
}
