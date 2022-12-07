class PopMartProvider {
    constructor(editorExtensionId) {
        this.editorExtensionId = editorExtensionId;
    }
    isEnable() {
        if (this.editorExtensionId === "") {
            return err("editorExtensionId is empty");
        }
        if (chrome.runtime === undefined) {
            return err("Extension not installed");
        }
        let response = err("");
        chrome.runtime.sendMessage(this.editorExtensionId, { type: "enable" }, (res) => {
            console.log("enable:", res);
            response = res;
        });
        return response;
    }
    accounts() {
        if (this.editorExtensionId === "") {
            return err("editorExtensionId is empty");
        }
        let response = err("");
        chrome.runtime.sendMessage(this.editorExtensionId, { type: "account_list" }, (res) => {
            console.log("account_list:", res);
            response = res;
        });
        return response;
    }
    defaultAccount() {
        if (this.editorExtensionId === "") {
            return err("editorExtensionId is empty");
        }
        let response = err("");
        chrome.runtime.sendMessage(this.editorExtensionId, { type: "default_account" }, (res) => {
            console.log("default_account:", res);
            response = res;
        });
        return response;
    }
}
function err(txt) {
    return {
        error: txt,
        data: null
    };
}
export { PopMartProvider };
