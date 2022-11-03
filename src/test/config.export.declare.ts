declare module "foobar" {
    export type barUnion = {
        bar: string;
    }

    export type BaseName1 =  {
        _barBuzz: string;
        bar: (number | string);
        buzz: number;
    }

    export type BaseName2 =  {
        _lithium: string;
        lithium: string;
    }

    export type BaseName3 = barUnion &  {
        _lithiumBarThat: string;
        lithium: string;
        that: number;
    }

    export type BaseName4 = barUnion &  {
        _anotherPropBarThat: string;
        anotherProp: string;
        that: number;
    }

    export type BaseName5 = barUnion &  {
        _okAgainBar: string;
        okAgain: string;
    }

    export type BaseName6 = barUnion &  {
        _iNeededAgainBarThat: string;
        iNeededAgain: string;
        that: number;
    }

}
