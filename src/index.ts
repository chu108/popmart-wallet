interface TransportResponseMessage {
    error: string | null;
    data: any;
}

const ACTION = {
    ENABLE: 'enable', // 初始化
    AUTH_ACCOUNT_LIST: 'auth_account_list', // 获取授权用户列表
    AUTH_ACCOUNT_DEF: 'auth_account_def', // 获取默认授权用户
    IS_AUTH: 'is_auth', // 当前账号是否授权
    AUTH:"auth",
    VERIFY:"verify"
}

class PopMartProvider {

    /**
     * 扩展插件ID
     */
    public editorExtensionId: string;

    constructor() {
        this.editorExtensionId = document.getElementById("my-chrome-extension-injected")?.innerText??"";
    }

    /**
     * 检测是否启用，未启用则授权
     */
    public enable(): Promise<any> {
        return this.connWallet(ACTION.AUTH)
    }

    /**
     * 获取所有授权账户
     */
    public isAuth():Promise<boolean> {
        return new Promise((resolve)=>{
            chrome.runtime.sendMessage(this.editorExtensionId, {type: ACTION.IS_AUTH}, (res) => {
                console.log("isAuth:", res);
                resolve(res.data as boolean);
            });
        })
    }

    /**
     * 获取所有授权账户
     */
    public async accounts(): Promise<TransportResponseMessage> {
        if (this.check() !== "") {
            return err(this.check())
        }
        if (await this.isAuth() === false) {
            await this.enable();
        }
        return new Promise((resolve)=>{
            chrome.runtime.sendMessage(this.editorExtensionId, {type: ACTION.AUTH_ACCOUNT_LIST}, (res) => {
                console.log("account_list:", res);
                resolve(res);
            });
        });
    }

    /**
     * 获取默认授权账户
     */
    public async defaultAccount(): Promise<TransportResponseMessage> {
        if (this.check() !== "") {
            return err(this.check())
        }

        if (await this.isAuth() === false) {
            await this.enable();
        }

        return new Promise((resolve)=>{
            chrome.runtime.sendMessage(this.editorExtensionId, {type: ACTION.AUTH_ACCOUNT_DEF}, (res) => {
                console.log("default_account:", res);
                resolve(res);
            });
        });
    }

    /**
     * 获取所有授权账户
     */
    public verify():Promise<any> {
        return this.connWallet(ACTION.VERIFY)
    }

    public connWallet(type:string):Promise<any> {
        if (this.check() !== "") {
            return Promise.reject(this.check());
        }
        const port = chrome.runtime.connect(this.editorExtensionId);
        port.postMessage({type: type, uri:window.origin});
        return new Promise((resolve)=>{
            console.log("等待授权结果。。。")
            port.onMessage.addListener(function(msg) {
                console.log("授权结果:", msg);
                resolve(msg)
            });
        })
    }

    private check():string {
        if (this.editorExtensionId === "") {
            return "editorExtensionId is empty";
        }
        if (chrome.runtime === undefined) {
            return "Extension not installed";
        }
        return "";
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