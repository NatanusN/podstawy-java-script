document.getElementById('addTaskButton').addEventListener('click', function() {
  const taskInput = document.getElementById('taskInput');
  const taskText = taskInput.value.trim();
  if (taskText !== "") {
    const newTask = {
      text: taskText,
      completed: false
    };
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(newTask);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    displayTasks();
    taskInput.value = "";
  }
});
function displayTasks() {
  const taskList = document.getElementById('taskList');
  taskList.innerHTML = "";
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  tasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.classList.toggle('completed', task.completed);
    const span = document.createElement('span');
    span.textContent = task.text;
    li.appendChild(span);
    const button = document.createElement('button');
    button.textContent = task.completed ? 'Usuń' : 'Zrobione';
    button.addEventListener('click', () => toggleTask(index));
    li.appendChild(button);
    taskList.appendChild(li);
  });
}
displayTasks();
function toggleTask(index) {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  if (tasks[index].completed) {
    tasks.splice(index, 1);
  } else {
    tasks[index].completed = true;
  }
  localStorage.setItem('tasks', JSON.stringify(tasks));
  displayTasks();
}