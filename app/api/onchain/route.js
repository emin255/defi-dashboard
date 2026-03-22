const ALCHEMY_URL = `https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`;

async function rpc(method, params) {
  const res = await fetch(ALCHEMY_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
  });
  const data = await res.json();
  return data.result;
}

export async function GET(request) {
  try{
    const { searchParams } = new URL(request.url);
    const wallet = searchParams.get('wallet');

    // Gas fiyatı
    const gasHex = await rpc('eth_gasPrice', []);
    const gasGwei = (parseInt(gasHex, 16) / 1e9).toFixed(2);

    // Son block
    const block = await rpc('eth_getBlockByNumber', ['latest', false]);
    const blockNumber = parseInt(block.number, 16);
    const blockTime = new Date(parseInt(block.timestamp, 16) * 1000).toLocaleTimeString('tr-TR');

    // Cüzdan bakiyesi (eğer adres verilmişse)
    let balance = null;
    if (wallet) {
      const balHex = await rpc('eth_getBalance', [wallet, 'latest']);
      balance = (parseInt(balHex, 16) / 1e18).toFixed(4);
    }

    return Response.json({
      gas: { gwei: gasGwei },
      block: { number: blockNumber, time: blockTime },
      balance: balance ? { eth: balance, address: wallet } : null,
    });
  }
  catch(e){
    console.error(e);
    return Response.json({ error: e.message }, { status: 500 });
  }
  
}