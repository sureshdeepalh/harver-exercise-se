"use strict";

const fetch = require("node-fetch");
const sharp = require("sharp");
let argv = require("minimist")(process.argv.slice(2));

const apiUrl="https://cataas.com";

const {
  greeting = "Hello",
  who = "You",
  width = 400,
  height = 500,
  color = "Pink",
  size = 100,
} = argv;

const api = {
  firstRequest: `${apiUrl}/cat/says/${greeting}?width=${width}&height=${height}&color=${color}&s=${size}`,
  secondRequest: `${apiUrl}/cat/says/${who}?width=${width}&height=${height}&color=${color}&s=${size}`,
};

const mergeImage = async () => {
  try {
    const firstImage = await fetch(api.firstRequest);
    const secondImage = await fetch(api.secondRequest);

    const catImage1 = await firstImage.buffer();
    const catImage2 = await secondImage.buffer();

    console.log("Received response with status:" + firstImage.status);

    const canvas = await sharp({
      create: {
        width: width * 2,
        height: height,
        channels: 3,
        background: "#fff",
      },
    })
      .jpeg()
      .toBuffer();

    await sharp(canvas)
      .composite([
        { input: catImage1, top: 0, left: 0 },
        { input: catImage2, top: 0, left: width },
      ])
      .toFile("cat-card.jpg");
  } catch (error) {
    console.error(error);
  }
};
mergeImage();
