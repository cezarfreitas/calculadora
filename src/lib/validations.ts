/**
 * Utilitários de validação
 */

export interface ValidationError {
  field: string;
  message: string;
}

export const validatePaymentData = (data: {
  referenceValue: number | string;
  installments: number;
  downPayment: number;
  discount: number;
  installmentInterval: number;
  firstInstallmentTerm: number;
  dueDay: number;
}): ValidationError[] => {
  const errors: ValidationError[] = [];

  // Validar valor de referência
  const value = typeof data.referenceValue === 'string' 
    ? parseFloat(data.referenceValue.replace(/[^\d,-]/g, '').replace(',', '.')) || 0
    : data.referenceValue;

  if (value <= 0) {
    errors.push({
      field: 'referenceValue',
      message: 'O valor deve ser maior que zero'
    });
  }

  if (value > 999999999) {
    errors.push({
      field: 'referenceValue',
      message: 'O valor é muito grande'
    });
  }

  // Validar parcelas
  if (data.installments < 0) {
    errors.push({
      field: 'installments',
      message: 'O número de parcelas não pode ser negativo'
    });
  }

  if (data.installments > 360) {
    errors.push({
      field: 'installments',
      message: 'O número máximo de parcelas é 360'
    });
  }

  // Validar entrada
  if (data.downPayment < 0 || data.downPayment > 100) {
    errors.push({
      field: 'downPayment',
      message: 'A entrada deve estar entre 0% e 100%'
    });
  }

  // Validar desconto
  if (data.discount < 0) {
    errors.push({
      field: 'discount',
      message: 'O desconto não pode ser negativo'
    });
  }

  if (data.discount > 100) {
    errors.push({
      field: 'discount',
      message: 'O desconto não pode ser maior que 100%'
    });
  }

  // Validar intervalo
  if (data.installmentInterval < 1) {
    errors.push({
      field: 'installmentInterval',
      message: 'O intervalo deve ser pelo menos 1 dia'
    });
  }

  if (data.installmentInterval > 365) {
    errors.push({
      field: 'installmentInterval',
      message: 'O intervalo máximo é 365 dias'
    });
  }

  // Validar prazo primeira parcela
  if (data.firstInstallmentTerm < 0) {
    errors.push({
      field: 'firstInstallmentTerm',
      message: 'O prazo não pode ser negativo'
    });
  }

  // Validar dia de vencimento
  if (data.dueDay < 0 || data.dueDay > 31) {
    errors.push({
      field: 'dueDay',
      message: 'O dia de vencimento deve estar entre 1 e 31'
    });
  }

  return errors;
};


