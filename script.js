/* ===========================================
   DOM ELEMENTS
=========================================== */

const taskInput = document.getElementById("taskInput");
const taskDescription = document.getElementById("taskDescription");
const prioritySelect = document.getElementById("prioritySelect");
const dueDate = document.getElementById("dueDate");

const addTaskBtn = document.getElementById("addTaskBtn");

const taskList = document.getElementById("taskList");

const searchInput = document.getElementById("searchInput");

const emptyState = document.getElementById("emptyState");

const totalTasks = document.getElementById("totalTasks");
const pendingTasks = document.getElementById("pendingTasks");
const completedTasks = document.getElementById("completedTasks");
const highPriorityTasks = document.getElementById("highPriorityTasks");

const currentDate = document.getElementById("currentDate");

const welcomeUser = document.getElementById("welcomeUser");
const userEmail = document.getElementById("userEmail");

const logoutBtn = document.getElementById("logoutBtn");

const themeSelector = document.getElementById("themeSelector");

/* ===========================================
   LOGIN PROTECTION
=========================================== */

const currentUser =
    JSON.parse(localStorage.getItem("loggedInUser"));

if (!currentUser) {

    window.location.href = "index.html";

}

/* ===========================================
   USER DETAILS
=========================================== */

welcomeUser.textContent =
    `Welcome, ${currentUser.name}`;

userEmail.textContent =
    currentUser.email;

/* ===========================================
   USER TASK STORAGE
=========================================== */

const TASK_KEY =
    `tasks_${currentUser.email}`;

let tasks =
    JSON.parse(localStorage.getItem(TASK_KEY))
    || [];

let currentFilter = "all";

let editingTaskId = null;

/* ===========================================
   SAVE TASKS
=========================================== */

function saveTasks(){

    localStorage.setItem(

        TASK_KEY,

        JSON.stringify(tasks)

    );

}

/* ===========================================
   CURRENT DATE
=========================================== */

function updateDate(){

    const today = new Date();

    currentDate.textContent =
        today.toLocaleDateString(

            "en-US",

            {

                weekday:"long",

                year:"numeric",

                month:"long",

                day:"numeric"

            }

        );

}

/* ===========================================
   THEME
=========================================== */

const savedTheme =
    localStorage.getItem("theme");

if(savedTheme){

    document.body.className =
        savedTheme;

    themeSelector.value =
        savedTheme;

}

themeSelector.addEventListener(

    "change",

    function(){

        document.body.className =
            this.value;

        localStorage.setItem(

            "theme",

            this.value

        );

    }

);

/* ===========================================
   ADD TASK
=========================================== */

function addTask(){

    const title =
        taskInput.value.trim();

    const description =
        taskDescription.value.trim();

    if(title===""){

        alert("Please enter task title.");

        return;

    }

    if(editingTaskId===null){

        const task={

            id:Date.now(),

            title:title,

            description:description,

            priority:prioritySelect.value,

            dueDate:dueDate.value,

            completed:false

        };

        tasks.unshift(task);

    }

    else{

        tasks=tasks.map(task=>{

            if(task.id===editingTaskId){

                return{

                    ...task,

                    title:title,

                    description:description,

                    priority:prioritySelect.value,

                    dueDate:dueDate.value

                };

            }

            return task;

        });

        editingTaskId=null;

        addTaskBtn.textContent="Add Task";

    }

    saveTasks();

    renderTasks();

    clearForm();

}

/* ===========================================
   CLEAR FORM
=========================================== */

function clearForm(){

    taskInput.value="";

    taskDescription.value="";

    prioritySelect.value="Low";

    dueDate.value="";

}

/* ===========================================
   LOGOUT
=========================================== */

logoutBtn.addEventListener(

    "click",

    ()=>{

        localStorage.removeItem(

            "loggedInUser"

        );

        window.location.href="index.html";

    }

);
/* ===========================================
   RENDER TASKS
=========================================== */

function renderTasks() {

    taskList.innerHTML = "";

    let filteredTasks = [...tasks];

    const searchValue = searchInput.value
        .trim()
        .toLowerCase();

    if (searchValue !== "") {

        filteredTasks = filteredTasks.filter(task =>

            task.title.toLowerCase().includes(searchValue) ||

            task.description.toLowerCase().includes(searchValue)

        );

    }

    switch (currentFilter) {

        case "pending":

            filteredTasks = filteredTasks.filter(
                task => !task.completed
            );

            break;

        case "completed":

            filteredTasks = filteredTasks.filter(
                task => task.completed
            );

            break;

        case "high":

            filteredTasks = filteredTasks.filter(
                task => task.priority === "High"
            );

            break;

    }

    if (filteredTasks.length === 0) {

        emptyState.style.display = "block";

    }

    else {

        emptyState.style.display = "none";

    }

    filteredTasks.forEach(task => {

        const card = document.createElement("div");

        card.className = task.completed
            ? "task-card completed"
            : "task-card";

        card.innerHTML = `

            <div class="task-info">

                <h3>${task.title}</h3>

                <p>
                    ${task.description || "No description"}
                </p>

                <p>
                    📅 Due :
                    ${task.dueDate || "Not Set"}
                </p>

                <span class="priority ${task.priority.toLowerCase()}">
                    ${task.priority}
                </span>

            </div>

            <div class="task-actions">

                <button
                    class="complete-btn"
                    onclick="toggleTask(${task.id})">

                    ${task.completed ? "Undo" : "Done"}

                </button>

                <button
                    class="edit-btn"
                    onclick="editTask(${task.id})">

                    Edit

                </button>

                <button
                    class="delete-btn"
                    onclick="deleteTask(${task.id})">

                    Delete

                </button>

            </div>

        `;

        taskList.appendChild(card);

    });

    updateStats();

}

/* ===========================================
   TOGGLE COMPLETE
=========================================== */

function toggleTask(id) {

    tasks = tasks.map(task => {

        if (task.id === id) {

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

/* ===========================================
   DELETE TASK
=========================================== */

function deleteTask(id) {

    const confirmDelete = confirm(
        "Delete this task?"
    );

    if (!confirmDelete) return;

    tasks = tasks.filter(task =>

        task.id !== id

    );

    saveTasks();

    renderTasks();

}

/* ===========================================
   EDIT TASK
=========================================== */

function editTask(id) {

    const task = tasks.find(

        task => task.id === id

    );

    if (!task) return;

    taskInput.value = task.title;

    taskDescription.value = task.description;

    prioritySelect.value = task.priority;

    dueDate.value = task.dueDate;

    editingTaskId = id;

    addTaskBtn.textContent = "Update Task";

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}

/* ===========================================
   SEARCH
=========================================== */

searchInput.addEventListener(

    "input",

    renderTasks

);

/* ===========================================
   FILTER BUTTONS
=========================================== */

document

.querySelectorAll(".menu-btn")

.forEach(button => {

    button.addEventListener(

        "click",

        () => {

            document

            .querySelectorAll(".menu-btn")

            .forEach(btn =>

                btn.classList.remove("active")

            );

            button.classList.add("active");

            currentFilter =

                button.dataset.filter;

            renderTasks();

        }

    );

});
/* ===========================================
   UPDATE STATISTICS
=========================================== */

function updateStats() {

    totalTasks.textContent = tasks.length;

    pendingTasks.textContent = tasks.filter(
        task => !task.completed
    ).length;

    completedTasks.textContent = tasks.filter(
        task => task.completed
    ).length;

    highPriorityTasks.textContent = tasks.filter(
        task => task.priority === "High"
    ).length;

}

/* ===========================================
   ADD TASK BUTTON
=========================================== */

addTaskBtn.addEventListener(

    "click",

    addTask

);

/* ===========================================
   ENTER KEY SUPPORT
=========================================== */

taskInput.addEventListener(

    "keydown",

    function(e){

        if(e.key==="Enter"){

            e.preventDefault();

            addTask();

        }

    }

);

/* ===========================================
   CLEAR COMPLETED TASKS
=========================================== */

function clearCompletedTasks(){

    const completed = tasks.filter(
        task => task.completed
    );

    if(completed.length===0){

        alert("No completed tasks found.");

        return;

    }

    const confirmClear = confirm(
        "Delete all completed tasks?"
    );

    if(!confirmClear){

        return;

    }

    tasks = tasks.filter(

        task => !task.completed

    );

    saveTasks();

    renderTasks();

}

/* ===========================================
   SORT TASKS
=========================================== */

function sortTasks(type){

    switch(type){

        case "newest":

            tasks.sort(

                (a,b)=>b.id-a.id

            );

            break;

        case "oldest":

            tasks.sort(

                (a,b)=>a.id-b.id

            );

            break;

        case "priority":

            const order={

                High:1,

                Medium:2,

                Low:3

            };

            tasks.sort(

                (a,b)=>

                order[a.priority]-order[b.priority]

            );

            break;

        case "duedate":

            tasks.sort(

                (a,b)=>

                new Date(a.dueDate||"9999-12-31")-

                new Date(b.dueDate||"9999-12-31")

            );

            break;

    }

    saveTasks();

    renderTasks();

}

/* ===========================================
   OVERDUE TASK HIGHLIGHT
=========================================== */

function checkOverdue(){

    const today=new Date();

    tasks.forEach(task=>{

        if(

            task.dueDate &&

            !task.completed &&

            new Date(task.dueDate)<today

        ){

            task.overdue=true;

        }

        else{

            task.overdue=false;

        }

    });

}

/* ===========================================
   AUTO SAVE
=========================================== */

window.addEventListener(

    "beforeunload",

    saveTasks

);

/* ===========================================
   INITIALIZE APP
=========================================== */

function initializeApp(){

    updateDate();

    checkOverdue();

    renderTasks();

}

/* ===========================================
   START APPLICATION
=========================================== */

initializeApp();