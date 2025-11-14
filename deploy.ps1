# Script de Deploy - Payment Calculator
# Gera build de produção e compacta em ZIP

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "  Payment Calculator - Deploy" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# 1. Limpar builds anteriores
Write-Host "1. Limpando builds anteriores..." -ForegroundColor Yellow
if (Test-Path ".next") {
    Remove-Item -Recurse -Force ".next"
    Write-Host "   ✓ Pasta .next removida" -ForegroundColor Green
}
if (Test-Path "out") {
    Remove-Item -Recurse -Force "out"
    Write-Host "   ✓ Pasta out removida" -ForegroundColor Green
}
if (Test-Path "payment-calculator-deploy.zip") {
    Remove-Item -Force "payment-calculator-deploy.zip"
    Write-Host "   ✓ ZIP anterior removido" -ForegroundColor Green
}
Write-Host ""

# 2. Instalar dependências
Write-Host "2. Instalando dependências..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "   ✗ Erro ao instalar dependências" -ForegroundColor Red
    exit 1
}
Write-Host "   ✓ Dependências instaladas" -ForegroundColor Green
Write-Host ""

# 3. Build de produção
Write-Host "3. Gerando build de produção..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "   ✗ Erro ao gerar build" -ForegroundColor Red
    exit 1
}
Write-Host "   ✓ Build gerado com sucesso" -ForegroundColor Green
Write-Host ""

# 4. Criar ZIP
Write-Host "4. Criando arquivo ZIP..." -ForegroundColor Yellow

# Arquivos e pastas para incluir no deploy
$filesToZip = @(
    ".next",
    "public",
    "package.json",
    "package-lock.json",
    "next.config.ts",
    "tsconfig.json",
    "postcss.config.mjs",
    "components.json",
    "README.md"
)

# Criar pasta temporária
$tempFolder = "temp-deploy"
if (Test-Path $tempFolder) {
    Remove-Item -Recurse -Force $tempFolder
}
New-Item -ItemType Directory -Path $tempFolder | Out-Null

# Copiar arquivos
foreach ($item in $filesToZip) {
    if (Test-Path $item) {
        Copy-Item -Path $item -Destination $tempFolder -Recurse -Force
        Write-Host "   ✓ Copiado: $item" -ForegroundColor Gray
    }
}

# Criar ZIP
Compress-Archive -Path "$tempFolder\*" -DestinationPath "payment-calculator-deploy.zip" -Force
Remove-Item -Recurse -Force $tempFolder

Write-Host "   ✓ ZIP criado com sucesso" -ForegroundColor Green
Write-Host ""

# 5. Informações finais
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "  Deploy concluído com sucesso!" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Arquivo gerado: payment-calculator-deploy.zip" -ForegroundColor White
Write-Host ""
Write-Host "Para fazer deploy:" -ForegroundColor Yellow
Write-Host "1. Extrair o ZIP no servidor" -ForegroundColor White
Write-Host "2. Executar: npm install --production" -ForegroundColor White
Write-Host "3. Executar: npm start" -ForegroundColor White
Write-Host ""

