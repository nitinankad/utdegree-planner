import { Button, makeStyles } from '@material-ui/core';
import React from 'react';
import { Fragment } from 'react';
import { useHistory } from 'react-router';
import { getHours } from '../utils/getHours';

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(1.5),
        width: '100%',

        "& table": {
            borderCollapse: "collapse",
            marginLeft: "50px"
        },
        "& button": {
            marginLeft: "50px"
        },
        "& tbody": {
            maxWidth: "900px",
            fontSize: "13px",
            fontFamily: "'Fira Sans',OpenSans,Arial,sans-serif"
        },
        "& th": {
            padding: "3px",
            border: "2px solid #e5e5e5",
            backgroundColor: "#e5e5e5"
        },
        "& td": {
            padding: "4px",
            border: "2px solid #e5e5e5"
        },
    },
    buttons: {
        margin: theme.spacing(1),
    },
    toolbar: theme.mixins.toolbar,
    course: {
        width: "280px"
    },
    header: {
        fontSize: "14px",
        fontWeight: "700",
		textAlign: "center"
    }, 
    schHeader: {
        width: "40px",
        textAlign: "center",
        fontWeight: "700",
        fontSize: "14px"
    },
    sch: {
        width: "40px",
        textAlign: "center"
    },
    bottom: {
        backgroundColor: "#e5e5e5",
        fontSize: "14px",
        fontWeight: "700"
    },
    highlightCourseName: {
        color: '#00863f',
        fontWeight: 700,
        display: 'inline',
    },
}));

const TableView = (props) => {
    const { board } = props;
    const classes = useStyles();
    let history = useHistory();

    const courseNameFormat = (courseName) => {
        let coursePrefix = "";
        const pattern = new RegExp(/[A-Z]+ \d{4}|\d{3} Core Course/);

        if (pattern.test(courseName)) {
            coursePrefix = courseName.match(pattern);
            courseName = courseName.split(coursePrefix)[1];
        }

        return <>
            <span className={classes.highlightCourseName}>{coursePrefix}</span> {courseName}
        </>;
    }

    return (
        <div className={classes.root}>
            <div className={classes.toolbar} />

            <Button className={classes.buttons} variant="contained" color="primary" onClick={() => history.push("/")}>Go Back</Button>

            {board.map((year, index) => 
                <Fragment key={index}>
                    <table>
                        <thead></thead>
                        <tbody>
                            <tr>
                                <th colSpan="100%">{year.year}</th>
                            </tr>
                
                            <tr>
                                <td className={classes.header}>Fall semester</td>
                                <td className={classes.schHeader}>SCH</td>
                                <td className={classes.header}>Spring semester</td>
                                <td className={classes.schHeader}>SCH</td>
                                <td className={classes.header}>Summer semester</td>
                                <td className={classes.schHeader}>SCH</td>
                            </tr>

                            {[...Array(Math.max(year.semesters[0].courses.length, year.semesters[1].courses.length, year.semesters[2].courses.length))].map((i, index) => 
                                <tr key={index}>
                                    <td className={classes.course}>{index < year.semesters[0].courses.length ? courseNameFormat(year.semesters[0].courses[index].courseName) : null}</td>
                                    <td className={classes.sch}>{index < year.semesters[0].courses.length ? getHours(year.semesters[0].courses[index].courseName) : null}</td>

                                    <td className={classes.course}>{index < year.semesters[1].courses.length ? courseNameFormat(year.semesters[1].courses[index].courseName) : null}</td>
                                    <td className={classes.sch}>{index < year.semesters[1].courses.length ? getHours(year.semesters[1].courses[index].courseName) : null}</td>

                                    <td className={classes.course}>{index < year.semesters[2].courses.length ? courseNameFormat(year.semesters[2].courses[index].courseName) : null}</td>
                                    <td className={classes.sch}>{index < year.semesters[2].courses.length ? getHours(year.semesters[2].courses[index].courseName) : null}</td>
                                </tr>
                            )}
                
                            <tr className={classes.bottom}>
                                <td className={classes.course}></td>
                                <td className={classes.sch}>{year.semesters[0].hours}</td>
                
                                <td className={classes.course}></td>
                                <td className={classes.sch}>{year.semesters[1].hours}</td>
                
                                <td className={classes.course}></td>
                                <td className={classes.sch}>{year.semesters[2].hours}</td>
                            </tr>
                        </tbody>
                    </table>
                    <br/>
                </Fragment>
            )}
        </div>
    );
};

export default TableView;