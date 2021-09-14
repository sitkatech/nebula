
export class HydstraFilter {
    static readonly Both = new HydstraFilter(
        "All (Wet + Dry)",
        "both"
    );

    static readonly Dry = new HydstraFilter(
        "Dry",
        "dry"
    );

    static readonly Wet = new HydstraFilter(
        "Wet",
        "wet"
    );

    private constructor(private readonly key: string,
        public readonly value: string) { }

    toString() {
        return this.key;
    }

    public static all(): HydstraFilter[] {
        return Object.values(HydstraFilter);
    }
}
