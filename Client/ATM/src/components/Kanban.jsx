


import{ useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const initialData = {
  todo: ["Task 1", "Task 2"],
  progress: [],
  done: []
};

export default function Kanban() {
  const [columns, setColumns] = useState(initialData);

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const sourceCol = result.source.droppableId;
    const destCol = result.destination.droppableId;

    const sourceItems = [...columns[sourceCol]];
    const [moved] = sourceItems.splice(result.source.index, 1);

    const destItems = [...columns[destCol]];
    destItems.splice(result.destination.index, 0, moved);

    setColumns({
      ...columns,
      [sourceCol]: sourceItems,
      [destCol]: destItems
    });
  };

  return (
<div>
  <h1>Kanban Here</h1>
  <DragDropContext onDragEnd={onDragEnd}>
      <div style={{ display: "flex", gap: 20 }}>
        {Object.keys(columns).map((col) => (
          <Droppable droppableId={col} key={col}>
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                <h3>{col.toUpperCase()}</h3>
                {columns[col].map((task, index) => (
                  <Draggable key={task} draggableId={task} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          padding: 10,
                          margin: 5,
                          background: "#038f3b"
                        }}
                      >
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