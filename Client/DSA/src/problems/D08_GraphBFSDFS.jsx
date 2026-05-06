/**
 * D08 — Graph BFS & DFS Visualizer
 * Topic: Graphs | Difficulty: Medium
 * Time: O(V+E) | Space: O(V)
 * Asked at: Google, Meta, Amazon, Microsoft
 */
import { useState, useRef, useCallback } from "react";

// Adjacency list graph
const GRAPH = {
  nodes: [
    { id:0, x:200, y:60,  label:"0" },
    { id:1, x:100, y:160, label:"1" },
    { id:2, x:300, y:160, label:"2" },
    { id:3, x:50,  y:260, label:"3" },
    { id:4, x:160, y:260, label:"4" },
    { id:5, x:260, y:260, label:"5" },
    { id:6, x:360, y:260, label:"6" },
  ],
  edges: [[0,1],[0,2],[1,3],[1,4],[2,5],[2,6]],
  adj: { 0:[1,2], 1:[0,3,4], 2:[0,5,6], 3:[1], 4:[1], 5:[2], 6:[2] },
};

export default function GraphBFSDFS() {
  const [visited,  setVisited]  = useState(new Set());
  const [current,  setCurrent]  = useState(null);
  const [queue,    setQueue]    = useState([]);
  const [log,      setLog]      = useState([]);
  const [running,  setRunning]  = useState(false);
  const [speed,    setSpeed]    = useState(600);
  const [algo,     setAlgo]     = useState("bfs");
  const [start,    setStart]    = useState(0);
  const [tab,      setTab]      = useState("viz");
  const stopRef = useRef(false);

  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  const runBFS = useCallback(async () => {
    stopRef.current = false;
    setRunning(true);
    setVisited(new Set()); setCurrent(null); setQueue([]); setLog([]);

    const vis = new Set([start]);
    const q = [start];
    const order = [];

    while (q.length > 0) {
      if (stopRef.current) { setRunning(false); return; }
      const node = q.shift();
      setCurrent(node);
      setQueue([...q]);
      order.push(node);
      setVisited(new Set(order));
      setLog(l => [...l, { msg: `Visit ${node} | Queue: [${q.join(", ")}]`, type: "step" }]);
      await sleep(speed);

      for (const neighbor of GRAPH.adj[node]) {
        if (!vis.has(neighbor)) {
          vis.add(neighbor);
          q.push(neighbor);
          setQueue([...q]);
          setLog(l => [...l, { msg: `  Enqueue ${neighbor}`, type: "swap" }]);
          await sleep(speed / 3);
        }
      }
    }

    setCurrent(null);
    setLog(l => [...l, { msg: `✅ BFS order: [${order.join(" → ")}]`, type: "done" }]);
    setRunning(false);
  }, [start, speed]);

  const runDFS = useCallback(async () => {
    stopRef.current = false;
    setRunning(true);
    setVisited(new Set()); setCurrent(null); setQueue([]); setLog([]);

    const vis = new Set();
    const order = [];

    const dfs = async (node) => {
      if (stopRef.current || vis.has(node)) return;
      vis.add(node);
      order.push(node);
      setCurrent(node);
      setVisited(new Set(order));
      setLog(l => [...l, { msg: `Visit ${node} | Stack depth: ${order.length}`, type: "step" }]);
      await sleep(speed);

      for (const neighbor of GRAPH.adj[node]) {
        if (!vis.has(neighbor)) {
          setLog(l => [...l, { msg: `  Explore edge ${node}→${neighbor}`, type: "swap" }]);
          await sleep(speed / 3);
          await dfs(neighbor);
        }
      }
    };

    await dfs(start);
    setCurrent(null);
    setLog(l => [...l, { msg: `✅ DFS order: [${order.join(" → ")}]`, type: "done" }]);
    setRunning(false);
  }, [start, speed]);

  const reset = () => {
    stopRef.current = true;
    setVisited(new Set()); setCurrent(null); setQueue([]); setLog([]);
    setRunning(false);
  };

  const getNodeClass = (id) => {
    if (id === current)    return "node-active";
    if (visited.has(id))   return "node-visited";
    return "node-default";
  };

  const isEdgeActive = (a, b) => visited.has(a) && visited.has(b);

  return (
    <div className="prob-card">
      <div className="prob-header">
        <div>
          <div className="prob-title">Graph BFS & DFS</div>
          <div className="prob-meta">
            <span className="dsa-difficulty diff-med">Medium</span>
            <span className="complexity tc">T: O(V+E)</span>
            <span className="complexity sc">S: O(V)</span>
          </div>
        </div>
      </div>

      <p className="prob-desc">
        <strong>BFS</strong> (Breadth-First Search) uses a queue — explores level by level.
        Best for shortest path in unweighted graphs.
        <br />
        <strong>DFS</strong> (Depth-First Search) uses a stack/recursion — explores as deep as possible first.
        Best for cycle detection, topological sort, connected components.
      </p>

      <div className="tabs">
        {[["viz","Visualizer"],["code","JavaScript"],["notes","Notes"]].map(([t,l]) => (
          <button key={t} className={`tab-btn ${tab===t?"active":""}`} onClick={() => setTab(t)}>{l}</button>
        ))}
      </div>

      {tab === "viz" && (
        <>
          <div className="controls">
            <div style={{ display:"flex", gap:"var(--s1)" }}>
              <button className={`btn btn-sm ${algo==="bfs"?"btn-primary":"btn-ghost"}`}
                onClick={() => { setAlgo("bfs"); reset(); }} disabled={running}>BFS</button>
              <button className={`btn btn-sm ${algo==="dfs"?"btn-primary":"btn-ghost"}`}
                onClick={() => { setAlgo("dfs"); reset(); }} disabled={running}>DFS</button>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:"var(--s2)" }}>
              <span style={{ fontSize:"var(--xs)", color:"var(--t2)" }}>Start:</span>
              <select value={start} onChange={e => { setStart(Number(e.target.value)); reset(); }}
                style={{ background:"var(--bg4)", border:"1px solid var(--gb2)", borderRadius:"var(--r1)",
                  color:"var(--t1)", padding:"5px 8px", fontFamily:"var(--mono)", fontSize:"var(--sm)", outline:"none" }}>
                {GRAPH.nodes.map(n => <option key={n.id} value={n.id}>{n.id}</option>)}
              </select>
            </div>
            <button className="btn btn-primary" onClick={algo==="bfs"?runBFS:runDFS} disabled={running}>▶ Run {algo.toUpperCase()}</button>
            <button className="btn btn-ghost" onClick={reset} disabled={running}>↺ Reset</button>
            <div className="speed-wrap">
              <span>Speed</span>
              <input type="range" min={200} max={1500} step={100} value={speed}
                onChange={e => setSpeed(Number(e.target.value))} disabled={running} />
            </div>
          </div>

          {/* Graph SVG */}
          <div style={{ background:"var(--bg2)", border:"1px solid var(--gb)", borderRadius:"var(--r3)",
            padding:"var(--s4)", marginBottom:"var(--s4)" }}>
            <svg width="100%" height={320} viewBox="0 0 420 320">
              {GRAPH.edges.map(([a, b], i) => {
                const na = GRAPH.nodes[a], nb = GRAPH.nodes[b];
                return (
                  <line key={i} x1={na.x} y1={na.y} x2={nb.x} y2={nb.y}
                    stroke={isEdgeActive(a,b) ? "var(--ok)" : "var(--gb2)"}
                    strokeWidth={isEdgeActive(a,b) ? 2.5 : 1.5}
                    style={{ transition:"stroke .3s" }} />
                );
              })}
              {GRAPH.nodes.map(node => (
                <g key={node.id}>
                  <circle cx={node.x} cy={node.y} r={22} className={getNodeClass(node.id)} />
                  <text x={node.x} y={node.y+5} textAnchor="middle"
                    style={{ fontFamily:"var(--mono)", fontSize:14, fontWeight:700,
                      fill: node.id===current?"var(--a3)":visited.has(node.id)?"var(--ok)":"var(--t1)" }}>
                    {node.label}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          {/* Queue/Stack display */}
          {queue.length > 0 && (
            <div style={{ display:"flex", alignItems:"center", gap:"var(--s2)", marginBottom:"var(--s3)" }}>
              <span style={{ fontSize:"var(--xs)", color:"var(--t3)" }}>{algo==="bfs"?"Queue:":"Stack:"}</span>
              {queue.map((v, i) => (
                <div key={i} style={{ width:32, height:32, borderRadius:"var(--r1)", background:"var(--abg2)",
                  border:"1px solid var(--a2)", display:"flex", alignItems:"center", justifyContent:"center",
                  fontFamily:"var(--mono)", fontSize:"var(--sm)", color:"var(--a3)", fontWeight:700 }}>
                  {v}
                </div>
              ))}
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
          <div className="code-body">{`// BFS — uses Queue, finds shortest path
function bfs(graph, start) {
  const visited = new Set([start]);
  const queue = [start];
  const order = [];

  while (queue.length > 0) {
    const node = queue.shift(); // dequeue
    order.push(node);

    for (const neighbor of graph[node]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor); // enqueue
      }
    }
  }
  return order;
}

// DFS — uses Stack (or recursion)
function dfs(graph, start, visited = new Set()) {
  visited.add(start);
  const order = [start];

  for (const neighbor of graph[start]) {
    if (!visited.has(neighbor)) {
      order.push(...dfs(graph, neighbor, visited));
    }
  }
  return order;
}

// Number of Islands (LC #200) — DFS on grid
function numIslands(grid) {
  let count = 0;
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[0].length; c++) {
      if (grid[r][c] === '1') {
        count++;
        dfsGrid(grid, r, c);
      }
    }
  }
  return count;
}

function dfsGrid(grid, r, c) {
  if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length || grid[r][c] !== '1') return;
  grid[r][c] = '0'; // mark visited
  dfsGrid(grid, r+1, c); dfsGrid(grid, r-1, c);
  dfsGrid(grid, r, c+1); dfsGrid(grid, r, c-1);
}

// Shortest path BFS (unweighted)
function shortestPath(graph, start, end) {
  const queue = [[start, [start]]];
  const visited = new Set([start]);

  while (queue.length > 0) {
    const [node, path] = queue.shift();
    if (node === end) return path;

    for (const neighbor of graph[node]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push([neighbor, [...path, neighbor]]);
      }
    }
  }
  return null;
}`}</div>
        </div>
      )}

      {tab === "notes" && (
        <div style={{ display:"flex", flexDirection:"column", gap:"var(--s4)" }}>
          {[
            { title:"BFS vs DFS — when to use", body:"BFS: shortest path (unweighted), level-order traversal, finding nearest neighbor. DFS: cycle detection, topological sort, connected components, maze solving." },
            { title:"Graph representations", body:"Adjacency list: O(V+E) space, efficient for sparse graphs. Adjacency matrix: O(V²) space, O(1) edge lookup, good for dense graphs." },
            { title:"Topological Sort", body:"DFS-based: run DFS, push to stack after all neighbors visited. Reverse stack = topological order. Only works on DAGs (Directed Acyclic Graphs)." },
            { title:"Top problems", body:"LC #200 Number of Islands, #133 Clone Graph, #207 Course Schedule (cycle detection), #210 Course Schedule II (topo sort), #127 Word Ladder (BFS), #417 Pacific Atlantic." },
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
