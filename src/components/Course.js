import React, { useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { Card, CardHeader, IconButton } from "@material-ui/core";
import DeleteSharpIcon from '@material-ui/icons/DeleteSharp';
import { connect } from "react-redux";
import { deleteCourse } from "../actions/courseActions";
import { editCourse } from "../actions/courseActions";
import Tooltip from '@material-ui/core/Tooltip';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import Modal from '@material-ui/core/Modal';
import courseData from '../constants/spring2020Data';
import { Bar } from "react-chartjs-2";
import { reformatArray, sortByGrades, splitGradeData, getGradeColors } from "../utils/gradeChart";
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '3px',
    cursor: 'pointer'
  },
  highlightCourseName: {
    color: '#00863f',
    fontWeight: 700,
    display: 'inline',
  },
  invalidHighlight: {
    color: 'red',
    fontWeight: 700,
    display: 'inline',
  },
  showDelete: {
    display: 'block',
    width: 4,
    opacity: 0.6,
    '&:hover': {
      opacity: 0.9,
    },
    marginRight: 17,
  },
  hideDelete: {
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  rmpBox: {
    '&:focus': {
      outline: 'none'
    }
  },
  green: {
    backgroundColor: "#95ff95"
  },
  yellow: {
    backgroundColor: "#ffda6c"
  },
  red: {
    backgroundColor: "#ff7373"
  }
}));

const Course = (props) => {
  let { dispatch, courseName, yearIndex, semesterIndex, courseIndex, valid, manualApprove } = props;
  const classes = useStyles();
  const [state, setState] = useState({ isHovering: false, manualApproved: manualApprove, checked: false });
  const [modalOpen, setModalOpen] = useState(false);

  const handleHover = () => {
    setState({
      ...state,
      isHovering: !state.isHovering
    });
  };

  const toggleSort = () => {
    setState({
      ...state,
      checked: !state.checked
    });
  };

  const setValid = () => {
    setState({
      ...state,
      manualApproved: !state.manualApproved,
      isHovering: !state.isHovering
    });
    // console.log(state.manualApproved);
    dispatch(editCourse(yearIndex, semesterIndex, courseIndex));
  }

  const handleDelete = () => {
    dispatch(deleteCourse(yearIndex, semesterIndex, courseIndex));
  };

  let coursePrefix = "";
  const pattern = new RegExp(/[A-Z]+ \d{4}|\d{3} Core Course/);

  if (pattern.test(courseName)) {
    coursePrefix = courseName.match(pattern);
    courseName = courseName.split(coursePrefix)[1];
  }

  const showModal = (visible) => {
    setModalOpen(visible);
  }

  const renderGraph = (course) => {
    const grades = course["grades"];
    const formattedGrades = reformatArray(grades);
    const sortedGrades = sortByGrades(formattedGrades);
    const { keys, values } = splitGradeData(sortedGrades);
    const colors = getGradeColors(keys);
    // console.log(keys);
    const barGraphState = {
      labels: keys,
      datasets: [
        {
          label: 'Grades',
          backgroundColor: colors,
          borderColor: colors,
          borderWidth: 2,
          data: values
        }
      ]
    };

    return (
      <div style={{ width: "80%" }}>
        <Bar
          data={barGraphState}
          options={{
            title: {
              display: true,
              text: course["professor"] + " Section " + course["section"],
              fontSize: 15
            },
            legend: {
              display: false
            }
          }}
        />
      </div>
    );
  };

  const displayClassInfo = () => {
    if (!courseData[coursePrefix]) return (<div style={{ textAlign: "center" }}>No course data available.</div>);
    var data = courseData[coursePrefix];
    if (state.checked && courseData[coursePrefix]) {
      data = JSON.parse(JSON.stringify(courseData[coursePrefix]));
      data.sort(function (a, b) {
        if (!a["overall_rating"]) return 1;
        if (!b["overall_rating"]) return -1;
        return b["overall_rating"] - a["overall_rating"];
      });
    }
    return (
      <>
        <div>
          {data.map((course, i) =>
            <div key={i} style={{ display: "flex" }}>
              <div style={{ width: "20%", margin: "auto", textAlign: "center" }}>
                {/* {course["professor"]} */}
                <p>RMP Rating</p>
                {course["overall_rating"]
                  ? <h1
                    style={{ borderRadius: "20px", width: "120px", margin: "0 auto" }}
                    className={course["overall_rating"] > 3.5 ? classes.green :
                      course["overall_rating"] > 2.5 ? classes.yellow : classes.red}
                  >{course["overall_rating"]}</h1>
                  : <h1>N/A</h1>
                }
                {course["total_ratings"]
                  ? <h3>{course["total_ratings"]} Reviews</h3>
                  : <h3>0 Reviews</h3>
                }
              </div>
              {renderGraph(course)}
            </div>
          )}
        </div>
        {/* <div style={{ width: "100%", border: "1px solid rgba(0,0,0,0.1)", marginBottom: "10px" }}></div> */}
      </>
    );

  };
  return (
    <div className={classes.root}>
      <Card
        onMouseEnter={handleHover}
        onMouseLeave={handleHover}
        elevation={1}
      >
        <CardHeader
          title={
            <div style={{ display: "flex", alignItems: "center" }}>
              <div onClick={() => showModal(true)}>
                <Tooltip interactive
                  title={
                    valid === '1' ? '' :
                      <React.Fragment>
                        {valid}
                      </React.Fragment>
                  } placement="top-start">
                  <div className={valid === '1' ? classes.highlightCourseName : classes.invalidHighlight}>{coursePrefix}</div>
                </Tooltip>
                {courseName}
              </div>

              <div>
                {valid !== '1' ? <Tooltip interactive title="Manual Approve" placement="top-start">
                  <IconButton size="small" onClick={setValid}><CheckIcon /></IconButton>
                </Tooltip> : ''}
                {state.manualApproved ? <Tooltip interactive title="Undo Approval" placement="top-start">
                  <IconButton size="small" onClick={setValid}><CloseIcon /></IconButton>
                </Tooltip> : ''}
              </div>

              {/* Take up the remaining whitespace on the card to handle the modal popup */}
              <div onClick={() => showModal(true)} style={{ flex: "1", height: "20px" }}></div>
            </div>
          }
          titleTypographyProps={{ variant: 'body2' }}
          action={
            <>
              <div className={state.isHovering ? classes.showDelete : classes.hideDelete} onClick={handleDelete}>
                <DeleteSharpIcon fontSize={'small'} />
              </div>
            </>
          }
          style={{ padding: 10 }}
        >
        </CardHeader>
      </Card>

      <Modal
        open={modalOpen}
        onClose={() => showModal(false)}
        aria-labelledby="stats-modal-title"
        aria-describedby="stats-modal-description"
      >
        <div className={classes.rmpBox} style={{ position: "fixed", width: "100vw", height: "100vh", maxWidth: "800px", maxHeight: "600px", overflow: "auto", top: "50%", left: "50%", transform: "translate(-50%, -50%)", backgroundColor: "white", borderRadius: "10px" }}>
          <div style={{ margin: "20px" }}>
            <div style={{ display: "flex" }}>
              <div style={{ width: "20%" }}>
                <FormControlLabel
                  control={<Switch checked={state.checked} onChange={toggleSort} name="sort" />}
                  label={
                    <p style={{ fontSize: "13px" }}>Sort by Rating</p>
                  }
                />
              </div>
              <div style={{ width: "80%", textAlign: "center", margin: "auto" }}>
                <div className={classes.highlightCourseName}>{coursePrefix}</div> {courseName}
              </div>
            </div>

            <div>
              {displayClassInfo()}
            </div>
          </div>

        </div>
      </Modal >
    </div >
  );
}

export default connect()(Course);
