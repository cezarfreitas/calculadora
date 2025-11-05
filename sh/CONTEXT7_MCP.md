# Context7 MCP - Configuração de Documentação

Este projeto está configurado para usar o Context7 MCP (Model Context Protocol) para acesso à documentação de bibliotecas.

## O que é Context7 MCP?

Context7 MCP é um serviço que fornece documentação atualizada e contextualizada para bibliotecas e frameworks populares, permitindo acesso rápido à documentação durante o desenvolvimento.

## Configuração no Cursor

Para usar o Context7 MCP no Cursor, você precisa configurá-lo nas configurações do Cursor:

### 1. Acesse as Configurações do Cursor

- Abra o Cursor
- Vá em **Settings** (ou use `Ctrl + ,`)
- Procure por **MCP** ou **Model Context Protocol**

### 2. Configuração do Context7 MCP

Adicione a seguinte configuração no arquivo de configurações do Cursor:

```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": [
        "-y",
        "@context7/mcp-server"
      ],
      "env": {
        "CONTEXT7_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

### 3. Obter API Key do Context7

1. Acesse [Context7](https://context7.com) (se disponível)
2. Crie uma conta ou faça login
3. Gere uma API Key
4. Substitua `your-api-key-here` pela sua chave

## Bibliotecas Documentadas

Este projeto utiliza as seguintes bibliotecas que podem ser documentadas via Context7:

- **Next.js 15.5.4** - Framework React para produção
- **React 19.1.0** - Biblioteca UI
- **TypeScript 5** - Tipagem estática
- **Tailwind CSS 4** - Framework CSS utilitário
- **Radix UI** - Componentes de UI acessíveis
  - @radix-ui/react-label
  - @radix-ui/react-select
  - @radix-ui/react-slot

## Uso no Desenvolvimento

Uma vez configurado, o Context7 MCP permitirá:

- Acesso rápido à documentação das bibliotecas
- Sugestões contextuais baseadas na documentação
- Exemplos de código atualizados
- Melhor autocomplete e IntelliSense

## Verificação

Para verificar se o Context7 MCP está funcionando:

1. Abra um arquivo TypeScript/TSX
2. Digite código que use uma biblioteca (ex: `import { ... } from 'next'`)
3. O Context7 deve fornecer sugestões e documentação relacionada

## Recursos Adicionais

- [Documentação do Next.js](https://nextjs.org/docs)
- [Documentação do React](https://react.dev)
- [Documentação do TypeScript](https://www.typescriptlang.org/docs)
- [Documentação do Tailwind CSS](https://tailwindcss.com/docs)

## Notas

- O Context7 MCP é opcional e não afeta o funcionamento do projeto se não estiver configurado
- A configuração é feita no nível do editor (Cursor), não no projeto
- Certifique-se de ter uma conexão com internet para acessar a documentação


