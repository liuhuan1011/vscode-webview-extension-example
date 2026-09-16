import { ExtensionContext, ViewColumn, WebviewPanel, commands, window } from 'vscode';
import { NavigationTreeProvider } from './view-provider/navigation-tree-provider';
import { ViewProviderPanel } from './view-provider/view-provider-panel';
import { getHandlers } from './handlers';

export function activate(context: ExtensionContext) {
  const handlers = getHandlers(context);
  const navigationTreeProvider = new NavigationTreeProvider();
  let portPanel: WebviewPanel | undefined;

  const navigationDisposable = window.registerTreeDataProvider('sidebar-view-container', navigationTreeProvider);

  const openPortDisposable = commands.registerCommand('portManagement.openPort', async () => {
    if (portPanel) {
      portPanel.reveal(ViewColumn.One);
      return;
    }

    const viewProviderPanel = new ViewProviderPanel(context, handlers);
    portPanel = window.createWebviewPanel('portManagement.port', 'Port 管理', ViewColumn.One, {
      retainContextWhenHidden: true,
      enableFindWidget: true,
    });
    portPanel.onDidDispose(() => {
      portPanel = undefined;
    });
    await viewProviderPanel.resolveWebviewView(portPanel);
  });

  context.subscriptions.push(navigationDisposable, openPortDisposable);
}

export function deactivate() {}
