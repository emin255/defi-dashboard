export async function GET() {
  const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  try{
    const [pricesRes, newsRes, tvlRes] = await Promise.all([
    fetch(base+'/api/prices'),
    fetch(base+'/api/news'),
    fetch(base+'/api/tvl'),
  ]);

  const prices = await pricesRes.json();
  const news = await newsRes.json();
  const tvl = await tvlRes.json();

    const prompt = `
  Aşağıdaki kripto para verilerini analiz et ve kısa bir piyasa yorumu yaz (4-5 cümle, Türkçe):

  TOKEN FİYATLARI:
  ${Object.entries(prices).map(([t, d]) => `${t}: $${d.price} (${d.change}%)`).join('\n')}

  TOP DeFi PROTOKOLLER (TVL):
  ${tvl.protocols.map(p => `${p.name}: $${(p.tvl / 1e9).toFixed(2)}B (${p.change24h}%)`).join('\n')}

  SON HABERLER:
  ${news.news.map((n, i) => `${i + 1}. ${n.title}`).join('\n')}

  Fiyat hareketleri, TVL değişimleri ve haberler arasındaki bağlantıya dikkat et.
    `;

    const response =
      await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1024,
        messages: [{ role: 'user', content: prompt }],
      }),
    });
    if(!response.ok){
      throw new Error('Anthropic API error');
    }
    const data = await response.json();
    const analysis = data.content[0].text;

    return Response.json({ analysis });
  }
  catch(e){
    console.error(e);
    return Response.json({ error: e.message }, { status: 500 });
  }
  
}