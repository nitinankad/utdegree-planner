import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, CssBaseline } from '@material-ui/core';
import { DragDropContext } from 'react-beautiful-dnd';
import { connect } from 'react-redux';
import { handleDrag } from '../actions/semesterActions';
import Semester from "../components/Semester";
import Button from '@material-ui/core/Button';
import { useHistory } from "react-router-dom";

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(1.5),
        width: '100%',
    },
    toolbar: theme.mixins.toolbar,
    verticalYearLabel: {
        writingMode: 'vertical-lr',
        textOrientation: 'upright',
        textAlign: 'center',
        marginRight: '15px',
        padding: 4,
        fontWeight: 700,
        [theme.breakpoints.down('md')]: {
            marginTop: '10px',
        },
    },
    firstYearRow: {
        // Prevents an excessive gap at the top
        display: 'flex',
    },
    yearRow: {
        display: 'flex',
        marginTop: '30px',
    },
}));

const SemesterPlan = (props) => {
    const classes = useStyles();
    const { dispatch, semester, yearIndex, semesterIndex } = props;
    let history = useHistory();

    function handleClick() {
        history.push("/")
    }
    const onDragEnd = (result) => {
        if (!result.destination) {
            return;
        }
        dispatch(handleDrag(result));
    }

    return (
        <main className={classes.root}>
            <div className={classes.toolbar} />
            <Button variant="contained" color="primary" onClick={handleClick}>Go Back</Button>
            <DragDropContext onDragEnd={onDragEnd}>
                <Semester
                    semesterName={semester.semesterName}
                    courses={semester.courses}
                    semesterId={semester.id}
                    yearIndex={yearIndex}
                    semesterIndex={semesterIndex}
                    handleClick={handleClick}
                />
            </DragDropContext>
        </main>
    );
}

const mapStateToProps = state => ({
    board: state.board
});

export default connect(mapStateToProps)(SemesterPlan);