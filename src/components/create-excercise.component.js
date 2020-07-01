import React, { Component } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

export default class CreateExcercise extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            description: '',
            duration: 0,
            date: new Date(),
            users: []
        }
    }

    componentDidMount() {
        axios.get('http://localhost:5000/users')
            .then(response => {
                if (response.data.length > 0) {
                    this.setState({
                        users: response.data.map(user => user.username),
                        username: response.data[0].username
                    })
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }

    onSubmit = e => {
        e.preventDefault()

        const { username, description, duration, date } = this.state

        const excercise = {
            username: username,
            description: description,
            duration: duration,
            date: date
        }

        axios.post('http://localhost:5000/exercises/add', excercise)
            .then(res => {
                if (res.data.success) {
                    this.props.history.push('/')
                }
            });
    }

    render() {
        return (
            <div>
                <h3>Create New Exercise Log</h3>
                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <label>Username: </label>
                        <select ref="userInput"
                            required
                            className="form-control"
                            value={this.state.username}
                            onChange={(e) => {
                                var username = e.target.value
                                this.setState({ username })
                            }}>
                            {
                                this.state.users.map(function (user) {
                                    return <option
                                        key={user}
                                        value={user}>{user}
                                    </option>;
                                })
                            }
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Description: </label>
                        <input type="text"
                            required
                            className="form-control"
                            value={this.state.description}
                            onChange={(e) => {
                                var description = e.target.value
                                this.setState({ description })
                            }}
                        />
                    </div>
                    <div className="form-group">
                        <label>Duration (in minutes): </label>
                        <input
                            type="text"
                            className="form-control"
                            value={this.state.duration}
                            onChange={(e) => {
                                var duration = e.target.value
                                this.setState({ duration })
                            }}
                        />
                    </div>
                    <div className="form-group">
                        <label>Date: </label>
                        <div>
                            <DatePicker
                                className="form-control"
                                selected={this.state.date}
                                onChange={(date) => {
                                    this.setState({ date })
                                }}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <input type="submit" value="Create Exercise Log" className="btn btn-primary" />
                    </div>
                </form>
            </div>
        )
    }
}