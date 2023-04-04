class Util {
    static SESSION_CONFIG_ID = "session-config";

    static async delay(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
}

export default Util;
