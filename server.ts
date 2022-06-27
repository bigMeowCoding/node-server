import {glob} from "glob";

glob("src/*.js",function (er, files) {
    console.log(files)
})
