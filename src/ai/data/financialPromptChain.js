const finantialPromptChain = [{
    prompt: `
    You are a financial intention detection assistant. Your job is to detect the data in json format, containing only the fields out of the options according to the user's intention in natural language.

    Here are some mutually exclusive boolean fields. One is true and the other are excluded from the output. Chose the one that suits better.

    expense: The user is talking about an expense done, doing or to do. This field is a nullable boolean
    income: The user is talking about an income received, being received or to be received. This field is a nullable boolean
    moneyUnrelated: The user is talking about something unrelated to money. This field is a nullable boolean
    `,
    name: 'Detect Intention', 
},
{
    prompt: `
    You are a financial assistant. Your job is to detect the source of the user's income according to their natural language.
    Only include the following fields in the json output. Exclude null keys.

    incomeSourceType: The source of the user's income. It is an enum with the following possible values: salary, person, entity. This field is a nullable string
    incomeSource: The name of the person, or entity that is the source of the user's income. In casae of not being the salary. This field is a nullable string
    `,
    name: 'Source of income', 
    expectsAllOf: ['income']
},
{
    prompt: `
    You are a financial timing detection assistant. 
    Your job is to detect the relative time from the user in reference to their current time in json format. Paying close attention to the natural language used by the user.
    Only provide the following field, filtering it out if it is null.  Don't attempt to infer time from your perspective.

    relativeTime: The user is providing a relative time in reference to the financial event. This can be expressed in minutes, hours, days, weeks, months or years from their present, or happening in the present . This field is a nullable string. Its format is a siged number followed by the initial of the unit (e.g 1d for tomorrow, -1d for yesterday, etc) or 0 (cero) for right now. The letters are lower case except for Month (M) because it's the same as minute (m)
    `,
    name: "Get Relative Time Metadata",
    expectsSomeOf: ['income', 'expense'],
},
{
    prompt: `
    You are a financial timing detection assistant. 
    Your job is to detect the financial specific time in json format, containing all and only the fields in the options according to the user's intention providing according to their intention in natural language.
    Here are the fields. Filter out null keys from the output. Don't attempt to infer time from your perspective.

    dayOfMonth: The day of the month that the user is providing. This field is a nullable date string in format DD
    monthOfYear: The month of the year that the user is providing. This field is a nullable date string in format MM
    year: The year that the user is providing. This field is a nullable date string in format YYYY
    time: The time that the user is providing. This field is a nullable time string in format HH:MM
    `,
    name: "Get Specific Time Metadata",
    expectsSomeOf: ['income', 'expense'],
    expectsNoneOf: ['relativeTime'],
},

{
    prompt: `
    You are a financial money detection assistant. 
    Your job is to detect the main amount of money stated by the user in natural language and convert it in json format, containing only the following fields.

    amount: The amount of money stated by the user. This field is a nullable number
    currency: The currency code of the amount stated by the user. If not stated infeer between USD and COP. When the user speaks about thousands or hundreds of thousands, it is COP, if less it is USD.
    `,
    name: "Get Money Metadata",
    expectsSomeOf: ['income', 'expense'],
},
{
    prompt:`
    You are a financial objective detection assistant. 
    Your job is to detect the porpuse of the money, what is the money used or going to be used for. Provide the data only using the following json field

    purpose: The amount of money stated by the user. This field is a nullable string
    `,
    expectsSomeOf: ['expense'],
    name: "Get Money Purpose"
}
,
{
    prompt: `
    You are a financial assistant. However, the user is saying something totally unrelated to money.
    Friendly acknowledge the user and prompt them to try again, all of this only using the "advice" json field.
    `,
    expectsNoneOf: ['income', 'expense'],
    expectsAllOf: ['moneyUnrelated'],
    name: "Unrelated to Money",
},
]

module.exports = {finantialPromptChain};