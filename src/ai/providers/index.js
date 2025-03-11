class TranscriptionProvider{
    async transcribe(file){
        throw new Error('transcribe method must be implemented');
    }
}
class TextStructuringProvider{
    async structure(text){
        throw new Error('structure method must be implemented');
    }
}
module.exports = {TranscriptionProvider,TextStructuringProvider};