import React, { Component } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import Year from "./Year";
import LoadDegreeClasses from "./LoadDegreeClasses";

const board = [
  {
    id: "100",
    year: "FRESHMAN",
    semesters: [
      {
        id: "1",
        content: "Fall semester",
        subItems: [
          {
            id: "10", content: "CS 2336 Computer Science II"
          },
          {
            id: "11", content: "CS 2305 Discrete Mathematics I"
          }
        ]
      },
      {
        id: "2",
        content: "Spring semester",
        subItems: [
          {
            id: "20", content: "CS 3340 Computer Architecture"
          },
          {
            id: "21", content: "CS 3345 Data Structures and Algorithms"
          }
        ]
      },
      {
        id: "12",
        content: "Summer semester",
        subItems: []
      }
    ]
  },
  {
    id: "200",
    year: "SOPHOMORE",
    semesters: [ {
        id: "3",
        content: "Fall semester",
        subItems: [
          {
            id: "30", content: "CS 4384 Automata Theory"
          }
        ]
    },
    {
        id: "4",
        content: "Spring semester",
        subItems: [
          {
            id: "40", content: "ECS 3390 Professional and Technical Communication"
          },
          {
            id: "41", content: "CS 3354 Software Engineering"
          }
        ]
    },
    {
      id: "11",
      content: "Summer semester",
      subItems: []
    }
    ]
  },
  {
    id: "300",
    year: "JUNIOR",
    semesters: [
      {
        id: "5",
        content: "Fall semester",
        subItems: [
          {
            id: "50", content: "CS 4347 Database Systems"
          }
        ]
      },
      {
        id: "6",
        content: "Spring semester",
        subItems: [
          {
            id: "60", content: "CS 4348 Operating System Concepts"
          },
          {
            id: "61", content: "CS 4337 Organization of Programming Languages"
          }
        ] 
      },
      {
        id: "10",
        content: "Summer semester",
        subItems: []
      }
    ]
  },
  {
    id: "400",
    year: "SENIOR",
    semesters: [
      {
        id: "7",
        content: "Fall semester",
        subItems: [
          {
            id: "70", content: "MUSI 1306 Understanding Music"
          }
        ]
      },
      {
          id: "8",
          content: "Spring semester",
          subItems: [
            {
              id: "80", content: "CS 4365 Artificial Intelligence"
            },
            {
              id: "81", content: "CS 4375 Introduction to Machine Learning"
            }
          ]
      },
      {
        id: "9",
        content: "Summer semester",
        subItems: []
      }
    ]
  }
];


const getYearSideStyle = () => ({
  writingMode: 'vertical-lr',
  textOrientation: 'upright',
  border: '1px solid',
  textAlign: 'center',
  alignSerif: 'stretch',
  padding: '5px',
  margin: '2px 13px 0 0',
  fontWeight: '700',
});


const reorder = (list, startIndex, endIndex) => {
  const result = [...list];

  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

class App extends Component {
  constructor(props) {
    super(props);

    const saved = localStorage.getItem("degreeplan");

    if (saved) {
      this.state = {
        items: JSON.parse(saved)
      };

    } else {
      this.state = {
        items: board
      };
    }

    
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const sourceId = result.source.droppableId;
    const destinationId = result.destination.droppableId;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    // Fetch the source & destination lists from the board
    let sourceList, destinationList;
    let sourceYearId, destinationYearId; // Used when iterating again to update the board
    
    this.state.items.map((years) => (
      years.semesters.map((semester) => {
        if (semester.id === sourceId) {
          sourceList = semester;
          sourceYearId = years.id;

        } else if (semester.id === destinationId) {
          destinationList = semester;
          destinationYearId = years.id;
        
        }

        return semester;
      })
    ));

    if (!destinationList) {
      // Dragging within the same semester

      // Reorder the semester
      const newSubList = reorder(sourceList.subItems, sourceIndex, destinationIndex);

      // Update the reordered semester
      let newBoard = [...this.state.items];

      newBoard = newBoard.map((year) => {
        if (year.id === sourceYearId) {
          year.semesters.map((semester) => {
            if (semester.id === sourceId) 
              semester.subItems = newSubList;
            
            return semester;
          });
        }
        
        return year;
      });

      this.setState(
        newBoard,
      );
      localStorage.setItem("degreeplan", JSON.stringify(newBoard));
    
    } else {
      // Dragging between two semesters

      // Reorder the semester
      let newSourceSubItems = [...sourceList.subItems];
      const [draggedItem] = newSourceSubItems.splice(sourceIndex, 1);

      let newDestSubItems = [...destinationList.subItems];
      newDestSubItems.splice(destinationIndex, 0, draggedItem);

      // Update the reordered semester
      let newBoard = [...this.state.items];

      newBoard = newBoard.map((year) => {
        if (year.id === sourceYearId) {
          year.semesters.map((semester) => {
            if (semester.id === sourceId)
              semester.subItems = newSourceSubItems;
          });
        }

        return year;
      });

      newBoard = newBoard.map((year) => {
        if (year.id === destinationYearId) {
          year.semesters.map((semester) => {
            if (semester.id === destinationId)
              semester.subItems = newDestSubItems;
          });
        }

        return year;
      });

      this.setState(
        newBoard,
      );
      localStorage.setItem("degreeplan", JSON.stringify(newBoard));

    }
  }

  loadClasses = newBoard => {
    this.setState({
      items: newBoard
    });
    localStorage.setItem("degreeplan", JSON.stringify(newBoard));
  }

  render() {
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
      {this.state.items.map((item, index) => (
        <div style={{display: 'flex'}}>
          <div style={getYearSideStyle()}>
            {item.year}
          </div>

          <div>
          <Year
            semesters={item.semesters}
          >
          </Year>
          </div>

          <div>
          
          </div>
        </div>
      ))}

      <div style={{marginTop: '20px'}}>
        <LoadDegreeClasses callback={this.loadClasses}></LoadDegreeClasses>
      </div>

    </DragDropContext> 
    );
  }
}

export default App;