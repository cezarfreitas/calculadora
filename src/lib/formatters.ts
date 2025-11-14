/**
 * Utilitários de formatação reutilizáveis
 */

// Função auxiliar para obter data de hoje no formato YYYY-MM-DD no fuso horário do Brasil
export const getTodayDateString = (): string => {
  try {
    // Obter data no fuso horário do Brasil (GMT-3 / America/Sao_Paulo)
    const today = new Date();
    const brazilTime = new Date(today.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));
    const year = brazilTime.getFullYear();
    const month = String(brazilTime.getMonth() + 1).padStart(2, '0');
    const day = String(brazilTime.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch {
    // Fallback caso o navegador não suporte timeZone
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
};

// Fallback para formatação de moeda
const formatCurrencyFallback = (value: number): string => {
  const formatted = value.toFixed(2).replace('.', ',');
  return `R$ ${formatted}`;
};

// Função para formatar moeda brasileira com fallback
export const formatCurrency = (value: number): string => {
  if (typeof Intl !== 'undefined' && Intl.NumberFormat) {
    try {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }).format(value);
      } catch {
        return formatCurrencyFallback(value);
      }
  }
  return formatCurrencyFallback(value);
};

// Fallback para formatação de data
const formatDateFallback = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// Função para formatar data brasileira com fallback
export const formatDateBR = (dateString: string): string => {
  if (!dateString) return '';
  
  try {
    // Adicionar 'T00:00:00' para garantir que seja tratada como local date
    const date = new Date(dateString + 'T00:00:00');
    if (isNaN(date.getTime())) {
      return dateString;
    }

    if (typeof Intl !== 'undefined' && typeof Intl.DateTimeFormat !== 'undefined') {
      try {
        return new Intl.DateTimeFormat('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          timeZone: 'America/Sao_Paulo'
        }).format(date);
        } catch {
          return formatDateFallback(date);
        }
      }
      return formatDateFallback(date);
    } catch {
      return dateString;
    }
};

// Função para formatar data para input type="date" (YYYY-MM-DD)
export const formatDateToInput = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Função para parsear valor monetário de string
export const parseCurrencyValue = (value: string | number): number => {
  if (typeof value === 'number') {
    return value;
  }
  if (typeof value === 'string') {
    return parseFloat(value.replace(/[^\d,-]/g, '').replace(',', '.')) || 0;
  }
  return 0;
};


