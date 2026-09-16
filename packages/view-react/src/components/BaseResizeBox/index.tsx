import { ResizeBox, type ResizeBoxProps } from '@arco-design/web-react';
import type { FC, ReactNode } from 'react';

export interface BaseResizeBoxProps extends ResizeBoxProps {
  children?: ReactNode;
}

type BaseResizeBoxComponent = FC<BaseResizeBoxProps> & {
  Split: typeof ResizeBox.Split;
  SplitGroup: typeof ResizeBox.SplitGroup;
};

const BaseResizeBox = ((props: BaseResizeBoxProps) => {
  const { children, ...restProps } = props;
  return <ResizeBox {...restProps}>{children}</ResizeBox>;
}) as BaseResizeBoxComponent;

BaseResizeBox.Split = ResizeBox.Split;
BaseResizeBox.SplitGroup = ResizeBox.SplitGroup;
BaseResizeBox.displayName = 'BaseResizeBox';

export { BaseResizeBox };
