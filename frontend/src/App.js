import React, { useState, setState } from 'react';
import './App.css';
import { Container } from 'react-bootstrap'
import Modal from 'react-modal';

function DeleteButton(props) {
  var request = {
    'method': 'DELETE',
    'body': JSON.stringify({
      'database': 'TodoDB',
      'collection': 'todos',
      'Filter': {
        'title': props.title,
        'author': props.author,
        'date': props.date,
      },
    })
  }
  const buttonClicked = () => {
    console.log(request);
    fetch('http://localhost:5001/mongodb', request)
      .then(res => res.json())
      .then(json => console.log(json));
    window.location.reload();
  }

  return (
    <i className="fa fa-trash" onClick={buttonClicked}></i>
  )
}

function Todo(props) { 
  return (
    <div class="post">
      <hr></hr>
      <div class="right">
        <EditModal
          title={props.title}
          author={props.author}
          date={props.date}
          posts={props.posts}
          new={false} />
        <DeleteButton
          title={props.title}
          author={props.author}
          date={props.date}></DeleteButton>
      </div>
      <div class="block">
        <h2>{props.title}</h2>
        <p class="author">{props.author}</p>
        <p class="date">{props.date}</p>
      </div>
      <p class="body">{props.posts} </p>
    </div>);
}

class EditModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: props.title,
      author: props.author,
      date: props.date,
      body: props.posts,
      show: false,
      new: props.new,
      oldTitle: props.title,
      oldAuthor: props.author,
      oldDate: props.date,
      oldBody: props.posts,
      icon: props.new ? "fa fa-lg fa-plus" : "fa fa fa-pencil",
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
  }

  saveOnButtonClick() {
    this.modalIsOpen = !this.modalIsOpen;
  }

  showModal = () => {
    this.setState({ show: true });
  };

  hideModal = () => {
    this.setState({ show: false });
  };


  handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;
    this.setState({
      [name]: value
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    console.log(this.state.new);
    if (this.state.new) {
      var request = {
        'method': 'POST',
        'body': JSON.stringify({
          'database': 'TodoDB',
          'collection': 'todos',
          'Document': {
            'title': this.state.title,
            'author': this.state.author,
            'date': this.state.date,
            'posts': this.state.body
          },
        })
      }
    } else {
      var request = {
        'method': 'PUT',
        'body': JSON.stringify({
          'database': 'TodoDB',
          'collection': 'todos',
          'Filter': {
            'title': this.state.oldTitle,
            'author': this.state.oldAuthor,
            'date': this.state.oldDate,
            'posts': this.state.oldBody,
          },
          'DataToBeUpdated': {
            'title': this.state.title,
            'author': this.state.author,
            'date': this.state.date,
            'posts': this.state.body
          },
        })
      }
    }
    console.log(request);
    fetch('http://localhost:5001/mongodb', request)
      .then(res => res.json())
      .then(json => console.log(json));
    window.location.reload();
    alert(this.state);
    console.log(this.state);
    this.hideModal();
  }

  render() {
    return (
      <div>
        <i class={this.state.icon} onClick={this.showModal} aria-hidden="true"></i>
        <Modal isOpen={this.state.show} onRequestClose={this.hideModal}>
          <form onSubmit={this.handleSubmit}>
            <div class="center">
              <label class="space">Enter your task:
                <input
                  type="text"
                  name="author"
                  value={this.state.author}
                  class="space"
                  onChange={this.handleChange}
                />
              </label>
              <label class="space"> Enter the tag of task:
                <input
                  type="text"
                  name="title"
                  value={this.state.title}
                  class="space"
                  onChange={this.handleChange}
                />
              </label>
              <label class="space"> Enter today's date:
                <input
                  type="text"
                  name="date"
                  value={this.state.date}
                  onChange={this.handleChange}
                  class="space"
                />
              </label>
            </div>
            <div class="center">
              <label class="space">Enter title of task:
                <input
                  type="text"
                  name="body"
                  value={this.state.body}
                  class="space"
                  onChange={this.handleChange}
                />
              </label>
            </div>
            <div>
              <button type="submit">Save</button>
            </div>
          </form>
        </Modal>
      </div >
    )
  }
}

class App extends React.Component {
  state = {
    isLoading: true
  };

  componentDidMount() {
    fetch('http://localhost:5001/mongodb', {
      'methods':
        'GET'
    })
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoading: false,
            items: result.articles
          });
        },
        (error) => {
          this.setState({
            isLoading: true,
            error
          });
        }
      )
  }

  render() {
    if (this.state.isLoading || this.state.items == null) {
      return null; //app is not ready (fake request is in process)
    }

    return (
      <div>
        <h1>Kozliuk TODO App</h1>
        <div class="center">
          <EditModal
            new={true}
          />
        </div>
        <Container>
          {this.state.items.map(item =>
            <Todo title={item.title}
              author={item.author}
              date={item.date}
              posts={item.posts}></Todo>
          )}
        </Container>
      </div>
    );
  }
}
export default App;
