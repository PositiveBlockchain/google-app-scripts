const SPREADSHEET_ID = "1-Imie1YgTv4cRGmDTSQWoFgDxiUqmgFfnDLEfFcbCGg";
const SHEET_NAME = "CSV Template";
const DESTINATION_SPREADSHEET_FOLDER_ID = "1ZLZJzQvI1dgeWvGHIcjIFv57uwPOut7Y";


function onSubmit(e) {
  const form = FormApp.getActiveForm();
  const newSheet = copySheetWithPublicColumns();
  const spreadsheet = newSheet.getParent();
  makeSpreadsheetPublic(spreadsheet);
  // Delete the first 5 rows, as they are for internal use only and not meant for the public
  spreadsheet.deleteRows(1, 5);
  const sheetUrl = spreadsheet.getUrl();
  SpreadsheetApp.flush();
  console.log(sheetUrl);
  const message = 'Thank you for your submission! The following link will open up a GoogleSheet with a readonly version of the data snapshot. From this sheet you can download the data in any way you need (CSV, XLSX, etc). ' + sheetUrl;
  form.setConfirmationMessage(message);
}

function copySheetWithPublicColumns() {
  const sheetToCopy = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
  const publicColumns = getPublicColumns(sheetToCopy);
  const newSheet = createNewSheet(publicColumns);
  copyDataToNewSheet(sheetToCopy, newSheet, publicColumns);
  deleteColumnsExcept(newSheet, publicColumns);
  return newSheet;
}

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

function createNewSheet() {
  const folder = DriveApp.getFolderById(DESTINATION_SPREADSHEET_FOLDER_ID);
  const newSheetName = createNewSheetName();
  const newSheetFile = SpreadsheetApp.create(newSheetName);
  folder.addFile(DriveApp.getFileById(newSheetFile.getId()));
  const newSheet = newSheetFile.getActiveSheet();
  return newSheet;
}

function copyDataToNewSheet(originalSheet, newSheet, publicColumns) {
  const numRows = originalSheet.getLastRow();
  const rangeToCopy = originalSheet.getRange(1, 1, numRows, publicColumns.length);
  const dataToCopy = rangeToCopy.getValues();
  const rangeToPaste = newSheet.getRange(1, 1, numRows, publicColumns.length);
  rangeToPaste.setValues(dataToCopy);
}

function deleteColumnsExcept(sheet, columnIndices) {
  const numColumns = sheet.getLastColumn();
  for (let i = numColumns; i > 0; i--) {
    if (columnIndices.indexOf(i) === -1) {
      sheet.deleteColumn(i);
    }
  }
  SpreadsheetApp.flush();
}

function makeSpreadsheetPublic(spreadsheet) {
  const id = spreadsheet.getId();
  DriveApp.getFileById(id).setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
}

function createNewSheetName() {
  const now = new Date();
  const formattedDate = Utilities.formatDate(now, "GMT", "yyyy-MM-dd'T'HH:mm:ss'Z'");
  const newSheetName = "PositiveBlockchain Data Snapshot - " + formattedDate;
  return newSheetName;
}