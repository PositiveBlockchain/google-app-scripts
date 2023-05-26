// Define the source spreadsheet ID and destination folder ID
const SOURCE_SPREADSHEET_ID = "1wUWzUNjxbIuN8BpRRtfQuuM0eHMjKLN_mHM-b9wf9Tk"; // Test sheet
const DESTINATION_DRIVE_FOLDER_ID = "1ZLZJzQvI1dgeWvGHIcjIFv57uwPOut7Y";
const HEADER_ROW = 6;

// Function triggered on form submit
function onBulkUploadFormSubmit(e) {
  // Copy the source spreadsheet to the destination folder
  const sourceSpreadsheet = SpreadsheetApp.openById(SOURCE_SPREADSHEET_ID);
  const sheetName = sourceSpreadsheet.getName();
  const destinationFolder = DriveApp.getFolderById(DESTINATION_DRIVE_FOLDER_ID);
  const newSheetName = createBulkUploadSheetName();
  const destinationSpreadsheet = sourceSpreadsheet.copy(newSheetName);
  destinationFolder.addFile(
    DriveApp.getFileById(destinationSpreadsheet.getId())
  );

  // Make the spreadsheet public, but protect and make read-only all sheets except for the first one
  const spreadsheetFile = DriveApp.getFileById(destinationSpreadsheet.getId());
  spreadsheetFile.setSharing(
    DriveApp.Access.ANYONE_WITH_LINK,
    DriveApp.Permission.EDIT
  );

  removeNonEssentialSheets(destinationSpreadsheet);

  const sheets = destinationSpreadsheet.getSheets();

  // Protect pages
  for (let i = 1; i < sheets.length; i++) {
    const sheet = sheets[i];
    sheet.protect();
    sheet
      .getRange(1, 1, sheet.getMaxRows(), sheet.getMaxColumns())
      .setValues(
        sheet
          .getRange(1, 1, sheet.getMaxRows(), sheet.getMaxColumns())
          .getValues()
      );
    sheet.showSheet();
  }

  // Delete all rows after HEADER_ROW
  const activeSheet = destinationSpreadsheet.getActiveSheet();
  const lastRow = activeSheet.getLastRow();
  if (lastRow > HEADER_ROW) {
    activeSheet.deleteRows(HEADER_ROW + 1, lastRow - HEADER_ROW);
  }

  hideNonPublicColumns(destinationSpreadsheet);

  // Protect all rows from 0 to HEADER_ROW
  const protection = activeSheet
    .getRange(1, 1, HEADER_ROW, activeSheet.getMaxColumns())
    .protect();
  protection
    .getRange()
    .setValues(
      activeSheet
        .getRange(1, 1, HEADER_ROW, activeSheet.getMaxColumns())
        .getValues()
    );
  protection.removeEditors(protection.getEditors());

  // Get the public link to the spreadsheet and include it in the form response
  const publicUrl = spreadsheetFile.getUrl();

  const message =
    "Thank you for your submission! The following link will open up a GoogleSheet where you can create your bulk submission: " +
    publicUrl;
  const form = FormApp.getActiveForm();
  form.setConfirmationMessage(message);

  console.log(publicUrl);
}

// Function to create a new sheet name based on the current date and time
function createBulkUploadSheetName() {
  const now = new Date();
  const formattedDate = Utilities.formatDate(
    now,
    "GMT",
    "yyyy-MM-dd'T'HH:mm:ss'Z'"
  );
  const newSheetName =
    "PositiveBlockchain Bulk Upload Sheet - " + formattedDate;
  return newSheetName;
}

// Function to remove non-essential sheets from the destination spreadsheet
function removeNonEssentialSheets(spreadsheet) {
  const sheets = spreadsheet.getSheets();

  for (let i = 1; i < sheets.length; i++) {
    const sheet = sheets[i];
    if (
      sheet.getName() !== "CSV Template" &&
      sheet.getName() !== "DB frame" &&
      sheet.getName() !== "Data tables" &&
      sheet.getName() !== "regions"
    ) {
      spreadsheet.deleteSheet(sheet);
    } else {
      sheet.protect().setWarningOnly(true);
      sheet
        .getRange(1, 1, sheet.getMaxRows(), sheet.getMaxColumns())
        .setValues(
          sheet
            .getRange(1, 1, sheet.getMaxRows(), sheet.getMaxColumns())
            .getValues()
        );
      sheet.showSheet();
    }
  }
}

// Function to hide columns in the destination spreadsheet that are not prefixed with "PUBLIC_"
function hideNonPublicColumns(spreadsheet) {
  const sheet = spreadsheet.getActiveSheet();
  const row = sheet.getRange(2, 1, 1, sheet.getLastColumn()).getValues()[0];
  for (let i = 0; i < row.length; i++) {
    if (!row[i].toString().startsWith("PUBLIC_")) {
      sheet.hideColumns(i + 1);
    }
  }
}
