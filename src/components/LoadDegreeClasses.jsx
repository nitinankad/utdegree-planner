import React, { Component } from "react";

const API_URL = "http://127.0.0.1/api/1";

export default class LoadDegreeClasses extends Component {
  constructor(props) {
    super(props);
    this.state = {
        isLoading: false
    };
  }
  fetchCourses = () => {
    return fetch(API_URL).then(response => {
        return response.json();
    }).then(data => {
        this.props.callback(data);
    });
  }

  getCourses = () => {
      return Promise.all([this.fetchCourses()]);
  }

  handleClick = () => {
      this.setState({ isLoading: true });

      this.getCourses().then((val) => {   
          this.setState({ isLoading: false })
      });

  }

  render() {
      const buttonStyle = () => ({
          width: '191px',
          padding: '10px',
          border: 'none',
          display: 'inline-block',
          backgroundColor: '#c75b12',
          color: 'white',
          cursor: this.state.isLoading ? 'not-allowed' : 'pointer',
          opacity: this.state.isLoading ? '0.5' : '1'
      });

      return (
          <div>
              <div>
                  {this.state.isLoading ? (<CircularProgress />) : null}
              </div>

              <button style={buttonStyle()} onClick={this.handleClick} disabled={this.state.isLoading}>
                  Load classes from sample CS degree plan
              </button>
          </div>
      );
  }
}
