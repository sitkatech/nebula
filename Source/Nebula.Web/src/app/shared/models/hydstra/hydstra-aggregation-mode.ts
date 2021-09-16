export class HydstraAggregationMethod {
    static readonly Total = new HydstraAggregationMethod(
        "Total",
        "tot"
    );

    static readonly Average = new HydstraAggregationMethod(
        "Average",
        "mean"
    );

    static readonly Maximum = new HydstraAggregationMethod(
        "Maximum",
        "max"
    );

    static readonly Minimum = new HydstraAggregationMethod(
        "Minimum",
        "min"
    );

    private constructor(private readonly key: string,
        public readonly value: string) { }

    toString() {
        return this.key;
    }

    public static all(): HydstraAggregationMethod[] {
        return Object.values(HydstraAggregationMethod);
    }
}

