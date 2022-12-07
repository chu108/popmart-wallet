interface TransportResponseMessage {
    error: string | null;
    data: any;
}

class PopMartProvider {

    /**
     * 扩展插件ID
     */
    public editorExtensionId: string;

    constructor(editorExtensionId: string) {
        this.editorExtensionId = editorExtensionId;
    }

    /**
     * 检测是否启用，未启用则授权
     */
    public isEnable(): TransportResponseMessage {
        if (this.editorExtensionId === "") {
            return err("editorExtensionId is empty");
        }
        if (chrome.runtime === undefined) {
            return err("Extension not installed");
        }
        let response: TransportResponseMessage = err("");
        chrome.runtime.sendMessage(this.editorExtensionId, {type: "enable"}, (res) => {
            console.log("enable:", res);
            response = res;
        });
        return response
    }

    /**
     * 获取所有授权账户
     */
    public accounts(): TransportResponseMessage {
        if (this.editorExtensionId === "") {
            return err("editorExtensionId is empty");
        }
        let response: TransportResponseMessage = err("");
        chrome.runtime.sendMessage(this.editorExtensionId, {type: "account_list"}, (res) => {
            console.log("account_list:", res);
            response = res;
        });
        return response
    }

    /**
     * 获取默认授权账户
     */
    public defaultAccount(): TransportResponseMessage {
        if (this.editorExtensionId === "") {
            return err("editorExtensionId is empty");
        }
        let response: TransportResponseMessage = err("");
        chrome.runtime.sendMessage(this.editorExtensionId, {type: "default_account"}, (res) => {
            console.log("default_account:", res);
            response = res;
        });
        return response
    }

}

function err(txt:string): TransportResponseMessage {
    return {
        error: txt,
        data: null
    }
}

export {
    PopMartProvider,
    TransportResponseMessage
}