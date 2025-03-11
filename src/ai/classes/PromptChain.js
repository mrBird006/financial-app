
const Joi = require('joi');

// Define the schema for validation
const schema = Joi.array().items(
    Joi.object({
        prompt: Joi.string().required(),
        name: Joi.string().required(),
        expectsAllOf: Joi.array().items(Joi.string()),
        expectsSomeOf: Joi.array().items(Joi.string()),
        expectsNoneOf: Joi.array().items(Joi.string()),
        outputsSomeOf: Joi.array().items(Joi.string()),
        outputsAllOf: Joi.array().items(Joi.string()),
    })
);

class PromptChain {
    constructor() {
        this.chainLinks = null;
        this.structurer = null
    }
    setChainLinks(chainLinks) {
        const validationResult = schema.validate(chainLinks);
        if (validationResult.error) {
            throw new Error(validationResult.error.message);
        }
        for (let link of chainLinks) {
            if (link.expectsAllOf && link.expectsSomeOf) {
                throw new Error('Cannot have both expectsAllOf and expectsSomeOf');
            }
            if (link.expectsAllOf && link.expectsAllOf.length === 0) {
                throw new Error('expectsAllOf cannot be empty');
            }
            if (link.expectsSomeOf && link.expectsSomeOf.length === 0) {
                throw new Error('expectsSomeOf cannot be empty');
            }
            if (link.outputsAllOf && link.outputsSomeOf) {
                throw new Error('Cannot have both outputsAllOf and outputsSomeOf');
            }
            if (link.outputsAllOf && link.outputsAllOf.length === 0) {
                throw new Error('outputsAllOf cannot be empty');
            }
            if (link.outputsSomeOf && link.outputsSomeOf.length === 0) {
                throw new Error('outputsSomeOf cannot be empty');
            }
        }
        this.chainLinks = chainLinks;
    }
    setStructurer(structurer) {
        this.structurer = structurer;
    }

    async processChain(userMessage) {
        if (!this.chainLinks) {
            throw new Error('Chain links not set');
        }
        if (!this.structurer) {
            throw new Error('Structurer not set');
        }
        let context = {};
        const skippedSteps = []
        for (let i = 0; i < this.chainLinks.length; i++) {
            let skipped = false;
            const chainLink = this.chainLinks[i];
            const expectedSomeOfKeys = chainLink.expectsSomeOf;
            const expectedAllOfKeys = chainLink.expectsAllOf;

            const contextTruthyKeys = Object.keys(context).filter(key => !!context[key]);
            if (expectedSomeOfKeys) {
                const found = expectedSomeOfKeys.some(key => contextTruthyKeys.includes(key));
                if (!found) {
                    skipped = true;
                }
            }
            if (expectedAllOfKeys) {
                const found = expectedAllOfKeys.every(key => contextTruthyKeys.includes(key));
                if (!found) {
                    skipped = true;
                }
            }
            if (chainLink.expectsNoneOf) {
                const found = chainLink.expectsNoneOf.some(key => contextTruthyKeys.includes(key));
                if (found) {
                    skipped = true;
                }
            }
            userMessage = userMessage.replace(/\[(\w+)\]/g, (match, key) => {
                if (!context[key]) {
                    skipped = true;
                    return "";
                }
            });
            if (skipped) {
                skippedSteps.push(chainLink.name);
                continue;
            }
            const response = await this.structurer.structurize(chainLink.prompt, userMessage);
            context = { ...context, ...response };
        }
        return { context, skippedSteps };
    }

}
module.exports = { PromptChain };