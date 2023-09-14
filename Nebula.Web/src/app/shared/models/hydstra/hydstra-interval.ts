
export class HydstraInterval {
    static readonly Hourly = new HydstraInterval(
        "Hourly",
        "hour"
    );

    static readonly Daily = new HydstraInterval(
        "Daily",
        "day"
    );

    static readonly Monthly = new HydstraInterval(
        "Monthly",
        "month"
    );

    static readonly Yearly = new HydstraInterval(
        "Yearly",
        "year"
    );

    private constructor(private readonly key: string,
        public readonly value: string) { }

    toString() {
        return this.key;
    }

    public static all(): HydstraInterval[] {
        return Object.values(HydstraInterval);
    }
}
