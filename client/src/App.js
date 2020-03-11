import React from 'react';
import io from 'socket.io-client';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: [],
      taskName: ''
    };
  }
  componentDidMount() {
    this.socket = io('localhost:8000');
    this.socket.on('updateData', tasks => {
      this.updateTasks(tasks);
    });
    this.socket.on('addTask', task => {
      this.addTask(task);
    });
    this.socket.on('removeTask', index => {
      this.removeTask(index);
    });
  }
  removeTask(index, isLocal) {
    let newList = this.state.tasks;
    newList.splice(index, 1);
    this.setState({ tasks: newList });
    if (isLocal) {
      this.socket.emit('removeTask', index);
    }
  }
  updateTask(value) {
    this.setState({ taskName: value });
  }
  submitForm(e) {
    e.preventDefault();
    this.addTask(this.state.taskName);
    this.socket.emit('addTask', this.state.taskName);
  }
  addTask(string) {
    this.setState({ tasks: [...this.state.tasks, string] });
  }
  updateTasks(taskslist) {
    this.setState({ tasks: taskslist });
  }
  render() {
    const { tasks } = this.state;
    return (
      <div className='App'>
        <header>
          <h1>ToDoList.app</h1>
        </header>

        <section className='tasks-section' id='tasks-section'>
          <h2>Tasks</h2>

          <ul className='tasks-section__list' id='tasks-list'>
            {tasks.map(task => (
              <li className='task' key={task}>
                {task}
                <button
                  className='btn btn--red'
                  onClick={e => this.removeTask(tasks.indexOf(task), true)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>

          <form id='add-task-form'>
            <input
              className='text-input'
              autoComplete='off'
              type='text'
              placeholder='Type your description'
              id='task-name'
              onChange={e => this.updateTask(e.target.value)}
            />
            <button
              className='btn'
              type='submit'
              onClick={e => this.submitForm(e)}
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
