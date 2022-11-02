const jsons = [
    {
        bar: 22,
        buzz: 69,
    },

    {
        bar: "this is a string",
        buzz: 69,
    },

    {
        lithium: "is my bit daddy",
    },

    {
        lithium: "is my bit daddy",
        bar: "oneMoreTime"
    },

    {
        anotherProp: "prop",
        bar: "anoother bar"
    },

    {
        okAgain: "prop",
        bar: "i needed one more string only bar"
    },

    {
        iNeededAgain: "Yes, i have a default amount of 4",
        bar: "There we go, we are at 4 now"
    },

    {
        lithium: "I needed a lithium data point so i can have 2 lith + bar unions",
        bar: "There we go, we are at 4 now",
        that: 69,
    },
]

jsons.forEach(x => console.log(JSON.stringify(x)));

