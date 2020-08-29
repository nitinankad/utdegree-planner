import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Paper } from '@material-ui/core';
import { DragDropContext } from 'react-beautiful-dnd';
import { connect } from 'react-redux';
import { handleDrag } from '../actions/semesterActions';
import Year from "../components/Year";

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

const DragDropPlan = (props) => {
    const classes = useStyles();
    const { dispatch, board } = props;

    const onDragEnd = (result) => {
        if (!result.destination) {
            return;
        }
        dispatch(handleDrag(result));
    }

    return (
        <main className={classes.root}>
            <div className={classes.toolbar} />
            <DragDropContext onDragEnd={onDragEnd}>
                {board.map((item, index) => (
                    <div key={index} className={(index === 0) ? classes.firstYearRow : classes.yearRow}>
                        <Paper className={classes.verticalYearLabel}>
                            {item.year}
                        </Paper>
                        <Year
                            semesters={item.semesters}
                            yearIndex={index}
                        />
                    </div>
                ))}
            </DragDropContext>
        </main>
    );
}

const mapStateToProps = state => ({
    board: state.board
});

export default connect(mapStateToProps)(DragDropPlan);