import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const initialData = { todo: ["Task 1", "Task 2"], progress: [], done: [] };

const colColors = { todo: "var(--warn)", progress: "var(--info)", done: "var(--ok)" };

export default function Kanban() {
  const [columns, setColumns] = useState(initialData);

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const src = result.source.droppableId;
    const dst = result.destination.droppableId;
    const srcItems = [...columns[src]];
    const [moved] = srcItems.splice(result.source.index, 1);
    const dstItems = [...columns[dst]];
    dstItems.splice(result.destination.index, 0, moved);
    setColumns({ ...columns, [src]: srcItems, [dst]: dstItems });
  };

  return (
    <div className="card">
      <h2 className="card-title">📋 Kanban Board</h2>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="board">
          {Object.keys(columns).map((col) => (
            <Droppable droppableId={col} key={col}>
              {(provided) => (
                <div className="col" ref={provided.innerRef} {...provided.droppableProps}>
                  <div className="col-head" style={{ color: colColors[col] }}>
                    {col === "todo" ? "📝 Todo" : col === "progress" ? "⚡ In Progress" : "✅ Done"}
                    <span style={{ marginLeft: "var(--s2)", opacity: .6 }}>({columns[col].length})</span>
                  </div>
                  {columns[col].map((task, index) => (
                    <Draggable key={task} draggableId={task} index={index}>
                      {(provided) => (
                        <div className="task-item"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{ ...provided.draggableProps.style }}>
                          {task}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}