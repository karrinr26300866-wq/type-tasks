import { addTask, advanceTask, deleteTask, filterByStatus } from "./model.js";
// Global state holding tasks and the current active filter
let tasks = [];
let activeFilter = "all";
// Type assertions to strictly type element access without using 'any'
const titleInput = document.getElementById("title");
const addBtn = document.getElementById("add");
const listEl = document.getElementById("list");
const summaryEl = document.getElementById("summary");
const chipBtns = document.querySelectorAll(".chip");
/**
 * Renders the task list and summary based on the current active filter
 */
function render() {
    // Clear existing list items
    listEl.innerHTML = "";
    // Apply filtering based on selected filter status
    const filteredTasks = activeFilter === "all"
        ? tasks
        : filterByStatus(tasks, activeFilter);
    // Build task elements
    filteredTasks.forEach((task) => {
        const li = document.createElement("li");
        li.className = "task-item";
        // Task inner markup
        li.innerHTML = `
      <div class="task-content">
        <span class="badge ${task.status}">${task.status}</span>
        <span class="task-title ${task.status === "done" ? "done" : ""}">${task.title}</span>
      </div>
      <div class="actions">
        ${task.status !== "done"
            ? `<button class="btn-action btn-advance" data-id="${task.id}">advance →</button>`
            : ""}
        <button class="btn-action btn-delete" data-id="${task.id}">✕</button>
      </div>
    `;
        // Attach click listener for advance button
        const advanceBtn = li.querySelector(".btn-advance");
        if (advanceBtn) {
            advanceBtn.onclick = () => {
                tasks = advanceTask(tasks, task.id);
                render();
            };
        }
        // Attach click listener for delete button
        const deleteBtn = li.querySelector(".btn-delete");
        deleteBtn.onclick = () => {
            tasks = deleteTask(tasks, task.id);
            render();
        };
        listEl.appendChild(li);
    });
    // Render status breakdown summary
    const todoCount = filterByStatus(tasks, "todo").length;
    const inProgressCount = filterByStatus(tasks, "in-progress").length;
    const doneCount = filterByStatus(tasks, "done").length;
    summaryEl.textContent = `${todoCount} to do · ${inProgressCount} in progress · ${doneCount} done`;
}
/**
 * Handle adding a new task from input
 */
function handleAddTask() {
    const title = titleInput.value.trim();
    if (!title)
        return;
    tasks = addTask(tasks, title);
    titleInput.value = "";
    render();
}
// Add task on button click
addBtn.onclick = handleAddTask;
// Add task on "Enter" keypress inside input field
titleInput.onkeydown = (e) => {
    if (e.key === "Enter") {
        handleAddTask();
    }
};
// Set up filter chip click handlers
chipBtns.forEach((btn) => {
    btn.onclick = () => {
        // Remove active state from all chips
        chipBtns.forEach((c) => c.classList.remove("active"));
        btn.classList.add("active");
        // Read status from dataset attribute
        const status = btn.getAttribute("data-status");
        activeFilter = status;
        render();
    };
});
// Initial render call
render();
