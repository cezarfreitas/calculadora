'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import '@/lib/polyfills';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import PaymentForm from '@/components/PaymentForm';
import InstallmentsTable from '@/components/InstallmentsTable';
import SummarySection from '@/components/SummarySection';
import ResultSection from '@/components/ResultSection';
import { ToastContainer } from '@/components/ui/toast';
import { formatCurrency, formatDateBR, formatDateToInput, parseCurrencyValue, getTodayDateString } from '@/lib/formatters';
import { validatePaymentData } from '@/lib/validations';

export interface PaymentData {
  referenceValue: number | string;
  paymentMethod: string;
  installments: number;
  entryDate: string;
  downPayment: number;
  discount: number;
  installmentInterval: number;
  firstInstallmentTerm: number;
  dueDay: number;
  defaultPaymentMethod: string;
}

export interface Installment {
  id: string;
  description: string;
  value: number;
  dueDate: string;
  paymentMethod: string;
}

export interface Summary {
  subtotal: number;
  financialDiscount: number;
  total: number;
}

interface Toast {
  id: string;
  message: string;
  type?: 'success' | 'error' | 'info';
}

export default function Home() {
  const [paymentData, setPaymentData] = useState<PaymentData>({
    referenceValue: 1,
    paymentMethod: 'PARCELADO',
    installments: 1,
    entryDate: getTodayDateString(),
    downPayment: 0,
    discount: 0,
    installmentInterval: 30,
    firstInstallmentTerm: 0,
    dueDay: 0,
    defaultPaymentMethod: 'Boleto',
  });

  const [installments, setInstallments] = useState<Installment[]>([]);
  const [summary, setSummary] = useState<Summary>({
    subtotal: 0,
    financialDiscount: 0,
    total: 0,
  });
  const [resultText, setResultText] = useState<string>('');
  const [showResult, setShowResult] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Função para adicionar toast
  const addToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Math.random().toString(36).substring(7);
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  // Função para remover toast
  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  // Função para gerar parcelas
  const generateInstallments = useCallback((total: number, cashValue: number) => {
    const newInstallments: Installment[] = [];

    // Adicionar entrada à vista
    if (paymentData.downPayment > 0) {
      newInstallments.push({
        id: 'cash',
        description: 'À vista',
        value: cashValue,
        dueDate: paymentData.entryDate,
        paymentMethod: paymentData.defaultPaymentMethod,
      });
    }

    // Limpar parcelas se o número de parcelas for 0
    if (paymentData.installments === 0) {
      setInstallments(newInstallments);
      return;
    }

    // Adicionar parcelas se necessário
    if (paymentData.installments > 0) {
      const remainingValue = total - cashValue;
      const installmentValue = remainingValue / paymentData.installments;

      // Calcular data base para primeira parcela
      let baseDate = new Date();
      baseDate.setDate(baseDate.getDate() + paymentData.firstInstallmentTerm);
      
      // Se dueDay estiver definido, ajustar a data base para o primeiro dia do mês do vencimento
      if (paymentData.dueDay > 0 && paymentData.dueDay <= 31) {
        // Ajustar para o próximo mês com o dia especificado
        baseDate.setMonth(baseDate.getMonth() + 1);
        baseDate.setDate(paymentData.dueDay);
        
        // Verificar se o dia existe no mês
        if (baseDate.getDate() !== paymentData.dueDay) {
          // Se não existe, usar o último dia do mês
          baseDate = new Date(baseDate.getFullYear(), baseDate.getMonth() + 1, 0);
        }
      }

      for (let i = 1; i <= paymentData.installments; i++) {
        let dueDate: Date;
        
        // Se dueDay estiver definido (1-31), usar o mesmo dia do mês para todas as parcelas
        if (paymentData.dueDay > 0 && paymentData.dueDay <= 31) {
          // Calcular quantos meses adicionar baseado no intervalo
          // Se intervalo é ~30 dias, adiciona 1 mês por parcela
          const monthsToAdd = (i - 1) * Math.floor(paymentData.installmentInterval / 30);
          
          // Criar data baseada na primeira parcela + meses
          dueDate = new Date(baseDate);
          dueDate.setMonth(dueDate.getMonth() + monthsToAdd);
          
          // Definir o dia do mês
          const targetDay = paymentData.dueDay;
          dueDate.setDate(targetDay);
          
          // Verificar se o dia foi definido corretamente (trata casos como 31 em fevereiro)
          if (dueDate.getDate() !== targetDay) {
            // Se o dia não existe no mês, usar o último dia do mês
            dueDate = new Date(dueDate.getFullYear(), dueDate.getMonth() + 1, 0);
          }
        } else {
          // Comportamento padrão: usar intervalo em dias
          dueDate = new Date(baseDate);
          dueDate.setDate(
            dueDate.getDate() + 
            (i * paymentData.installmentInterval)
          );
        }

        newInstallments.push({
          id: `installment-${i}`,
          description: `${i}ª parcela`,
          value: installmentValue,
          dueDate: formatDateToInput(dueDate),
          paymentMethod: paymentData.defaultPaymentMethod,
        });
      }
    }

    setInstallments(newInstallments);
  }, [paymentData.downPayment, paymentData.entryDate, paymentData.installments, paymentData.firstInstallmentTerm, paymentData.installmentInterval, paymentData.dueDay, paymentData.defaultPaymentMethod]);

  // Validar dados antes de calcular
  const validationErrorsMemo = useMemo(() => {
    const errors = validatePaymentData(paymentData);
    const errorMap: Record<string, string> = {};
    errors.forEach((error) => {
      errorMap[error.field] = error.message;
    });
    return errorMap;
  }, [paymentData]);

  // Atualizar erros de validação
  useEffect(() => {
    setValidationErrors(validationErrorsMemo);
  }, [validationErrorsMemo]);

  // Função para calcular pagamento
  const calculatePayment = useCallback(() => {
    // Validar antes de calcular
    const errors = validatePaymentData(paymentData);
    if (errors.length > 0) {
      const firstError = errors[0];
      addToast(firstError.message, 'error');
      return;
    }

    // Converter referenceValue para número
    const subtotal = parseCurrencyValue(paymentData.referenceValue);
    
    if (subtotal <= 0) {
      // Se não há valor, limpar parcelas se número de parcelas for 0
      if (paymentData.installments === 0) {
        setInstallments([]);
      }
      return;
    }

    const financialDiscountValue = (subtotal * paymentData.discount) / 100;
    const total = subtotal - financialDiscountValue;
    const cashValue = (total * paymentData.downPayment) / 100;

    setSummary({
      subtotal,
      financialDiscount: financialDiscountValue,
      total,
    });

    // Gerar parcelas - sempre recria com o número correto
    generateInstallments(total, cashValue);
  }, [paymentData, generateInstallments, addToast]);

  // Função para gerar resultado em texto
  const generateResult = useCallback(() => {
    // Validar antes de gerar
    const errors = validatePaymentData(paymentData);
    if (errors.length > 0) {
      addToast('Por favor, corrija os erros antes de gerar o resultado', 'error');
      return;
    }

    if (installments.length === 0) {
      addToast('Nenhuma parcela calculada. Configure os valores primeiro.', 'error');
      return;
    }

    let result = '';
    const referenceValue = parseCurrencyValue(paymentData.referenceValue);
    
    result += `Valor: ${formatCurrency(referenceValue)} | Forma: ${paymentData.paymentMethod} | Parcelas: ${paymentData.installments}\n`;
    result += `Entrada: ${paymentData.downPayment}% | Desconto: ${paymentData.discount}% | Data: ${formatDateBR(paymentData.entryDate)}\n\n`;
    result += `Subtotal: ${formatCurrency(summary.subtotal)} | Total: ${formatCurrency(summary.total)}\n\n`;

    // Adicionar parcelas com quebra de linha
    installments.forEach((installment) => {
      result += `${installment.description}: ${formatCurrency(installment.value)} - ${formatDateBR(installment.dueDate)} - ${installment.paymentMethod}\n`;
    });

    setResultText(result);
    setShowResult(true);
    addToast('Resultado gerado com sucesso!', 'success');
  }, [paymentData, installments, summary, addToast]);

  // Função para copiar resultado com fallback
  const copyResult = useCallback(async () => {
    if (!resultText) {
      addToast('Nenhum resultado para copiar', 'error');
      return;
    }

    try {
      // Verificar se Clipboard API está disponível (HTTPS ou localhost)
      if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        await navigator.clipboard.writeText(resultText);
        setCopied(true);
        addToast('Resultado copiado para a área de transferência!', 'success');
        setTimeout(() => setCopied(false), 2000);
        return;
      }
      
      // Fallback para browsers antigos ou HTTP
      const textArea = document.createElement('textarea');
      textArea.value = resultText;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      try {
        const successful = document.execCommand('copy');
        if (successful) {
          setCopied(true);
          addToast('Resultado copiado para a área de transferência!', 'success');
          setTimeout(() => setCopied(false), 2000);
        } else {
          throw new Error('Falha ao copiar');
        }
      } catch (err) {
        console.error('Erro ao copiar:', err);
        addToast('Não foi possível copiar. Selecione o texto manualmente.', 'error');
      } finally {
        document.body.removeChild(textArea);
      }
    } catch (err) {
      console.error('Erro ao copiar:', err);
      addToast('Não foi possível copiar. Selecione o texto manualmente.', 'error');
    }
  }, [resultText, addToast]);

  // Função para limpar formulário
  const clearForm = useCallback(() => {
    setPaymentData({
      referenceValue: 1,
      paymentMethod: 'PARCELADO',
      installments: 1,
      entryDate: getTodayDateString(),
      downPayment: 0,
      discount: 0,
      installmentInterval: 30,
      firstInstallmentTerm: 0,
      dueDay: 0,
      defaultPaymentMethod: 'Boleto',
    });
    setInstallments([]);
    setSummary({ subtotal: 0, financialDiscount: 0, total: 0 });
    setShowResult(false);
    setValidationErrors({});
    addToast('Formulário limpo', 'info');
  }, [addToast]);


  // Recalcular quando os dados mudarem (apenas se válidos)
  useEffect(() => {
    const referenceValue = parseCurrencyValue(paymentData.referenceValue);
    
    // Se há valor válido e sem erros, recalcular
    if (referenceValue > 0 && Object.keys(validationErrors).length === 0) {
      calculatePayment();
    }
  }, [paymentData, calculatePayment, validationErrors]);

  // Efeito específico para quando o número de parcelas mudar
  useEffect(() => {
    // Se o número de parcelas for 0, limpar todas as parcelas (exceto entrada)
    if (paymentData.installments === 0) {
      setInstallments(prev => prev.filter(inst => inst.id === 'cash'));
      return;
    }

    // Se há parcelas existentes e o número foi reduzido, forçar recálculo
    const referenceValue = parseCurrencyValue(paymentData.referenceValue);
    if (referenceValue > 0 && installments.length > paymentData.installments) {
      // Recalcular para atualizar o número de parcelas
      calculatePayment();
    }
  }, [paymentData.installments, paymentData.referenceValue, calculatePayment, installments.length]);

  return (
    <div className="min-h-screen bg-white py-4">
      <div className="max-w-7xl mx-auto px-4">
        {/* Primeira Linha - Duas Colunas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Coluna Esquerda - Formulário e Resultado */}
          <div className="space-y-4">
            <Card className="border border-gray-200">
              <CardContent className="p-4 space-y-4">
                <PaymentForm
                  paymentData={paymentData}
                  setPaymentData={setPaymentData}
                  formatCurrency={formatCurrency}
                  validationErrors={validationErrors}
                />

                <SummarySection summary={summary} formatCurrency={formatCurrency} />

                <div className="flex flex-wrap justify-center gap-2 pt-3 border-t border-gray-200">
                  <Button 
                    variant="outline" 
                    onClick={generateResult} 
                    size="sm" 
                    className="border-gray-300 text-black hover:bg-gray-50 transition-colors"
                    aria-label="Gerar resultado do cálculo"
                  >
                    Gerar Resultado
                  </Button>
                  {showResult && (
                    <Button 
                      variant="outline" 
                      onClick={copyResult} 
                      size="sm" 
                      className="border-gray-300 text-black hover:bg-gray-50 transition-colors"
                      aria-label={copied ? 'Resultado copiado' : 'Copiar resultado'}
                    >
                      {copied ? 'Copiado!' : 'Copiar'}
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    onClick={clearForm} 
                    size="sm" 
                    className="border-gray-300 text-black hover:bg-gray-50 transition-colors"
                    aria-label="Limpar formulário"
                  >
                    Limpar
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Resultado abaixo dos botões */}
            {showResult && (
              <ResultSection resultText={resultText} />
            )}
          </div>

          {/* Coluna Direita - Parcelas */}
          <InstallmentsTable
            installments={installments}
            setInstallments={setInstallments}
            formatCurrency={formatCurrency}
            formatDateBR={formatDateBR}
          />
        </div>

        <ToastContainer toasts={toasts} removeToast={removeToast} />
      </div>
    </div>
  );
}