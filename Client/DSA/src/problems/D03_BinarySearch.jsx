/**
 * D03 — Binary Search Visualizer
 * Topic: Searching | Difficulty: Easy
 * Time: O(log n) | Space: O(1)
 * Asked at: Every company — most common interview question
 */
import { useState, useRef, useCallback } from "react";

const DEFAULT = [2, 5, 8, 12, 16, 23, 38, 45, 56, 72, 91];

export default function BinarySearch() {
  const [arr,     setArr]     = useState([...DEFAULT]);
  const [target,  setTarget]  = useState(23);
  const [left,    setLeft]    = useState(-1);
  const [right,   setRight]   = useState(-1);
  const [mid,     setMid]     = useState(-1);
  const [found,   setFound]   = useState(-1);
  const [log,     setLog]     = useState([]);
  const [running, setRunning] = useState(false);
  const [speed,   setSpeed]   = useState(600);
  const [tab,     setTab]     = useState("viz");
  const stopRef = useRef(false);

  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  const run = useCallback(async () => {
    stopRef.current = false;
    setRunning(true);
    setFound(-1);
    setLog([]);
    const a = [...arr];
    let l = 0, r = a.length - 1;

    while (l <= r) {
      if (stopRef.current) { setRunning(false); return; }
      const m = Math.floor((l + r) / 2);
      setLeft(l); setRight(r); setMid(m);
      setLog(prev => [...prev, { msg: `left=${l}, right=${r}, mid=${m} → a[mid]=${a[m]}`, type: "step" }]);
      await sleep(speed);

      if (a[m] === target) {
        setFound(m);
        setLog(prev => [...prev, { msg: `✅ Found ${target} at index ${m}!`, type: "done" }]);
        setRunning(false);
        return;
      } else if (a[m] < target) {
        setLog(prev => [...prev, { msg: `  ${a[m]} < ${target} → search right half`, type: "swap" }]);
        l = m + 1;
      } else {
        setLog(prev => [...prev, { msg: `  ${a[m]} > ${target} → search left half`, type: "swap" }]);
        r = m - 1;
      }
      await sleep(speed / 2);
    }

    setLeft(-1); setRight(-1); setMid(-1);
    setLog(prev => [...prev, { msg: `❌ ${target} not found in array`, type: "done" }]);
    setRunning(false);
  }, [arr, target, speed]);

  const reset = () => {
    stopRef.current = true;
    setLeft(-1); setRight(-1); setMid(-1); setFound(-1);
    setLog([]);
    setRunning(false);
  };

  const getCellClass = (i) => {
    if (found === i) return "result";
    if (mid === i)   return "mid";
    if (i < left || i > right) return "visited"; // eliminated
    if (i === left)  return "left";
    if (i === right) return "right";
    return "";
  };

  return (
    <div className="prob-card">
      <div className="prob-header">
        <div>
          <div className="prob-title">Binary Search</div>
          <div className="prob-meta">
            <span className="dsa-difficulty diff-easy">Easy</span>
            <span className="complexity tc">T: O(log n)</span>
            <span className="complexity sc">S: O(1)</span>
          </div>
        </div>
      </div>

      <p className="prob-desc">
        Search a <strong>sorted</strong> array by repeatedly halving the search space.
        Compare target with the middle element — if equal, found. If target is smaller,
        search left half. If larger, search right half.
        <br /><br />
        <strong>Key insight:</strong> Each comparison eliminates half the remaining elements.
        32 elements → max 5 comparisons. 1 billion elements → max 30 comparisons.
      </p>

      <div className="tabs">
        {[["viz","Visualizer"],["code","JavaScript"],["variants","Variants"],["notes","Notes"]].map(([t,l]) => (
          <button key={t} className={`tab-btn ${tab===t?"active":""}`} onClick={() => setTab(t)}>{l}</button>
        ))}
      </div>

      {tab === "viz" && (
        <>
          <div className="controls">
            <div style={{ display:"flex", alignItems:"center", gap:"var(--s2)" }}>
              <span style={{ fontSize:"var(--xs)", color:"var(--t2)" }}>Target:</span>
              <input type="number" value={target}
                onChange={e => { setTarget(Number(e.target.value)); reset(); }}
                style={{ width:70, background:"var(--bg4)", border:"1px solid var(--gb2)",
                  borderRadius:"var(--r1)", color:"var(--t1)", padding:"5px 8px",
                  fontFamily:"var(--mono)", fontSize:"var(--sm)", outline:"none" }} />
            </div>
            <button className="btn btn-primary" onClick={run} disabled={running}>▶ Search</button>
            <button className="btn btn-ghost" onClick={reset} disabled={running}>↺ Reset</button>
            <div className="speed-wrap">
              <span>Speed</span>
              <input type="range" min={200} max={1500} step={100} value={speed}
                onChange={e => setSpeed(Number(e.target.value))} disabled={running} />
            </div>
          </div>

          {/* Array cells */}
          <div style={{ marginBottom:"var(--s3)" }}>
            <div className="array-input" style={{ justifyContent:"center" }}>
              {arr.map((v, i) => (
                <div key={i} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
                  <div className={`array-cell ${getCellClass(i)}`}>{v}</div>
                  <div className="ptr">
                    {mid === i && found !== i && "mid"}
                    {found === i && "✓"}
                    {left === i && mid !== i && "L"}
                    {right === i && mid !== i && "R"}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div style={{ display:"flex", gap:"var(--s4)", marginBottom:"var(--s4)", fontSize:"var(--xs)", color:"var(--t2)", flexWrap:"wrap" }}>
            {[["mid (checking)","var(--a2)"],["left pointer","var(--warn)"],["right pointer","var(--err)"],["eliminated","var(--t3)"],["found","var(--ok)"]].map(([l,c]) => (
              <div key={l} style={{ display:"flex", alignItems:"center", gap:4 }}>
                <div style={{ width:10, height:10, borderRadius:2, background:c }} />
                {l}
              </div>
            ))}
          </div>

          <div className="step-log">
            {log.length === 0 && <span style={{ color:"var(--t3)" }}>Press Search to start...</span>}
            {log.map((l, i) => <div key={i} className={l.type}>{l.msg}</div>)}
          </div>
        </>
      )}

      {tab === "code" && (
        <div className="code-block">
          <div className="code-header"><span className="code-lang">JavaScript</span></div>
          <div className="code-body">{`// Iterative — O(1) space
function binarySearch(arr, target) {
  let left = 0, right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (arr[mid] === target) return mid;       // found
    if (arr[mid] < target)   left  = mid + 1;  // search right
    else                     right = mid - 1;  // search left
  }

  return -1; // not found
}

// Recursive — O(log n) space (call stack)
function binarySearchRec(arr, target, left = 0, right = arr.length - 1) {
  if (left > right) return -1;

  const mid = Math.floor((left + right) / 2);
  if (arr[mid] === target) return mid;
  if (arr[mid] < target)   return binarySearchRec(arr, target, mid + 1, right);
  return binarySearchRec(arr, target, left, mid - 1);
}

// Find first occurrence (leftmost)
function findFirst(arr, target) {
  let left = 0, right = arr.length - 1, result = -1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) { result = mid; right = mid - 1; } // keep searching left
    else if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return result;
}`}</div>
        </div>
      )}

      {tab === "variants" && (
        <div style={{ display:"flex", flexDirection:"column", gap:"var(--s4)" }}>
          {[
            { title:"Find first/last occurrence", tag:"Medium", desc:"Modify to not stop at first match — continue searching left (first) or right (last) half." },
            { title:"Search in rotated sorted array", tag:"Medium", desc:"LeetCode #33. Determine which half is sorted, then decide which half to search." },
            { title:"Find peak element", tag:"Medium", desc:"LeetCode #162. Binary search on the slope — if arr[mid] < arr[mid+1], peak is on right." },
            { title:"Sqrt(x) without sqrt()", tag:"Easy", desc:"LeetCode #69. Binary search on answer space 1..x. Find largest m where m*m <= x." },
            { title:"Koko eating bananas", tag:"Medium", desc:"LeetCode #875. Binary search on the eating speed. Classic 'search on answer' pattern." },
            { title:"Median of two sorted arrays", tag:"Hard", desc:"LeetCode #4. Binary search on partition point. O(log(min(m,n))). Top FAANG question." },
          ].map(v => (
            <div key={v.title} style={{ background:"var(--bg4)", border:"1px solid var(--gb)", borderRadius:"var(--r2)", padding:"var(--s4)", display:"flex", gap:"var(--s3)" }}>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", alignItems:"center", gap:"var(--s2)", marginBottom:"var(--s1)" }}>
                  <span style={{ fontWeight:700, color:"var(--t1)", fontSize:"var(--sm)" }}>{v.title}</span>
                  <span className={`dsa-difficulty ${v.tag==="Easy"?"diff-easy":v.tag==="Medium"?"diff-med":"diff-hard"}`}>{v.tag}</span>
                </div>
                <p style={{ fontSize:"var(--sm)", margin:0 }}>{v.desc}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "notes" && (
        <div style={{ display:"flex", flexDirection:"column", gap:"var(--s4)" }}>
          {[
            { title:"Common bug: integer overflow", body:"Use mid = left + Math.floor((right - left) / 2) instead of (left + right) / 2 to avoid overflow in languages with fixed int size." },
            { title:"Template to remember", body:"while (left <= right) with left = mid + 1 and right = mid - 1. The <= is critical — without it you miss the single-element case." },
            { title:"'Search on answer' pattern", body:"Binary search doesn't just search arrays. If you can define a monotonic condition on an answer space, you can binary search the answer itself. Very common in FAANG." },
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
