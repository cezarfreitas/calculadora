# Script de limpeza de arquivos desnecessários
# Remove arquivos temporários, cache e builds

Write-Host "Limpando arquivos desnecessários..." -ForegroundColor Yellow

# Remover diretórios de build
$buildDirs = @('.next', 'out', 'build', 'dist', '.vercel', '.cache')
foreach ($dir in $buildDirs) {
    if (Test-Path $dir) {
        Write-Host "Removendo $dir..." -ForegroundColor Gray
        Remove-Item -Path $dir -Recurse -Force -ErrorAction SilentlyContinue
    }
}

# Remover arquivos temporários
$tempFiles = @('*.log', '*.tmp', '*.cache', '*.bak', '*.swp', '*.swo', '*~')
foreach ($pattern in $tempFiles) {
    Get-ChildItem -Path . -Recurse -File -Force -Filter $pattern -ErrorAction SilentlyContinue | 
        ForEach-Object {
            Write-Host "Removendo $($_.FullName)..." -ForegroundColor Gray
            Remove-Item -Path $_.FullName -Force -ErrorAction SilentlyContinue
        }
}

# Remover arquivos do sistema
$systemFiles = @('.DS_Store', 'Thumbs.db')
foreach ($file in $systemFiles) {
    Get-ChildItem -Path . -Recurse -File -Force -Filter $file -ErrorAction SilentlyContinue | 
        ForEach-Object {
            Write-Host "Removendo $($_.FullName)..." -ForegroundColor Gray
            Remove-Item -Path $_.FullName -Force -ErrorAction SilentlyContinue
        }
}

Write-Host "Limpeza concluída!" -ForegroundColor Green

