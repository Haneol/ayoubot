const { AttachmentBuilder } = require("discord.js");

const { createCanvas } = require("canvas");

async function createColorImage(color) {
  const canvas = createCanvas(200, 200);
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 200, 200);

  const buffer = canvas.toBuffer("image/png");
  const attachment = new AttachmentBuilder(buffer, {
    name: "color.png",
  });
  return attachment;
}

module.exports = {
  createColorImage,
};
