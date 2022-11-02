export const jsons = [
    {
        _barBuzz: "",
        bar: 22,
        buzz: 69,
    },

    {
        _barBuzz: "",
        bar: "this is a string",
        buzz: 69,
    },

    {
        _lithium: "",
        lithium: "is my bit daddy",
    },

    {
        _lithiumBarThat: "",
        lithium: "is my bit daddy",
        bar: "oneMoreTime",
        that: 69,
    },

    {
        _anotherPropBarThat: "",
        anotherProp: "prop",
        bar: "anoother bar",
        that: 69,
    },

    {
        _okAgainBar: "",
        okAgain: "prop",
        bar: "i needed one more string only bar"
    },

    {
        _iNeededAgainBarThat: "",
        iNeededAgain: "Yes, i have a default amount of 4",
        bar: "There we go, we are at 4 now",
        that: 69,
    },

    {
        _lithiumBarThat: "",
        lithium: "I needed a lithium data point so i can have 2 lith + bar unions",
        bar: "There we go, we are at 4 now",
        that: 69,
    },
]

if (require.main === module) {
    jsons.forEach(x => console.log(JSON.stringify(x)));
}
