"use strict"
let todoList = []; //declares a new array for Your todo list
let namesList = ["Title","Description","Place","Due Date",""];

let initList = function() {
    let savedList = window.localStorage.getItem("todos");
    if (savedList != null)
        todoList = JSON.parse(savedList);
    else
        todoList.push(
        {
            'title': "Learn JS",
            'description': "Create a demo application for my TODO's",
            'place': "445",
            'dueDate': new Date(2019,10,16)
        },
        {
            title: "Lecture test",
            description: "Quick test from the first three lectures",
            place: "F6",
            dueDate: new Date(2019,10,17)
        }
            // of course the lecture test mentioned above will not take place
    );
}

$.ajax({
 // copy Your bin identifier here. It can be obtained in the dashboard
 url: 'https://api.jsonbin.io/b/5da49fa29d04f724cee7dd46/latest',
 type: 'GET',
 headers: { //Required only if you are trying to access a private bin
   'secret-key': "$2b$10$.ekc3fPIZbWgSufj4PKSGOhfaqj7uF.7RwLghfitcK6zWPWVoHPCC"
 },
 success: (data) => {
   //console.log(data);
todoList = data;
 },
 error: (err) => {
   console.log(err.responseJSON);
 }
});

let updateJSONbin = function() {
    $.ajax({
  url: 'https://api.jsonbin.io/b/5da49fa29d04f724cee7dd46',
  type: 'PUT',
  headers: { //Required only if you are trying to access a private bin
    'secret-key': "$2b$10$.ekc3fPIZbWgSufj4PKSGOhfaqj7uF.7RwLghfitcK6zWPWVoHPCC"
  },
  contentType: 'application/json',
  data: JSON.stringify(todoList),
  success: (data) => {
    console.log(data);
  },
  error: (err) => {
    console.log(err.responseJSON);
  }
});}




let updateTodoList = function() {

    // let table = document.querySelector("table");
    let table = $("table")[0];

    //remove all elements
    while (table.firstChild) {
         table.removeChild(table.firstChild);
    }

    let thead = table.createTHead();      
    let row = thead.insertRow();

     // let thead=jQuery("<thead></thead>").appendTo(table);
     // let row=jQuery("<tr></tr>").appendTo(thead);
    
    
    for (let column in namesList){
        let th = document.createElement("th");
        let text = document.createTextNode(namesList[column]);
        th.appendChild(text);
        row.appendChild(th);
        // let th = $("<th></th>").text(namesList[column])[0];
        // row.append(th);
    }
     // let att = document.createAttribute("class");
     // att.value = "thead-dark";
     // thead.setAttributeNode(att);
    thead.attr("class", "thead-dark");

    let tbody = table.createTBody();
    // let tbody =jQuery("<tbody></tbody>").appendTo(table);
    let filterInput = $("#inputSearch")[0];
    let dateFilter1 = $("#inputSearchDate1")[0];
    let dateFilter2 = $("#inputSearchDate2")[0];
    // let filterInput = document.getElementById("inputSearch");
    // let dateFilter1 = document.getElementById("inputSearchDate1");
    // let dateFilter2 = document.getElementById("inputSearchDate2"); 
    
    for (let todo in todoList) {
        if (
            (filterInput.value == "") ||
            (todoList[todo].title.includes(filterInput.value)) ||
            (todoList[todo].description.includes(filterInput.value))
        ){
            if((dateFilter1.value == "" ||  dateFilter2.value == "" ) || (todoList[todo].dueDate >= dateFilter1.value && todoList[todo].dueDate <= dateFilter2.value)) {
                let row = tbody.insertRow();
                for(let key in todoList[todo]){
                    let cell = row.insertCell();
                    let text = document.createTextNode(todoList[todo][key]);
                    cell.appendChild(text);
                    att=document.createAttribute("class");
                    att.value = "border";
                    cell.setAttributeNode(att);
                }
                let newDeleteButton1 = document.createElement("input");
                newDeleteButton1.type = "button";
                newDeleteButton1.value = "x";
                newDeleteButton1.addEventListener("click",
                function() {
                    deleteTodo(todo);
                });
                let cell = row.insertCell();
                let text = document.createTextNode(newDeleteButton1.value);
                cell.appendChild(newDeleteButton1);
                att=document.createAttribute("class");
                att.value = "border btn btn-outline-dark";
                cell.setAttributeNode(att);
            }
        }
    }
}

setInterval(updateTodoList, 1000);

let deleteTodo = function(index) {
    todoList.splice(index,1);
    updateJSONbin();
}

let addTodo = function() {
  // get the elements in the form

    // let inputTitle = document.getElementById("inputTitle");
    // let inputDescription = document.getElementById("inputDescription");
    // let inputPlace = document.getElementById("inputPlace");
    // let inputDate = document.getElementById("inputDate");
    let inputTitle = $("#inputTitle")[0];
    let inputDescription = $("#inputDescription")[0];
    let inputPlace = $("#inputPlace")[0];
    let inputDate = $("#inputDate")[0];
  //get the values from the form
    let newTitle = inputTitle.value;
    let newDescription = inputDescription.value;
    let newPlace = inputPlace.value;
    let newDate = new Date(inputDate.value);
  //create new item
    let newTodo = {
        title: newTitle,
        description: newDescription,
        place: newPlace,
        dueDate: newDate
    };
  //add item to the list
    todoList.push(newTodo);

    window.localStorage.setItem("todos", JSON.stringify(todoList));
    updateJSONbin();
    
    inputTitle.value="";
    inputDescription.value="";
    inputPlace.value="";
    inputDate.value="";
    
}
