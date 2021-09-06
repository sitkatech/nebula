
export class HydstraInterval {
    static readonly Total = new HydstraInterval(
        "Hourly",
        "hour"
    );

    static readonly Average = new HydstraInterval(
        "Daily",
        "day"
    );

    static readonly Maximum = new HydstraInterval(
        "Monthly",
        "month"
    );

    static readonly Minimum = new HydstraInterval(
        "Yearly",
        "year"
    );

    private constructor(private readonly key: string,
        public readonly value: string) { }

    toString() {
        return this.key;
    }
}
