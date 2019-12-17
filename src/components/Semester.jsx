import React, { Component } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import Course from "./Course";

const getItemStyle = (draggableStyle) => ({
  userSelect: "none",
  padding: 2,
  margin: `0 10px 10px 0`,

  display: "inline-flex",
  width: "300px",
  padding: "10px",

  background: "white",
  display: "inline-flex",
  padding: "10px",
  margin: "0 10px 10px 10px",
  border: "1px solid grey",
  borderRadius: '7px',
  ...draggableStyle
});

const getListStyle = isDraggingOver => ({
  border: '1px dashed',
  padding: '2px',
  margin: "1px 0"
});

export default class Semester extends Component {
  render() {
    return (
      <Droppable droppableId={String(this.props.semesterId)} type={`droppableSubItem`}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            style={getListStyle(snapshot.isDraggingOver)}
          >
            {this.props.subItems.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index}>
                {(provided, snapshot) => (
                  <div style={{ display: "flex" }}>
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={getItemStyle(
                        provided.draggableProps.style
                      )}
                    >
                      <Course
                        name={item.content}
                      >
                      </Course>
                    </div>
                    {provided.placeholder}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    );
  }
}