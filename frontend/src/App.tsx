// ... existing imports ...
import { useState, useRef } from 'react';
import './App.css';

// Remove the old lazy-load code

function RustCalculatorTab() {
  const [expr, setExpr] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const wasmRef = useRef<any>(null);

  const loadWasm = async () => {
    if (!wasmRef.current) {
      const wasmModule = await import('calculator_wasm');
      await wasmModule.default('/calculator_wasm_bg.wasm'); // Load from public dir
      wasmRef.current = wasmModule;
    }
    return wasmRef.current;
  };

  const handleCalculate = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const wasmMod = await loadWasm();
      const res = wasmMod.calculate(expr);
      setResult(res.toString());
    } catch (e: any) {
      setError(e.message || e.toString());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto', textAlign: 'center' }}>
      <h2>Rust Calculator (WASM)</h2>
      <input
        type="text"
        value={expr}
        onChange={e => setExpr(e.target.value)}
        placeholder="Enter expression, e.g. (2+2)*3"
        style={{ width: '80%', padding: '0.5rem', fontSize: '1rem' }}
      />
      <br />
      <button onClick={handleCalculate} style={{ marginTop: '1rem', padding: '0.5rem 1rem' }} disabled={loading}>
        {loading ? 'Calculating...' : 'Calculate'}
      </button>
      {result && (
        <div style={{ marginTop: '1rem', color: 'green' }}>Result: {result}</div>
      )}
      {error && (
        <div style={{ marginTop: '1rem', color: 'red' }}>Error: {error}</div>
      )}
    </div>
  );
}

function App() {
  const [tab, setTab] = useState(0);
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'center', margin: '2rem 0' }}>
        <button onClick={() => setTab(0)} style={{ fontWeight: tab === 0 ? 'bold' : 'normal' }}>Rust Calculator</button>
        <button onClick={() => setTab(1)} style={{ fontWeight: tab === 1 ? 'bold' : 'normal', marginLeft: '1rem' }}>Tab 2 (Coming Soon)</button>
      </div>
      {tab === 0 && <RustCalculatorTab />}
      {tab === 1 && <div style={{ textAlign: 'center', marginTop: '2rem' }}>Tab 2 will be implemented later.</div>}
    </div>
  );
}

export default App;
