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
  }
}));

const Course = (props) => {
  let { dispatch, courseName, yearIndex, semesterIndex, courseIndex, valid, manualApprove } = props;
  const classes = useStyles();
  const [state, setState] = useState({ isHovering: false, manualApproved: manualApprove });
  const [modalOpen, setModalOpen] = useState(false);
  const handleHover = () => {
    setState({
      ...state,
      isHovering: !state.isHovering
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
    console.log(keys);
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
      <Bar
        data={barGraphState}
        options={{
          title: {
            display: true,
            text: course["professor"]+" Section "+course["section"],
            fontSize: 15
          },
          legend: {
            display: false
          }
        }}
      />
    );
  };

  const displayClassInfo = () => {
    if (!courseData[coursePrefix]) return (<div>No course data available.</div>);

    return (
      <div>
        {courseData[coursePrefix].map((course, i) =>
          <div key={i}>
            {course["professor"]}
            {course["overall_rating"] ? <div>RMP Rating: {course["overall_rating"]}</div> : null}
            {course["total_ratings"] ? <div># of RMP reviews: {course["total_ratings"]}</div> : null}

            {renderGraph(course)}

            <div style={{ width: "100%", border: "1px solid rgba(0,0,0,0.1)", marginBottom: "10px" }}></div>
          </div>

        )}
      </div>
    );

  };

  return (
    <div className={classes.root}>
      <Card
        onMouseEnter={handleHover}
        onMouseLeave={handleHover}
        elevation={3}
        onClick={() => showModal(true)}
      >
        <CardHeader
          title={
            <>
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

              {valid !== '1' ? <Tooltip interactive title="Manual Approve" placement="top-start">
                <IconButton size="small" onClick={setValid}><CheckIcon /></IconButton>
              </Tooltip> : ''}
              {state.manualApproved ? <Tooltip interactive title="Undo Approval" placement="top-start">
                <IconButton size="small" onClick={setValid}><CloseIcon /></IconButton>
              </Tooltip> : ''}
            </>
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
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div style={{ position: "absolute", width: 800, height: 600, overflow: "auto", top: "50%", left: "50%", transform: "translate(-50%, -50%)", backgroundColor: "white", borderRadius: "10px" }}>
          <div style={{ textAlign: "center" }}>
            <div className={classes.highlightCourseName}>{coursePrefix}</div> {courseName}
          </div>

          <div>
            {displayClassInfo()}
          </div>

        </div>
      </Modal>
    </div>
  );
}

export default connect()(Course);
