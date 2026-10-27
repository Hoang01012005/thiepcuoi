// Utility to generate "Add to Calendar" links for Google Calendar, iCal / Apple Calendar
// Uses the wedding dates from weddingConfig

export interface CalendarEvent {
  title: string;
  description: string;
  location: string;
  startISO: string;
  endISO: string;
}

function toICSDate(isoString: string): string {
  // Convert ISO 8601 to ICS format: YYYYMMDDTHHMMSSZ (UTC)
  const date = new Date(isoString);
  return date
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}/, '');
}

export function buildGoogleCalendarUrl(event: CalendarEvent): string {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${toICSDate(event.startISO)}/${toICSDate(event.endISO)}`,
    details: event.description,
    location: event.location,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function buildICalContent(event: CalendarEvent): string {
  const now = toICSDate(new Date().toISOString());
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Wedding Invite//Nam & Hiep//VI',
    'BEGIN:VEVENT',
    `UID:${now}-nam-hiep-wedding@thiep.cưới`,
    `DTSTAMP:${now}`,
    `DTSTART:${toICSDate(event.startISO)}`,
    `DTEND:${toICSDate(event.endISO)}`,
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${event.description}`,
    `LOCATION:${event.location}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

export function downloadICalFile(event: CalendarEvent, filename = 'wedding.ics'): void {
  const content = buildICalContent(event);
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
