# Batch Rename
> An app powered with [Electron](https://www.electronjs.org/), a framework for building desktop applications using JavaScript, HTML, and CSS.

![App Screenshot](https://scontent.fsgn5-8.fna.fbcdn.net/v/t1.15752-9/260902156_1475669992851348_4585694398908888505_n.png?_nc_cat=109&ccb=1-5&_nc_sid=ae9488&_nc_ohc=SelIewRS_V0AX_E1t1x&_nc_ht=scontent.fsgn5-8.fna&oh=2cc025cd368632fa5482d67233910948&oe=61C457F0)
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
## :bulb: Features (things that we've managed to handle)
![App Screenshot 2](https://scontent.fsgn5-4.fna.fbcdn.net/v/t1.15752-9/261375591_285262423609264_1508983599461558878_n.png?_nc_cat=102&ccb=1-5&_nc_sid=ae9488&_nc_ohc=DPkdGQAMGLMAX9TUi71&tn=-18x6bk46jtQpwMZ&_nc_ht=scontent.fsgn5-4.fna&oh=799624606219609216cf7782cf0d30a2&oe=61C58CB5)
- Functions that handle each renaming rule are dynamically loaded from an external DLL file, written in C#.
- Ability to select all files and folders you want to rename, with drag and drop support.
- A set of whopping 8 renaming rules.
- Ability to save and load rule preset (which includes selected rules, rules' parameters, rules' order) as JSON file, with drag and drop support for loading preset.
- Ability to rearrange rules' order.
- Ability to select which files should be renamed after loading files
- Exceptions handle (duplication, empty or invalid parameters, no rule selected, etc.)
- The result can be previewed by users.
- Ability to create a copy of all the files and move them to a selected folder rather than perform the renaming on the original file.
- Extraodinary UI powered by HTML and CSS (Bootstrap enabled).
## :x: Things that we have yet managed to handle
- Some improvements mentioned in the project requirement article that we have yet delivered (no last time save, no autosave, no ability to save and load the work into a project).
## :100: Things that should be taken into account for bonus
- The fact that we have finished this project one month before the deadline.
- The fact that we have spent time doing our own research on this framework (Electron) and build this project with HTML, CSS and JS.
- Rules' order can be rearranged seamlessly with drag and drop enabled.
- Exceptions are carefully handled.
- A lot of improvements have been added to our program (JSON preset, copy renamed files to another folder, drag and drop enabled, result preview, etc.)
- A lot of work and research have been put into designing an intuitive and clean UI.
- Ability to select which files should be renamed after loading files
## :100: Expected grade
Every single member of our group has devoted immersive workload and research to making this project, so it's best to consider giving everyone a ten.
## :rocket: Demo
:video_camera: ![View demo on YouTube](https://youtu.be/02bNAz4L9KE)