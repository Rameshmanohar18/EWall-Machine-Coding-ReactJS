/**
 * D06 — Linked List Operations Visualizer
 * Topic: Linked List | Difficulty: Easy-Medium
 * Time: O(n) | Space: O(1)
 * Asked at: Amazon, Microsoft, Flipkart, Zoho
 * Problems: Reverse, Detect Cycle, Find Middle, Merge Two Sorted
 */
import { useState, useRef, useCallback } from "react";

const OPERATIONS = {
  reverse:  "Reverse Linked List",
  cycle:    "Detect Cycle (Floyd's)",
  middle:   "Find Middle Node",
  merge:    "Merge Two Sorted Lists",
};

function buildList(arr) {
  return arr.map((val, i) => ({ val, id: i, next: i + 1 < arr.length ? i + 1 : null }));
}

export default function LinkedList() {
  const [op,      setOp]      = useState("reverse");
  const [nodes,   setNodes]   = useState(buildList([1, 2, 3, 4, 5]));
  const [nodes2,  setNodes2]  = useState(buildList([1, 3, 5, 7]));
  const [active,  setActive]  = useState(new Set());
  const [done,    setDone]    = useState(new Set());
  const [log,     setLog]     = useState([]);
  const [running, setRunning] = useState(false);
  const [speed,   setSpeed]   = useState(600);
  const [tab,     setTab]     = useState("viz");
  const stopRef = useRef(false);

  const sleep = (ms) => new Promise(r => setTimeout(r, ms));
  const addLog = (msg, type = "step") => setLog(l => [...l.slice(-25), { msg, type }]);

  const runReverse = async () => {
    const arr = nodes.map(n => n.val);
    let prev = null, curr = 0;
    const result = [];

    while (curr !== null && curr < arr.length) {
      if (stopRef.current) return;
      setActive(new Set([curr]));
      addLog(`curr=${arr[curr]}, prev=${prev !== null ? arr[prev] : "null"}`, "step");
      await sleep(speed);

      const next = curr + 1 < arr.length ? curr + 1 : null;
      result.unshift(arr[curr]);
      prev = curr;
      curr = next;
      await sleep(speed / 2);
    }

    const reversed = buildList(result);
    setNodes(reversed);
    setActive(new Set());
    setDone(new Set(reversed.map(n => n.id)));
    addLog(`✅ Reversed: [${result.join(" → ")}]`, "done");
  };

  const runMiddle = async () => {
    const arr = nodes.map(n => n.val);
    let slow = 0, fast = 0;

    while (fast < arr.length && fast + 1 < arr.length) {
      if (stopRef.current) return;
      setActive(new Set([slow, fast]));
      addLog(`slow=${arr[slow]}, fast=${arr[fast]}`, "step");
      await sleep(speed);
      slow++;
      fast += 2;
      await sleep(speed / 2);
    }

    setActive(new Set([slow]));
    setDone(new Set([slow]));
    addLog(`✅ Middle node = ${arr[slow]} (index ${slow})`, "done");
  };

  const runCycle = async () => {
    // Simulate with a list that has a cycle: 1→2→3→4→5→3
    const cycleArr = [1, 2, 3, 4, 5];
    const cyclePos = 2; // node at index 2 (value 3) is the cycle entry
    let slow = 0, fast = 0, step = 0;

    addLog(`Simulating cycle: 1→2→3→4→5→back to 3`, "step");
    await sleep(speed);

    const getNext = (i) => {
      if (i + 1 >= cycleArr.length) return cyclePos; // cycle back
      return i + 1;
    };

    while (step < 12) {
      if (stopRef.current) return;
      setActive(new Set([slow % cycleArr.length, fast % cycleArr.length]));
      addLog(`slow=${cycleArr[slow % cycleArr.length]}, fast=${cycleArr[fast % cycleArr.length]}`, "step");
      await sleep(speed);

      slow = getNext(slow);
      fast = getNext(getNext(fast));
      step++;

      if (slow === fast) {
        setDone(new Set([slow % cycleArr.length]));
        addLog(`✅ Cycle detected! slow=fast=${cycleArr[slow % cycleArr.length]}`, "done");
        return;
      }
    }
    addLog("No cycle detected", "done");
  };

  const runMerge = async () => {
    const a = nodes.map(n => n.val);
    const b = nodes2.map(n => n.val);
    const merged = [];
    let i = 0, j = 0;

    while (i < a.length && j < b.length) {
      if (stopRef.current) return;
      setActive(new Set([i, a.length + j]));
      addLog(`Compare a[${i}]=${a[i]} vs b[${j}]=${b[j]}`, "step");
      await sleep(speed);

      if (a[i] <= b[j]) {
        merged.push(a[i++]);
        addLog(`  Take ${merged[merged.length-1]} from list A`, "swap");
      } else {
        merged.push(b[j++]);
        addLog(`  Take ${merged[merged.length-1]} from list B`, "swap");
      }
      await sleep(speed / 2);
    }
    while (i < a.length) merged.push(a[i++]);
    while (j < b.length) merged.push(b[j++]);

    setNodes(buildList(merged));
    setNodes2([]);
    setDone(new Set(merged.map((_, i) => i)));
    addLog(`✅ Merged: [${merged.join(" → ")}]`, "done");
  };

  const run = useCallback(async () => {
    stopRef.current = false;
    setRunning(true);
    setActive(new Set()); setDone(new Set()); setLog([]);
    if (op === "reverse") await runReverse();
    if (op === "middle")  await runMiddle();
    if (op === "cycle")   await runCycle();
    if (op === "merge")   await runMerge();
    setRunning(false);
  }, [op, speed, nodes, nodes2]);

  const reset = () => {
    stopRef.current = true;
    setNodes(buildList([1, 2, 3, 4, 5]));
    setNodes2(buildList([1, 3, 5, 7]));
    setActive(new Set()); setDone(new Set()); setLog([]);
    setRunning(false);
  };

  const renderList = (list, offset = 0, label = "") => (
    <div style={{ display:"flex", alignItems:"center", gap:"var(--s2)", flexWrap:"wrap", marginBottom:"var(--s3)" }}>
      {label && <span style={{ fontSize:"var(--xs)", color:"var(--t3)", minWidth:20 }}>{label}</span>}
      {list.map((node, i) => (
        <div key={node.id} style={{ display:"flex", alignItems:"center", gap:"var(--s1)" }}>
          <div style={{
            width:44, height:44, borderRadius:"var(--r2)", display:"flex", alignItems:"center",
            justifyContent:"center", fontFamily:"var(--mono)", fontWeight:700, fontSize:"var(--sm)",
            background: done.has(i) ? "var(--ok-bg)" : active.has(i + offset) ? "var(--abg2)" : "var(--bg4)",
            border: `1px solid ${done.has(i) ? "var(--ok)" : active.has(i + offset) ? "var(--a2)" : "var(--gb2)"}`,
            color: done.has(i) ? "var(--ok)" : active.has(i + offset) ? "var(--a3)" : "var(--t1)",
            transition: "all .2s ease",
          }}>
            {node.val}
          </div>
          {node.next !== null && (
            <span style={{ color:"var(--t3)", fontSize:"var(--sm)" }}>→</span>
          )}
          {node.next === null && (
            <span style={{ color:"var(--t3)", fontSize:"var(--xs)", fontFamily:"var(--mono)" }}>null</span>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="prob-card">
      <div className="prob-header">
        <div>
          <div className="prob-title">Linked List Operations</div>
          <div className="prob-meta">
            <span className="dsa-difficulty diff-med">Easy–Medium</span>
            <span className="complexity tc">T: O(n)</span>
            <span className="complexity sc">S: O(1)</span>
          </div>
        </div>
      </div>

      <p className="prob-desc">
        Linked list problems rely on pointer manipulation. Master the fast/slow pointer technique
        (Floyd's algorithm) for cycle detection and finding the middle node.
      </p>

      <div className="tabs">
        {[["viz","Visualizer"],["code","JavaScript"],["notes","Notes"]].map(([t,l]) => (
          <button key={t} className={`tab-btn ${tab===t?"active":""}`} onClick={() => setTab(t)}>{l}</button>
        ))}
      </div>

      {tab === "viz" && (
        <>
          <div style={{ display:"flex", gap:"var(--s2)", marginBottom:"var(--s4)", flexWrap:"wrap" }}>
            {Object.entries(OPERATIONS).map(([key, label]) => (
              <button key={key}
                className={`btn btn-sm ${op===key?"btn-primary":"btn-ghost"}`}
                onClick={() => { setOp(key); reset(); }}
                disabled={running}>
                {label}
              </button>
            ))}
          </div>

          <div className="controls">
            <button className="btn btn-primary" onClick={run} disabled={running}>▶ Run</button>
            <button className="btn btn-ghost" onClick={reset} disabled={running}>↺ Reset</button>
            <div className="speed-wrap">
              <span>Speed</span>
              <input type="range" min={200} max={1500} step={100} value={speed}
                onChange={e => setSpeed(Number(e.target.value))} disabled={running} />
            </div>
          </div>

          <div style={{ background:"var(--bg2)", border:"1px solid var(--gb)", borderRadius:"var(--r3)", padding:"var(--s5)", marginBottom:"var(--s4)" }}>
            {op === "merge" ? (
              <>
                {renderList(nodes, 0, "A:")}
                {renderList(nodes2, nodes.length, "B:")}
              </>
            ) : (
              renderList(op === "cycle" ? buildList([1,2,3,4,5]) : nodes)
            )}
            {op === "cycle" && (
              <div style={{ fontSize:"var(--xs)", color:"var(--t3)", marginTop:"var(--s2)" }}>
                ↑ Cycle: 5 → back to 3 (index 2)
              </div>
            )}
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
          <div className="code-body">{`// Reverse Linked List (LC #206)
function reverseList(head) {
  let prev = null, curr = head;
  while (curr) {
    const next = curr.next;
    curr.next = prev;  // reverse pointer
    prev = curr;
    curr = next;
  }
  return prev; // new head
}

// Find Middle (LC #876) — fast/slow pointers
function middleNode(head) {
  let slow = head, fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
  }
  return slow; // slow is at middle
}

// Detect Cycle (LC #141) — Floyd's algorithm
function hasCycle(head) {
  let slow = head, fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}

// Find cycle start (LC #142)
function detectCycle(head) {
  let slow = head, fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) {
      slow = head; // reset one pointer to head
      while (slow !== fast) { slow = slow.next; fast = fast.next; }
      return slow; // cycle start
    }
  }
  return null;
}

// Merge Two Sorted Lists (LC #21)
function mergeTwoLists(l1, l2) {
  const dummy = { next: null };
  let curr = dummy;
  while (l1 && l2) {
    if (l1.val <= l2.val) { curr.next = l1; l1 = l1.next; }
    else                  { curr.next = l2; l2 = l2.next; }
    curr = curr.next;
  }
  curr.next = l1 || l2;
  return dummy.next;
}`}</div>
        </div>
      )}

      {tab === "notes" && (
        <div style={{ display:"flex", flexDirection:"column", gap:"var(--s4)" }}>
          {[
            { title:"Dummy head trick", body:"Create a dummy node before the head. Makes edge cases (empty list, single node) disappear. Always use for merge/insert problems." },
            { title:"Fast/slow pointer", body:"Slow moves 1 step, fast moves 2. When fast reaches end, slow is at middle. If they meet, there's a cycle. After meeting, reset slow to head — they meet again at cycle start." },
            { title:"Reverse in groups of K", body:"LC #25. Reverse each group of k nodes. Tricky pointer manipulation — practice this one specifically for FAANG." },
            { title:"Top interview problems", body:"LC #206 Reverse, #21 Merge Two Sorted, #141 Cycle Detection, #142 Cycle Start, #876 Middle, #19 Remove Nth from End, #25 Reverse K Groups." },
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
