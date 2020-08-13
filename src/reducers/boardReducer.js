import boardData from "../constants/boardData";
import { actionTypes } from "../constants/actionTypes";
import prereqMap from "../constants/prereqMap";
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
  // console.log(newCourses);
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

// validate all courses on the board
const validateBoard = (board) => {
  for (var i = 0; i < board.length; i++) {
    var year = board[i]["semesters"];
    for (var j = 0; j < year.length; j++) {
      var sem = year[j]["courses"];
      var total = 0;
      for (var k = 0; k < sem.length; k++) {
        var name = sem[k]["courseName"].match('[A-Z]+ [0-9]+')
        if (sem[k].manualApprove === true) {
          sem[k]["valid"] = '1';
          if (name && name.length === 1)
            total += name[0].split(' ')[1].charAt(1) - '0';
          else
            total += 3;
          continue;
        }
        if (name && name.length === 1) {
          var creditHours = name[0].split(' ')[1].charAt(1) - '0';
          total += creditHours;

          name = name[0].replace(' ', '').toLowerCase();

          var mapped = prereqMap[0][name];
          if (!mapped || Object.keys(mapped).length === 0) continue;
          var res = validateCourse(board, mapped, i, j);

          if (!res["result"]) {
            var reason = prereqMap[0][name][res["type"]];
            if (reason.startsWith("SPX"))
              reason = reason.split(": ")[1]
            sem[k]["valid"] = res["type"] + ": " + reason;
          } else {
            sem[k]["valid"] = '1';
          }
        } else {
          // set default credit hours to 3
          total += 3;
        }
      }
      year[j]["hours"] = total;
    }
  }
  console.log(board);
};

// main logic for validating one course for a certain prerequisite
const validateReq = (board, course, yearId, semId, req) => {
  if (course[req].startsWith("SPX")) {
    console.log(course[req]);
    return false;
  }

  var add = 0;
  if (req === "Coreq" || req === "PreOrCoreq")
    add = 1; // Corequisite is allowed to be in current semester as well as all previous semesters

  if (!(req in course))
    return true;
  var evalStr = course[req].replace(/and/g, '&&').replace(/or/g, '||');
  for (var i = 0; i <= yearId; i++) {
    var year = board[i]["semesters"];
    // scans all courses in years < current year, then scan all courses in semester < current semester
    var limit = i === yearId ? semId + add : year.length;
    for (var j = 0; j < limit; j++) {
      var sem = year[j]["courses"];
      for (var k = 0; k < sem.length; k++) {
        var currName = sem[k].courseName.match('[A-Z]+ [0-9]+')
        if (evalStr.includes(currName)) {
          // replace course with true in prerequisite string if taken previously
          evalStr = evalStr.replace(currName, 'true');
        }
      }
    }
  }
  // replace all other 
  evalStr = evalStr.replace(/[A-Z]+ [0-9]+/g, "false");
  console.log(evalStr);
  // eval is a necessary evil
  // eslint-disable-next-line
  var res = eval(evalStr);
  // if (!res)
  // console.log(course);
  return res;
};

// validate single course for different types of prerequisites
const validateCourse = (board, course, yearId, semId) => {
  var good = true;
  var result = { "type": "" };
  if ("Prereq" in course) {
    var res = validateReq(board, course, yearId, semId, "Prereq");
    if (!res)
      result["type"] = "Prereq";
    good &= res;
  }
  if ("Coreq" in course) {
    res = validateReq(board, course, yearId, semId, "Coreq");
    if (!res)
      result["type"] = "Coreq";
    good &= res;
  }
  if ("PreOrCoreq" in course) {
    res = validateReq(board, course, yearId, semId, "PreOrCoreq");
    if (!res)
      result["type"] = "PreOrCoreq";
    good &= res;
  }
  result["result"] = good;
  return result;
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
  switch (action.type) {
    case actionTypes.ADD_COURSE: {
      const { courseName, yearIndex, semesterIndex } = action.payload;

      const newCourse = {
        id: uuid(),
        valid: '1',
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
      validateBoard(newBoard);
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
      validateBoard(newBoard);
      return newBoard;
    }

    // toggle the manually approved state for the current course
    case actionTypes.EDIT_COURSE: {
      const { yearIndex, semesterIndex, courseIndex } = action.payload;
      let currBoard = [...state];
      let original = currBoard[yearIndex].semesters[semesterIndex].courses[courseIndex].manualApprove;
      currBoard[yearIndex].semesters[semesterIndex].courses[courseIndex].manualApprove = !original;
      validateBoard(currBoard);
      return currBoard;
    }

    // export course into JSON format that can be read back in through import button
    case actionTypes.EXPORT_COURSES: {
      let currBoard = [...state];
      var res = JSON.stringify(currBoard) // (currBoard, null, 2) for pretty print
      alert(res); // might want to change to better interface (with copy button)
      return currBoard;
    }

    // import previously exported JSON object into the degree plan
    case actionTypes.LOAD_COURSE: {
      const { json } = action.payload;
      try {
        var newBoard = JSON.parse(json);
        validateBoard(newBoard);
        return newBoard;
      } catch (error) {
        alert('JSON format error!')
        return [...state];
      }
    }

    case actionTypes.SET_BOARD: {
      const { newBoard } = action.payload;
      console.log(newBoard)
      validateBoard(newBoard);
      return newBoard;
    }

    // load prerequisite courses from unofficial transcript onto the degree plan
    case actionTypes.ADD_PDF_COURSES: {
      const { courses } = action.payload;
      let currBoard = [...state];
      for (var val of courses) {
        var newCourse = {
          id: uuid(),
          valid: '1',
          courseName: val,
          manualApprove: true
        };
        // first year (prior row), others course list (third column)
        currBoard[0].semesters[2].courses.push(newCourse);
      }
      return currBoard;
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
      validateBoard(newBoard);
      return newBoard;
    }

    default: {
      return state;
    }
  }
};

export default boardReducer;