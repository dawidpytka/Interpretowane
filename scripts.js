"use strict"
let todoList = [];
let namesList = ["Title","Description","Place","Due Date",""];

$.ajax({

 url: 'https://api.jsonbin.io/b/5da49fa29d04f724cee7dd46/latest',
 type: 'GET',
 headers: { 
   'secret-key': "$2b$10$.ekc3fPIZbWgSufj4PKSGOhfaqj7uF.7RwLghfitcK6zWPWVoHPCC"
 },
 success: (data) => {
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
  headers: { 
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

    let table = $("table")[0];

    while (table.firstChild) {
         table.removeChild(table.firstChild);
    }

     let thead=jQuery("<thead></thead>").appendTo(table);
     let row=jQuery("<tr></tr>").appendTo(thead);
    
    
    for (let column in namesList){
        let th = $("<th></th>").text(namesList[column]);
        row.append(th);
    }
    thead.attr("class","thead thead-dark");

    let tbody =jQuery("<tbody></tbody>").appendTo(table);
    let filterInput = $("#inputSearch")[0];
    let dateFilter1 = $("#inputSearchDate1")[0];
    let dateFilter2 = $("#inputSearchDate2")[0];
    
    for (let todo in todoList) {
        if (
            (filterInput.value == "") ||
            (todoList[todo].title.includes(filterInput.value)) ||
            (todoList[todo].description.includes(filterInput.value))
        ){
            if((dateFilter1.value == "" ||  dateFilter2.value == "" ) || (todoList[todo].dueDate >= dateFilter1.value && todoList[todo].dueDate <= dateFilter2.value)) {
                let row=jQuery("<tr></tr>").appendTo(tbody);
                for(let key in todoList[todo]){
                    let td = $("<td></td>").text(todoList[todo][key]);
                    row.append(td);
                    td.attr("class","border");
                }
                let td = $('<input></input>').attr({'type': 'button'}).val("x").click(function() {
                    deleteTodo(todo);
                });

                td.attr("class","btn btn-dark");
                row.append(td);
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

    let inputTitle = $("#inputTitle")[0];
    let inputDescription = $("#inputDescription")[0];
    let inputPlace = $("#inputPlace")[0];
    let inputDate = $("#inputDate")[0];

    let newTitle = inputTitle.value;
    let newDescription = inputDescription.value;
    let newPlace = inputPlace.value;
    let newDate = new Date(inputDate.value);

    let newTodo = {
        title: newTitle,
        description: newDescription,
        place: newPlace,
        dueDate: newDate
    };

    todoList.push(newTodo);

    window.localStorage.setItem("todos", JSON.stringify(todoList));
    updateJSONbin();
    
    inputTitle.value="";
    inputDescription.value="";
    inputPlace.value="";
    inputDate.value="";
    
}
