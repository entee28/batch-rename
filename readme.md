# Batch Rename
> An app powered with [Electron](https://www.electronjs.org/), a framework for building desktop applications using JavaScript, HTML, and CSS.
## :construction_worker: People behind this project
- Nguyễn Nhật Thành - 2059040
- Vũ Bình Gia Uy - 2059048
- La Triệu Huy - 2059016
- Ngô Trung Hải - 2059012
## :gear: Instructions on compiling and running the project
### Requirement
- Node.js installed (the latest LTS version available is recommended)
- Make sure you've installed all the [necessary build tools](https://github.com/TooTallNate/node-gyp#installation) for your platform (this is necessary to install some of the packages)
### Installing required packages
```
$ npm install
```
### Open the app in development mode
```
$ npm start
```
## Features (things that we've managed to handle)
- Functions that handle each renaming rule are dynamically loaded from an external DLL file, written in C#.
- Ability to select all files and folders you want to rename, with drag and drop support.
- A set of whopping 8 renaming rules.
- Ability to save and load rule preset (which includes selected rules, rules' parameters, rules' order) as JSON file, with drag and drop support for loading preset.
- Ability to rearrange rules' order.
- Exceptions handle (duplication, empty or invalid parameters, no rule selected, etc.)
- The result can be previewed by users.
- Ability to create a copy of all the files and move them to a selected folder rather than perform the renaming on the original file.
- Extraodinary UI powered by HTML and CSS (Bootstrap enabled).
## Things that we have yet managed to handle (until 25/11/2021)
- The UI has yet responsive to resize.
- Some improvements mentioned in the project requirement article that we have yet delivered (no last time save, no autosave, no ability to save and load the work into a project).
## :100: Things that should be taken into account for bonus
- The fact that we have finished this project one month earlier the deadline.
- The fact that we have spent time doing our own research on this framework (Electron) and build this project with HTML, CSS and JS, make all of our work happens.
- Rules' order can be rearranged seamlessly with drag and drop enabled.
- Exceptions are carefully handled.
- A lot of improvements have been added to our program (JSON preset, copy renamed files to another folder, drag and drop enabled, result preview, etc.)
- A lot of work and research have been put into designing UI.