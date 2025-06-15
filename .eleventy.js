import CleanCSS from "clean-css";
import { minify } from "terser";
import { globSync } from "glob";
import fs from "fs";


const minifyCSS = () => {
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

const minifyJS = async () => {
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

export default function (eleventyConfig) {
    eleventyConfig.addWatchTarget("./src/sass/");
    eleventyConfig.addPassthroughCopy("./src/css");
    eleventyConfig.addPassthroughCopy("./src/js");
    eleventyConfig.addPassthroughCopy("./src/assets/");
    eleventyConfig.addPassthroughCopy("./src/admin/");

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