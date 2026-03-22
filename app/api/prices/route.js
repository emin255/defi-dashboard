export async function GET() {
  try{  
    const res = await fetch(
    'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd&include_24hr_change=true'
    );
    const data = await res.json();

    return Response.json({
      bitcoin: {
        price: data.bitcoin.usd,
        change: data.bitcoin.usd_24h_change.toFixed(2),
      },
      ethereum: {
        price: data.ethereum.usd,
        change: data.ethereum.usd_24h_change.toFixed(2),
      },
      solana: {
        price: data.solana.usd,
        change: data.solana.usd_24h_change.toFixed(2),
      },
    });
  }
  catch(e){
    console.error(e);
    return Response.json({ error: e.message });
  }
}