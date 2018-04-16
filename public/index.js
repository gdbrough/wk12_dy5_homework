var characters = null;

const makeRequest = function(url, callback){
  const request = new XMLHttpRequest();
  request.open("GET", url);
  request.addEventListener("load", callback);
  request.send();
};

const requestComplete = function(){
  if (this.status !== 200) return;
  const jsonString = this.responseText;
  characters = JSON.parse(jsonString);
  populateList(characters);
  google.charts.setOnLoadCallback(drawChart);
};

const populateList = function(characters){
  const select = document.getElementById("characters-select");
  select.onchange = displayCharacter;

  let option = document.createElement("option");
  option.value = "select";
  option.innerText = "Select a Character";
  select.appendChild(option);
  for (let index in characters){
    let option = document.createElement("option");
    option.value = index;
    option.innerText = characters[index].name;
    select.appendChild(option);
  };
};

const displayCharacter = function(event){
  const ul = document.getElementById("character-display");
  while(ul.firstChild){
    ul.removeChild(ul.firstChild);
  }
  if (this.value === "select"){
    return;
  };
  let pic = document.createElement("li");
  pic.innerHTML = "<br /><img id=\"portrait\" src=\"" + characters[this.value].image + "\">";
  ul.appendChild(pic);
  if (characters[this.value].hogwartsStudent){
    staffOrStudent = " (Student) ";
  } else if (characters[this.value].hogwartsStaff){
    staffOrStudent = " (Staff) ";
  } else {
    staffOrStudent = "";
  };
  let name = document.createElement("li");
  if(characters[this.value].alive){
    name.innerText = characters[this.value].name + staffOrStudent;
  } else {
    name.innerText = "The late " + characters[this.value].name + staffOrStudent;
  }
  ul.appendChild(name);
  for (dataType in characters[this.value]){
    // console.log(dataType);
    if(dataType !== "name" && dataType !== "image" && dataType !== "alive" && dataType !== "hogwartsStudent" && dataType !== "hogwartsStaff"){
      if (dataType === "wand"){
        let wand = document.createElement("li");
        if (characters[this.value].wand.wood === ""){
          wand.innerText = "Wand: None"
        } else {
          wand.innerText = "Wand: " + characters[this.value].wand.length +
            " inch " + characters[this.value].wand.wood +
            " with " + characters[this.value].wand.core + " core";
        };
        ul.appendChild(wand);
      } else {
        let element = dataType;
        element = document.createElement("li");
        let outputText = eval("characters[this.value]." + dataType);
        if (outputText === ""){
          outputText = "unknown";
        };
        if(typeof outputText == "string"){
          element.innerText = capitalise(dataType) + ": " + capitalise(outputText);
        } else {
          element.innerText = capitalise(dataType) + ": " + outputText;
        };
        ul.appendChild(element);
      };
    };
  };
};

function capitalise(str) {
return str
    .toLowerCase()
    .split(' ')
    .map(function(word) {
        return word[0].toUpperCase() + word.substr(1);
    })
    .join(' ');
 }

const app = function(){
    // const url = "https://swapi.co/api/people";
    const url = "http://hp-api.herokuapp.com/api/characters";
    makeRequest(url, requestComplete);
}


// Load the Visualization API and the corechart package.
google.charts.load('current', {'packages':['corechart']});

// Set a callback to run when the Google Visualization API is loaded.
google.charts.setOnLoadCallback(drawChart);

// Callback that creates and populates a data table,
// instantiates the pie chart, passes in the data and
// draws it.
function drawChart() {
  console.log("characters: ", this.characters);
  let staff = 0;
  let student = 0;
  let neither = 0
  for (character of characters){
    if (character.hogwartsStudent){
      student += 1;
    } else if (character.hogwartsStaff){
      staff += 1;
    } else {
      neither += 1
    };
  }
  console.log("staff", staff, "student", student, "neither", neither);

  // function foo(arr) {
  //     var a = [], b = [], prev;
  //
  //     arr.sort();
  //     for ( var i = 0; i < arr.length; i++ ) {
  //         if ( arr[i] !== prev ) {
  //             a.push(arr[i]);
  //             b.push(1);
  //         } else {
  //             b[b.length-1]++;
  //         }
  //         prev = arr[i];
  //     }
  //
  //     return [a, b];
  // }



// Create the data table.
  var data = new google.visualization.DataTable();
  data.addColumn('string', 'Topping');
  data.addColumn('number', 'Slices');
  data.addRows([
    ['Students', student],
    ['Staff', staff],
    ['Neither', neither]
  ]);

// Set chart options
  var options = {'title':"Who's at Hogwarts",
                 'width':400,
                 'height':300};

// Instantiate and draw our chart, passing in some options.
  var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
  chart.draw(data, options);
}






window.addEventListener('load', app);
