
export class HydstraWeatherCondition {
    static readonly Both = new HydstraWeatherCondition(
        "All (Wet + Dry)",
        "both"
    );

    static readonly Dry = new HydstraWeatherCondition(
        "Dry",
        "dry"
    );

    static readonly Wet = new HydstraWeatherCondition(
        "Wet",
        "wet"
    );

    private constructor(private readonly key: string,
        public readonly value: string) { }

    toString() {
        return this.key;
    }

    public static all(): HydstraWeatherCondition[] {
        return Object.values(HydstraWeatherCondition);
    }
}
