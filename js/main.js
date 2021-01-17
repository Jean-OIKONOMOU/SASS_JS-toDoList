import toDoItem from "./todoitem.js";
import toDoList from "./todolist.js";

/* TODO: create function to check if user is on phone or pc and then show message about the use of the TAB button. check how I can add that msg to the screen reader too. 
https://flow.ai/blog/check-if-mobile-or-desktop-pc
.PC_INFO
*/

const ToDoList = new toDoList();

/* check if the DOM is fully loaded and ready to be fiddled with*/
document.addEventListener("readystatechange", (event) => {
  if (event.target.readyState === "complete") {
    initApp();
  }
});

const initApp = () => {
  // event listeners

  // procedural
  // load list object from web storage API
  // refresh the page
  refreshThePage();
};

const refreshThePage = () => {
  clearListDisplay();
  renderList();
  clearItemEntryField();
  setFocusOnItemEntry();
};

const clearListDisplay = () => {
  // get the list
  const parentElement = document.getElementById("listItems");
  // fire a function that deletes all children within a parent element
  deleteContents(parentElement);
};

const deleteContents = (parentElement) => {
  let child = parentElement.lastElementChild;
  while (child) {
    parentElement.removeChild(child);
    child = parentElement.lastElementChild;
  }
};

const renderList = () => {
  const list = ToDoList.getList();
  list.forEach((item) => {
    buildListItem(item);
  });
};

const buildListItem = (item) => {
  const div = document.createElement("div");
  div.className = "item";
  const check = document.createElement("input");
  check.type = "checkbox";
  check.id = item.getId();
  check.tabIndex = 0;
  addClickListenerToCheckbox(check);
  const label = document.createElement("label");
  label.htmlFor = item.getId();
  label.textContent = item.getItem();
  div.appendChild(check);
  div.appendChild(label);
  const container = document.getElementById("listItems");
  container.appendChild(div);
};

const addClickListenerToCheckbox = (checkbox) => {
  addClickListenerToCheckbox.addEventListener("click", (event) => {
    toDoList.removeItemFromList(checkbox.id);
    // TODO: remove it from web storage api too !!! 1:13
    setTimeout(() => {
      refreshThePage();
    }, 1000);
  });
};

const clearItemEntryField = () => {
  document.getElementById("newItem").value = "";
};

const setFocusOnItemEntry = () => {
  document.getElementById("newItem").focus();
};
