#!/usr/bin/env node
// Regenerates events.ics from events.json. Run this after editing events.json.
const fs = require('fs');
const path = require('path');

const events = JSON.parse(fs.readFileSync(path.join(__dirname, 'events.json'), 'utf8'));

function icsEscape(str) {
  return String(str).replace(/\\/g, '\\\\').replace(/,/g, '\\,').replace(/;/g, '\\;').replace(/\n/g, '\\n');
}
function icsDateUTC(d) {
  return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}
function icsDateOnly(dateStr) {
  return dateStr.replace(/-/g, '');
}
function buildICS(events) {
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Ligue de Judo de la Martinique//Dojos Ouverts 2026//FR', 'CALSCALE:GREGORIAN', 'X-WR-CALNAME:Opération Dojos Ouverts 2026'];
  events.forEach((e, i) => {
    lines.push('BEGIN:VEVENT');
    lines.push('UID:dojos-ouverts-2026-' + i + '@judo-martinique');
    lines.push('SUMMARY:' + icsEscape(e.title));
    if (e.allDay) {
      lines.push('DTSTART;VALUE=DATE:' + icsDateOnly(e.start));
      if (e.end) lines.push('DTEND;VALUE=DATE:' + icsDateOnly(e.end));
    } else {
      lines.push('DTSTART:' + icsDateUTC(new Date(e.start)));
      if (e.end) lines.push('DTEND:' + icsDateUTC(new Date(e.end)));
    }
    if (e.location) lines.push('LOCATION:' + icsEscape(e.location));
    const descParts = [];
    if (e.description) descParts.push(e.description);
    if (e.contact) descParts.push('Contact : ' + e.contact);
    if (descParts.length) lines.push('DESCRIPTION:' + icsEscape(descParts.join('\n')));
    lines.push('END:VEVENT');
  });
  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}

fs.writeFileSync(path.join(__dirname, 'events.ics'), buildICS(events) + '\r\n');
console.log('Wrote events.ics with', events.length, 'events.');
