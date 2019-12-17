import React, { Component } from "react";

const getHighlightColor = () => ({
    userSelect: 'none',
    color: '#00863f',
    fontWeight: 700,
    display: 'inline'
});

const getBoxStyle = () => ({
    fontSize: 14,
});

export default class Course extends Component {
    render() {
        let coursePrefix = "";
        let name = this.props.name;

        let pattern = new RegExp(/[A-Z]+ \d{4}/);

        if (pattern.test(name)) {
            coursePrefix = name.match(pattern);
            name = name.split(coursePrefix)[1];
        }
 
        return (
            <div style={getBoxStyle()}>
                <div style={getHighlightColor()}>{coursePrefix}</div>{name}
            </div>
            
        );
    }
}