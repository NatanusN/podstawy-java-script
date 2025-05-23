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