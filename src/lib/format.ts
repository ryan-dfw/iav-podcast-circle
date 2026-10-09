const dateFmt = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
const weekdayFmt = new Intl.DateTimeFormat('en-US', { weekday: 'long' });
const timeFmt = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' });
const monthShort = new Intl.DateTimeFormat('en-US', { month: 'short' });

export const formatDate = (iso: string) => dateFmt.format(new Date(iso));

export function eventDateParts(iso: string) {
  const d = new Date(iso);
  return {
    month: monthShort.format(d),
    day: d.getDate(),
    weekday: weekdayFmt.format(d),
    time: timeFmt.format(d),
    full: dateFmt.format(d),
  };
}

export const padEpisode = (n: number) => String(n).padStart(2, '0');
