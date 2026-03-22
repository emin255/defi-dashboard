export async function GET() {
  try {
    const res = await fetch('https://cointelegraph.com/rss', {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    if (!res.ok) {
      throw new Error(`RSS API hatası: ${res.status}`);
    }
    const xml = await res.text();

    const titleMatches = [...xml.matchAll(/<title>(.*?)<\/title>/gs)];
    const linkMatches = [...xml.matchAll(/<link>(.*?)<\/link>/gs)];
    const dateMatches = [...xml.matchAll(/<pubDate>(.*?)<\/pubDate>/gs)];

    // İlk ikisi channel başlığı ve linki, onları atla
    const news = titleMatches.slice(2, 7).map((m, i) => ({
      title: m[1].replace(/<!\[CDATA\[|\]\]>/g, '').trim(),
      url: linkMatches[i + 2]?.[1].replace(/<!\[CDATA\[|\]\]>/g, '').trim() || '#',
      date: dateMatches[i] ? new Date(dateMatches[i][1]).toLocaleDateString('tr-TR') : '',
    }));

    return Response.json({ news });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}