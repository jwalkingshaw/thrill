// .eleventy.js
module.exports = function(eleventyConfig) {
  // Copy the `css` folder to the output
  eleventyConfig.addPassthroughCopy("css");
  // Copy the `images` folder to the output
  eleventyConfig.addPassthroughCopy("images");
  // Copy the `js` folder to the output
  eleventyConfig.addPassthroughCopy("js");
  // Copy any other static assets as needed
  return {
    dir: {
      input: ".",
      output: "_site"
    }
  };
};
