import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Exercise = props => (
    <tr>
        <td>{props.exercise.username}</td>
        <td>{props.exercise.description}</td>
        <td>{props.exercise.duration}</td>
        <td>{props.exercise.date.substring(0, 10)}</td>
        <td>
            <Link to={"exercise/edit/" + props.exercise._id}>edit</Link> | <a href="#" onClick={() => { props.deleteExercise(props.exercise._id) }}>delete</a>
        </td>
    </tr>
)

export default class ExercisesList extends Component {
    constructor(props) {
        super(props);

        this.deleteExercise = this.deleteExercise.bind(this)

        this.state = { 
            exercises: [],
            message: '', 
        };
    }

    componentDidMount() {
        axios.get('http://localhost:5000/exercises/')
            .then(response => {
                this.setState({ exercises: response.data })
            })
            .catch((error) => {
                console.log(error);
            })
    }

    deleteExercise(id) {
        if (window.confirm("Are you sure want to delete this item?")){
            axios.delete('http://localhost:5000/exercises/' + id)
            .then(response => { 
                if (response.data.success) {
                    this.setState({
                        exercises: this.state.exercises.filter(el => el._id !== id)
                    })
                    this.setState({ message: response.data.message })
                }
             });

        
        }
    }

    message() {
        if (this.state.message !== ''){
            return (
                <div className="alert alert-primary" role="alert">
                    {this.state.message}
                </div>
            )
        }
    }

    exerciseList() {
        return this.state.exercises.map(currentexercise => {
            return <Exercise exercise={currentexercise} deleteExercise={this.deleteExercise} key={currentexercise._id} />;
        })
    }

    render() {
        return (
            <div>
                {this.message()}
                <h3>Logged Exercises</h3>
                <table className="table">
                    <thead className="thead-light">
                        <tr>
                            <th>Username</th>
                            <th>Description</th>
                            <th>Duration</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.exerciseList()}
                    </tbody>
                </table>
            </div>
        )
    }
}