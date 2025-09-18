import CleanCSS from "clean-css";
import { minify } from "terser";
import { globSync } from "glob";
import { compile as sassCompile } from "sass";
import fs from "fs";


function minifyCSS() {
    console.log("Minifying CSS files...");
    const cleanCSS = new CleanCSS();
    const cssFiles = globSync("./build/css/*.css");

    cssFiles.forEach(file => {
        const input = fs.readFileSync(file, "utf8");
        try {
            const output = cleanCSS.minify(input).styles;
            fs.writeFileSync(file, output);
        }
        catch (err) {
            console.error(`Error minifying CSS file ${file}:`, err);
        }
    });
}

async function minifyJS() {
    console.log("Minifying JS files...");
    const jsFiles = globSync("./build/js/*.js");
    jsFiles.forEach(async file => {
        const input = fs.readFileSync(file, "utf8");
        try {
            const output = await minify(input);
            fs.writeFileSync(file, output.code);
        }
        catch (err) {
            console.error(`Error minifying JS file ${file}:`, err);
        }
    })
}

function compileSass() {
    console.log("Compiling SASS...");
    const result = sassCompile("./src/sass/main.scss", { style: 'expanded' });
    if (!fs.existsSync("./build/css")) {
        fs.mkdirSync("./build/css", { recursive: true });
    }
    fs.writeFileSync("./build/css/main.css", result.css);
}

export default function (eleventyConfig) {
    eleventyConfig.addWatchTarget("./src/sass/");
    eleventyConfig.addPassthroughCopy("./src/js");
    eleventyConfig.addPassthroughCopy("./src/assets/fonts");
    eleventyConfig.addPassthroughCopy("./src/assets/images");
    eleventyConfig.addPassthroughCopy("./src/assets/examples");

    eleventyConfig.on("beforeBuild", () => {
        compileSass();
    });

    eleventyConfig.on("afterBuild", () => {
        minifyCSS();
        minifyJS();
    });



    return {
        dir: {
            input: "src",
            output: "build"
        },
    };
};