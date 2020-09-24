import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import { useHistory } from "react-router-dom";
import Graph from "react-graph-vis";
import { setBoard } from "../actions/boardActions";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const useStyles = makeStyles(theme => ({
    root: {
        padding: theme.spacing(1.5),
        width: '100%',
    },
    buttons: {
        margin: theme.spacing(1),
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

const PrereqGraph = (props) => {
    const classes = useStyles();
    const { dispatch, board } = props;
    let history = useHistory();
    let graph = { nodes: [], edges: [] };
    init();

    function init() {
        dispatch(setBoard(board));
        // allow all boards to be shown, might add some additional actions for invalid boards later
        if (board.valid || true) {
            var id = 0;
            var oid = 10001;
            var dd = {};
            var nodepends = [];
            var first = Array(20).fill(-1);
            var semId = 1;
            for (var year of board) {
                for (var semester of year["semesters"]) {
                    for (var course of semester["courses"]) {
                        var pre = course["courseName"].match("[A-Z]+ [0-9]+")
                        if (!pre)
                            pre = [course["courseName"]]
                        nodepends.push({ id: pre[0], level: semId });
                        if (course["Prereq"]) { //  || course["Coreq"]
                            nodepends.pop();
                            if (!(pre[0] in dd)) {
                                dd[pre[0]] = { id: id++, taken: true };
                                if (first[semId] === -1) {
                                    first[semId] = dd[pre[0]]["id"];
                                }
                                graph["nodes"].push({ id: id - 1, shape: "box", label: pre[0], title: pre[0], color: "#00FF00", level: semId });
                                graph["edges"].push({ from: id - 1, to: first[semId], color: { opacity: 0 } });
                            }
                            var prereqs = [];
                            var coreqs = [];
                            if (course["Prereq"])
                                prereqs = Array.from(course["Prereq"].matchAll("[A-Z]+ [0-9]+"));
                            /*if(course["Coreq"])
                                coreqs = Array.from(course["Coreq"].matchAll("[A-Z]+ [0-9]+"));*/
                            // prereqs.concat(coreqs); // TODO: deal with coreqs
                            for (var oc of prereqs) {
                                oc = oc[0];
                                if (nodepends.includes(oc)) {
                                    nodepends.splice(nodepends.indexOf(oc), 1);
                                }
                                if (!(oc in dd) && course["valid"] !== "1") {
                                    dd[oc] = { id: id++, taken: false };
                                    graph["nodes"].push({ id: id - 1, shape: "box", label: oc, title: oc, color: "#FF0000", level: semId - 1 });
                                }
                                if (oc in dd) {
                                    graph["edges"].push({ from: dd[oc]["id"], to: dd[pre[0]]["id"] });
                                }
                            }
                        }
                    }
                    if (semester["courses"].length !== 0) semId++;
                }
            }
            for (var no of nodepends) {
                var level = no["level"]
                no = no["id"]
                dd[no] = { id: oid++, taken: true };
                graph["nodes"].push({ id: oid - 1, shape: "box", label: no, title: no, color: "cyan", level: level });
                graph["edges"].push({ from: oid - 1, to: first[level], color: { "opacity": 0.0 }, length: 150, arrows: "" });
                first[level] = oid - 1; // this is smart
            }
        } else {
            alert('Please fix your prerequisites!');
            history.push("/")
        }
        console.log(graph["nodes"])

    }

    function handleClick() {
        history.push("/")
    }

    // testing data
    // const graph = { "nodes": [{ "id": 0, "label": "MATH 2413", "title": "MATH 2413", "color": "#00FF00" }, { "id": 1, "label": "ALEKS 0000", "title": "ALEKS 0000", "color": "#FF0000" }, { "id": 2, "label": "MATH 2306", "title": "MATH 2306", "color": "#FF0000" }, { "id": 3, "label": "MATH 2312", "title": "MATH 2312", "color": "#FF0000" }, { "id": 4, "label": "CS 1337", "title": "CS 1337", "color": "#00FF00" }, { "id": 5, "label": "CS 1336", "title": "CS 1336", "color": "#FF0000" }, { "id": 6, "label": "MATH 2414", "title": "MATH 2414", "color": "#00FF00" }, { "id": 7, "label": "MATH 2417", "title": "MATH 2417", "color": "#FF0000" }, { "id": 8, "label": "CS 2305", "title": "CS 2305", "color": "#00FF00" }, { "id": 9, "label": "CS 2336", "title": "CS 2336", "color": "#00FF00" }, { "id": 10, "label": "CE 1337", "title": "CE 1337", "color": "#FF0000" }, { "id": 11, "label": "PHYS 2325", "title": "PHYS 2325", "color": "#00FF00" }, { "id": 12, "label": "CS 3305", "title": "CS 3305", "color": "#00FF00" }, { "id": 13, "label": "CE 2305", "title": "CE 2305", "color": "#FF0000" }, { "id": 14, "label": "MATH 2419", "title": "MATH 2419", "color": "#FF0000" }, { "id": 15, "label": "PHYS 2326", "title": "PHYS 2326", "color": "#00FF00" }, { "id": 16, "label": "MATH 2418", "title": "MATH 2418", "color": "#00FF00" }, { "id": 17, "label": "CS 3341", "title": "CS 3341", "color": "#00FF00" }, { "id": 18, "label": "MATH 1326", "title": "MATH 1326", "color": "#FF0000" }, { "id": 19, "label": "CS 3345", "title": "CS 3345", "color": "#00FF00" }, { "id": 20, "label": "CE 2336", "title": "CE 2336", "color": "#FF0000" }, { "id": 21, "label": "CS 2337", "title": "CS 2337", "color": "#FF0000" }, { "id": 22, "label": "CS 3377", "title": "CS 3377", "color": "#00FF00" }, { "id": 23, "label": "ECS 3390", "title": "ECS 3390", "color": "#00FF00" }, { "id": 24, "label": "RHET 1302", "title": "RHET 1302", "color": "#FF0000" }, { "id": 25, "label": "CS 3354", "title": "CS 3354", "color": "#00FF00" }, { "id": 26, "label": "CS 3333", "title": "CS 3333", "color": "#FF0000" }, { "id": 27, "label": "CS 4337", "title": "CS 4337", "color": "#00FF00" }, { "id": 28, "label": "CS 3340", "title": "CS 3340", "color": "#FF0000" }, { "id": 29, "label": "SE 3340", "title": "SE 3340", "color": "#FF0000" }, { "id": 30, "label": "CE 4304", "title": "CE 4304", "color": "#FF0000" }, { "id": 31, "label": "EE 4304", "title": "EE 4304", "color": "#FF0000" }, { "id": 32, "label": "CS 4341", "title": "CS 4341", "color": "#00FF00" }, { "id": 33, "label": "CE 2310", "title": "CE 2310", "color": "#FF0000" }, { "id": 34, "label": "EE 2310", "title": "EE 2310", "color": "#FF0000" }, { "id": 35, "label": "CS 4348", "title": "CS 4348", "color": "#00FF00" }, { "id": 36, "label": "SE 3377", "title": "SE 3377", "color": "#FF0000" }, { "id": 37, "label": "CE 3345", "title": "CE 3345", "color": "#FF0000" }, { "id": 38, "label": "SE 3345", "title": "SE 3345", "color": "#FF0000" }, { "id": 39, "label": "CS 4349", "title": "CS 4349", "color": "#00FF00" }, { "id": 40, "label": "CS 4347", "title": "CS 4347", "color": "#00FF00" }, { "id": 41, "label": "CS 4384", "title": "CS 4384", "color": "#00FF00" }, { "id": 42, "label": "CS 4485", "title": "CS 4485", "color": "#00FF00" }, { "id": 43, "label": "CE 3354", "title": "CE 3354", "color": "#FF0000" }, { "id": 44, "label": "SE 3354", "title": "SE 3354", "color": "#FF0000" }], "edges": [{ "from": 1, "to": 0 }, { "from": 2, "to": 0 }, { "from": 3, "to": 0 }, { "from": 5, "to": 4 }, { "from": 7, "to": 6 }, { "from": 0, "to": 6 }, { "from": 1, "to": 8 }, { "from": 3, "to": 8 }, { "from": 10, "to": 9 }, { "from": 4, "to": 9 }, { "from": 0, "to": 11 }, { "from": 7, "to": 11 }, { "from": 13, "to": 12 }, { "from": 8, "to": 12 }, { "from": 6, "to": 12 }, { "from": 14, "to": 12 }, { "from": 11, "to": 15 }, { "from": 6, "to": 15 }, { "from": 14, "to": 15 }, { "from": 2, "to": 16 }, { "from": 0, "to": 16 }, { "from": 7, "to": 16 }, { "from": 18, "to": 17 }, { "from": 6, "to": 17 }, { "from": 14, "to": 17 }, { "from": 13, "to": 17 }, { "from": 8, "to": 17 }, { "from": 13, "to": 19 }, { "from": 8, "to": 19 }, { "from": 20, "to": 19 }, { "from": 9, "to": 19 }, { "from": 21, "to": 19 }, { "from": 20, "to": 22 }, { "from": 9, "to": 22 }, { "from": 21, "to": 22 }, { "from": 24, "to": 23 }, { "from": 20, "to": 25 }, { "from": 9, "to": 25 }, { "from": 21, "to": 25 }, { "from": 26, "to": 25 }, { "from": 13, "to": 25 }, { "from": 8, "to": 25 }, { "from": 20, "to": 27 }, { "from": 9, "to": 27 }, { "from": 21, "to": 27 }, { "from": 26, "to": 27 }, { "from": 13, "to": 27 }, { "from": 8, "to": 27 }, { "from": 28, "to": 27 }, { "from": 29, "to": 27 }, { "from": 30, "to": 27 }, { "from": 31, "to": 27 }, { "from": 33, "to": 32 }, { "from": 34, "to": 32 }, { "from": 28, "to": 32 }, { "from": 29, "to": 32 }, { "from": 15, "to": 32 }, { "from": 28, "to": 35 }, { "from": 29, "to": 35 }, { "from": 22, "to": 35 }, { "from": 36, "to": 35 }, { "from": 37, "to": 35 }, { "from": 19, "to": 35 }, { "from": 38, "to": 35 }, { "from": 12, "to": 39 }, { "from": 37, "to": 39 }, { "from": 19, "to": 39 }, { "from": 38, "to": 39 }, { "from": 37, "to": 40 }, { "from": 19, "to": 40 }, { "from": 38, "to": 40 }, { "from": 12, "to": 41 }, { "from": 37, "to": 42 }, { "from": 19, "to": 42 }, { "from": 38, "to": 42 }, { "from": 43, "to": 42 }, { "from": 25, "to": 42 }, { "from": 44, "to": 42 }] };

    const options = {
        layout: {
            hierarchical: {
                direction: "UD",
                sortMethod: "directed",
                parentCentralization: false,
                nodeSpacing: 10,
                levelSeparation: 90
            }
        },
        edges: {
            smooth: true,
            color: "#000000"
        },
        height: '1000px',
        width: '1410px',
        physics: {
            hierarchicalRepulsion: {
                springConstant: 0.000001,
                nodeDistance: 55
            }
        }
    };

    const events = {
        select: function (event) {
            var { nodes, edges } = event;
            // process events
        }
    };

    const _exportPdf = () => {
        html2canvas(document.getElementsByClassName("vis-network")[0]).then(canvas => {
            // document.body.appendChild(canvas);  // if you want see your screenshot in body.
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('l', 'mm', 'a3');
            pdf.addImage(imgData, 'PNG', 0, 0);
            pdf.save("degreePlan.pdf");
        });
    }

    return (
        <main className={classes.root}>
            <div className={classes.toolbar} />
            <Button className={classes.buttons} variant="contained" color="primary" onClick={handleClick}>Go Back</Button>
            <Button className={classes.buttons} variant="contained" color="secondary" onClick={_exportPdf}>Export</Button>
            <Graph
                graph={graph}
                options={options}
                events={events}
                id="canvas"
                getNetwork={network => {}}
            />
        </main>
    );
}

const mapStateToProps = state => ({
    board: state.board
});

export default connect(mapStateToProps)(PrereqGraph);