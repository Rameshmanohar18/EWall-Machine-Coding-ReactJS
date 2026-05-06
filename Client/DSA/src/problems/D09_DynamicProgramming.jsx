/**
 * D09 — Dynamic Programming Visualizer
 * Topic: DP | Difficulty: Medium-Hard
 * Asked at: Google, Meta, Amazon, Microsoft — most common FAANG topic
 * Problems: Fibonacci, Climbing Stairs, Coin Change, Longest Common Subsequence
 */
import { useState, useRef, useCallback } from "react";

const PROBLEMS = {
  fib: {
    label: "Fibonacci (Memoization)",
    desc: "Compute nth Fibonacci number. Shows how memoization avoids recomputation.",
  },
  stairs: {
    label: "Climbing Stairs",
    desc: "Count ways to climb n stairs taking 1 or 2 steps at a time. LC #70.",
  },
  coinChange: {
    label: "Coin Change",
    desc: "Minimum coins to make amount. LC #322. Classic unbounded knapsack.",
  },
  lcs: {
    label: "Longest Common Subsequence",
    desc: "Length of LCS of two strings. LC #1143. 2D DP table.",
  },
};

export default function DynamicProgramming() {
  const [problem, setProblem] = useState("fib");
  const [n,       setN]       = useState(8);
  const [coins,   setCoins]   = useState([1, 5, 6, 9]);
  const [amount,  setAmount]  = useState(11);
  const [str1,    setStr1]    = useState("ABCBDAB");
  const [str2,    setStr2]    = useState("BDCAB");
  const [dp,      setDp]      = useState([]);
  const [active,  setActive]  = useState(null);
  const [log,     setLog]     = useState([]);
  const [running, setRunning] = useState(false);
  const [speed,   setSpeed]   = useState(300);
  const [tab,     setTab]     = useState("viz");
  const stopRef = useRef(false);

  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  const runFib = useCallback(async () => {
    const table = new Array(n + 1).fill(0);
    table[0] = 0; table[1] = 1;
    setDp([...table]);
    setLog([{ msg: `dp[0]=0, dp[1]=1 (base cases)`, type: "step" }]);
    await sleep(speed);

    for (let i = 2; i <= n; i++) {
      if (stopRef.current) return;
      setActive(i);
      table[i] = table[i-1] + table[i-2];
      setDp([...table]);
      setLog(l => [...l, { msg: `dp[${i}] = dp[${i-1}](${table[i-1]}) + dp[${i-2}](${table[i-2]}) = ${table[i]}`, type: "swap" }]);
      await sleep(speed);
    }
    setActive(null);
    setLog(l => [...l, { msg: `✅ Fibonacci(${n}) = ${table[n]}`, type: "done" }]);
  }, [n, speed]);

  const runStairs = useCallback(async () => {
    const table = new Array(n + 1).fill(0);
    table[0] = 1; table[1] = 1;
    setDp([...table]);
    setLog([{ msg: `dp[0]=1 (1 way to stay), dp[1]=1 (1 way)`, type: "step" }]);
    await sleep(speed);

    for (let i = 2; i <= n; i++) {
      if (stopRef.current) return;
      setActive(i);
      table[i] = table[i-1] + table[i-2];
      setDp([...table]);
      setLog(l => [...l, { msg: `dp[${i}] = dp[${i-1}](${table[i-1]}) + dp[${i-2}](${table[i-2]}) = ${table[i]}`, type: "swap" }]);
      await sleep(speed);
    }
    setActive(null);
    setLog(l => [...l, { msg: `✅ Ways to climb ${n} stairs = ${table[n]}`, type: "done" }]);
  }, [n, speed]);

  const runCoinChange = useCallback(async () => {
    const table = new Array(amount + 1).fill(Infinity);
    table[0] = 0;
    setDp([...table]);
    setLog([{ msg: `dp[0]=0 (0 coins for amount 0)`, type: "step" }]);
    await sleep(speed);

    for (let i = 1; i <= amount; i++) {
      if (stopRef.current) return;
      setActive(i);
      for (const coin of coins) {
        if (coin <= i && table[i - coin] + 1 < table[i]) {
          table[i] = table[i - coin] + 1;
          setLog(l => [...l, { msg: `dp[${i}]: use coin ${coin} → dp[${i-coin}]+1=${table[i]}`, type: "swap" }]);
        }
      }
      setDp([...table]);
      await sleep(speed);
    }
    setActive(null);
    const ans = table[amount] === Infinity ? -1 : table[amount];
    setLog(l => [...l, { msg: `✅ Min coins for ${amount} = ${ans}`, type: "done" }]);
  }, [coins, amount, speed]);

  const runLCS = useCallback(async () => {
    const m = str1.length, k = str2.length;
    const table = Array.from({ length: m+1 }, () => new Array(k+1).fill(0));
    setDp(table.map(r => [...r]));
    await sleep(speed);

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= k; j++) {
        if (stopRef.current) return;
        setActive(`${i},${j}`);
        if (str1[i-1] === str2[j-1]) {
          table[i][j] = table[i-1][j-1] + 1;
          setLog(l => [...l, { msg: `Match '${str1[i-1]}': dp[${i}][${j}]=${table[i][j]}`, type: "swap" }]);
        } else {
          table[i][j] = Math.max(table[i-1][j], table[i][j-1]);
          setLog(l => [...l, { msg: `No match: dp[${i}][${j}]=max(${table[i-1][j]},${table[i][j-1]})=${table[i][j]}`, type: "step" }]);
        }
        setDp(table.map(r => [...r]));
        await sleep(speed / 2);
      }
    }
    setActive(null);
    setLog(l => [...l, { msg: `✅ LCS length = ${table[m][k]}`, type: "done" }]);
  }, [str1, str2, speed]);

  const run = useCallback(async () => {
    stopRef.current = false;
    setRunning(true);
    setDp([]); setActive(null); setLog([]);
    if (problem === "fib")        await runFib();
    if (problem === "stairs")     await runStairs();
    if (problem === "coinChange") await runCoinChange();
    if (problem === "lcs")        await runLCS();
    setRunning(false);
  }, [problem, runFib, runStairs, runCoinChange, runLCS]);

  const reset = () => {
    stopRef.current = true;
    setDp([]); setActive(null); setLog([]);
    setRunning(false);
  };

  return (
    <div className="prob-card">
      <div className="prob-header">
        <div>
          <div className="prob-title">Dynamic Programming</div>
          <div className="prob-meta">
            <span className="dsa-difficulty diff-hard">Medium–Hard</span>
            <span className="complexity tc">T: varies</span>
            <span className="complexity sc">S: O(n)–O(n²)</span>
          </div>
        </div>
      </div>

      <p className="prob-desc">
        DP solves problems by breaking them into overlapping subproblems and storing results.
        <strong> Top-down</strong> (memoization): recursion + cache.
        <strong> Bottom-up</strong> (tabulation): fill table iteratively.
        <br /><br />
        <strong>Key insight:</strong> If a problem has optimal substructure + overlapping subproblems → DP.
      </p>

      <div className="tabs">
        {[["viz","Visualizer"],["code","JavaScript"],["patterns","Patterns"],["notes","Notes"]].map(([t,l]) => (
          <button key={t} className={`tab-btn ${tab===t?"active":""}`} onClick={() => setTab(t)}>{l}</button>
        ))}
      </div>

      {tab === "viz" && (
        <>
          {/* Problem selector */}
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

          {/* Inputs */}
          <div style={{ display:"flex", gap:"var(--s3)", marginBottom:"var(--s4)", flexWrap:"wrap", alignItems:"center" }}>
            {(problem === "fib" || problem === "stairs") && (
              <div style={{ display:"flex", alignItems:"center", gap:"var(--s2)" }}>
                <span style={{ fontSize:"var(--xs)", color:"var(--t2)" }}>n =</span>
                <input type="number" min={2} max={15} value={n}
                  onChange={e => { setN(Number(e.target.value)); reset(); }}
                  style={{ width:60, background:"var(--bg4)", border:"1px solid var(--gb2)",
                    borderRadius:"var(--r1)", color:"var(--t1)", padding:"5px 8px",
                    fontFamily:"var(--mono)", fontSize:"var(--sm)", outline:"none" }} />
              </div>
            )}
            {problem === "coinChange" && (
              <>
                <div style={{ display:"flex", alignItems:"center", gap:"var(--s2)" }}>
                  <span style={{ fontSize:"var(--xs)", color:"var(--t2)" }}>Amount:</span>
                  <input type="number" min={1} max={30} value={amount}
                    onChange={e => { setAmount(Number(e.target.value)); reset(); }}
                    style={{ width:60, background:"var(--bg4)", border:"1px solid var(--gb2)",
                      borderRadius:"var(--r1)", color:"var(--t1)", padding:"5px 8px",
                      fontFamily:"var(--mono)", fontSize:"var(--sm)", outline:"none" }} />
                </div>
                <span style={{ fontSize:"var(--xs)", color:"var(--t2)" }}>Coins: [{coins.join(",")}]</span>
              </>
            )}
            {problem === "lcs" && (
              <>
                <input value={str1} onChange={e => { setStr1(e.target.value.toUpperCase()); reset(); }}
                  style={{ width:100, background:"var(--bg4)", border:"1px solid var(--gb2)",
                    borderRadius:"var(--r1)", color:"var(--t1)", padding:"5px 8px",
                    fontFamily:"var(--mono)", fontSize:"var(--sm)", outline:"none" }} />
                <input value={str2} onChange={e => { setStr2(e.target.value.toUpperCase()); reset(); }}
                  style={{ width:100, background:"var(--bg4)", border:"1px solid var(--gb2)",
                    borderRadius:"var(--r1)", color:"var(--t1)", padding:"5px 8px",
                    fontFamily:"var(--mono)", fontSize:"var(--sm)", outline:"none" }} />
              </>
            )}
          </div>

          <div className="controls">
            <button className="btn btn-primary" onClick={run} disabled={running}>▶ Run</button>
            <button className="btn btn-ghost" onClick={reset} disabled={running}>↺ Reset</button>
            <div className="speed-wrap">
              <span>Speed</span>
              <input type="range" min={50} max={800} step={50} value={speed}
                onChange={e => setSpeed(Number(e.target.value))} disabled={running} />
            </div>
          </div>

          {/* DP Table visualization */}
          {dp.length > 0 && problem !== "lcs" && (
            <div style={{ overflowX:"auto", marginBottom:"var(--s4)" }}>
              <div style={{ display:"flex", gap:4, alignItems:"flex-end" }}>
                {dp.map((val, i) => (
                  <div key={i} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
                    <div style={{
                      minWidth:44, height:44, borderRadius:"var(--r2)",
                      display:"flex", alignItems:"center", justifyContent:"center",
                      fontFamily:"var(--mono)", fontWeight:700, fontSize:"var(--sm)",
                      background: active===i ? "var(--abg2)" : val===Infinity ? "var(--err-bg)" : "var(--bg4)",
                      border: `1px solid ${active===i?"var(--a2)":val===Infinity?"var(--err)":"var(--gb2)"}`,
                      color: active===i ? "var(--a3)" : val===Infinity ? "var(--err)" : "var(--t1)",
                      transition:"all .2s",
                    }}>
                      {val === Infinity ? "∞" : val}
                    </div>
                    <div style={{ fontSize:9, color:"var(--t3)", fontFamily:"var(--mono)" }}>{i}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* LCS 2D table */}
          {dp.length > 0 && problem === "lcs" && (
            <div style={{ overflowX:"auto", marginBottom:"var(--s4)" }}>
              <table style={{ borderCollapse:"collapse", fontFamily:"var(--mono)", fontSize:"var(--xs)" }}>
                <thead>
                  <tr>
                    <td style={{ padding:"4px 8px", color:"var(--t3)" }}></td>
                    <td style={{ padding:"4px 8px", color:"var(--t3)" }}>""</td>
                    {str2.split("").map((c,i) => (
                      <td key={i} style={{ padding:"4px 8px", color:"var(--a3)", fontWeight:700 }}>{c}</td>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {dp.map((row, i) => (
                    <tr key={i}>
                      <td style={{ padding:"4px 8px", color:"var(--a3)", fontWeight:700 }}>
                        {i === 0 ? '""' : str1[i-1]}
                      </td>
                      {row.map((val, j) => (
                        <td key={j} style={{
                          padding:"4px 8px", textAlign:"center",
                          background: active===`${i},${j}` ? "var(--abg2)" : val>0 ? "var(--ok-bg)" : "transparent",
                          color: active===`${i},${j}` ? "var(--a3)" : val>0 ? "var(--ok)" : "var(--t3)",
                          border:"1px solid var(--gb)", fontWeight:val>0?700:400,
                          transition:"all .15s",
                        }}>
                          {val}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
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
          <div className="code-body">{`// Fibonacci — Top-down (memoization)
function fib(n, memo = {}) {
  if (n <= 1) return n;
  if (memo[n]) return memo[n];
  return memo[n] = fib(n-1, memo) + fib(n-2, memo);
}

// Fibonacci — Bottom-up (tabulation)
function fibDP(n) {
  const dp = [0, 1];
  for (let i = 2; i <= n; i++) dp[i] = dp[i-1] + dp[i-2];
  return dp[n];
}

// Climbing Stairs (LC #70)
function climbStairs(n) {
  const dp = [1, 1];
  for (let i = 2; i <= n; i++) dp[i] = dp[i-1] + dp[i-2];
  return dp[n];
}

// Coin Change (LC #322)
function coinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let i = 1; i <= amount; i++) {
    for (const coin of coins) {
      if (coin <= i) dp[i] = Math.min(dp[i], dp[i - coin] + 1);
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}

// Longest Common Subsequence (LC #1143)
function longestCommonSubsequence(text1, text2) {
  const m = text1.length, n = text2.length;
  const dp = Array.from({length: m+1}, () => new Array(n+1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (text1[i-1] === text2[j-1]) dp[i][j] = dp[i-1][j-1] + 1;
      else dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
    }
  }
  return dp[m][n];
}

// 0/1 Knapsack
function knapsack(weights, values, capacity) {
  const n = weights.length;
  const dp = Array.from({length: n+1}, () => new Array(capacity+1).fill(0));

  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= capacity; w++) {
      dp[i][w] = dp[i-1][w]; // don't take item i
      if (weights[i-1] <= w) {
        dp[i][w] = Math.max(dp[i][w], dp[i-1][w - weights[i-1]] + values[i-1]);
      }
    }
  }
  return dp[n][capacity];
}`}</div>
        </div>
      )}

      {tab === "patterns" && (
        <div style={{ display:"flex", flexDirection:"column", gap:"var(--s4)" }}>
          {[
            { title:"1D DP — Linear sequence", tag:"Easy-Med", problems:"Fibonacci, Climbing Stairs, House Robber, Jump Game, Decode Ways" },
            { title:"2D DP — Two sequences/grid", tag:"Medium", problems:"LCS, Edit Distance, Unique Paths, Minimum Path Sum, Coin Change 2" },
            { title:"Interval DP", tag:"Hard", problems:"Burst Balloons, Matrix Chain Multiplication, Palindrome Partitioning" },
            { title:"Knapsack variants", tag:"Medium", problems:"0/1 Knapsack, Unbounded Knapsack, Partition Equal Subset Sum, Target Sum" },
            { title:"State machine DP", tag:"Medium", problems:"Best Time to Buy/Sell Stock (all variants), Paint House" },
            { title:"Tree DP", tag:"Hard", problems:"House Robber III, Binary Tree Cameras, Diameter of Binary Tree" },
          ].map(p => (
            <div key={p.title} style={{ background:"var(--bg4)", border:"1px solid var(--gb)", borderRadius:"var(--r2)", padding:"var(--s4)" }}>
              <div style={{ display:"flex", alignItems:"center", gap:"var(--s2)", marginBottom:"var(--s2)" }}>
                <span style={{ fontWeight:700, color:"var(--t1)", fontSize:"var(--sm)" }}>{p.title}</span>
                <span className={`dsa-difficulty ${p.tag.includes("Hard")?"diff-hard":p.tag.includes("Med")?"diff-med":"diff-easy"}`}>{p.tag}</span>
              </div>
              <p style={{ fontSize:"var(--sm)", margin:0, color:"var(--t2)" }}>{p.problems}</p>
            </div>
          ))}
        </div>
      )}

      {tab === "notes" && (
        <div style={{ display:"flex", flexDirection:"column", gap:"var(--s4)" }}>
          {[
            { title:"How to identify DP problems", body:"1. Asks for max/min/count. 2. Has overlapping subproblems. 3. Optimal substructure (optimal solution built from optimal sub-solutions). 4. Can't use greedy." },
            { title:"Top-down vs Bottom-up", body:"Top-down (memoization): easier to write, only computes needed states. Bottom-up (tabulation): no recursion overhead, easier to optimize space." },
            { title:"Space optimization", body:"Many 1D DP problems only need previous 1-2 values. Many 2D DP problems only need previous row. Reduces O(n²) space to O(n) or O(1)." },
            { title:"Must-solve DP problems", body:"LC #70 Climbing Stairs, #198 House Robber, #322 Coin Change, #1143 LCS, #300 LIS, #72 Edit Distance, #416 Partition Equal Subset, #121-123 Stock Problems." },
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
