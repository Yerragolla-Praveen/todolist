// ********** SELECT ITEMS **********
const form = document.querySelector(".todo-form");
const alert = document.querySelector(".alert");
const todo = document.querySelector("#todo");
const submitBtn = document.querySelector(".submit-btn");
const container = document.querySelector(".todo-continer");
const list = document.querySelector(".todo-list");
const clearBtn = document.querySelector(".clear-btn");
// ********** Edit ITEMS ********** 
let editFlag = false;
let editID;
let editElement;

// ********** EVENT LISTENERS **********
form.addEventListener("submit",addItem);

clearBtn.addEventListener("click",clearItems);

window.addEventListener("DOMContentLoaded",setupItems);

// ********** FUNCTIONS **********
function addItem(e) {
    e.preventDefault();
    const value = todo.value;
    const id = new Date().getTime().toString();
    if (value !="" && !editFlag) {
        let element = document.createElement("article");
        let attribute = document.createAttribute("data-id");
        attribute.value = id;
        element.setAttributeNode(attribute);
        element.classList.add("todo-item");
        
        element.innerHTML = `
        <p class="title">${value}</p>
        <div class="btn-container">
          <button class="edit-btn">
           <i class='fas fa-edit'></i>
          </button>
          <button class="delete-btn">
           <i class='fas fa-trash'></i>
          </button>
        </div>
        `;
        const editBtn = element.querySelector(".edit-btn");
        editBtn.addEventListener("click",editItem);
        const deleteBtn = element.querySelector(".delete-btn");
        deleteBtn.addEventListener("click",deleteItem);

        list.appendChild(element);
        displayAlert("item added to the list","success");
        container.classList.add("show-container");
        addToLocalStorage(id,value);
    }else if (value !="" && editFlag) {
      editElement.textContent = value;
      displayAlert("item changed","success");
      editFromLocalStorage(editID,value);
    }else {
      displayAlert("please enter a value","danger");
    }
    setBackToDefault();
}

function displayAlert(message,classname) {
  alert.textContent = message;
  alert.classList.add(`alert-${classname}`);
  setTimeout (() => {
    alert.textContent = "";
    alert.classList.remove(`alert-${classname}`)
  },1000);
}

function editItem(e) {
  let element = e.currentTarget.parentElement.parentElement;
  editElement = e.currentTarget.parentElement.previousElementSibling;
  editFlag = true;
  editID = element.dataset.id;
  todo.value = editElement.textContent;
  submitBtn.textContent = "edit";
}

function deleteItem(e) {
  let element = e.currentTarget.parentElement.parentElement;
  list.removeChild(element);
  displayAlert("item removed","danger");

  if (list.children.length === 0) {
    container.classList.remove("show-container");
  }
  removeFromLocalStorage(element.dataset.id);
}

function clearItems() {
  let items = document.querySelectorAll(".todo-item");
  items.forEach((item) => {
    list.removeChild(item);
  });

  displayAlert("empty list","danger");
  container.classList.remove("show-container");
  localStorage.removeItem("list");
}

function setBackToDefault() {
  editFlag = false;
  todo.value = "";
  submitBtn.textContent = "submit";
}
// ********** LOCAL STORAGE **********
function getFromLocalStorage() {
  return localStorage.getItem("list")
  ? JSON.parse(localStorage.getItem("list"))
  : [];

}

function addToLocalStorage(id,value) {
  let items = getFromLocalStorage();
  const todo = {id,value};
  items.push(todo);

  localStorage.setItem("list",JSON.stringify(items));
}

function removeFromLocalStorage(id) {
  let items = getFromLocalStorage();
  items = items.filter((item) => {
    if (item.id != id) {
      return item;
    }
  });
  localStorage.setItem("list",JSON.stringify(items));
}

function editFromLocalStorage(id,value) {
  let items = getFromLocalStorage();
  items = items.map((item) => {
    if (item.id === id) {
      item.value = value;
    }
    return item;
  });
  localStorage.setItem("list",JSON.stringify(items));
}

// ********** SETUP ITEMS **********
function setupItems() {
  let items = getFromLocalStorage();
  items.forEach((item) => {
    setupItem(item.id,item.value);
  });
  container.classList.add("show-container");
}

function setupItem(id,value) {
  let element = document.createElement("article");
  let attribute = document.createAttribute("data-id");
  attribute.value = id;
  element.setAttributeNode(attribute);
  element.classList.add("todo-item");
  
  element.innerHTML = `
  <p class="title">${value}</p>
  <div class="btn-container">
    <button class="edit-btn">
     <i class='fas fa-edit'></i>
    </button>
    <button class="delete-btn">
     <i class='fas fa-trash'></i>
    </button>
  </div>
  `;
  const editBtn = element.querySelector(".edit-btn");
  editBtn.addEventListener("click",editItem);
  const deleteBtn = element.querySelector(".delete-btn");
  deleteBtn.addEventListener("click",deleteItem);

  list.appendChild(element);
}