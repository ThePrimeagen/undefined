type barUnion = {
    bar: string;
}

type FlexMeDaddy =  {
    _barBuzz: string;
    bar: (number | string);
    buzz: number;
}

type BaseName1 =  {
    _lithium: string;
    lithium: string;
}

type BaseName2 = barUnion &  {
    _lithiumBarThat: string;
    lithium: string;
    that: number;
}

type BaseName3 = barUnion &  {
    _anotherPropBarThat: string;
    anotherProp: string;
    that: number;
}

type BaseName4 = barUnion &  {
    _okAgainBar: string;
    okAgain: string;
}

type BaseName5 = barUnion &  {
    _iNeededAgainBarThat: string;
    iNeededAgain: string;
    that: number;
}
