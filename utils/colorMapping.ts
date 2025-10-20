// Mapeamento de nomes de cores para códigos hex
export const colorNameToHex = (colorName: string): string => {
  const colorMap: { [key: string]: string } = {
    // Cores básicas
    'preto': '#000000',
    'branco': '#FFFFFF',
    'prata': '#C0C0C0',
    'cinza': '#808080',
    'vermelho': '#DC143C',
    'azul': '#1E90FF',
    'verde': '#228B22',
    'amarelo': '#FFD700',
    'laranja': '#FF8C00',
    'marrom': '#8B4513',
    'bege': '#F5F5DC',
    'dourado': '#FFD700',
    'roxo': '#800080',
    'rosa': '#FFC0CB',
    'vinho': '#722F37',

    // Variações
    'azul marinho': '#000080',
    'azul claro': '#87CEEB',
    'azul escuro': '#00008B',
    'verde musgo': '#556B2F',
    'verde claro': '#90EE90',
    'verde escuro': '#006400',
    'vermelho escuro': '#8B0000',
    'cinza claro': '#D3D3D3',
    'cinza escuro': '#A9A9A9',
    'prata metalizado': '#C0C0C0',
    'champagne': '#F7E7CE',
    'bronze': '#CD7F32',
  };

  const normalizedColor = colorName.toLowerCase().trim();
  return colorMap[normalizedColor] || '#808080'; // Cinza padrão se não encontrar
};
