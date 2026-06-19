// Lista única de humores, usada em SeletorHumor, CardHumor e GraficoMensal.
// Mantendo isso centralizado evitamos duplicar a lista em 3 lugares diferentes.

export const HUMORES = [
  { id: 'feliz', emoji: '😄', label: 'Feliz', cor: '#4CAF50' },
  { id: 'animado', emoji: '🤩', label: 'Animado', cor: '#9C27B0' },
  { id: 'neutro', emoji: '😐', label: 'Neutro', cor: '#9E9E9E' },
  { id: 'ansioso', emoji: '😰', label: 'Ansioso', cor: '#FF9800' },
  { id: 'triste', emoji: '😢', label: 'Triste', cor: '#2196F3' },
  { id: 'irritado', emoji: '😠', label: 'Irritado', cor: '#F44336' },
];

// Função utilitária: dado um id de humor, retorna o objeto completo.
// Usada sempre que precisamos exibir o emoji/label a partir do registro salvo.
export function getHumorPorId(id) {
  return HUMORES.find((h) => h.id === id) || null;
}
