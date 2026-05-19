export async function fetchGoogleCalendarEvents(icsUrl: string) {
  try {
    const res = await fetch(
      `https://api.allorigins.win/raw?url=${encodeURIComponent(icsUrl)}`
    );

    const text = await res.text();

    return parseICS(text);
  } catch (err) {
    console.error(err);
    return [];
  }
}

function parseICS(data: string) {
  const events: any[] = [];

  const chunks = data.split("BEGIN:VEVENT");

  for (const chunk of chunks) {
    const title = chunk.match(/SUMMARY:(.*)/)?.[1];
    const start = chunk.match(/DTSTART.*:(.*)/)?.[1];

    if (!title || !start) continue;

    const date = parseICSDate(start);

    events.push({
      title,
      date,
    });
  }

  return events;
}

function parseICSDate(value: string) {
  const year = Number(value.slice(0, 4));
  const month = Number(value.slice(4, 6)) - 1;
  const day = Number(value.slice(6, 8));

  return new Date(year, month, day);
}