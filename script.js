// ============= Setup Enviroment ====================//

const container = document.querySelector(".container");
const CANVAS_WIDTH = container.clientWidth;
const CANVAS_HEIGHT = container.clientHeight;
let CELL_SIZE = 25;
const grid = document.querySelector(".container");

let numRows = Math.ceil(CANVAS_HEIGHT / CELL_SIZE);
let numCols = Math.ceil(CANVAS_WIDTH / CELL_SIZE);
let color = "black"; // Default Color Mode

// Button Toggles
let hoverModeEnabled = false;
let rainbowModeEnabled = false;
let eraseModeEnabled = false;
let gridLinesEnabled = true;
let uploadButtonClickable = true;

// =============== Helper Functions ===============//

function generateRandomString(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}


// ============= Generating The Grid ================== //

for (let i = 0; i < numRows; i++) {
  const row = document.createElement("div");
  row.setAttribute("class", "row"); // adding rows
  grid.appendChild(row);
  for (let j = 0; j < numCols; j++) {
    const cell = document.createElement("div"); // for each row create a cell and add it.
    cell.setAttribute("class", "cell");
    if(j === 0){  
      cell.style.borderLeft = "0px"
    }
    row.appendChild(cell);
  }
}

// =================== Event Listerners handling =============== // 

const cells = document.querySelectorAll(".cell"); // selecting all cells
let mouseDown = false; // boolean for controlling the holding mouse button effect

document.addEventListener('mousedown', () => {
  mouseDown = true;
});

document.addEventListener('mouseup', () => {
  mouseDown = false;
});

// This event listner is responsible for enabling the painting as long as the mouse button is clicked
document.addEventListener('mousemove', (event) => { 
  if (mouseDown) {
    const cell = event.target;
    if (cell.classList.contains('cell')) { 
      if (eraseModeEnabled) {
        cell.style.backgroundColor = "#ececec"; 
      } else {
        cell.style.backgroundColor = rainbowModeEnabled ? getRandomColor() : color;
      }
      cell.style.transition = "0.5s";
    }
  }
});

// This event listener handles single mouse clicks
cells.forEach(cell => {
  cell.addEventListener('mousedown', () => {
    
    if (eraseModeEnabled) {
      cell.style.backgroundColor = "#ececec"; 
    } else {
      cell.style.backgroundColor = rainbowModeEnabled ? getRandomColor() : color;
    }
    cell.style.transition = "0.5s";
  });

});

// This one handles button and styling
const buttons = document.querySelectorAll("button");
buttons.forEach(button => {
  let buttonClicked = false;
  button.addEventListener('click', () => {
    buttonClicked = !buttonClicked;
    if (buttonClicked) {
      button.style.backgroundColor = "white";
      button.style.color = "black";
    } else {
      button.style.backgroundColor = ""; 
      button.style.color = ""; 
    }
  });
});


// Event listener for color picker
document.addEventListener("DOMContentLoaded", function() {
  const colorPicker = document.getElementById("color-picker");

  colorPicker.addEventListener("input", function(event) {
    const selectedColor = event.target.value;
    console.log("Selected color:", selectedColor);
    color = selectedColor;

  });
});


// ========== Basic Toggles Handling =============== //

let hoverEventListener = null;

function ToggleRainbow() {
  rainbowModeEnabled = !rainbowModeEnabled;
}

function ToggleGrid() {
  gridLinesEnabled = !gridLinesEnabled;
  const cells = document.querySelectorAll(".cell");
  cells.forEach(cell => {
    cell.style.border = gridLinesEnabled ? "1px solid #ccc" : "none";
  });
}

function ToggleErase() {
  eraseModeEnabled = !eraseModeEnabled;
}

function resetCanvas(){
  cells.forEach(cell => {
    cell.style.backgroundColor = "#ececec";
  });
}

function ToggleHover() {
  hoverModeEnabled = !hoverModeEnabled;
  console.log(hoverModeEnabled);
  
  if (hoverModeEnabled) { // Event listner for the hovering effect
    hoverEventListener = (event) => {
      const cell = event.target;
      if (eraseModeEnabled) {
        cell.style.backgroundColor = "#e2e2e2"; 
      } else {
        cell.style.backgroundColor = rainbowModeEnabled ? getRandomColor() : color;
      }
      cell.style.transition = "0.5s";
    };
    cells.forEach(cell => {
      cell.addEventListener('mouseover', hoverEventListener);
    });
  } else {
    cells.forEach(cell => {
      cell.removeEventListener('mouseover', hoverEventListener);
    });
  }
}

// =================== Firebase and Gallery Section =============//


// This function transfrom the grid values to canvas image
function convertGridToImage() {
  const canvas = document.createElement("canvas");
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
  const ctx = canvas.getContext("2d");
// loop through each cell index and convert it to (x,y),color
  cells.forEach((cell, index) => {
    const row = Math.floor(index / numCols); 
    const col = index % numCols; 
    const x = col * CELL_SIZE; 
    const y = row * CELL_SIZE; 
    const color = cell.style.backgroundColor;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);
  });

  // create the DataURL so we can later pass it to firebase
  const imageDataUrl = canvas.toDataURL();
  console.log(imageDataUrl);
  return imageDataUrl;

}

// Fuction for sending the DataURL to the storage in firebase 
function uploadImageToFirebase(imageDataUrl) {
  const storageRef = firebase.storage().ref(); // get a refernce to the storage

  const imageName = `image_${Date.now()}_${generateRandomString(5)}.png`; // generate a random image name for it

  const imageRef = storageRef.child(imageName); // make a reference in the tree

  // Upload the image data
  imageRef.putString(imageDataUrl, "data_url").then(snapshot => {
    console.log("Image uploaded to Firebase!");
    document.querySelector(".upload-status").innerHTML="Image Uploaded Successfully!";
    setTimeout(function() {
    document.querySelector(".upload-status").innerHTML="";
    uploadButtonClickable = true;
    }, 10000);
  }).catch(error => {
    document.querySelector(".upload-status").innerHTML="oops, some error has occured!";
    document.querySelector(".upload-status").style.color="red";
    console.error("Error uploading image to Firebase:", error);
  });

}

// Function to handle image upload process
function handleImageUpload() {
  if (uploadButtonClickable){
    uploadButtonClickable = false;
  document.querySelector(".upload-status").innerHTML="Uploading Images, Please wait";
  const imageDataUrl = convertGridToImage();
  uploadImageToFirebase(imageDataUrl);}else{
  document.querySelector(".upload-status").innerHTML="Please Wait before uploading again!";

  }
}

// Function to retrieve image URLs from Firebase Storage
function retrieveImageUrls() {
  const storageRef = firebase.storage().ref(); // again, get a reference

  storageRef.listAll().then(function(result) { 
    result.items.forEach(function(itemRef) {
      itemRef.getDownloadURL().then(function(url) { // get a url for these images
        displayImage(url); 
      }).catch(function(error) {
        console.error("Error getting download URL:", error);
      });
    });
  }).catch(function(error) {
    console.error("Error listing items in storage:", error);
  });
}

function displayImage(url) { // adding the image to DOM
  const img = document.createElement('img');
  img.src = url;
  img.alt = "Image";

  document.querySelector(".gallery").appendChild(img);
}

