// simple mood definitions
const moods = [
  { id: 'very-sad', name: 'Très triste', emoji: '😢', lightColor: '#8B0000' },
  { id: 'sad', name: 'Triste', emoji: '😥', lightColor: '#DC143C' },
  { id: 'neutral', name: 'Neutre', emoji: '😐', lightColor: '#FFA500' },
  { id: 'happy', name: 'Heureux', emoji: '😊', lightColor: '#90EE90' },
  { id: 'very-happy', name: 'Très heureux', emoji: '😁', lightColor: '#228B22' },
];

export function getMoodById(id) {
  return moods.find((m) => m.id === id) || null;
}

export function getAllMoods() {
  return moods;
}
