/**
 * Polyfills e utilitários de compatibilidade para browsers antigos
 */

// Polyfill para String.padStart (IE 11)
if (!String.prototype.padStart) {
  String.prototype.padStart = function (maxLength: number, fillString?: string): string {
    const str = String(this);
    if (str.length >= maxLength) {
      return str;
    }
    fillString = fillString !== undefined ? String(fillString) : ' ';
    const fillLength = maxLength - str.length;
    const fill = fillString.repeat(Math.ceil(fillLength / fillString.length));
    return fill.slice(0, fillLength) + str;
  };
}

// Polyfill para String.padEnd (IE 11)
if (!String.prototype.padEnd) {
  String.prototype.padEnd = function (maxLength: number, fillString?: string): string {
    const str = String(this);
    if (str.length >= maxLength) {
      return str;
    }
    fillString = fillString !== undefined ? String(fillString) : ' ';
    const fillLength = maxLength - str.length;
    const fill = fillString.repeat(Math.ceil(fillLength / fillString.length));
    return str + fill.slice(0, fillLength);
  };
}

// Verificar suporte a features modernas
export const checkBrowserSupport = () => {
  const features = {
    intl: typeof Intl !== 'undefined',
    clipboard: typeof navigator !== 'undefined' && navigator.clipboard !== undefined,
    dateInput: (() => {
      const input = document.createElement('input');
      input.type = 'date';
      return input.type === 'date';
    })(),
    numberInput: (() => {
      const input = document.createElement('input');
      input.type = 'number';
      return input.type === 'number';
    })(),
    flexbox: CSS.supports('display', 'flex'),
    grid: CSS.supports('display', 'grid'),
    cssVariables: CSS.supports('--custom', 'property'),
  };

  return features;
};

// Log de compatibilidade (apenas em desenvolvimento)
if (process.env.NODE_ENV === 'development') {
  if (typeof window !== 'undefined') {
    const support = checkBrowserSupport();
    const unsupported = Object.entries(support)
      .filter(([, supported]) => !supported)
      .map(([feature]) => feature);

    if (unsupported.length > 0) {
      console.warn('Features não suportadas:', unsupported);
    }
  }
}

