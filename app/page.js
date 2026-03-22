'use client';

import { useState, useEffect } from 'react';
function fetchData(){
  fetch('/api/onchain').then(r => r.json()).then(setOnchain);
    fetch('/api/tvl').then(r => r.json()).then(d => setTvl(d.protocols));
    fetch('/api/prices').then(r => r.json()).then(setPrices);
    fetch('/api/news').then(r => r.json()).then(d => setNews(d.news));
}
export default function Home() {
  const [prices, setPrices] = useState(null);
  const [news, setNews] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [tvl, setTvl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [onchain, setOnchain] = useState(null);
  const [walletInput, setWalletInput] = useState('');

  const analyze = async () => {
    setLoading(true);
    const res = await fetch('/api/analyze');
    const data = await res.json();
    setAnalysis(data.analysis);
    setLoading(false);
  };

  useEffect(() => {
  fetchData();
  const dataInterval = setInterval(fetchData, 60000);
  const aiInterval = setInterval(analyze, 600000);
  return () => {
    clearInterval(dataInterval);
    clearInterval(aiInterval);
  };
}, []);

  const tokenColors = { bitcoin: '#F7931A', ethereum: '#627EEA', solana: '#9945FF' };
  const tokenSymbols = { bitcoin: 'BTC', ethereum: 'ETH', solana: 'SOL' };

  return (
    <main style={{ minHeight: '100vh', background: '#080B12', color: '#E8EAF0', fontFamily: "'DM Sans', sans-serif", padding: '0' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: #0d1117; } ::-webkit-scrollbar-thumb { background: #2a2f3e; border-radius: 2px; }
        .card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 16px; backdrop-filter: blur(12px); transition: border-color 0.2s; }
        .card:hover { border-color: rgba(255,255,255,0.12); }
        .tag { display: inline-flex; align-items: center; padding: 2px 8px; border-radius: 6px; font-size: 11px; font-weight: 500; letter-spacing: 0.5px; }
        .glow-btn { position: relative; overflow: hidden; cursor: pointer; border: none; outline: none; }
        .glow-btn::after { content: ''; position: absolute; inset: 0; background: rgba(255,255,255,0.1); opacity: 0; transition: opacity 0.2s; }
        .glow-btn:hover::after { opacity: 1; }
        .news-item { padding: 10px 12px; border-radius: 10px; cursor: pointer; border: 1px solid transparent; transition: all 0.15s; }
        .news-item:hover { background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.08); }
        .stat-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 20px; text-align: center; flex: 1; }
        input { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 10px 14px; color: #E8EAF0; font-family: 'DM Mono', monospace; font-size: 13px; outline: none; transition: border-color 0.2s; }
        input:focus { border-color: rgba(99,120,255,0.5); }
        input::placeholder { color: rgba(255,255,255,0.25); }
      `}</style>

      {/* Header */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '20px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.02)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg, #6378FF, #9945FF)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>⬡</div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 600, letterSpacing: '-0.3px' }}>DeFi Dashboard</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.5px' }}>ETHEREUM MAINNET</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#22C55E', boxShadow: '0 0 8px #22C55E' }}></div>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>Canlı</span>
        </div>
      </div>

      <div style={{ padding: '32px 40px', maxWidth: 1400, margin: '0 auto' }}>

        {/* Üst grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>

          {/* Token Fiyatları */}
          <div className="card" style={{ padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <span style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Token Fiyatları</span>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)' }}>24s değişim</span>
            </div>
            {prices ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {Object.entries(prices).map(([token, data]) => (
                  <div key={token} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: tokenColors[token] || '#666', boxShadow: `0 0 8px ${tokenColors[token] || '#666'}` }}></div>
                      <span style={{ fontSize: 14, fontWeight: 500 }}>{token.charAt(0).toUpperCase() + token.slice(1)}</span>
                      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontFamily: 'DM Mono, monospace' }}>{tokenSymbols[token]}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ fontSize: 15, fontWeight: 600, fontFamily: 'DM Mono, monospace' }}>${data.price.toLocaleString()}</span>
                      <span style={{ fontSize: 12, fontWeight: 500, color: data.change >= 0 ? '#22C55E' : '#EF4444', background: data.change >= 0 ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', padding: '3px 8px', borderRadius: 6, fontFamily: 'DM Mono, monospace' }}>
                        {data.change >= 0 ? '▲' : '▼'} {Math.abs(data.change)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 13 }}>Yükleniyor...</p>}
          </div>

          {/* Haberler */}
          <div className="card" style={{ padding: 24 }}>
            <div style={{ marginBottom: 20 }}>
              <span style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Son Haberler</span>
            </div>
            {news ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {news.map((item, i) => (
                  <div key={i} className="news-item" onClick={() => window.open(item.url, '_blank')}>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', fontFamily: 'DM Mono, monospace', marginTop: 2, minWidth: 16 }}>0{i + 1}</span>
                      <div>
                        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', lineHeight: 1.5 }}>{item.title}</p>
                        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', marginTop: 4 }}>{item.date}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 13 }}>Yükleniyor...</p>}
          </div>
        </div>

        {/* TVL */}
        <div className="card" style={{ padding: 24, marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Top 5 DeFi Protokolü</span>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)' }}>Total Value Locked</span>
          </div>
          {tvl ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {tvl.map((p, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)', fontFamily: 'DM Mono, monospace', minWidth: 20 }}>#{i + 1}</span>
                    <span style={{ fontSize: 14, fontWeight: 500 }}>{p.name}</span>
                    <span className="tag" style={{ background: 'rgba(99,120,255,0.12)', color: 'rgba(99,120,255,0.8)', border: '1px solid rgba(99,120,255,0.2)' }}>{p.category}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 15, fontWeight: 600, fontFamily: 'DM Mono, monospace' }}>${(p.tvl / 1e9).toFixed(2)}B</span>
                    <span style={{ fontSize: 12, fontWeight: 500, color: p.change24h >= 0 ? '#22C55E' : '#EF4444', background: p.change24h >= 0 ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', padding: '3px 8px', borderRadius: 6, fontFamily: 'DM Mono, monospace' }}>
                      {p.change24h >= 0 ? '▲' : '▼'} {Math.abs(p.change24h)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 13 }}>Yükleniyor...</p>}
        </div>

        {/* On-Chain */}
        <div className="card" style={{ padding: 24, marginBottom: 20 }}>
          <div style={{ marginBottom: 20 }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>On-Chain Veriler</span>
          </div>
          {onchain ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', gap: 12 }}>
                <div className="stat-card">
                  <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 10 }}>Gas Fiyatı</p>
                  <p style={{ fontSize: 28, fontWeight: 600, fontFamily: 'DM Mono, monospace', color: '#F7931A' }}>{onchain.gas.gwei}</p>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>Gwei</p>
                </div>
                <div className="stat-card">
                  <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 10 }}>Son Block</p>
                  <p style={{ fontSize: 28, fontWeight: 600, fontFamily: 'DM Mono, monospace', color: '#627EEA' }}>#{onchain.block.number.toLocaleString()}</p>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>{onchain.block.time}</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <input
                  type="text"
                  placeholder="0x... cüzdan adresi gir"
                  value={walletInput}
                  onChange={e => setWalletInput(e.target.value)}
                  style={{ flex: 1 }}
                />
                <button
                  className="glow-btn"
                  onClick={() => fetch(`/api/onchain?wallet=${walletInput}`).then(r => r.json()).then(setOnchain)}
                  style={{ background: 'rgba(99,120,255,0.15)', border: '1px solid rgba(99,120,255,0.3)', borderRadius: 10, padding: '10px 20px', color: 'rgba(99,120,255,0.9)', fontSize: 13, fontWeight: 500, fontFamily: 'DM Sans, sans-serif' }}
                >
                  Sorgula
                </button>
              </div>
              {onchain.balance && (
                <div style={{ background: 'rgba(99,120,255,0.06)', border: '1px solid rgba(99,120,255,0.15)', borderRadius: 12, padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>Cüzdan Bakiyesi</p>
                    <p style={{ fontSize: 22, fontWeight: 600, fontFamily: 'DM Mono, monospace' }}>{onchain.balance.eth} <span style={{ fontSize: 14, color: '#627EEA' }}>ETH</span></p>
                  </div>
                  <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', fontFamily: 'DM Mono, monospace', maxWidth: 200, textAlign: 'right', wordBreak: 'break-all' }}>{onchain.balance.address}</p>
                </div>
              )}
            </div>
          ) : <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 13 }}>Yükleniyor...</p>}
        </div>

        {/* AI Analizi */}
        <div className="card" style={{ padding: 24 }}>
          <div style={{ marginBottom: 20 }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>AI Piyasa Analizi</span>
          </div>
          <button
            className="glow-btn"
            onClick={analyze}
            disabled={loading}
            style={{ background: loading ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg, rgba(99,120,255,0.2), rgba(153,69,255,0.2))', border: '1px solid rgba(99,120,255,0.3)', borderRadius: 10, padding: '11px 24px', color: loading ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.85)', fontSize: 13, fontWeight: 500, fontFamily: 'DM Sans, sans-serif', cursor: loading ? 'not-allowed' : 'pointer' }}
          >
            {loading ? '⟳  Analiz ediliyor...' : '✦  Analiz Et'}
          </button>
          {analysis && (
            <div style={{ marginTop: 20, padding: '16px 20px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, borderLeft: '3px solid rgba(99,120,255,0.5)' }}>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 1.8 }}>{analysis}</p>
            </div>
          )}
        </div>

      </div>
    </main>
  );
}