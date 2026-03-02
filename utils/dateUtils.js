// simple utilities for formatting dates in the MoodApp

export function getMonthName(month) {
  const names = [
    'Janvier','Février','Mars','Avril','Mai','Juin',
    'Juillet','Août','Septembre','Octobre','Novembre','Décembre'
  ];
  return names[month - 1] || '';
}

export function formatDateDisplay(dateStr) {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
}

export function parseDate(date) {
  // expect either Date object or ISO string
  if (date instanceof Date) return date;
  return new Date(date);
}
