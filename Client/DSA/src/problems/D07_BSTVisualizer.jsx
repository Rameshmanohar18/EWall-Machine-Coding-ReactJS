/**
 * D07 — Binary Search Tree Visualizer
 * Topic: Trees | Difficulty: Medium
 * Time: O(log n) avg, O(n) worst | Space: O(h)
 * Asked at: Google, Amazon, Microsoft, Atlassian
 */
import { useState, useRef, useCallback } from "react";

class TreeNode {
  constructor(val) { this.val = val; this.left = null; this.right = null; }
}

function insert(root, val) {
  if (!root) return new TreeNode(val);
  if (val < root.val) root.left  = insert(root.left,  val);
  else                root.right = insert(root.right, val);
  return root;
}

function buildBST(arr) {
  let root = null;
  for (const v of arr) root = insert(root, v);
  return root;
}

// Assign x,y positions for SVG rendering
function assignPositions(node, depth = 0, counter = { val: 0 }) {
  if (!node) return;
  assignPositions(node.left,  depth + 1, counter);
  node.x = counter.val++ * 60 + 30;
  node.y = depth * 70 + 40;
  assignPositions(node.right, depth + 1, counter);
}

function collectNodes(node, nodes = [], edges = []) {
  if (!node) return;
  nodes.push(node);
  if (node.left)  { edges.push([node, node.left]);  collectNodes(node.left,  nodes, edges); }
  if (node.right) { edges.push([node, node.right]); collectNodes(node.right, nodes, edges); }
  return { nodes, edges };
}

const DEFAULT_VALS = [50, 30, 70, 20, 40, 60, 80, 10, 25, 35, 45];

export default function BSTVisualizer() {
  const [root,    setRoot]    = useState(() => buildBST(DEFAULT_VALS));
  const [visited, setVisited] = useState(new Set());
  const [path,    setPath]    = useState(new Set());
  const [current, setCurrent] = useState(null);
  const [log,     setLog]     = useState([]);
  const [running, setRunning] = useState(false);
  const [speed,   setSpeed]   = useState(600);
  const [op,      setOp]      = useState("search");
  const [target,  setTarget]  = useState(40);
  const [insertVal, setInsertVal] = useState(55);
  const [tab,     setTab]     = useState("viz");
  const stopRef = useRef(false);

  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  const runSearch = useCallback(async () => {
    stopRef.current = false;
    setRunning(true);
    setVisited(new Set()); setPath(new Set()); setCurrent(null); setLog([]);

    let node = root;
    const pathSet = new Set();

    while (node) {
      if (stopRef.current) { setRunning(false); return; }
      setCurrent(node.val);
      pathSet.add(node.val);
      setPath(new Set(pathSet));
      setLog(l => [...l, { msg: `Visit ${node.val} — target=${target}`, type: "step" }]);
      await sleep(speed);

      if (node.val === target) {
        setVisited(new Set([node.val]));
        setLog(l => [...l, { msg: `✅ Found ${target}!`, type: "done" }]);
        break;
      } else if (target < node.val) {
        setLog(l => [...l, { msg: `  ${target} < ${node.val} → go left`, type: "swap" }]);
        node = node.left;
      } else {
        setLog(l => [...l, { msg: `  ${target} > ${node.val} → go right`, type: "swap" }]);
        node = node.right;
      }
      await sleep(speed / 2);
    }

    if (!node) setLog(l => [...l, { msg: `❌ ${target} not found`, type: "done" }]);
    setCurrent(null);
    setRunning(false);
  }, [root, target, speed]);

  const runInorder = useCallback(async () => {
    stopRef.current = false;
    setRunning(true);
    setVisited(new Set()); setPath(new Set()); setCurrent(null); setLog([]);
    const result = [];

    const inorder = async (node) => {
      if (!node || stopRef.current) return;
      await inorder(node.left);
      if (stopRef.current) return;
      setCurrent(node.val);
      setVisited(new Set([...result, node.val]));
      result.push(node.val);
      setLog(l => [...l, { msg: `Visit ${node.val}`, type: "step" }]);
      await sleep(speed);
      await inorder(node.right);
    };

    await inorder(root);
    setLog(l => [...l, { msg: `✅ Inorder: [${result.join(", ")}]`, type: "done" }]);
    setCurrent(null);
    setRunning(false);
  }, [root, speed]);

  const doInsert = () => {
    const newRoot = insert(root, insertVal);
    setRoot(newRoot);
    setLog([{ msg: `Inserted ${insertVal}`, type: "done" }]);
  };

  const reset = () => {
    stopRef.current = true;
    setRoot(buildBST(DEFAULT_VALS));
    setVisited(new Set()); setPath(new Set()); setCurrent(null); setLog([]);
    setRunning(false);
  };

  // Build SVG data
  const rootCopy = JSON.parse(JSON.stringify(root));
  assignPositions(rootCopy);
  const { nodes, edges } = collectNodes(rootCopy);
  const svgW = Math.max(...nodes.map(n => n.x)) + 50;
  const svgH = Math.max(...nodes.map(n => n.y)) + 50;

  const getNodeClass = (val) => {
    if (val === current)       return "node-active";
    if (visited.has(val))      return "node-visited";
    if (path.has(val))         return "node-path";
    return "node-default";
  };

  return (
    <div className="prob-card">
      <div className="prob-header">
        <div>
          <div className="prob-title">Binary Search Tree</div>
          <div className="prob-meta">
            <span className="dsa-difficulty diff-med">Medium</span>
            <span className="complexity tc">T: O(log n) avg</span>
            <span className="complexity sc">S: O(h)</span>
          </div>
        </div>
      </div>

      <p className="prob-desc">
        A BST maintains the invariant: left subtree values &lt; node &lt; right subtree values.
        This enables O(log n) search, insert, delete on average.
        <br /><br />
        <strong>Inorder traversal</strong> of a BST always produces a sorted array — key insight for many problems.
      </p>

      <div className="tabs">
        {[["viz","Visualizer"],["code","JavaScript"],["notes","Notes"]].map(([t,l]) => (
          <button key={t} className={`tab-btn ${tab===t?"active":""}`} onClick={() => setTab(t)}>{l}</button>
        ))}
      </div>

      {tab === "viz" && (
        <>
          <div style={{ display:"flex", gap:"var(--s3)", marginBottom:"var(--s4)", flexWrap:"wrap", alignItems:"center" }}>
            {/* Search */}
            <div style={{ display:"flex", alignItems:"center", gap:"var(--s2)" }}>
              <input type="number" value={target}
                onChange={e => setTarget(Number(e.target.value))}
                style={{ width:60, background:"var(--bg4)", border:"1px solid var(--gb2)",
                  borderRadius:"var(--r1)", color:"var(--t1)", padding:"5px 8px",
                  fontFamily:"var(--mono)", fontSize:"var(--sm)", outline:"none" }} />
              <button className="btn btn-primary btn-sm" onClick={runSearch} disabled={running}>🔍 Search</button>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={runInorder} disabled={running}>📋 Inorder</button>
            {/* Insert */}
            <div style={{ display:"flex", alignItems:"center", gap:"var(--s2)" }}>
              <input type="number" value={insertVal}
                onChange={e => setInsertVal(Number(e.target.value))}
                style={{ width:60, background:"var(--bg4)", border:"1px solid var(--gb2)",
                  borderRadius:"var(--r1)", color:"var(--t1)", padding:"5px 8px",
                  fontFamily:"var(--mono)", fontSize:"var(--sm)", outline:"none" }} />
              <button className="btn btn-success btn-sm" onClick={doInsert} disabled={running}>+ Insert</button>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={reset} disabled={running}>↺ Reset</button>
            <div className="speed-wrap">
              <span>Speed</span>
              <input type="range" min={200} max={1500} step={100} value={speed}
                onChange={e => setSpeed(Number(e.target.value))} disabled={running} />
            </div>
          </div>

          {/* SVG Tree */}
          <div style={{ background:"var(--bg2)", border:"1px solid var(--gb)", borderRadius:"var(--r3)",
            padding:"var(--s4)", marginBottom:"var(--s4)", overflowX:"auto" }}>
            <svg width={svgW} height={svgH} className="viz-svg">
              {edges.map(([parent, child], i) => (
                <line key={i} className="tree-edge"
                  x1={parent.x} y1={parent.y} x2={child.x} y2={child.y} />
              ))}
              {nodes.map(node => (
                <g key={node.val} className="tree-node">
                  <circle cx={node.x} cy={node.y} r={20} className={getNodeClass(node.val)} />
                  <text x={node.x} y={node.y + 4} textAnchor="middle">{node.val}</text>
                </g>
              ))}
            </svg>
          </div>

          {/* Legend */}
          <div style={{ display:"flex", gap:"var(--s4)", marginBottom:"var(--s4)", fontSize:"var(--xs)", color:"var(--t2)" }}>
            {[["current","var(--a2)"],["path taken","var(--warn)"],["visited/found","var(--ok)"]].map(([l,c]) => (
              <div key={l} style={{ display:"flex", alignItems:"center", gap:4 }}>
                <div style={{ width:10, height:10, borderRadius:"50%", background:c }} />{l}
              </div>
            ))}
          </div>

          <div className="step-log">
            {log.length === 0 && <span style={{ color:"var(--t3)" }}>Choose an operation to start...</span>}
            {log.map((l, i) => <div key={i} className={l.type}>{l.msg}</div>)}
          </div>
        </>
      )}

      {tab === "code" && (
        <div className="code-block">
          <div className="code-header"><span className="code-lang">JavaScript</span></div>
          <div className="code-body">{`class TreeNode {
  constructor(val) { this.val = val; this.left = this.right = null; }
}

// Insert into BST
function insert(root, val) {
  if (!root) return new TreeNode(val);
  if (val < root.val) root.left  = insert(root.left,  val);
  else                root.right = insert(root.right, val);
  return root;
}

// Search BST — O(log n) avg
function search(root, target) {
  if (!root || root.val === target) return root;
  if (target < root.val) return search(root.left,  target);
  return search(root.right, target);
}

// Inorder traversal → sorted array
function inorder(root, result = []) {
  if (!root) return result;
  inorder(root.left, result);
  result.push(root.val);
  inorder(root.right, result);
  return result;
}

// Validate BST (LC #98)
function isValidBST(root, min = -Infinity, max = Infinity) {
  if (!root) return true;
  if (root.val <= min || root.val >= max) return false;
  return isValidBST(root.left,  min, root.val) &&
         isValidBST(root.right, root.val, max);
}

// Lowest Common Ancestor (LC #235)
function lowestCommonAncestor(root, p, q) {
  if (p.val < root.val && q.val < root.val) return lowestCommonAncestor(root.left,  p, q);
  if (p.val > root.val && q.val > root.val) return lowestCommonAncestor(root.right, p, q);
  return root; // split point = LCA
}

// Kth Smallest in BST (LC #230) — inorder gives sorted order
function kthSmallest(root, k) {
  let count = 0, result = null;
  function inorder(node) {
    if (!node || result !== null) return;
    inorder(node.left);
    if (++count === k) { result = node.val; return; }
    inorder(node.right);
  }
  inorder(root);
  return result;
}`}</div>
        </div>
      )}

      {tab === "notes" && (
        <div style={{ display:"flex", flexDirection:"column", gap:"var(--s4)" }}>
          {[
            { title:"Inorder = sorted", body:"Inorder traversal of BST gives elements in ascending order. Use this to find kth smallest, validate BST, convert to sorted array." },
            { title:"Height matters", body:"Balanced BST: O(log n) operations. Skewed BST (all left or all right): O(n). AVL trees and Red-Black trees self-balance." },
            { title:"LCA pattern", body:"For BST: if both nodes are less than root, go left. If both greater, go right. Otherwise, root is the LCA. For general binary tree, use DFS." },
            { title:"Top problems", body:"LC #98 Validate BST, #230 Kth Smallest, #235 LCA of BST, #450 Delete Node, #108 Sorted Array to BST, #173 BST Iterator." },
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
