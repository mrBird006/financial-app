const {OpenAITranscriptionProvider,OpenAITextStructuringProvider} = require('./providers/openAi');
const {PromptChain} = require('./classes/PromptChain');
const transcriptionProviders = {
    openai: new OpenAITranscriptionProvider()
}

const structuringProviders = {
    openai: new OpenAITextStructuringProvider()
}

const promptChainingProviders = {
    openai: new PromptChain()
}
function normalizeKey(key) {
    return key.toLowerCase().trim();
}
function getTranscriber(providerKey) {
    const normalizedKey = normalizeKey(providerKey);
    if (!transcriptionProviders[normalizedKey]) {
        throw new Error(`Transcription provider ${providerKey} not found`);
    }
    return transcriptionProviders[normalizedKey];
}

function getStructurer(providerKey) {
    const normalizedKey = normalizeKey(providerKey);
    if (!structuringProviders[normalizedKey]) {
        throw new Error(`Transcription provider ${providerKey} not found`);
    }
    return structuringProviders[normalizedKey];
}

function getPromptChainer(providerKey) {
    const normalizedKey = normalizeKey(providerKey);
    if (!promptChainingProviders[normalizedKey]) {
        throw new Error(`Transcription provider ${providerKey} not found`);
    }
    const provider = promptChainingProviders[normalizedKey];
    provider.setStructurer(getStructurer(providerKey));
    return provider;
}

module.exports = {getTranscriber,getStructurer,getPromptChainer};