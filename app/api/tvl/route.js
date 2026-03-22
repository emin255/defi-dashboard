export async function GET() {
  try{
      const res = await fetch('https://api.llama.fi/protocols');
      if (!res.ok) {
        throw new Error(`DeFiLlama API hatası: ${res.status}`);
      }
      const data = await res.json();

      const top5 = data
        .sort((a, b) => b.tvl - a.tvl)
        .slice(0, 5)
        .map(p => ({
          name: p.name,
          tvl: p.tvl,
          category: p.category,
          change24h: p.change_1d?.toFixed(2) || '0',
        }));

      return Response.json({ protocols: top5 });
  }
  catch(e){
    console.error(e);
    return Response.json({ error: e.message }, { status: 500 });
  }
  
}