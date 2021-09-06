export class HydstraAggregationMode {
    static readonly Total = new HydstraAggregationMode(
        "Total",
        "tot"
    );

    static readonly Average = new HydstraAggregationMode(
        "Average",
        "mean"
    );

    static readonly Maximum = new HydstraAggregationMode(
        "Maximum",
        "max"
    );

    static readonly Minimum = new HydstraAggregationMode(
        "Minimum",
        "min"
    );

    private constructor(private readonly key: string,
        public readonly value: string) { }

    toString() {
        return this.key;
    }
}