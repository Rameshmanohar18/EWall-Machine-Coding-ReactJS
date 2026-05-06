/**
 * D02 — Merge Sort Visualizer
 * Topic: Sorting | Difficulty: Medium
 * Time: O(n log n) | Space: O(n)
 * Asked at: Google, Meta, Amazon
 */
import { useState, useRef, useCallback } from "react";

const DEFAULT = [38, 27, 43, 3, 9, 82, 10, 56, 17, 64];

export default function MergeSort() {
  const [arr,     setArr]     = useState([...DEFAULT]);
  const [states,  setStates]  = useState({});
  const [log,     setLog]     = useState([]);
  const [running, setRunning] = useState(false);
  const [speed,   setSpeed]   = useState(400);
  const [tab,     setTab]     = useState("viz");
  const stopRef = useRef(false);

  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  const merge = async (a, left, mid, right) => {
    const L = a.slice(left, mid + 1);
    const R = a.slice(mid + 1, right + 1);
    let i = 0, j = 0, k = left;

    while (i < L.length && j < R.length) {
      if (stopRef.current) return;
      setStates({ [left + i]: "comparing", [mid + 1 + j]: "comparing" });
      await sleep(speed);

      if (L[i] <= R[j]) {
        a[k] = L[i++];
      } else {
        a[k] = R[j++];
      }
      setArr([...a]);
      setStates({ [k]: "swapping" });
      setLog(l => [...l.slice(-30), { msg: `Placed ${a[k]} at index ${k}`, type: "swap" }]);
      await sleep(speed / 2);
      k++;
    }
    while (i < L.length) { a[k++] = L[i++]; setArr([...a]); await sleep(speed / 3); }
    while (j < R.length) { a[k++] = R[j++]; setArr([...a]); await sleep(speed / 3); }

    // Mark merged range as sorted
    const sorted = {};
    for (let x = left; x <= right; x++) sorted[x] = "sorted";
    setStates(sorted);
    setLog(l => [...l.slice(-30), { msg: `Merged [${left}..${right}]`, type: "done" }]);
    await sleep(speed);
  };

  const mergeSort = async (a, left, right) => {
    if (stopRef.current || left >= right) return;
    const mid = Math.floor((left + right) / 2);
    setLog(l => [...l.slice(-30), { msg: `Split [${left}..${right}] → [${left}..${mid}] + [${mid+1}..${right}]`, type: "step" }]);
    await sleep(speed / 2);
    await mergeSort(a, left, mid);
    await mergeSort(a, mid + 1, right);
    await merge(a, left, mid, right);
  };

  const run = useCallback(async () => {
    stopRef.current = false;
    setRunning(true);
    setLog([]);
    setStates({});
    const a = [...arr];
    await mergeSort(a, 0, a.length - 1);
    if (!stopRef.current) {
      const all = {};
      a.forEach((_, i) => all[i] = "sorted");
      setStates(all);
      setLog(l => [...l, { msg: "✅ Sorted!", type: "done" }]);
    }
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
          <div className="prob-title">Merge Sort</div>
          <div className="prob-meta">
            <span className="dsa-difficulty diff-med">Medium</span>
            <span className="complexity tc">T: O(n log n)</span>
            <span className="complexity sc">S: O(n)</span>
          </div>
        </div>
      </div>

      <p className="prob-desc">
        Divide-and-conquer: split array in half recursively until single elements,
        then merge sorted halves back together. Guaranteed O(n log n) in all cases.
        <br /><br />
        <strong>Key insight:</strong> The merge step is the core — two sorted arrays can be merged in O(n).
        Used in external sorting (data too large for RAM) and as the basis for TimSort (Python/Java default sort).
      </p>

      <div className="tabs">
        {[["viz","Visualizer"],["code","JavaScript"],["notes","Notes"]].map(([t,l]) => (
          <button key={t} className={`tab-btn ${tab===t?"active":""}`} onClick={() => setTab(t)}>{l}</button>
        ))}
      </div>

      {tab === "viz" && (
        <>
          <div className="controls">
            <button className="btn btn-primary" onClick={run} disabled={running}>▶ Run</button>
            <button className="btn btn-ghost" onClick={reset} disabled={running}>↺ Reset</button>
            <div className="speed-wrap">
              <span>Speed</span>
              <input type="range" min={100} max={1000} step={100} value={speed}
                onChange={e => setSpeed(Number(e.target.value))} disabled={running} />
              <span>{speed}ms</span>
            </div>
          </div>

          <div className="viz-box" style={{ height: 180 }}>
            {arr.map((v, i) => (
              <div key={i} className={`viz-bar ${states[i] || ""}`}
                style={{
                  height: `${(v / maxVal) * 140}px`,
                  width: `${Math.max(20, 320 / arr.length)}px`,
                  background: states[i] ? undefined : `hsl(${260 + (v / maxVal) * 60}, 70%, 55%)`,
                }}>
                {arr.length <= 15 && v}
              </div>
            ))}
          </div>

          <div className="step-log">
            {log.length === 0 && <span style={{ color:"var(--t3)" }}>Press Run to start...</span>}
            {log.map((l, i) => <div key={i} className={l.type}>{l.msg}</div>)}
          </div>
        </>
      )}

      {tab === "code" && (
        <div className="code-block">
          <div className="code-header"><span className="code-lang">JavaScript</span></div>
          <div className="code-body">{`function mergeSort(arr) {
  if (arr.length <= 1) return arr;

  const mid = Math.floor(arr.length / 2);
  const left  = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));

  return merge(left, right);
}

function merge(left, right) {
  const result = [];
  let i = 0, j = 0;

  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      result.push(left[i++]);
    } else {
      result.push(right[j++]);
    }
  }

  return [...result, ...left.slice(i), ...right.slice(j)];
}

// Example
console.log(mergeSort([38, 27, 43, 3, 9, 82, 10]));
// → [3, 9, 10, 27, 38, 43, 82]`}</div>
        </div>
      )}

      {tab === "notes" && (
        <div style={{ display:"flex", flexDirection:"column", gap:"var(--s4)" }}>
          {[
            { title:"Why O(n log n)?", body:"log n levels of recursion × O(n) work per level to merge = O(n log n) total." },
            { title:"Stable sort?", body:"Yes — when merging, left[i] <= right[j] keeps equal elements in original order." },
            { title:"vs Quick Sort", body:"Merge sort is always O(n log n). Quick sort is O(n log n) average but O(n²) worst case. Merge sort is preferred for linked lists and external sorting." },
            { title:"Interview tip", body:"Be ready to implement the merge() function from scratch. Common follow-up: 'Merge K sorted arrays' — use a min-heap for O(n log k)." },
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
