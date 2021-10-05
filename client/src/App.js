import React from 'react';
import io from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: [],
      taskName: '',
      editedTask: {},
    };
  }
  componentDidMount() {
    this.socket = io('localhost:8000');
    this.socket.on('updateData', (tasks) => {
      this.updateTasks(tasks);
    });
    this.socket.on('addTask', (task) => {
      this.addTask(task);
    });
    this.socket.on('removeTask', (id) => {
      this.removeTask(id);
    });
    this.socket.on('editTask', (task) => {
      this.editTask(task);
    });
  }
  removeTask(id, isLocal) {
    this.setState({
      tasks: this.state.tasks.filter((task) => task.id !== id),
    });
    if (isLocal) {
      this.socket.emit('removeTask', id);
    }
  }
  updateTask(value) {
    this.setState({ taskName: value });
  }
  submitForm(e) {
    e.preventDefault();
    const newTask = { name: this.state.taskName, id: uuidv4() };
    this.addTask(newTask);
    this.socket.emit('addTask', newTask);
    this.setState({ taskName: '' });
  }
  addTask(newTask) {
    this.setState({ tasks: [...this.state.tasks, newTask] });
  }
  updateTasks(taskslist) {
    this.setState({ tasks: taskslist });
  }
  startEdit(task) {
    this.setState({ editedTask: task });
  }
  setEditedTask(value) {
    this.setState({ editedTask: { ...this.state.editedTask, name: value } });
  }
  editTask(task) {
    this.setState({
      tasks: this.state.tasks.map((task) =>
        task.id === this.state.editedTask.id
          ? { ...task, name: this.state.editedTask.name }
          : task
      ),
    });
  }
  submitEdit(e) {
    e.preventDefault();
    this.editTask(this.state.editedTask);
    //emit change
    this.socket.emit('editTask', this.state.editedTask);
    //clear editedTask
    this.setState({ editedTask: {} });
  }
  render() {
    const { tasks, editedTask } = this.state;
    return (
      <div className='App'>
        <header>
          <h1>ToDoList.app</h1>
        </header>

        <section className='tasks-section' id='tasks-section'>
          <h2>Tasks</h2>
          <ul className='tasks-section__list' id='tasks-list'>
            {tasks.map((task) => (
              <li className='task' key={task.id}>
                {task.name}
                <div className='buttons'>
                  <button
                    className='btn'
                    onClick={(e) => this.startEdit(task, true)}
                  >
                    Edit
                  </button>
                  <button
                    className='btn btn--red'
                    onClick={(e) => this.removeTask(task.id, true)}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
          {Object.keys(editedTask).length !== 0 && (
            <form id='edit-task-form'>
              <input
                className='text-input'
                autoComplete='off'
                type='text'
                value={this.state.editedTask.name}
                id='task-name'
                onChange={(e) => this.setEditedTask(e.target.value)}
              />
              <button
                className='btn'
                type='submit'
                onClick={(e) => this.submitEdit(e)}
              >
                Change
              </button>
            </form>
          )}
          <form id='add-task-form'>
            <input
              className='text-input'
              autoComplete='off'
              type='text'
              placeholder='Type your description'
              id='task-name'
              onChange={(e) => this.updateTask(e.target.value)}
            />
            <button
              className='btn'
              type='submit'
              onClick={(e) => this.submitForm(e)}
            >
              Add
            </button>
          </form>
        </section>
      </div>
    );
  }
}

export default App;
