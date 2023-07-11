export class HydstraRegressionMethod {
    static readonly Exponential = new HydstraRegressionMethod(
        "Exponential",
        "exp"
    );

    static readonly Linear = new HydstraRegressionMethod(
        "Linear",
        "linear"
    );

    static readonly Logarithmic = new HydstraRegressionMethod(
        "Logarithmic",
        "log"
    );

    static readonly Polynomial = new HydstraRegressionMethod(
        "Polynomial",
        "poly"
    );

    static readonly Power = new HydstraRegressionMethod(
        "Power",
        "pow"
    );

    static readonly Quadratic = new HydstraRegressionMethod(
        "Quadratic",
        "quad"
    );

    private constructor(private readonly key: string,
        public readonly value: string) { }

    toString() {
        return this.key;
    }

    public static all(): HydstraRegressionMethod[] {
        return Object.values(HydstraRegressionMethod);
    }
}
