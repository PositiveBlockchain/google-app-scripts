# Google Apps Script Management with `clasp`

This project demonstrates how to manage your Google Apps Script projects using `clasp`, a command-line tool provided by Google. `clasp` allows you to develop, manage, and deploy your Google Apps Script projects using modern development workflows.

## Prerequisites

Before using this project, ensure you have the following prerequisites installed on your machine:

- [Node.js](https://nodejs.org) (version 12 or above)
- [Yarn](https://yarnpkg.com) or [npm](https://www.npmjs.com) package manager
- [clasp](https://github.com/google/clasp)
- [jq](https://stedolan.github.io/jq/)

## Getting Started

1. Clone this repository to your local machine.

   ```bash
   git clone <repository-url>
   ```

2. Install the project dependencies.

   ```bash
   cd <project-folder>
   yarn install
   ```

3. Configure `clasp` with your Google account.

   ```bash
   yarn clasp login
   ```

**NOTE**
You will need to enable the script API:
https://script.google.com/home/usersettings

## Editing projects

Each project is named by its ScriptId (see the [clone section](https://developers.google.com/apps-script/guides/clasp#clone_an_existing_project) to find the script id.)

You will need to go into a specific project directory to edit and run clasp commands. Remember to use `yarn clasp` if you don't have clasp installed globally.

## Adding new projects

Simply use the helper script to add a new project:

`sh scripts/clone_project.sh`

or

`yarn init_project`

## Additional Resources

- [clasp documentation](https://developers.google.com/apps-script/guides/clasp)

For more detailed information on using `clasp` to manage your Google Apps Script projects, refer to the official [clasp documentation](https://developers.google.com/apps-script/guides/clasp).

## Contributing

Contributions are welcome! If you encounter any issues or have suggestions for improvements, please feel free to submit a pull request or open an issue on the GitHub repository.
