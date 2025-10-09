#!/usr/bin/env python3
"""
Script para migrar cores hardcoded para o sistema de cores global do Mobistory.
Faz substituições inteligentes de cores hex para Colors.*
"""

import os
import re
from pathlib import Path

# Mapeamento de cores hex para o sistema de cores
COLOR_MAPPINGS = {
    # Cores primárias
    '#1f2937': 'Colors.primary.DEFAULT',
    '#111827': 'Colors.primary.dark',
    '#374151': 'Colors.primary.light',

    # Cores de texto
    '#4b5563': 'Colors.text.secondary',
    '#6b7280': 'Colors.text.tertiary',
    '#9ca3af': 'Colors.text.placeholder',

    # Cores de fundo
    '#ffffff': 'Colors.background.primary',
    '#fff': 'Colors.background.primary',
    '#f9fafb': 'Colors.background.secondary',
    '#f3f4f6': 'Colors.background.tertiary',

    # Bordas
    '#e5e7eb': 'Colors.border.DEFAULT',
    '#d1d5db': 'Colors.border.dark',

    # Status
    '#10b981': 'Colors.success.DEFAULT',
    '#d1fae5': 'Colors.success.light',
    '#059669': 'Colors.success.dark',
    '#065f46': 'Colors.success.text',

    '#ef4444': 'Colors.error.DEFAULT',
    '#fee2e2': 'Colors.error.light',
    '#dc2626': 'Colors.error.dark',
    '#991b1b': 'Colors.error.text',

    '#f59e0b': 'Colors.warning.DEFAULT',
    '#fef3c7': 'Colors.warning.light',
    '#d97706': 'Colors.warning.dark',
    '#92400e': 'Colors.warning.text',

    '#3b82f6': 'Colors.info.DEFAULT',
    '#dbeafe': 'Colors.info.light',
    '#2563eb': 'Colors.info.dark',
    '#1e40af': 'Colors.info.text',

    # Combustíveis
    '#a855f7': 'Colors.fuel.flex',
    '#06b6d4': 'Colors.fuel.electric',

    # Outras cores específicas
    '#dcfce7': 'Colors.success.light',  # green-100
    '#166534': 'Colors.success.text',   # green-800
}

def should_skip_file(file_path):
    """Verifica se o arquivo deve ser ignorado."""
    skip_dirs = {'node_modules', '.expo', '.git', 'scripts'}
    return any(skip_dir in file_path.parts for skip_dir in skip_dirs)

def has_import_colors(content):
    """Verifica se o arquivo já importa Colors."""
    return bool(re.search(r"import.*Colors.*from.*['\"].*constants", content))

def add_colors_import(content):
    """Adiciona o import de Colors no início do arquivo."""
    # Procura por imports existentes
    import_match = re.search(r'^import .*from .*;$', content, re.MULTILINE)

    if import_match:
        # Adiciona após os imports React (geralmente são os primeiros)
        react_imports = list(re.finditer(r'^import .*from [\'"]react.*[\'"];$', content, re.MULTILINE))
        if react_imports:
            last_react_import = react_imports[-1]
            pos = last_react_import.end()
            return content[:pos] + "\nimport { Colors } from '@/constants';" + content[pos:]
        else:
            # Adiciona após o primeiro import
            pos = import_match.end()
            return content[:pos] + "\nimport { Colors } from '@/constants';" + content[pos:]

    return "import { Colors } from '@/constants';\n" + content

def migrate_colors_in_content(content):
    """Substitui cores hex pelo sistema de cores."""
    modified = False

    for hex_color, color_const in COLOR_MAPPINGS.items():
        # Padrões para capturar cores em diferentes contextos
        patterns = [
            (f"'{hex_color}'", f"{color_const}"),
            (f'"{hex_color}"', f"{color_const}"),
            (f"`{hex_color}`", f"{color_const}"),
        ]

        for pattern, replacement in patterns:
            if pattern in content:
                content = content.replace(pattern, replacement)
                modified = True

    return content, modified

def migrate_file(file_path):
    """Migra um arquivo individual."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            original_content = f.read()

        content, has_colors = migrate_colors_in_content(original_content)

        if not has_colors:
            return False

        # Adiciona import se necessário
        if not has_import_colors(content):
            content = add_colors_import(content)

        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)

        return True

    except Exception as e:
        print(f"[ERRO] Erro ao migrar {file_path}: {e}")
        return False

def main():
    """Função principal."""
    print("Iniciando migracao de cores para o sistema global...\n")

    root_dir = Path(__file__).parent.parent
    migrated_count = 0
    skipped_count = 0

    # Procura por arquivos .ts e .tsx
    for file_path in root_dir.rglob('*.ts*'):
        if should_skip_file(file_path) or file_path.name.endswith('.d.ts'):
            continue

        # Ignora o próprio arquivo de colors
        if 'constants/colors' in str(file_path):
            continue

        if migrate_file(file_path):
            print(f"[OK] Migrado: {file_path.relative_to(root_dir)}")
            migrated_count += 1
        else:
            skipped_count += 1

    print(f"\nMigracao concluida!")
    print(f"Arquivos migrados: {migrated_count}")
    print(f"Arquivos sem cores: {skipped_count}")

if __name__ == '__main__':
    main()
