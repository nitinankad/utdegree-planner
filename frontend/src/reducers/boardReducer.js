import boardData from "../constants/boardData";
import { actionTypes } from "../constants/actionTypes";
import uuid from "uuid4";

const reorder = (list, startIndex, endIndex) => {
  const result = [...list];

  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

// Dragging within the same semester
const dragWithinSemester = (board, sourceList, sourceIndex, destinationIndex, sourceId, sourceYearId) => {
  const newCourses = reorder(sourceList.courses, sourceIndex, destinationIndex);

  let newBoard = [...board];

  newBoard = newBoard.map((year) => {
    if (year.id === sourceYearId) {
      year.semesters.map((semester) => {
        if (semester.id === sourceId) 
          semester.courses = newCourses;
        
        return semester;
      });
    }
    
    return year;
  });

  return newBoard;
};

// Dragging between two semesters
const dragBetweenSemesters = (board, sourceList, destinationList, sourceIndex, destinationIndex, sourceId, destinationId, sourceYearId, destinationYearId) => {
  // Get the dragged course from source semester
  let newSourceCourses = [...sourceList.courses];
  const [draggedCourse] = newSourceCourses.splice(sourceIndex, 1);

  // Insert dragged course into destination semester
  let newDestCourses = [...destinationList.courses];
  newDestCourses.splice(destinationIndex, 0, draggedCourse);

  let newBoard = [...board];

  newBoard = newBoard.map((year) => {
    // Remove course from original semester
    if (year.id === sourceYearId) {
      year.semesters.map((semester) => {
        if (semester.id === sourceId)
          semester.courses = newSourceCourses;

        return semester;
      });
    }

    // Add course to new semester
    if (year.id === destinationYearId) {
      year.semesters.map((semester) => {
        if (semester.id === destinationId)
          semester.courses = newDestCourses;

        return semester;

      });
    }

    return year;
  });

  return newBoard;
};

const boardReducer = (state = boardData, action) => {
  switch(action.type) {
    case actionTypes.ADD_COURSE: {
      const { courseName, yearIndex, semesterIndex } = action.payload;

      const newCourse = {
          id: uuid(),
          courseName: courseName
      };

      const destinationYear = state[yearIndex];
      const destinationSemester = destinationYear.semesters[semesterIndex];
      const destinationCourses = destinationSemester.courses;

      let newCourses = [...destinationCourses];
      newCourses.splice(newCourses.length, 0, newCourse);

      let newBoard = [...state];

      newBoard = newBoard.map((year) => {
          // Add course to semester
          if (year.id === destinationYear.id) {
              year.semesters.map((semester) => {
                  if (semester.id === destinationSemester.id)
                  semester.courses = newCourses;

                  return semester;

              });
          }

          return year;
      });

      return newBoard;
    }

    case actionTypes.DELETE_COURSE: {
      const { yearIndex, semesterIndex, courseIndex } = action.payload;

      const destinationYear = state[yearIndex];
      const destinationSemester = destinationYear.semesters[semesterIndex];
      const destinationCourses = destinationSemester.courses;

      // Delete course from list
      let courses = [...destinationCourses];
      courses.splice(courseIndex, 1);
      
      let newBoard = [...state];

      newBoard = newBoard.map((year) => {
          // Remove course from original semester
          if (year.id === destinationYear.id) {
              year.semesters.map((semester) => {
                  if (semester.id === destinationSemester.id)
                      semester.courses = courses;

                  return semester;
              });
          }
      
          return year;
      });

      return newBoard;
    }

    case actionTypes.SET_BOARD: {
      const { newBoard } = action.payload;
      
      return newBoard;
    }

    case actionTypes.DRAG_EVENT: {
      const result = action.payload.result;

      const sourceId = result.source.droppableId;
      const destinationId = result.destination.droppableId;

      const sourceIndex = result.source.index;
      const destinationIndex = result.destination.index;
      let sourceList, destinationList;

      // Used when iterating again to update the board
      let sourceYearId, destinationYearId; 

      state.map((years) => (
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

      const newBoard = !destinationList
      ? dragWithinSemester(state, sourceList, sourceIndex, destinationIndex, sourceId, sourceYearId)
      : dragBetweenSemesters(state, sourceList, destinationList, sourceIndex, destinationIndex, sourceId, destinationId, sourceYearId, destinationYearId);

      return newBoard;
    }

    default: {
      return state;
    }
  }
};

export default boardReducer;