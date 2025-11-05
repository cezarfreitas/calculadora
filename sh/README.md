# Calculadora de Parcelamentos

Calculadora de pagamentos e parcelas desenvolvida com Next.js, React e TypeScript.

## 🚀 Funcionalidades

- Calculadora de parcelas com diferentes formas de pagamento
- Cálculo de entrada e descontos
- Geração de resultados formatados com quebras de linha
- Interface moderna e responsiva
- Suporte a múltiplas parcelas e intervalos personalizados

## 📋 Pré-requisitos

- Node.js 18+ 
- npm ou yarn

## 🛠️ Instalação

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Iniciar servidor de produção
npm start
```

Abra [http://localhost:3000](http://localhost:3000) no navegador para ver o resultado.

## 📚 Context7 MCP - Documentação

Este projeto está configurado para usar o Context7 MCP para acesso à documentação de bibliotecas.

Para configurar o Context7 MCP no Cursor, consulte o arquivo [CONTEXT7_MCP.md](./CONTEXT7_MCP.md) para instruções detalhadas.

### Bibliotecas Documentadas

- Next.js 15.5.4
- React 19.1.0
- TypeScript 5
- Tailwind CSS 4
- Radix UI Components

## 🏗️ Estrutura do Projeto

```
src/
├── app/              # Páginas e layouts do Next.js
│   ├── layout.tsx    # Layout principal
│   └── page.tsx      # Página inicial
├── components/       # Componentes React
│   ├── PaymentForm.tsx
│   ├── InstallmentsTable.tsx
│   ├── ResultSection.tsx
│   ├── SummarySection.tsx
│   └── ui/           # Componentes UI (shadcn/ui)
└── lib/              # Utilitários
    └── utils.ts
```

## 🧩 Tecnologias

- **Next.js 15.5.4** - Framework React
- **React 19.1.0** - Biblioteca UI
- **TypeScript 5** - Tipagem estática
- **Tailwind CSS 4** - Estilização
- **Radix UI** - Componentes acessíveis
- **shadcn/ui** - Componentes UI

## 📖 Documentação

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Context7 MCP Setup](./CONTEXT7_MCP.md)
- [Compatibilidade entre Browsers e OS](./BROWSER_COMPATIBILITY.md)

## 🚢 Deploy

O projeto pode ser deployado em:

- **Vercel** (recomendado para Next.js)
- **Docker** (usando o Dockerfile incluído)
- Qualquer plataforma que suporte Node.js

### Deploy com Docker

```bash
# Build da imagem
docker build -t payment-calculator .

# Executar container
docker run -p 3000:3000 payment-calculator
```

## 📝 Licença

Este projeto é privado.
