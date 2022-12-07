interface TransportResponseMessage {
    error: string | null;
    data: any;
}
declare class PopMartProvider {
    editorExtensionId: string;
    constructor(editorExtensionId: string);
    isEnable(): TransportResponseMessage;
    accounts(): TransportResponseMessage;
    defaultAccount(): TransportResponseMessage;
}
export { PopMartProvider, TransportResponseMessage };
