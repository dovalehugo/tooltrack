export function formatDate(date) {
  if (!date) return '-';

  return new Date(date).toLocaleString('es-ES', {
    dateStyle: 'short',
    timeStyle: 'short',
  });
}
