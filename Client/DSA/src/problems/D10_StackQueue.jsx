/**
 * D10 — Stack & Queue Problems
 * Topic: Stack/Queue | Difficulty: Easy-Medium
 * Asked at: Amazon, Microsoft, Zoho, Freshworks
 */
import { useState, useRef, useCallback } from "react";

const PROBLEMS = {
  validParens: { label:"Valid Parentheses", desc:"Check if brackets are balanced. LC #20." },
  nextGreater: { label:"Next Greater Element", desc:"For each element, find the next greater element using a monotonic stack. LC #496." },
  minStack:    { label:"Min Stack", desc:"Stack that supports getMin() in O(1). LC #155." },
};

export default function StackQueue() {
  const [problem, setProblem] = useState("validParens");
  const [input,   setInput]   = useState("({[]})");
  const [stack,   setStack]   = useState([]);
  const [result,  setResult]  = useState(null);
  const [log,     setLog]     = useState([]);
  const [running, setRunning] = useState(false);
  const [speed,   setSpeed]   = useState(600);
  const [tab,     setTab]     = useState("viz");
  const stopRef = useRef(false);

  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  const runValidParens = useCallback(async () => {
    const s = [];
    const pairs = { ')':'(', ']':'[', '}':'{' };
    const chars = input.split("");

    for (let i = 0; i < chars.length; i++) {
      if (stopRef.current) return;
      const ch = chars[i];
      setLog(l => [...l, { msg: `Process '${ch}'`, type: "step" }]);

      if ("([{".includes(ch)) {
        s.push(ch);
        setStack([...s]);
        setLog(l => [...l, { msg: `  Push '${ch}' → stack: [${s.join(",")}]`, type: "swap" }]);
      } else {
        if (s.length === 0 || s[s.length-1] !== pairs[ch]) {
          setStack([...s]);
          setResult("❌ INVALID");
          setLog(l => [...l, { msg: `  Mismatch! Expected '${pairs[ch]}' but got '${s[s.length-1]||"empty"}'`, type: "done" }]);
          return;
        }
        s.pop();
        setStack([...s]);
        setLog(l => [...l, { msg: `  Pop '${pairs[ch]}' matches '${ch}' → stack: [${s.join(",")}]`, type: "swap" }]);
      }
      await sleep(speed);
    }

    if (s.length === 0) {
      setResult("✅ VALID");
      setLog(l => [...l, { msg: "Stack empty → VALID!", type: "done" }]);
    } else {
      setResult("❌ INVALID");
      setLog(l => [...l, { msg: `Stack not empty: [${s.join(",")}] → INVALID`, type: "done" }]);
    }
  }, [input, speed]);

  const runNextGreater = useCallback(async () => {
    const arr = [4, 5, 2, 10, 8, 3, 7];
    const result = new Array(arr.length).fill(-1);
    const s = []; // monotonic stack (indices)

    for (let i = 0; i < arr.length; i++) {
      if (stopRef.current) return;
      setLog(l => [...l, { msg: `Process arr[${i}]=${arr[i]}`, type: "step" }]);
      await sleep(speed);

      while (s.length > 0 && arr[s[s.length-1]] < arr[i]) {
        const idx = s.pop();
        result[idx] = arr[i];
        setLog(l => [...l, { msg: `  NGE of ${arr[idx]} is ${arr[i]}`, type: "swap" }]);
        await sleep(speed / 2);
      }
      s.push(i);
      setStack([...s.map(i => arr[i])]);
      await sleep(speed / 2);
    }

    setResult(`NGE: [${result.join(", ")}]`);
    setLog(l => [...l, { msg: `✅ Next Greater Elements: [${result.join(", ")}]`, type: "done" }]);
  }, [speed]);

  const run = useCallback(async () => {
    stopRef.current = false;
    setRunning(true);
    setStack([]); setResult(null); setLog([]);
    if (problem === "validParens") await runValidParens();
    if (problem === "nextGreater") await runNextGreater();
    setRunning(false);
  }, [problem, runValidParens, runNextGreater]);

  const reset = () => {
    stopRef.current = true;
    setStack([]); setResult(null); setLog([]);
    setRunning(false);
  };

  return (
    <div className="prob-card">
      <div className="prob-header">
        <div>
          <div className="prob-title">Stack & Queue</div>
          <div className="prob-meta">
            <span className="dsa-difficulty diff-easy">Easy–Medium</span>
            <span className="complexity tc">T: O(n)</span>
            <span className="complexity sc">S: O(n)</span>
          </div>
        </div>
      </div>

      <p className="prob-desc">
        Stack (LIFO) and Queue (FIFO) are fundamental data structures.
        The <strong>monotonic stack</strong> pattern — maintaining a stack in increasing/decreasing order —
        solves many "next greater/smaller element" problems in O(n).
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

          <p style={{ fontSize:"var(--sm)", color:"var(--t2)", marginBottom:"var(--s4)" }}>
            {PROBLEMS[problem].desc}
          </p>

          {problem === "validParens" && (
            <div style={{ display:"flex", alignItems:"center", gap:"var(--s2)", marginBottom:"var(--s4)" }}>
              <span style={{ fontSize:"var(--xs)", color:"var(--t2)" }}>Input:</span>
              <input value={input} onChange={e => { setInput(e.target.value); reset(); }}
                style={{ width:140, background:"var(--bg4)", border:"1px solid var(--gb2)",
                  borderRadius:"var(--r1)", color:"var(--t1)", padding:"5px 10px",
                  fontFamily:"var(--mono)", fontSize:"var(--lg)", outline:"none",
                  letterSpacing:4 }} />
            </div>
          )}

          {problem === "nextGreater" && (
            <div style={{ fontSize:"var(--sm)", color:"var(--t2)", marginBottom:"var(--s4)" }}>
              Array: <code>[4, 5, 2, 10, 8, 3, 7]</code>
            </div>
          )}

          <div className="controls">
            <button className="btn btn-primary" onClick={run} disabled={running}>▶ Run</button>
            <button className="btn btn-ghost" onClick={reset} disabled={running}>↺ Reset</button>
            <div className="speed-wrap">
              <span>Speed</span>
              <input type="range" min={200} max={1500} step={100} value={speed}
                onChange={e => setSpeed(Number(e.target.value))} disabled={running} />
            </div>
          </div>

          {/* Stack visualization */}
          <div style={{ background:"var(--bg2)", border:"1px solid var(--gb)", borderRadius:"var(--r3)",
            padding:"var(--s5)", marginBottom:"var(--s4)", minHeight:100 }}>
            <div style={{ fontSize:"var(--xs)", color:"var(--t3)", marginBottom:"var(--s3)" }}>Stack (top →)</div>
            <div style={{ display:"flex", gap:"var(--s2)", alignItems:"center", flexWrap:"wrap" }}>
              {stack.length === 0 ? (
                <span style={{ color:"var(--t3)", fontSize:"var(--sm)" }}>empty</span>
              ) : (
                stack.map((v, i) => (
                  <div key={i} style={{
                    width:44, height:44, borderRadius:"var(--r2)",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontFamily:"var(--mono)", fontWeight:700, fontSize:"var(--lg)",
                    background: i === stack.length-1 ? "var(--abg2)" : "var(--bg4)",
                    border: `1px solid ${i === stack.length-1 ? "var(--a2)" : "var(--gb2)"}`,
                    color: i === stack.length-1 ? "var(--a3)" : "var(--t1)",
                    transition:"all .2s",
                  }}>
                    {v}
                  </div>
                ))
              )}
              {stack.length > 0 && (
                <span style={{ fontSize:"var(--xs)", color:"var(--a3)" }}>← top</span>
              )}
            </div>
          </div>

          {result && (
            <div style={{
              background: result.includes("✅") ? "var(--ok-bg)" : "var(--err-bg)",
              border: `1px solid ${result.includes("✅") ? "rgba(16,185,129,.3)" : "rgba(239,68,68,.3)"}`,
              borderRadius:"var(--r2)", padding:"var(--s3) var(--s4)", marginBottom:"var(--s4)",
              fontWeight:700, fontSize:"var(--md)",
              color: result.includes("✅") ? "var(--ok)" : "var(--err)",
            }}>
              {result}
            </div>
          )}

          <div className="step-log">
            {log.length === 0 && <span style={{ color:"var(--t3)" }}>Press Run to start...</span>}
            {log.map((l, i) => <div key={i} className={l.type}>{l.msg}</div>)}
          </div>
        </>
      )}

      {tab === "code" && (
        <div className="code-block">
          <div className="code-header"><span className="code-lang">JavaScript</span></div>
          <div className="code-body">{`// Valid Parentheses (LC #20)
function isValid(s) {
  const stack = [];
  const pairs = { ')':'(', ']':'[', '}':'{' };

  for (const ch of s) {
    if ('([{'.includes(ch)) {
      stack.push(ch);
    } else {
      if (stack.pop() !== pairs[ch]) return false;
    }
  }
  return stack.length === 0;
}

// Min Stack (LC #155) — O(1) getMin
class MinStack {
  constructor() { this.stack = []; this.minStack = []; }

  push(val) {
    this.stack.push(val);
    const min = this.minStack.length === 0 ? val : Math.min(val, this.getMin());
    this.minStack.push(min);
  }
  pop()    { this.stack.pop(); this.minStack.pop(); }
  top()    { return this.stack[this.stack.length - 1]; }
  getMin() { return this.minStack[this.minStack.length - 1]; }
}

// Next Greater Element — Monotonic Stack (LC #496)
function nextGreaterElement(nums) {
  const result = new Array(nums.length).fill(-1);
  const stack = []; // indices

  for (let i = 0; i < nums.length; i++) {
    while (stack.length > 0 && nums[stack[stack.length-1]] < nums[i]) {
      result[stack.pop()] = nums[i];
    }
    stack.push(i);
  }
  return result;
}

// Daily Temperatures (LC #739) — same pattern
function dailyTemperatures(temps) {
  const result = new Array(temps.length).fill(0);
  const stack = [];

  for (let i = 0; i < temps.length; i++) {
    while (stack.length > 0 && temps[stack[stack.length-1]] < temps[i]) {
      const idx = stack.pop();
      result[idx] = i - idx;
    }
    stack.push(i);
  }
  return result;
}

// Largest Rectangle in Histogram (LC #84) — Hard
function largestRectangleArea(heights) {
  const stack = [-1];
  let maxArea = 0;
  heights.push(0); // sentinel

  for (let i = 0; i < heights.length; i++) {
    while (stack[stack.length-1] !== -1 && heights[stack[stack.length-1]] >= heights[i]) {
      const h = heights[stack.pop()];
      const w = i - stack[stack.length-1] - 1;
      maxArea = Math.max(maxArea, h * w);
    }
    stack.push(i);
  }
  return maxArea;
}`}</div>
        </div>
      )}

      {tab === "notes" && (
        <div style={{ display:"flex", flexDirection:"column", gap:"var(--s4)" }}>
          {[
            { title:"Monotonic Stack pattern", body:"Maintain stack in increasing or decreasing order. When current element breaks the order, pop and process. Used for: next greater/smaller, histogram, trapping rain water." },
            { title:"Queue with two stacks", body:"Implement queue using two stacks. Push to stack1. Pop: if stack2 empty, move all from stack1 to stack2. Amortized O(1) per operation." },
            { title:"Deque (double-ended queue)", body:"Used for sliding window maximum (LC #239). Maintain indices of useful elements. Front = max of current window. O(n) total." },
            { title:"Top problems", body:"LC #20 Valid Parentheses, #155 Min Stack, #739 Daily Temperatures, #496 Next Greater, #84 Largest Rectangle, #42 Trapping Rain Water, #232 Queue using Stacks." },
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
