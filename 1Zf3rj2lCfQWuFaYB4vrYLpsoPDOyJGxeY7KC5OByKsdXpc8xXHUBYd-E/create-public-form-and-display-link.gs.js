// Define the source spreadsheet ID, sheet name, and destination folder ID
const SPREADSHEET_ID = "1-Imie1YgTv4cRGmDTSQWoFgDxiUqmgFfnDLEfFcbCGg";
const SHEET_NAME = "CSV Template";
const DESTINATION_SPREADSHEET_FOLDER_ID = "1ZLZJzQvI1dgeWvGHIcjIFv57uwPOut7Y";

// Function triggered on form submit
function onSubmit(e) {
  const form = FormApp.getActiveForm();
  const newSheet = copySheetWithPublicColumns();
  const spreadsheet = newSheet.getParent();
  makeSpreadsheetPublic(spreadsheet);
  const sheetUrl = spreadsheet.getUrl();
  console.log(sheetUrl);
  const message =
    "Thank you for your submission! The following link will open up a GoogleSheet with a readonly version of the data snapshot. From this sheet you can download the data in any way you need (CSV, XLSX, etc). " +
    sheetUrl;
  form.setConfirmationMessage(message);
}

// Function to copy the sheet with public columns to a new sheet
function copySheetWithPublicColumns() {
  const sheetToCopy =
    SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
  const publicColumns = getPublicColumns(sheetToCopy);
  const newSheet = createNewSheet();
  copyDataToNewSheet(sheetToCopy, newSheet, publicColumns);
  deleteColumnsExcept(newSheet, publicColumns);
  return newSheet;
}

// Function to get the column indices of public columns
function getPublicColumns(sheet) {
  const headers = sheet.getRange(2, 1, 1, sheet.getLastColumn()).getValues()[0];
  const publicColumns = [];
  for (let i = 0; i < headers.length; i++) {
    if (headers[i].startsWith("PUBLIC_")) {
      publicColumns.push(i + 1); // add 1 to account for 0-based indexing
    }
  }
  return publicColumns;
}

// Function to create a new sheet in the destination folder
function createNewSheet() {
  const folder = DriveApp.getFolderById(DESTINATION_SPREADSHEET_FOLDER_ID);
  const newSheetName = createNewSheetName();
  const newSheetFile = SpreadsheetApp.create(newSheetName);
  folder.addFile(DriveApp.getFileById(newSheetFile.getId()));
  const newSheet = newSheetFile.getActiveSheet();
  return newSheet;
}

// Function to copy data from the original sheet to the new sheet
function copyDataToNewSheet(originalSheet, newSheet, publicColumns) {
  const numRows = originalSheet.getLastRow();
  const rangeToCopy = originalSheet.getRange(
    1,
    1,
    numRows,
    publicColumns.length
  );
  const dataToCopy = rangeToCopy.getValues();
  const rangeToPaste = newSheet.getRange(1, 1, numRows, publicColumns.length);
  rangeToPaste.setValues(dataToCopy);
}

// Function to delete columns from the sheet except for the specified column indices
function deleteColumnsExcept(sheet, columnIndices) {
  const numColumns = sheet.getLastColumn();
  for (let i = numColumns; i > 0; i--) {
    if (columnIndices.indexOf(i) === -1) {
      sheet.deleteColumn(i);
    }
  }
  SpreadsheetApp.flush();
}

// Function to make the spreadsheet public with view access
function makeSpreadsheetPublic(spreadsheet) {
  const id = spreadsheet.getId();
  DriveApp.getFileById(id).setSharing(
    DriveApp.Access.ANYONE_WITH_LINK,
    DriveApp.Permission.VIEW
  );
}

// Function to create a new sheet name based on the current date and time
function createNewSheetName() {
  const now = new Date();
  const formattedDate = Utilities.formatDate(
    now,
    "GMT",
    "yyyy-MM-dd'T'HH:mm:ss'Z'"
  );
  const newSheetName = "PositiveBlockchain Data Snapshot - " + formattedDate;
  return newSheetName;
}
