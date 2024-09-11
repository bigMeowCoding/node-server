import svgtofont from "svgtofont";
import path from "node:path";

svgtofont({
  src: path.resolve(process.cwd(), "svgs"), // svg path
  dist: path.resolve(process.cwd(), "font"), // output path
  fontName: "svgtofont", // font name
  website: {
    enabled: true,
  },
  css: true, // Create CSS files.
}).then(() => {
  console.log("done!");
});
