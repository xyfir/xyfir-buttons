Take control of the web with floating buttons.

Most documentation can be found in [Xyfir's documentation repo](https://github.com/Xyfir/Documentation).

# Xyfir Buttons

Xyfir Buttons (xyButtons) is a new type of userscript system like Greasemonkey or Tampermonkey that while similar to other extensions has a few notable differences. One of the main differences is whereas extensions like Greasemonkey keep installed scripts hidden away in a special browser menu where you can enable or disable the scripts, xyButtons puts the scripts where you can see them: on the page itself, in the form of floating buttons. Each script has its own button that is rendered onto the page where it can listen to events on the button as well as have full access to the page it is injected into. Buttons are grouped into 'presets' that control the placement of the buttons on the page among other things. Both buttons and presets have 'url match expressions' that determine whether a preset or its buttons will be rendered to a page.

xyButtons also has its own button and presets repository that allows users to easily find and share buttons and presets with other users.

**Will xyButtons work with my existing userscript(s)?** xyButtons has a 'Convert from Userscript' option in the 'Create Button' section which *might* be able to convert your userscript to a button automatically, even if it depends on some variables given via `@grant`. xyButtons will ignore the userscript metadata comment block anywhere outside of the converter. *This extension is not intended to be a complete replacement for other userscript systems.* Most existing userscripts are probably better suited for the systems they were built for originally.

# Contributing

## Building the Client

As of now, the build scripts in `package.json` are written for Windows. Either use Windows to build the xyButtons client or take a few minutes to rewrite them. Feel free to make a pull request with the updated versions (alongside the Windows commands).

Before running any of the build scripts, you must first be sure you have the installed (`npm install`), and also that you setup the config file. Create a copy of the file `./constants/config.default.js` within the folder, rename that copy to `config.js`, and then fill in the appropriate values.

All build scripts are run with `npm run <script_name>`. Available scripts are:

- `build:js`: Runs webpack. Builds app.js, content-script.js, inject.js, and background.js.
- `build:app-css`: Converts the SCSS for the app (app.scss) to a single css file (app.css).
- `build:inject-css`: Converts the SCSS for the styling injected into each page (inject.scss) to a single css file (inject.css).
- `build:css`: Runs both the css scripts at once.
- `build:extension`: Wipes the `./build` folder, copies `./res` and `./main` to the build folder, and runs `build:js` and `build:css`.
- `zip`: Zips up everything in the build folder into a single zip file and puts that zip file in the build folder.

## Guidelines

Any code contributions must follow these guidelines to be considered for acceptance:

- Use `'` instead of `"` where possible.
- Use two space tabs.
- Keep lines at or under 80 characters long.
- Use promises over callbacks if possible.
- Use JSDOC comments to document (at the very least) all functions and class properties and methods.
- Attempt to keep the contents and dependencies of `content-script.js` and the files it injects into pages as small as possible.
- Exported functions should have an empty line between `export ... function(...)` and the code itself and also a line at the end of the function's code before the ending bracket (`}`). See files in `./lib` for examples.
- Attempt to follow the code style already present in the file(s) you work on.
- Capitalize the beginning of commit messages.
- Attempt to keep the first line of commit messages under 50 characters. Use other lines for more detailed messages if needed.