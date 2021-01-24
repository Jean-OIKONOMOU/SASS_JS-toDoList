import ToDoItem from "./todoitem.js";
import ToDoList from "./todolist.js";

/* TODO: create function to check if user is on phone or pc and then show message about the use of the TAB button. check how I can add that msg to the screen reader too. 
https://flow.ai/blog/check-if-mobile-or-desktop-pc
.PC_INFO
*/

const toDoList = new ToDoList();

/* check if the DOM is fully loaded and ready to be fiddled with*/
document.addEventListener("readystatechange", (event) => {
  if (event.target.readyState === "complete") {
    // TODO: read aloud the way to navigate in the app.
    initApp();
  }
});

const initApp = () => {
  // event listeners
  const itemEntryForm = document.getElementById("itemEntryForm");
  itemEntryForm.addEventListener("submit", (event) => {
    event.preventDefault();
    processSubmission();
  });
  const clearItems = document.getElementById("clearItems");
  clearItems.addEventListener("click", (event) => {
    const list = toDoList.getList();
    if (list.length) {
      const confirmed = confirm("Are you sure you want to delete everything ?");
      if (confirmed) {
        fadeOutAnimationForAll("listItems");
        setTimeout(() => {
          toDoList.clearList();
          updatePersistentData(toDoList.getList());
          refreshThePage();
        }, 500);
      }
    }
  });
  // procedural
  loadPersistentData();
  refreshThePage();
};

const loadPersistentData = () => {
  const storedList = localStorage.getItem("myToDoList");
  if (typeof storedList !== "string") return;
  const parsedList = JSON.parse(storedList);
  parsedList.forEach((itemObj) => {
    let newToDoItem = createNewItem(itemObj._id, itemObj._item);
    toDoList.addItemToList(newToDoItem);
  });
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
  const list = toDoList.getList();
  // log(list);
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
  checkbox.addEventListener("click", (event) => {
    toDoList.removeItemFromList(checkbox.id);
    updatePersistentData(toDoList.getList());
    const removedText = getLabelText(checkbox.id);
    fadeOutAnimation(checkbox.id);
    updateScreenReaderConfirmation(removedText, "removed from list");
    setTimeout(() => {
      refreshThePage();
    }, 500);
  });
};

const getLabelText = (checkboxId) => {
  return document.getElementById(checkboxId).nextElementSibling.textContent;
};

const updatePersistentData = (listArray) => {
  localStorage.setItem("myToDoList", JSON.stringify(listArray));
};

const clearItemEntryField = () => {
  document.getElementById("newItem").value = "";
};

const setFocusOnItemEntry = () => {
  document.getElementById("newItem").focus();
};

const processSubmission = () => {
  const newEntryText = getNewEntry();
  if (!newEntryText.length) return;
  const nextItemId = calcNextItemId();
  const toDoItem = createNewItem(nextItemId, newEntryText);
  toDoList.addItemToList(toDoItem);
  updatePersistentData(toDoList.getList());
  updateScreenReaderConfirmation(newEntryText, "added");
  refreshThePage();
};

const getNewEntry = () => {
  return document.getElementById("newItem").value.trim();
};

const calcNextItemId = () => {
  let nextItemId = 1;
  const list = toDoList.getList();
  if (list.length > 0) {
    nextItemId = list[list.length - 1].getId() + 1;
  }
  return nextItemId;
};

const createNewItem = (itemId, itemText) => {
  const toDo = new ToDoItem();
  toDo.setId(itemId);
  toDo.setItem(itemText);
  return toDo;
};

const log = (obj) => {
  console.log(obj);
};

const fadeOutAnimation = (id) => {
  let element = document.getElementById(id);
  element.parentElement.classList.add("deleteItem");
  // console.log(element);
};

const fadeOutAnimationForAll = (id) => {
  let children = document.getElementById(id).children;
  for (let child of children) {
    child.classList.add("deleteItem");
  }
};

const updateScreenReaderConfirmation = (newEntryText, actionVerb) => {
  document.getElementById(
    "confirmation"
  ).textContent = `${newEntryText} ${actionVerb}.`;
};
