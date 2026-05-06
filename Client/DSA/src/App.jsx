import { useState } from "react";
import BubbleSort        from "./problems/D01_BubbleSort";
import MergeSort         from "./problems/D02_MergeSort";
import BinarySearch      from "./problems/D03_BinarySearch";
import TwoPointers       from "./problems/D04_TwoPointers";
import SlidingWindow     from "./problems/D05_SlidingWindow";
import LinkedList        from "./problems/D06_LinkedList";
import BSTVisualizer     from "./problems/D07_BSTVisualizer";
import GraphBFSDFS       from "./problems/D08_GraphBFSDFS";
import DynamicProgramming from "./problems/D09_DynamicProgramming";
import StackQueue        from "./problems/D10_StackQueue";

const SECTIONS = [
  {
    label: "Sorting",
    problems: [
      { id:"d01", label:"Bubble Sort",    tag:"Easy · O(n²)",      difficulty:"easy",   component:BubbleSort    },
      { id:"d02", label:"Merge Sort",     tag:"Medium · O(n log n)",difficulty:"med",    component:MergeSort     },
    ]
  },
  {
    label: "Searching",
    problems: [
      { id:"d03", label:"Binary Search",  tag:"Easy · O(log n)",   difficulty:"easy",   component:BinarySearch  },
    ]
  },
  {
    label: "Array Patterns",
    problems: [
      { id:"d04", label:"Two Pointers",   tag:"Easy-Med · O(n)",   difficulty:"easy",   component:TwoPointers   },
      { id:"d05", label:"Sliding Window", tag:"Medium · O(n)",     difficulty:"med",    component:SlidingWindow },
    ]
  },
  {
    label: "Linked List",
    problems: [
      { id:"d06", label:"Linked List Ops",tag:"Easy-Med · O(n)",   difficulty:"easy",   component:LinkedList    },
    ]
  },
  {
    label: "Trees",
    problems: [
      { id:"d07", label:"BST Visualizer", tag:"Medium · O(log n)", difficulty:"med",    component:BSTVisualizer },
    ]
  },
  {
    label: "Graphs",
    problems: [
      { id:"d08", label:"BFS & DFS",      tag:"Medium · O(V+E)",   difficulty:"med",    component:GraphBFSDFS   },
    ]
  },
  {
    label: "Dynamic Programming",
    problems: [
      { id:"d09", label:"DP Patterns",    tag:"Med-Hard · varies", difficulty:"hard",   component:DynamicProgramming },
    ]
  },
  {
    label: "Stack & Queue",
    problems: [
      { id:"d10", label:"Stack & Queue",  tag:"Easy-Med · O(n)",   difficulty:"easy",   component:StackQueue    },
    ]
  },
];

const ALL = SECTIONS.flatMap(s => s.problems);

const DIFF_CLASS = { easy:"diff-easy", med:"diff-med", hard:"diff-hard" };

export default function App() {
  const [active,    setActive]    = useState("d01");
  const [collapsed, setCollapsed] = useState({});

  const current   = ALL.find(p => p.id === active);
  const Component = current.component;

  const toggle = (label) => setCollapsed(c => ({ ...c, [label]: !c[label] }));

  return (
    <div className="dsa-root">

      {/* ── Sidebar ── */}
      <nav className="dsa-sidebar">
        <div className="dsa-brand">
          <div className="dsa-brand-title">DSA Visualizer</div>
          <div className="dsa-brand-sub">
            {ALL.length} problems · FAANG Interview Prep
          </div>
        </div>

        <div className="dsa-nav-scroll">
          {SECTIONS.map(section => (
            <div key={section.label}>
              <button className="dsa-section-btn" onClick={() => toggle(section.label)}>
                <span className="dsa-section-label">{section.label}</span>
                <span className={`dsa-section-arrow ${!collapsed[section.label] ? "open" : ""}`}>▶</span>
              </button>

              {!collapsed[section.label] && section.problems.map(p => {
                const idx = ALL.findIndex(x => x.id === p.id);
                return (
                  <button
                    key={p.id}
                    className={`dsa-nav-btn ${active === p.id ? "active" : ""}`}
                    onClick={() => setActive(p.id)}
                  >
                    <div className="dsa-nav-row">
                      <span className="dsa-nav-num">{String(idx + 1).padStart(2, "0")}</span>
                      <span className="dsa-nav-label">{p.label}</span>
                      <span className={`dsa-difficulty ${DIFF_CLASS[p.difficulty]}`}>
                        {p.difficulty === "easy" ? "E" : p.difficulty === "med" ? "M" : "H"}
                      </span>
                    </div>
                    <div className="dsa-nav-tag">{p.tag}</div>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </nav>

      {/* ── Main ── */}
      <main className="dsa-main">
        <Component />
      </main>
    </div>
  );
}
