import { JsonrpcClient, MessageReceiver, MessageSender } from '@jsonrpc-rx/client';
import { createContext } from 'react';

type VsCodeApi = {
  postMessage(message: unknown): void;
};

type VsCodeWindow = Window & {
  acquireVsCodeApi?: () => VsCodeApi;
  __portManagementVsCodeApi__?: VsCodeApi;
};

const browserMessageApi: VsCodeApi = {
  postMessage: (message) => window.parent.postMessage(message, window.location.origin),
};

const vscodeWindow = window as VsCodeWindow;

// VS Code only allows acquireVsCodeApi to be called once per page. Cache it on
// window so Vite HMR can replace this module without acquiring a second time.
const vscodeApi =
  vscodeWindow.__portManagementVsCodeApi__ ?? vscodeWindow.acquireVsCodeApi?.() ?? browserMessageApi;
vscodeWindow.__portManagementVsCodeApi__ = vscodeApi;

// 创建消息发送者和接收者
const msgSender: MessageSender = vscodeApi.postMessage.bind(vscodeApi);
const msgReceiver: MessageReceiver = (handler) => window.addEventListener('message', (e) => handler(e.data));

// 初始化一个 Jsonrpc 的“客户端”，与 extension 的“服务端”对应
const jsonrpcClient = new JsonrpcClient(msgSender, msgReceiver);

// The context and its provider intentionally share this small bridge module.
// eslint-disable-next-line react-refresh/only-export-components
export const JsonrpcClientContext = createContext<JsonrpcClient>(jsonrpcClient);

export const JsonrpcClientContextProvider = ({ children }: { children: React.ReactNode }) => {
  return <JsonrpcClientContext.Provider value={jsonrpcClient}>{children}</JsonrpcClientContext.Provider>;
};
