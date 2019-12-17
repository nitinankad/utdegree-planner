import React, { Component } from "react";
import { Droppable } from "react-beautiful-dnd";
import Semester from "./Semester";

const getItemStyle = (isDragging, draggableStyle) => ({
    userSelect: 'none',
    padding: '2px',
    margin: `0 8px 0 0`,

    ...draggableStyle,
  });

const getHeadingStyle = () => ({
  width: '340px',
  padding: '5px',
  fontWeight: 500,
  textAlign: 'center',
  border: '1px solid',
});
  
  const getListStyle = isDraggingOver => ({
    display: 'flex',
    overflow: 'auto',
  });

export default class Year extends Component {
    render() {
        return (
            <Droppable droppableId="droppable" type="droppableItem" direction="horizontal">
            {(provided, snapshot) => (
              <div
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
              {...provided.droppableProps}
            >
              {this.props.semesters.map((semester, semIndex) => (
                <Droppable droppableId="droppableSem" type="droppableSubItem" direction="vertical">
                  {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    // {...provided.draggableProps}
                    // {...provided.dragHandleProps}
                    // style={getItemStyle(
                    //   snapshot.isDragging,
                    //   provided.draggableProps.style
                    // )}
                    {...provided.droppableProps}
                    style={getItemStyle(
                      snapshot.isDragging,
                      provided.droppableProps.style
                    )}
                  >
                  <div style={getHeadingStyle()}>
                    {semester.content}
                  </div>
                    <Semester
                      subItems={semester.subItems}
                      semesterId={semester.id}
                    >
                    </Semester>
                  </div>
                )}
                </Droppable>
              ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        );
    }
}