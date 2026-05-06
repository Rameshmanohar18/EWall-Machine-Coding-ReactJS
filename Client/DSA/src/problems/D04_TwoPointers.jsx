/**
 * D04 — Two Pointers Pattern
 * Topic: Arrays | Difficulty: Easy-Medium
 * Time: O(n) | Space: O(1)
 * Asked at: Google, Meta, Amazon, Flipkart
 * Problems: Two Sum II, 3Sum, Container With Most Water, Valid Palindrome
 */
import { useState, useRef, useCallback } from "react";

const PROBLEMS = {
  twoSum: {
    label: "Two Sum II (Sorted Array)",
    arr: [2, 7, 11, 15, 20, 25, 30],
    target: 22,
    desc: "Find two numbers that add up to target. Array is sorted.",
  },
  palindrome: {
    label: "Valid Palindrome",
    arr: "racecar".split(""),
    target: null,
    desc: "Check if string is a palindrome using two pointers.",
  },
  container: {
    label: "Container With Most Water",
    arr: [1, 8, 6, 2, 5, 4, 8, 3, 7],
    target: null,
    desc: "Find two lines that form a container holding the most water.",
  },
};

export default function TwoPointers() {
  const [problem, setProblem] = useState("twoSum");
  const [left,    setLeft]    = useState(-1);
  const [right,   setRight]   = useState(-1);
  const [result,  setResult]  = useState(null);
  const [log,     setLog]     = useState([]);
  const [running, setRunning] = useState(false);
  const [speed,   setSpeed]   = useState(700);
  const [tab,     setTab]     = useState("viz");
  const stopRef = useRef(false);

  const sleep = (ms) => new Promise(r => setTimeout(r, ms));
  const p = PROBLEMS[problem];

  const runTwoSum = async () => {
    const arr = p.arr, target = p.target;
    let l = 0, r = arr.length - 1;
    while (l < r) {
      if (stopRef.current) return;
      setLeft(l); setRight(r);
      const sum = arr[l] + arr[r];
      setLog(prev => [...prev, { msg: `a[${l}]=${arr[l]} + a[${r}]=${arr[r]} = ${sum}`, type: "step" }]);
      await sleep(speed);
      if (sum === target) {
        setResult([l, r]);
        setLog(prev => [...prev, { msg: `✅ Found! indices [${l}, ${r}]`, type: "done" }]);
        return;
      } else if (sum < target) {
        setLog(prev => [...prev, { msg: `  ${sum} < ${target} → move left →`, type: "swap" }]);
        l++;
      } else {
        setLog(prev => [...prev, { msg: `  ${sum} > ${target} → move right ←`, type: "swap" }]);
        r--;
      }
      await sleep(speed / 2);
    }
    setLog(prev => [...prev, { msg: "❌ No pair found", type: "done" }]);
  };

  const runPalindrome = async () => {
    const arr = p.arr;
    let l = 0, r = arr.length - 1;
    while (l < r) {
      if (stopRef.current) return;
      setLeft(l); setRight(r);
      setLog(prev => [...prev, { msg: `Comparing '${arr[l]}' (pos ${l}) and '${arr[r]}' (pos ${r})`, type: "step" }]);
      await sleep(speed);
      if (arr[l] !== arr[r]) {
        setResult("NOT palindrome");
        setLog(prev => [...prev, { msg: `❌ '${arr[l]}' ≠ '${arr[r]}' → Not a palindrome`, type: "done" }]);
        return;
      }
      setLog(prev => [...prev, { msg: `  ✓ Match! Move inward`, type: "swap" }]);
      l++; r--;
      await sleep(speed / 2);
    }
    setResult("IS palindrome");
    setLog(prev => [...prev, { msg: "✅ All characters matched — IS a palindrome!", type: "done" }]);
  };

  const runContainer = async () => {
    const arr = p.arr;
    let l = 0, r = arr.length - 1, maxWater = 0, bestL = 0, bestR = r;
    while (l < r) {
      if (stopRef.current) return;
      setLeft(l); setRight(r);
      const water = Math.min(arr[l], arr[r]) * (r - l);
      if (water > maxWater) { maxWater = water; bestL = l; bestR = r; }
      setLog(prev => [...prev, { msg: `l=${l}(h=${arr[l]}), r=${r}(h=${arr[r]}) → water=${water}, max=${maxWater}`, type: "step" }]);
      await sleep(speed);
      if (arr[l] < arr[r]) { l++; } else { r--; }
      await sleep(speed / 2);
    }
    setResult(`Max water = ${maxWater} (indices ${bestL}, ${bestR})`);
    setLog(prev => [...prev, { msg: `✅ Max water: ${maxWater}`, type: "done" }]);
  };

  const run = useCallback(async () => {
    stopRef.current = false;
    setRunning(true);
    setLeft(-1); setRight(-1); setResult(null); setLog([]);
    if (problem === "twoSum")    await runTwoSum();
    if (problem === "palindrome") await runPalindrome();
    if (problem === "container") await runContainer();
    setRunning(false);
  }, [problem, speed]);

  const reset = () => {
    stopRef.current = true;
    setLeft(-1); setRight(-1); setResult(null); setLog([]);
    setRunning(false);
  };

  const getCellClass = (i) => {
    if (result && Array.isArray(result) && result.includes(i)) return "result";
    if (i === left)  return "left";
    if (i === right) return "right";
    return "";
  };

  return (
    <div className="prob-card">
      <div className="prob-header">
        <div>
          <div className="prob-title">Two Pointers</div>
          <div className="prob-meta">
            <span className="dsa-difficulty diff-easy">Easy–Medium</span>
            <span className="complexity tc">T: O(n)</span>
            <span className="complexity sc">S: O(1)</span>
          </div>
        </div>
      </div>

      <p className="prob-desc">
        Use two indices (left and right) that move toward each other or in the same direction.
        Eliminates the need for nested loops — reduces O(n²) to O(n).
        <br /><br />
        <strong>When to use:</strong> Sorted array + find pair/triplet, palindrome check,
        partition problems, removing duplicates.
      </p>

      <div className="tabs">
        {[["viz","Visualizer"],["code","JavaScript"],["notes","Notes"]].map(([t,l]) => (
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

          <p style={{ fontSize:"var(--sm)", color:"var(--t2)", marginBottom:"var(--s4)" }}>{p.desc}</p>
          {p.target !== null && (
            <div style={{ fontSize:"var(--sm)", color:"var(--t2)", marginBottom:"var(--s4)" }}>
              Target: <strong style={{ color:"var(--a3)" }}>{p.target}</strong>
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

          <div style={{ marginBottom:"var(--s4)" }}>
            <div className="array-input" style={{ justifyContent:"center" }}>
              {p.arr.map((v, i) => (
                <div key={i} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
                  <div className={`array-cell ${getCellClass(i)}`}
                    style={{ width: problem==="palindrome"?40:44 }}>{v}</div>
                  <div className="ptr">
                    {i === left && "L"}
                    {i === right && "R"}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {result && (
            <div style={{ background:"var(--ok-bg)", border:"1px solid rgba(16,185,129,.3)",
              borderRadius:"var(--r2)", padding:"var(--s3) var(--s4)", marginBottom:"var(--s4)",
              color:"var(--ok)", fontWeight:700, fontSize:"var(--sm)" }}>
              {typeof result === "string" ? result : `Found at indices [${result[0]}, ${result[1]}] → values [${p.arr[result[0]]}, ${p.arr[result[1]]}]`}
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
          <div className="code-body">{`// Pattern 1: Two Sum II (sorted array)
function twoSum(arr, target) {
  let left = 0, right = arr.length - 1;
  while (left < right) {
    const sum = arr[left] + arr[right];
    if (sum === target) return [left, right];
    if (sum < target)  left++;
    else               right--;
  }
  return [-1, -1];
}

// Pattern 2: Valid Palindrome
function isPalindrome(s) {
  let left = 0, right = s.length - 1;
  while (left < right) {
    if (s[left] !== s[right]) return false;
    left++; right--;
  }
  return true;
}

// Pattern 3: Container With Most Water (LeetCode #11)
function maxArea(height) {
  let left = 0, right = height.length - 1, max = 0;
  while (left < right) {
    const water = Math.min(height[left], height[right]) * (right - left);
    max = Math.max(max, water);
    if (height[left] < height[right]) left++;
    else right--;
  }
  return max;
}

// Pattern 4: 3Sum (LeetCode #15)
function threeSum(nums) {
  nums.sort((a, b) => a - b);
  const result = [];
  for (let i = 0; i < nums.length - 2; i++) {
    if (i > 0 && nums[i] === nums[i-1]) continue; // skip duplicates
    let left = i + 1, right = nums.length - 1;
    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right];
      if (sum === 0) {
        result.push([nums[i], nums[left], nums[right]]);
        while (nums[left] === nums[left+1]) left++;
        while (nums[right] === nums[right-1]) right--;
        left++; right--;
      } else if (sum < 0) left++;
      else right--;
    }
  }
  return result;
}`}</div>
        </div>
      )}

      {tab === "notes" && (
        <div style={{ display:"flex", flexDirection:"column", gap:"var(--s4)" }}>
          {[
            { title:"Opposite direction pointers", body:"Start from both ends, move inward. Used for: Two Sum (sorted), 3Sum, palindrome, container with most water." },
            { title:"Same direction pointers (fast/slow)", body:"Both start at beginning, one moves faster. Used for: remove duplicates, cycle detection in linked list (Floyd's algorithm)." },
            { title:"Sliding window vs two pointers", body:"Sliding window maintains a window of elements (subarray). Two pointers are more general — the window can shrink from both ends." },
            { title:"Key interview problems", body:"LeetCode #1 Two Sum, #15 3Sum, #11 Container With Most Water, #42 Trapping Rain Water, #125 Valid Palindrome, #167 Two Sum II." },
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
