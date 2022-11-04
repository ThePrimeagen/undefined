type BarMe = BaseName1 & BaseName3 & BaseName4 & BaseName5 & BaseName6;

type barUnion = {
    bar: string;
};

type BaseName1 = {
    _barBuzz: string;
    bar: number | string;
    buzz: number;
};

type BaseName2 = {
    _lithium: string;
    lithium: string;
};

type BaseName3 = barUnion & {
    _lithiumBarThat: string;
    lithium: string;
    that: number;
};

type BaseName4 = barUnion & {
    _anotherPropBarThat: string;
    anotherProp: string;
    that: number;
};

type BaseName5 = barUnion & {
    _okAgainBar: string;
    okAgain: string;
};

type BaseName6 = barUnion & {
    _iNeededAgainBarThat: string;
    iNeededAgain: string;
    that: number;
};
