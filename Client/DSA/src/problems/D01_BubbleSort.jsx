/**
 * D01 — Bubble Sort Visualizer
 * Topic: Sorting | Difficulty: Easy
 * Time: O(n²) | Space: O(1)
 * Asked at: All companies (fundamentals)
 */
import { useState, useRef, useCallback } from "react";

const DEFAULT = [64, 34, 25, 12, 22, 11, 90, 45, 67, 38];

function randomArr(n = 12) {
  return Array.from({ length: n }, () => Math.floor(Math.random() * 90) + 10);
}

export default function BubbleSort() {
  const [arr,      setArr]      = useState([...DEFAULT]);
  const [states,   setStates]   = useState({}); // { idx: 'comparing'|'swapping'|'sorted' }
  const [log,      setLog]      = useState([]);
  const [running,  setRunning]  = useState(false);
  const [speed,    setSpeed]    = useState(300);
  const [tab,      setTab]      = useState("viz");
  const stopRef = useRef(false);

  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  const addLog = (msg, type = "step") => {
    setLog(l => [...l.slice(-30), { msg, type }]);
  };

  const run = useCallback(async () => {
    stopRef.current = false;
    setRunning(true);
    setLog([]);
    const a = [...arr];
    const n = a.length;
    const sorted = new Set();

    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        if (stopRef.current) { setRunning(false); return; }

        setStates({ [j]: "comparing", [j + 1]: "comparing" });
        addLog(`Comparing a[${j}]=${a[j]} and a[${j+1}]=${a[j+1]}`, "step");
        await sleep(speed);

        if (a[j] > a[j + 1]) {
          [a[j], a[j + 1]] = [a[j + 1], a[j]];
          setArr([...a]);
          setStates({ [j]: "swapping", [j + 1]: "swapping" });
          addLog(`  ↔ Swapped → [${a[j]}, ${a[j+1]}]`, "swap");
          await sleep(speed);
        }
      }
      sorted.add(n - 1 - i);
      setStates(Object.fromEntries([...sorted].map(k => [k, "sorted"])));
    }
    sorted.add(0);
    setStates(Object.fromEntries([...sorted, 0].map(k => [k, "sorted"])));
    addLog("✅ Array sorted!", "done");
    setRunning(false);
  }, [arr, speed]);

  const reset = () => {
    stopRef.current = true;
    setArr([...DEFAULT]);
    setStates({});
    setLog([]);
    setRunning(false);
  };

  const maxVal = Math.max(...arr);

  return (
    <div className="prob-card">
      <div className="prob-header">
        <div>
          <div className="prob-title">Bubble Sort</div>
          <div className="prob-meta">
            <span className="dsa-difficulty diff-easy">Easy</span>
            <span className="complexity tc">T: O(n²)</span>
            <span className="complexity sc">S: O(1)</span>
          </div>
        </div>
      </div>

      <p className="prob-desc">
        Repeatedly compare adjacent elements and swap if out of order. After each pass,
        the largest unsorted element "bubbles up" to its correct position.
        <br /><br />
        <strong>Key insight:</strong> After pass <code>i</code>, the last <code>i</code> elements are sorted.
        Best case O(n) with early termination when no swaps occur.
      </p>

      {/* Tabs */}
      <div className="tabs">
        {[["viz","Visualizer"],["code","JavaScript"],["notes","Notes"]].map(([t,l]) => (
          <button key={t} className={`tab-btn ${tab===t?"active":""}`} onClick={() => setTab(t)}>{l}</button>
        ))}
      </div>

      {tab === "viz" && (
        <>
          {/* Controls */}
          <div className="controls">
            <button className="btn btn-primary" onClick={run} disabled={running}>▶ Run</button>
            <button className="btn btn-ghost" onClick={reset} disabled={running}>↺ Reset</button>
            <button className="btn btn-ghost" onClick={() => { setArr(randomArr()); setStates({}); setLog([]); }} disabled={running}>
              🎲 Random
            </button>
            <div className="speed-wrap">
              <span>Speed</span>
              <input type="range" min={50} max={800} step={50} value={speed}
                onChange={e => setSpeed(Number(e.target.value))} disabled={running} />
              <span>{speed}ms</span>
            </div>
          </div>

          {/* Bar chart */}
          <div className="viz-box" style={{ height: 180 }}>
            {arr.map((v, i) => (
              <div key={i} className={`viz-bar ${states[i] || ""}`}
                style={{
                  height: `${(v / maxVal) * 140}px`,
                  width: `${Math.max(20, 320 / arr.length)}px`,
                  background: states[i] ? undefined :
                    `hsl(${220 + (v / maxVal) * 60}, 70%, 55%)`,
                }}>
                {arr.length <= 15 && v}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div style={{ display:"flex", gap:"var(--s4)", marginBottom:"var(--s4)", fontSize:"var(--xs)", color:"var(--t2)" }}>
            {[["comparing","var(--warn)"],["swapping","var(--err)"],["sorted","var(--ok)"]].map(([l,c]) => (
              <div key={l} style={{ display:"flex", alignItems:"center", gap:4 }}>
                <div style={{ width:10, height:10, borderRadius:2, background:c }} />
                {l}
              </div>
            ))}
          </div>

          {/* Step log */}
          <div className="step-log">
            {log.length === 0 && <span style={{ color:"var(--t3)" }}>Press Run to start...</span>}
            {log.map((l, i) => (
              <div key={i} className={l.type}>{l.msg}</div>
            ))}
          </div>
        </>
      )}

      {tab === "code" && (
        <div className="code-block">
          <div className="code-header">
            <span className="code-lang">JavaScript</span>
          </div>
          <div className="code-body">{`function bubbleSort(arr) {
  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    let swapped = false;

    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        // Swap
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
      }
    }

    // Early termination: already sorted
    if (!swapped) break;
  }

  return arr;
}

// Example
console.log(bubbleSort([64, 34, 25, 12, 22, 11, 90]));
// → [11, 12, 22, 25, 34, 64, 90]`}</div>
        </div>
      )}

      {tab === "notes" && (
        <div style={{ display:"flex", flexDirection:"column", gap:"var(--s4)" }}>
          {[
            { title:"When to use", body:"Teaching/learning only. Never in production — O(n²) is too slow for large inputs." },
            { title:"Optimization", body:"Add a 'swapped' flag. If no swaps in a pass, array is already sorted → break early. Best case becomes O(n)." },
            { title:"Stable sort?", body:"Yes — equal elements never swap, so relative order is preserved." },
            { title:"Interview tip", body:"Interviewers rarely ask you to implement bubble sort. They ask you to ANALYZE it — explain why it's O(n²) and when it degrades to worst case (reverse sorted input)." },
          ].map(n => (
            <div key={n.title} style={{ background:"var(--bg4)", border:"1px solid var(--gb)", borderRadius:"var(--r2)", padding:"var(--s4)" }}>
              <div style={{ fontWeight:700, color:"var(--a3)", marginBottom:"var(--s2)", fontSize:"var(--sm)" }}>{n.title}</div>
              <p style={{ fontSize:"var(--sm)", margin:0 }}>{n.body}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
