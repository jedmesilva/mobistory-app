#!/usr/bin/env python3
"""
Script para corrigir erros de sintaxe nas cores migradas.
Adiciona chaves {} onde necessário nos atributos de cor.
"""

import os
import re
from pathlib import Path

def fix_color_syntax(file_path):
    """Corrige sintaxe de cores em um arquivo."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        original = content

        # Corrige color={Colors. onde faltam as chaves finais
        content = re.sub(r'color=\{(Colors\.[a-zA-Z.]+)\s', r'color={\1} ', content)

        # Corrige placeholderTextColor={Colors. onde faltam as chaves finais
        content = re.sub(r'placeholderTextColor=\{(Colors\.[a-zA-Z.]+)\s', r'placeholderTextColor={\1} ', content)

        # Corrige fill={Colors. onde faltam as chaves finais
        content = re.sub(r'fill=\{(Colors\.[a-zA-Z.]+)\s', r'fill={\1} ', content)

        if content != original:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        return False

    except Exception as e:
        print(f"[ERRO] Erro ao corrigir {file_path}: {e}")
        return False

def main():
    """Função principal."""
    print("Corrigindo erros de sintaxe nas cores...\n")

    root_dir = Path(__file__).parent.parent
    fixed_count = 0

    # Procura por arquivos .ts e .tsx
    for file_path in root_dir.rglob('*.ts*'):
        skip_dirs = {'node_modules', '.expo', '.git', 'scripts'}
        if any(skip_dir in file_path.parts for skip_dir in skip_dirs):
            continue

        if file_path.name.endswith('.d.ts'):
            continue

        if fix_color_syntax(file_path):
            print(f"[OK] Corrigido: {file_path.relative_to(root_dir)}")
            fixed_count += 1

    print(f"\nConcluido! Arquivos corrigidos: {fixed_count}")

if __name__ == '__main__':
    main()
