const totalTask = document.querySelector("#totalTasks");
const activeTask = document.querySelector("#activeTasks");
const completedTask = document.querySelector("#completedTasks");
const taskForm = document.querySelector("#taskForm");
const taskInput = document.querySelector("#taskInput");
const addBtn = document.querySelector("#addBtn");
const taskCount = document.querySelector("#taskCount");
const clrCompleted = document.querySelector("#clearCompletedBtn");
const taskList = document.querySelector("#taskList");
const emptyState = document.querySelector("#emptyState");
const emptyTitle = document.querySelector("#emptyTitle");
const emptyMsg = document.querySelector("#emptyMessage");
const filterBtns = document.querySelectorAll(".filter-btn");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let currentFilter = "all";

filterBtns.forEach((button) => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;
    renderTasks();
    filterBtns.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.filter === currentFilter);
    });
  });
});

function renderTasks() {
  taskList.innerHTML = "";
  let filteredTasks = tasks.filter((task) => {
    if (currentFilter === "active") {
      return !task.completed;
    }
    if (currentFilter === "completed") {
      return task.completed;
    }
    return true;
  });
  filteredTasks.forEach((task) => {
    let li = document.createElement("li");
    li.classList.add("task-item");
    taskList.appendChild(li);
    let taskContent = document.createElement("div");
    taskContent.classList.add("task-content");
    li.appendChild(taskContent);
    let taskText = document.createElement("span");
    taskText.classList.add("task-text");
    taskText.innerText = task.text;
    if (task.completed) {
      taskText.classList.add("done");
    }
    taskContent.appendChild(taskText);
    let taskActions = document.createElement("div");
    taskActions.classList.add("task-actions");
    li.appendChild(taskActions);
    let doneBtn = document.createElement("button");
    doneBtn.classList.add("task-action-btn", "done");
    doneBtn.innerText = "✓";
    taskActions.appendChild(doneBtn);
    let dltBtn = document.createElement("button");
    dltBtn.classList.add("task-action-btn", "delete");
    dltBtn.innerText = "×";
    taskActions.appendChild(dltBtn);

    let editBtn = document.createElement("button");
    editBtn.classList.add("task-action-btn", "edit");
    editBtn.innerText = "✎";
    taskActions.appendChild(editBtn);

    editBtn.addEventListener("click", () => {
      const newTask = prompt("Edit your task:", task.text);
      if(newTask === null){
        return;
      }
      const updatedTask = newTask.trim();
      if(updatedTask === ""){
        return;
      }
      task.text = updatedTask;
      saveTasks();
      renderTasks();
      summary();
    })

    doneBtn.addEventListener("click", () => {
      task.completed = !task.completed;
      if (task.completed) {
        taskText.classList.add("done");
      } else {
        taskText.classList.remove("done");
      }
      saveTasks();
      summary();
    });

    dltBtn.addEventListener("click", () => {
      tasks = tasks.filter((item) => {
        return item.id !== task.id;
      });
      saveTasks();
      renderTasks();
      summary();
    });
  });
  updateEmptyState(filteredTasks);
  updateTaskCount();
}

renderTasks();

taskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let text = taskInput.value.trim();
  if (text === "") {
    return;
  }
  const newTask = {
    id: Date.now(),
    text: text,
    completed: false,
  };
  tasks.push(newTask);
  saveTasks();
  renderTasks();
  summary();
  taskInput.value = "";
});

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function summary() {
  const total = tasks.length;
  totalTask.innerText = total;

  const completedCount = tasks.filter((task) => {
    return task.completed;
  });
  completedTask.innerText = completedCount.length;

  const activeCount = tasks.filter((task) => {
    return !task.completed;
  });
  activeTask.innerText = activeCount.length;
}

summary();


function updateEmptyState(filteredTasks) {
  if (filteredTasks.length === 0) {
    emptyState.style.display = "block";

    if (currentFilter === "all") {
      emptyTitle.innerText = "No tasks yet";
      emptyMsg.innerText = "Add your first task to get started!";
    }
    if (currentFilter === "active") {
      emptyTitle.innerText = "No active tasks";
      emptyMsg.innerText = "All your tasks are completed!";
    }
    if (currentFilter === "completed") {
      emptyTitle.innerText = "No completed tasks";
      emptyMsg.innerText = "Complete a task and it will appear here!";
    }
  } else {
    emptyState.style.display = "none";
  }
}

function updateTaskCount(){
    if(tasks.length === 1){
        taskCount.innerText = "1 task";
    }else{
        taskCount.innerText = `${tasks.length} tasks`;
    } 
}

clrCompleted.addEventListener("click", () => {
    tasks = tasks.filter((task) => {
        return !task.completed;
    
    })
    saveTasks();
    renderTasks();
    summary();
})