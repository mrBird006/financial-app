const { Buffer } = require("buffer");
const { File } = require("formdata-node");

function base64ToMemoryFile(base64String, filename = "audio.wav") {
    const [, encoded] = base64String.split(","); // Remove the data URL prefix
    const fileBuffer = Buffer.from(encoded, "base64");

    return new File([fileBuffer], filename, { type: "audio/wav" });
}

module.exports = { base64ToMemoryFile };