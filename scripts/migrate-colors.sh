#!/bin/bash

# Script para migrar cores hardcoded para o sistema de cores global
# Este script faz substituições automáticas de cores hex para Colors.*

echo "🎨 Iniciando migração de cores..."

# Lista de arquivos a migrar (excluindo node_modules)
files=$(find . -type f \( -name "*.ts" -o -name "*.tsx" \) ! -path "*/node_modules/*" ! -path "*/.expo/*")

# Contador
count=0

for file in $files; do
  # Verifica se o arquivo contém cores hex
  if grep -q "#[0-9a-fA-F]\{6\}\|#[0-9a-fA-F]\{3\}" "$file" 2>/dev/null; then
    # Adiciona import se não existir
    if ! grep -q "import.*Colors.*from.*constants" "$file" 2>/dev/null; then
      # Verifica se já tem outros imports
      if grep -q "^import" "$file" 2>/dev/null; then
        # Adiciona após o último import
        sed -i "/^import/a import { Colors } from '@/constants';" "$file"
      else
        # Adiciona no início do arquivo
        sed -i "1i import { Colors } from '@/constants';" "$file"
      fi
    fi

    # Substituições de cores
    sed -i "s/'#1f2937'/Colors.primary.DEFAULT/g" "$file"
    sed -i 's/"#1f2937"/Colors.primary.DEFAULT/g' "$file"

    sed -i "s/'#111827'/Colors.primary.dark/g" "$file"
    sed -i 's/"#111827"/Colors.primary.dark/g' "$file"

    sed -i "s/'#374151'/Colors.primary.light/g" "$file"
    sed -i 's/"#374151"/Colors.primary.light/g' "$file"

    sed -i "s/'#4b5563'/Colors.text.secondary/g" "$file"
    sed -i 's/"#4b5563"/Colors.text.secondary/g' "$file"

    sed -i "s/'#6b7280'/Colors.text.tertiary/g" "$file"
    sed -i 's/"#6b7280"/Colors.text.tertiary/g' "$file"

    sed -i "s/'#9ca3af'/Colors.text.placeholder/g" "$file"
    sed -i 's/"#9ca3af"/Colors.text.placeholder/g' "$file"

    sed -i "s/'#ffffff'/Colors.background.primary/g" "$file"
    sed -i 's/"#ffffff"/Colors.background.primary/g' "$file"

    sed -i "s/'#fff'/Colors.background.primary/g" "$file"
    sed -i 's/"#fff"/Colors.background.primary/g' "$file"

    sed -i "s/'#f9fafb'/Colors.background.secondary/g" "$file"
    sed -i 's/"#f9fafb"/Colors.background.secondary/g' "$file"

    sed -i "s/'#f3f4f6'/Colors.background.tertiary/g" "$file"
    sed -i 's/"#f3f4f6"/Colors.background.tertiary/g' "$file"

    sed -i "s/'#e5e7eb'/Colors.border.DEFAULT/g" "$file"
    sed -i 's/"#e5e7eb"/Colors.border.DEFAULT/g' "$file"

    sed -i "s/'#d1d5db'/Colors.border.dark/g" "$file"
    sed -i 's/"#d1d5db"/Colors.border.dark/g' "$file"

    sed -i "s/'#10b981'/Colors.success.DEFAULT/g" "$file"
    sed -i 's/"#10b981"/Colors.success.DEFAULT/g' "$file"

    sed -i "s/'#ef4444'/Colors.error.DEFAULT/g" "$file"
    sed -i 's/"#ef4444"/Colors.error.DEFAULT/g' "$file"

    sed -i "s/'#f59e0b'/Colors.warning.DEFAULT/g" "$file"
    sed -i 's/"#f59e0b"/Colors.warning.DEFAULT/g' "$file"

    sed -i "s/'#3b82f6'/Colors.info.DEFAULT/g" "$file"
    sed -i 's/"#3b82f6"/Colors.info.DEFAULT/g' "$file"

    echo "✅ Migrado: $file"
    ((count++))
  fi
done

echo ""
echo "🎉 Migração concluída!"
echo "📊 Total de arquivos migrados: $count"
