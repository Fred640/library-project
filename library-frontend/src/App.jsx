import axios from "axios"
import React, { Component } from 'react';
class App extends React.Component{
  state = {details:[],}

  componentDidMount(){
    let data;
    axios.get("http://127.0.0.1:8000")
    .then(res => {
      data = res.data
      this.setState({
        details:data
      })
    })
    .catch(error => {
      console.log(error)
    })
  }
  render() {
    return (
      <div>
        <p>asd</p>
        {this.state.details.map((output, id) => (
        <div key={id}>
          <p>{output.title}</p>
          <p>{output.author}</p>
        </div>))}
      </div>
    )
  }
}

export default App