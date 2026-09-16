import {
  Command,
  ProviderResult,
  ThemeIcon,
  TreeDataProvider,
  TreeItem,
  TreeItemCollapsibleState,
} from 'vscode';

export class NavigationItem extends TreeItem {
  constructor(label: string, command: Command, icon: string) {
    super(label, TreeItemCollapsibleState.None);
    this.command = command;
    this.iconPath = new ThemeIcon(icon);
    this.contextValue = 'navigationItem';
  }
}

export class NavigationTreeProvider implements TreeDataProvider<NavigationItem> {
  getTreeItem(element: NavigationItem): TreeItem {
    return element;
  }

  getChildren(element?: NavigationItem): ProviderResult<NavigationItem[]> {
    if (element) {
      return [];
    }

    return [
      new NavigationItem(
        'Port',
        {
          command: 'portManagement.openPort',
          title: '打开 Port 管理',
        },
        'server-process',
      ),
    ];
  }
}
