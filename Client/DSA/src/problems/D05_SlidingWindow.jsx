/**
 * D05 — Sliding Window Pattern
 * Topic: Arrays/Strings | Difficulty: Medium
 * Time: O(n) | Space: O(1) or O(k)
 * Asked at: Google, Amazon, Microsoft, Flipkart
 */
import { useState, useRef, useCallback } from "react";

const PROBLEMS = {
  maxSum: {
    label: "Max Sum Subarray of size K",
    arr: [2, 1, 5, 1, 3, 2, 8, 4, 6, 1],
    k: 3,
    desc: "Find the maximum sum of any contiguous subarray of size k.",
  },
  longestUnique: {
    label: "Longest Substring Without Repeating",
    arr: "abcabcbb".split(""),
    k: null,
    desc: "Find the length of the longest substring without repeating characters.",
  },
  minWindow: {
    label: "Min Window Substring",
    arr: "ADOBECODEBANC".split(""),
    k: null,
    target: "ABC",
    desc: "Find the minimum window in string S that contains all chars of T='ABC'.",
  },
};

export default function SlidingWindow() {
  const [problem, setProblem] = useState("maxSum");
  const [winStart, setWinStart] = useState(-1);
  const [winEnd,   setWinEnd]   = useState(-1);
  const [bestStart,setBestStart]= useState(-1);
  const [bestEnd,  setBestEnd]  = useState(-1);
  const [log,      setLog]      = useState([]);
  const [running,  setRunning]  = useState(false);
  const [speed,    setSpeed]    = useState(600);
  const [tab,      setTab]      = useState("viz");
  const stopRef = useRef(false);

  const sleep = (ms) => new Promise(r => setTimeout(r, ms));
  const p = PROBLEMS[problem];

  const runMaxSum = async () => {
    const arr = p.arr, k = p.k;
    let windowSum = arr.slice(0, k).reduce((a, b) => a + b, 0);
    let maxSum = windowSum, maxStart = 0;
    setWinStart(0); setWinEnd(k - 1);
    setLog(prev => [...prev, { msg: `Initial window [0..${k-1}] sum=${windowSum}`, type: "step" }]);
    await sleep(speed);

    for (let i = k; i < arr.length; i++) {
      if (stopRef.current) return;
      windowSum += arr[i] - arr[i - k];
      setWinStart(i - k + 1); setWinEnd(i);
      setLog(prev => [...prev, { msg: `Slide: +${arr[i]} -${arr[i-k]} → sum=${windowSum}`, type: "swap" }]);
      await sleep(speed);
      if (windowSum > maxSum) {
        maxSum = windowSum; maxStart = i - k + 1;
        setBestStart(maxStart); setBestEnd(i);
        setLog(prev => [...prev, { msg: `  ★ New max! sum=${maxSum} at [${maxStart}..${i}]`, type: "done" }]);
        await sleep(speed / 2);
      }
    }
    setLog(prev => [...prev, { msg: `✅ Max sum = ${maxSum}`, type: "done" }]);
  };

  const runLongestUnique = async () => {
    const arr = p.arr;
    const seen = new Map();
    let start = 0, maxLen = 0, bestS = 0, bestE = 0;

    for (let end = 0; end < arr.length; end++) {
      if (stopRef.current) return;
      const ch = arr[end];
      if (seen.has(ch) && seen.get(ch) >= start) {
        start = seen.get(ch) + 1;
        setLog(prev => [...prev, { msg: `'${ch}' repeat → shrink start to ${start}`, type: "swap" }]);
      }
      seen.set(ch, end);
      setWinStart(start); setWinEnd(end);
      const len = end - start + 1;
      setLog(prev => [...prev, { msg: `Window [${start}..${end}] = "${arr.slice(start,end+1).join("")}" len=${len}`, type: "step" }]);
      await sleep(speed);
      if (len > maxLen) {
        maxLen = len; bestS = start; bestE = end;
        setBestStart(bestS); setBestEnd(bestE);
      }
    }
    setLog(prev => [...prev, { msg: `✅ Longest = ${maxLen} chars: "${arr.slice(bestS,bestE+1).join("")}"`, type: "done" }]);
  };

  const run = useCallback(async () => {
    stopRef.current = false;
    setRunning(true);
    setWinStart(-1); setWinEnd(-1); setBestStart(-1); setBestEnd(-1); setLog([]);
    if (problem === "maxSum")       await runMaxSum();
    if (problem === "longestUnique") await runLongestUnique();
    setRunning(false);
  }, [problem, speed]);

  const reset = () => {
    stopRef.current = true;
    setWinStart(-1); setWinEnd(-1); setBestStart(-1); setBestEnd(-1); setLog([]);
    setRunning(false);
  };

  const getCellClass = (i) => {
    if (i >= bestStart && i <= bestEnd && !running) return "result";
    if (i >= winStart && i <= winEnd) return "active";
    return "";
  };

  return (
    <div className="prob-card">
      <div className="prob-header">
        <div>
          <div className="prob-title">Sliding Window</div>
          <div className="prob-meta">
            <span className="dsa-difficulty diff-med">Medium</span>
            <span className="complexity tc">T: O(n)</span>
            <span className="complexity sc">S: O(1)–O(k)</span>
          </div>
        </div>
      </div>

      <p className="prob-desc">
        Maintain a window (subarray/substring) that slides over the data.
        Expand the right edge to include new elements, shrink the left edge when a constraint is violated.
        <br /><br />
        <strong>Fixed window:</strong> size k stays constant (max sum subarray).
        <strong> Variable window:</strong> size changes based on condition (longest unique substring).
      </p>

      <div className="tabs">
        {[["viz","Visualizer"],["code","JavaScript"],["notes","Notes"]].map(([t,l]) => (
          <button key={t} className={`tab-btn ${tab===t?"active":""}`} onClick={() => setTab(t)}>{l}</button>
        ))}
      </div>

      {tab === "viz" && (
        <>
          <div style={{ display:"flex", gap:"var(--s2)", marginBottom:"var(--s4)", flexWrap:"wrap" }}>
            {Object.entries(PROBLEMS).map(([key, val]) => (
              <button key={key}
                className={`btn btn-sm ${problem===key?"btn-primary":"btn-ghost"}`}
                onClick={() => { setProblem(key); reset(); }}
                disabled={running}>
                {val.label}
              </button>
            ))}
          </div>

          <p style={{ fontSize:"var(--sm)", color:"var(--t2)", marginBottom:"var(--s4)" }}>{p.desc}</p>
          {p.k && <div style={{ fontSize:"var(--sm)", color:"var(--t2)", marginBottom:"var(--s4)" }}>k = <strong style={{ color:"var(--a3)" }}>{p.k}</strong></div>}

          <div className="controls">
            <button className="btn btn-primary" onClick={run} disabled={running}>▶ Run</button>
            <button className="btn btn-ghost" onClick={reset} disabled={running}>↺ Reset</button>
            <div className="speed-wrap">
              <span>Speed</span>
              <input type="range" min={200} max={1500} step={100} value={speed}
                onChange={e => setSpeed(Number(e.target.value))} disabled={running} />
            </div>
          </div>

          {/* Window visualization */}
          <div style={{ position:"relative", marginBottom:"var(--s5)" }}>
            <div className="array-input" style={{ justifyContent:"center" }}>
              {p.arr.map((v, i) => (
                <div key={i} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
                  <div className={`array-cell ${getCellClass(i)}`}
                    style={{ width:38, height:38, fontSize:"var(--sm)" }}>{v}</div>
                  <div className="ptr" style={{ fontSize:9 }}>{i}</div>
                </div>
              ))}
            </div>
            {/* Window bracket */}
            {winStart >= 0 && winEnd >= 0 && (
              <div style={{ textAlign:"center", fontSize:"var(--xs)", color:"var(--a3)", marginTop:"var(--s1)" }}>
                ← window [{winStart}..{winEnd}] →
              </div>
            )}
          </div>

          <div style={{ display:"flex", gap:"var(--s4)", marginBottom:"var(--s4)", fontSize:"var(--xs)", color:"var(--t2)" }}>
            <div style={{ display:"flex", alignItems:"center", gap:4 }}>
              <div style={{ width:10, height:10, borderRadius:2, background:"var(--a2)" }} /> current window
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:4 }}>
              <div style={{ width:10, height:10, borderRadius:2, background:"var(--ok)" }} /> best result
            </div>
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
          <div className="code-body">{`// Fixed window: Max sum subarray of size k
function maxSumSubarray(arr, k) {
  let windowSum = arr.slice(0, k).reduce((a, b) => a + b, 0);
  let maxSum = windowSum;

  for (let i = k; i < arr.length; i++) {
    windowSum += arr[i] - arr[i - k]; // slide: add new, remove old
    maxSum = Math.max(maxSum, windowSum);
  }
  return maxSum;
}

// Variable window: Longest substring without repeating chars (LC #3)
function lengthOfLongestSubstring(s) {
  const seen = new Map();
  let start = 0, maxLen = 0;

  for (let end = 0; end < s.length; end++) {
    if (seen.has(s[end]) && seen.get(s[end]) >= start) {
      start = seen.get(s[end]) + 1; // shrink window
    }
    seen.set(s[end], end);
    maxLen = Math.max(maxLen, end - start + 1);
  }
  return maxLen;
}

// Variable window: Minimum window substring (LC #76)
function minWindow(s, t) {
  const need = new Map();
  for (const c of t) need.set(c, (need.get(c) || 0) + 1);

  let have = 0, required = need.size;
  let left = 0, minLen = Infinity, result = "";
  const window = new Map();

  for (let right = 0; right < s.length; right++) {
    const c = s[right];
    window.set(c, (window.get(c) || 0) + 1);
    if (need.has(c) && window.get(c) === need.get(c)) have++;

    while (have === required) {
      if (right - left + 1 < minLen) {
        minLen = right - left + 1;
        result = s.slice(left, right + 1);
      }
      const lc = s[left];
      window.set(lc, window.get(lc) - 1);
      if (need.has(lc) && window.get(lc) < need.get(lc)) have--;
      left++;
    }
  }
  return result;
}`}</div>
        </div>
      )}

      {tab === "notes" && (
        <div style={{ display:"flex", flexDirection:"column", gap:"var(--s4)" }}>
          {[
            { title:"Template", body:"Expand right pointer always. Shrink left pointer when constraint violated. Track best result at each valid state." },
            { title:"Key problems", body:"LC #3 Longest Substring Without Repeating, #76 Minimum Window Substring, #239 Sliding Window Maximum, #424 Longest Repeating Character Replacement." },
            { title:"Sliding Window Maximum (Hard)", body:"Use a deque (monotonic queue) to track the max in the current window in O(1). Overall O(n). Very common at Google." },
            { title:"When NOT to use", body:"When you need non-contiguous elements, or when the constraint isn't monotonic (adding elements doesn't always make it worse/better)." },
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
