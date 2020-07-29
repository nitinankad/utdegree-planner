import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, CssBaseline } from '@material-ui/core';
import { DragDropContext } from 'react-beautiful-dnd';
import { connect } from 'react-redux';
import { handleDrag } from '../actions/semesterActions';
import Topbar from "../layout/Topbar";
import Sidebar from "../layout/Sidebar";
import Footer from "../layout/Footer";
import Year from "../components/Year";

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  content: {
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

const Dashboard = (props) => {
  const classes = useStyles();
  const [openSidebar, setSidebarState] = React.useState(false);
  const { dispatch, board } = props;

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    dispatch(handleDrag(result));
  }

  const toggleSidebar = () => {
    setSidebarState(!openSidebar);
  }

  return (
    <div className={classes.root}>
      <CssBaseline />

      <Topbar
        onSidebarOpen={toggleSidebar}
      />

      <Sidebar
        onSidebarClose={toggleSidebar}
        open={openSidebar}
      />

      <main className={classes.content}>
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
          
          <Footer />
        </DragDropContext>
      </main>
    </div>
  );
}

const mapStateToProps = state => ({
  board: state.board
});

export default connect(mapStateToProps)(Dashboard);