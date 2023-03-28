import type {
    AuthenticationCreds,
    SignalDataTypeMap,
} from "@adiwajshing/baileys";

export declare function useSession(): Promise<{
    state: {
        creds: AuthenticationCreds;
        keys: {
            get: (
                type: keyof SignalDataTypeMap,
                ids: string[]
            ) => Promise<{
                [key: string]: any;
            }>;
            set: (data: any) => Promise<void>;
        };
    };
    saveCreds: () => Promise<void>;
}>;
