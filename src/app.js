const express = require('express');
const dotenv = require('dotenv');
const multer = require('multer');
const { base64ToMemoryFile } = require('./utils/fileUtils');
dotenv.config();
const upload = multer();
const { getTranscriber, getPromptChainer } = require('./ai/index');
const {finantialPromptChain} = require('./ai/data/financialPromptChain.js');

const transcriber = getTranscriber(process.env.TRANSCRIBER);
const promptChainer = getPromptChainer(process.env.TEXT_STRUCTURIZER);

promptChainer.setChainLinks(finantialPromptChain);

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/api/v1/speech-to-data', upload.none(), async (req, res) => {
    try {
        const audio = base64ToMemoryFile(req.body.audio);
        const transcription = await transcriber.transcribe(audio);
        const structure = await promptChainer.processChain(transcription);
        structure.context.description = transcription;
        console.log(structure);
        res.json({ message: "success", data: structure });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error transcribing audio');
    }
});
app.get('/status', (req, res) => {
    res.send('OK');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});