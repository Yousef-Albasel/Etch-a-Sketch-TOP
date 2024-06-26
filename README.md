# Etch-a-Sketch-TOP

Etch-a-Sketch-TOP is a fun web application built using Flexbox and JavaScript DOM manipulation. It allows users to create colorful drawings on a grid canvas. Additionally, it features integration with Firebase for image storage and retrieval, enhancing the overall experience.

## Setup Environment

Ensure that the following setup steps are completed to properly configure the environment:

1. Select the `.container` element to define the canvas dimensions.
2. Set the `CELL_SIZE` variable to determine the size of each grid cell.
3. Customize the `color` variable to set the default drawing color.

## Helper Functions

These helper functions aid in various functionalities of the application:

- `generateRandomString(length)`: Generates a random alphanumeric string of the specified length.
- `getRandomColor()`: Generates a random hex color code.

## Generating The Grid

The grid is dynamically generated based on the canvas dimensions and cell size. Each cell is represented by a `div` element with the class `cell`.

## Event Listeners Handling

- Mouse events (`mousedown`, `mouseup`, `mousemove`) are utilized for drawing functionality.
- Button clicks toggle various modes and styles, such as rainbow mode, erase mode, and grid lines visibility.
- Color picker input event updates the drawing color.

## Basic Toggles Handling

Functions for toggling rainbow mode, grid lines, erase mode, and hover mode are provided. These toggles enable/disable specific features of the application.

## Firebase and Gallery Section

Integration with Firebase allows users to upload and retrieve drawings from the storage. Key functions include:

- `convertGridToImage()`: Converts the grid data to a canvas image.
- `uploadImageToFirebase(imageDataUrl)`: Uploads the image data to Firebase storage.
- `handleImageUpload()`: Handles the process of uploading images to Firebase.
- `retrieveImageUrls()`: Retrieves image URLs from Firebase storage.
- `displayImage(url)`: Displays images in the gallery section of the application.

Ensure Firebase is properly configured and authenticated for seamless image storage and retrieval.

