import React, { Component } from 'react';
import axios from 'axios'

export default class CreateUser extends Component {
    constructor(props) {
        super(props);


        this.state = {
            id: '',
            username: '',
            message: '',
            isEdit: false,
            users: [],
        }
    }

    componentDidMount() {
        this.getUsers()
    }

    getUsers = () => {
        axios.get('http://localhost:5000/users')
            .then(res => {
                this.setState({ users: res.data })
            })
    }

    onSubmit = e => {
        e.preventDefault();

        const { id, username, isEdit } = this.state
        const user = {
            id: id,
            username: username
        }

        if (isEdit) {

            axios.post('http://localhost:5000/users/update', user)
                .then(res => {
                    if (res.data.success) {
                        this.setState({
                            id: '',
                            username: '',
                            message: res.data.message,
                            isEdit: false
                        })

                        this.getUsers()
                    }
                })
        } else {
            axios.post('http://localhost:5000/users/add', user)
            .then(res => {
                this.setState({ 
                    message: res.data.message,
                    username: ''
                })

                this.getUsers()
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

    userList() {
        return (
            this.state.users.map((user, index) => {
                return (
                    <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{user.username}</td>
                        <td>{user.createdAt.substring(0, 10)}</td>
                        <td>
                            <a href="#" onClick={() => this.editUser(user._id)}>edit</a> | <a href="#" onClick={() => { this.deleteUser(user._id) }}>delete</a>
                        </td>
                    </tr>
                )
            })
        )
    }     

    editUser = (id) => {

        axios.get('http://localhost:5000/users/' + id)
            .then(res => {
                this.setState({ 
                    username: res.data.username,
                    isEdit: true, 
                    id: res.data._id 
                })
            })
    }

    deleteUser = (id) => {
        if (window.confirm("Do you want to delete this user?")) {
            axios.delete('http://localhost:5000/users/' + id)
            .then(res => {
                if (res.data.success) {
                    this.setState({ 
                        message: res.data.message,
                        id: '',
                    })

                    this.getUsers()
                }
            })
        }
    }

    render() {
        const { isEdit } = this.state
        return (
            <div>
                {this.message()}
                {isEdit ? 
                    <h3>Edit User</h3> :
                    <h3>Create New User</h3>
                }
                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <label>Username: </label>
                        <input type="text"
                            required
                            className="form-control"
                            value={this.state.username}
                            onChange={(e) => {
                                var username = e.target.value
                                this.setState({username})
                            }}
                        />
                    </div>
                    <div className="form-group">
                        <input type="submit" value={isEdit ? 'Update User' : 'Create User'} className="btn btn-primary" />
                    </div>
                </form>
                <br/>

                <h3>Logged Users</h3>
                <table className="table">
                    <thead className="thead-light">
                        <tr>
                            <th>No</th>
                            <th>Username</th>
                            <th>Created At</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.userList()}
                    </tbody>
                </table>
            </div>
        )
    }
}