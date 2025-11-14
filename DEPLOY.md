# 📦 Guia de Deploy - Payment Calculator

## 🚀 Gerar Deploy em ZIP

### Opção 1: Usando npm (Recomendado)

```bash
npm run deploy
```

### Opção 2: Executar script diretamente

```powershell
powershell -ExecutionPolicy Bypass -File ./deploy.ps1
```

## 📋 O que o script faz?

1. ✅ Limpa builds anteriores (`.next`, `out`, ZIP antigo)
2. ✅ Instala dependências atualizadas
3. ✅ Gera build de produção otimizado
4. ✅ Cria arquivo `payment-calculator-deploy.zip`

## 📦 Conteúdo do ZIP

O arquivo ZIP contém:
- `.next/` - Build de produção
- `public/` - Arquivos estáticos
- `package.json` - Dependências
- `package-lock.json` - Lock de versões
- `next.config.ts` - Configuração Next.js
- `tsconfig.json` - Configuração TypeScript
- `postcss.config.mjs` - Configuração PostCSS
- `components.json` - Configuração de componentes
- `README.md` - Documentação

## 🖥️ Deploy no Servidor

### 1. Extrair o ZIP

```bash
unzip payment-calculator-deploy.zip -d /caminho/do/servidor
cd /caminho/do/servidor
```

### 2. Instalar dependências de produção

```bash
npm install --production
```

### 3. Iniciar aplicação

```bash
npm start
```

A aplicação estará disponível em: `http://localhost:3000`

## 🔧 Configurações Avançadas

### Mudar porta

```bash
PORT=8080 npm start
```

### Usar PM2 (Recomendado para produção)

```bash
# Instalar PM2
npm install -g pm2

# Iniciar aplicação
pm2 start npm --name "payment-calculator" -- start

# Ver logs
pm2 logs payment-calculator

# Reiniciar
pm2 restart payment-calculator

# Parar
pm2 stop payment-calculator
```

### Usar com Nginx (Proxy Reverso)

```nginx
server {
    listen 80;
    server_name seu-dominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 🌐 Deploy em Plataformas Cloud

### Vercel (Recomendado)

```bash
npm install -g vercel
vercel
```

### Netlify

```bash
npm install -g netlify-cli
netlify deploy --prod
```

### Docker

```bash
docker build -t payment-calculator .
docker run -p 3000:3000 payment-calculator
```

## ⚠️ Requisitos do Servidor

- **Node.js**: v20 ou superior
- **NPM**: v10 ou superior
- **Memória RAM**: Mínimo 512MB
- **Espaço em disco**: ~200MB

## 🔍 Verificar Build

Antes de fazer deploy, você pode testar localmente:

```bash
npm run build
npm start
```

Acesse: `http://localhost:3000`

## 📝 Notas Importantes

- ✅ O build é otimizado para produção
- ✅ Arquivos são minificados e comprimidos
- ✅ Imagens são otimizadas automaticamente
- ✅ CSS é extraído e otimizado
- ✅ JavaScript é dividido em chunks

## 🆘 Solução de Problemas

### Erro: "Cannot find module"
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Erro: "Port already in use"
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

### Build muito lento
```bash
# Limpar cache do Next.js
rm -rf .next
npm run build
```

## 📞 Suporte

Para problemas ou dúvidas:
1. Verifique os logs: `npm start`
2. Consulte a documentação do Next.js
3. Abra uma issue no repositório

