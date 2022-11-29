type barUnion = {
    bar: string;
};

type lithiumUnion = {
    lithium: string;
};

type thatUnion = {
    that: number;
};

type thatbarUnion = thatUnion & barUnion;

type BaseName1 = {
    _barBuzz: string;
    bar: number | string;
    buzz: number;
};

type BaseName2 = lithiumUnion & {
    _lithium: string;
};

type BaseName3 = lithiumUnion &
    thatbarUnion & {
        _lithiumBarThat: string;
    };

type BaseName4 = thatbarUnion & {
    _anotherPropBarThat: string;
    anotherProp: string;
};

type BaseName5 = barUnion & {
    _okAgainBar: string;
    okAgain: string;
};

type BaseName6 = thatbarUnion & {
    _iNeededAgainBarThat: string;
    iNeededAgain: string;
};
