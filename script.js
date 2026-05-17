const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const filterButtons = document.querySelectorAll(".filter-btn");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let currentFilter = "all";

renderTasks();

addBtn.addEventListener("click", addTask);

taskInput.addEventListener("keypress", function(e){
  if(e.key === "Enter"){
    addTask();
  }
});

function addTask(){

  const text = taskInput.value.trim();

  if(text === "") return;

  const task = {
    id: Date.now(),
    text: text,
    completed: false
  };

  tasks.push(task);

  saveTasks();

  renderTasks();

  taskInput.value = "";
}

function renderTasks(){

  taskList.innerHTML = "";

  let filteredTasks = tasks;

  if(currentFilter === "active"){
    filteredTasks = tasks.filter(task => !task.completed);
  }

  if(currentFilter === "completed"){
    filteredTasks = tasks.filter(task => task.completed);
  }

  filteredTasks.forEach(task => {

    const li = document.createElement("li");

    if(task.completed){
      li.classList.add("completed");
    }

    li.innerHTML = `
      <span>${task.text}</span>

      <div class="actions">
        <button class="edit-btn" data-id="${task.id}">Edit</button>
        <button class="delete-btn" data-id="${task.id}">Delete</button>
      </div>
    `;

    li.addEventListener("click", function(e){

      if(
        e.target.classList.contains("edit-btn") ||
        e.target.classList.contains("delete-btn")
      ){
        return;
      }

      toggleTask(task.id);
    });

    taskList.appendChild(li);
  });
}

taskList.addEventListener("click", function(e){

  const id = Number(e.target.dataset.id);

  if(e.target.classList.contains("delete-btn")){
    deleteTask(id);
  }

  if(e.target.classList.contains("edit-btn")){
    editTask(id);
  }
});

function toggleTask(id){

  tasks = tasks.map(task => {
    if(task.id === id){
      return {
        ...task,
        completed: !task.completed
      };
    }
    return task;
  });

  saveTasks();

  renderTasks();
}

function deleteTask(id){

  tasks = tasks.filter(task => task.id !== id);

  saveTasks();

  renderTasks();
}

function editTask(id){

  const task = tasks.find(task => task.id === id);

  const newText = prompt("Edit Task", task.text);

  if(newText === null || newText.trim() === ""){
    return;
  }

  task.text = newText.trim();

  saveTasks();

  renderTasks();
}

function saveTasks(){
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

filterButtons.forEach(button => {

  button.addEventListener("click", function(){

    document
      .querySelector(".filter-btn.active")
      .classList.remove("active");

    button.classList.add("active");

    currentFilter = button.dataset.filter;

    renderTasks();
  });

});