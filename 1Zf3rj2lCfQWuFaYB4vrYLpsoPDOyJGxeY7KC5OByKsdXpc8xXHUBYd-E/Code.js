// const CSV_FOLDER_ID = "1tMmVWWxe_ZREIRkw9AaQWawe1vE35VTf";
// const SPREADSHEET_ID = "1r8Nts5qtXau_-17mF1PE6HvyFrs8in98_1VVKg8QLAs";
// const SHEET_NAME = "Copy of CSV Template";

function onFormSubmit() {
  onSubmit();
//   const file = makeCsvFile();
//   makeFilePublic(file);
//   const downloadURL = file.getDownloadUrl().slice(0, -8);
//   console.log(downloadURL);
}

// function makeCsvFile() {
//   // Build csv string
//   const values = getSheetValues();
//   const csvString = convertValuesToCsvString(values);

//   // Create file
//   const timestamp = Date.now();
//   const fileName = `pb_database_download-${timestamp}.csv`;
//   const folder = DriveApp.getFolderById(CSV_FOLDER_ID);
//   const file = folder.createFile(fileName, csvString);
//   return file;
// }

// function getSheetValues() {
//   return Sheets.Spreadsheets.Values.get(SPREADSHEET_ID, SHEET_NAME).values
// }

// function convertValuesToCsvString(data) {
//   try {
//     if (data.length > 1) {
//       var rows = [];
//       data.forEach(row => {
//         var cols = [];
//         row.forEach(col => {
//           cols.push(`"${col.replace(/"/g, '""')}"`);
//         });

//         rows.push(cols.join(','));
//       });
      
//       return rows.join('\n');
//     }
//   } catch(err) {
//     Logger.log(err);
//     Browser.msgBox(err);
//   }
// }

// function makeFilePublic(file) {
//   const id = file.getId();
//   DriveApp.getFileById(id).setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
// }