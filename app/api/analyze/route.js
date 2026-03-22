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
      Sen deneyimli bir DeFi analistisin. Aşağıdaki verileri inceleyip profesyonel bir piyasa analizi yaz.

      TOKEN FİYATLARI:
      ${Object.entries(prices).map(([t, d]) => `${t}: $${d.price} (24s: ${d.change}%)`).join('\n')}

      TOP DeFi PROTOKOLLER (TVL):
      ${tvl.protocols.map(p => `${p.name}: $${(p.tvl / 1e9).toFixed(2)}B (24s: ${p.change24h}%)`).join('\n')}

      SON HABERLER:
      ${news.news.map((n, i) => `${i + 1}. ${n.title}`).join('\n')}

      Analizini şu üç başlık altında yaz:

      🔴 RİSKLER: Dikkat edilmesi gereken tehlike sinyalleri neler? Fiyat düşüşleri, TVL azalması, negatif haberler varsa belirt.

      🟢 FIRSATLAR: Pozitif sinyaller neler? Hangi protokol veya token öne çıkıyor?

      ⚡ ÖZET: Tek cümleyle bugünkü piyasa durumu ne?

      Her başlık için 2-3 cümle yaz. Gereksiz giriş cümlesi yazma, direkt konuya gir.
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