import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { CssBaseline } from '@material-ui/core';
import { connect } from 'react-redux';
import Topbar from "../layout/Topbar";
import Sidebar from "../layout/Sidebar";
import Footer from "../layout/Footer";
import SemesterPlan from "../views/SemesterPlan";
import DragDropPlan from './DragDropPlan';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useParams,
} from "react-router-dom";
import PrereqGraph from './PrereqGraph';

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
    marginTop: '31px',
  },
}));

const Dashboard = (props) => {
  const classes = useStyles();
  const [openSidebar, setSidebarState] = React.useState(false);
  const { board } = props;

  const toggleSidebar = () => {
    setSidebarState(!openSidebar);
  }

  return (
    <Router>
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
          <Switch>
            <Route exact path="/">
              <DragDropPlan board={board}/>
            </Route>
            <Route exact path="/graph">
              <PrereqGraph board={board} />
            </Route>
            <Route exact path="/:year/:semester" children={<Child board={board}/>} />
          </Switch>
          <Footer />
        </main>
      </div>

    </Router>
  );
}

const Child = (props) => {
  const { board } = props;
  let { year, semester } = useParams();
  return (
    <SemesterPlan semester={board[year]["semesters"][semester]} yearIndex={year} semesterIndex={semester} />
  );
}

const mapStateToProps = state => ({
  board: state.board
});

export default connect(mapStateToProps)(Dashboard);