import { ListTable } from '@visactor/react-vtable';
import type { ListTable as VTableInstance, ListTableConstructorOptions } from '@visactor/vtable';
import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  type ComponentPropsWithoutRef,
  type CSSProperties,
  type ForwardedRef,
  type ForwardRefExoticComponent,
  type MutableRefObject,
  type RefAttributes,
} from 'react';
import './styles.css';

type VTableProps = ComponentPropsWithoutRef<typeof ListTable>;

export type BaseListTableProps = Omit<VTableProps, 'height' | 'option' | 'ref' | 'width'> & {
  option?: ListTableConstructorOptions;
  style?: CSSProperties;
};

const baseOptions = {
  widthMode: 'standard',
  autoFillWidth: true,
  editCellTrigger: ['doubleclick', 'keydown'],
  defaultRowHeight: 24,
  emptyTip: { text: 'No Data', displayMode: 'basedOnContainer' },
  keyboardOptions: { moveFocusCellOnEnter: true },
  menu: { contextMenuWorkOnlyCell: false },
} satisfies Partial<ListTableConstructorOptions>;

function assignForwardedRef(ref: ForwardedRef<VTableInstance>, instance: VTableInstance | null) {
  if (typeof ref === 'function') {
    ref(instance);
    return;
  }
  if (ref) (ref as MutableRefObject<VTableInstance | null>).current = instance;
}

const BaseListTable: ForwardRefExoticComponent<BaseListTableProps & RefAttributes<VTableInstance>> = forwardRef<
  VTableInstance,
  BaseListTableProps
>(({ className, onReady, option, style, ...restProps }, forwardedRef) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const tableRef = useRef<VTableInstance | null>(null);

  const mergedOption = useMemo<ListTableConstructorOptions>(
    () => {
      const emptyTip =
        typeof option?.emptyTip === 'object'
          ? { ...baseOptions.emptyTip, ...option.emptyTip }
          : (option?.emptyTip ?? baseOptions.emptyTip);

      return {
        ...baseOptions,
        ...option,
        emptyTip,
        keyboardOptions: { ...baseOptions.keyboardOptions, ...option?.keyboardOptions },
        menu: { ...baseOptions.menu, ...option?.menu },
      };
    },
    [option],
  );

  const combinedRef = useCallback(
    (instance: VTableInstance | null) => {
      tableRef.current = instance;
      assignForwardedRef(forwardedRef, instance);
    },
    [forwardedRef],
  );

  const resizeTable = useCallback(() => tableRef.current?.resize(), []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationFrame = 0;
    const scheduleResize = () => {
      cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(resizeTable);
    };
    const observer = new ResizeObserver(scheduleResize);
    observer.observe(container);
    scheduleResize();

    return () => {
      observer.disconnect();
      cancelAnimationFrame(animationFrame);
    };
  }, [resizeTable]);

  const handleReady: NonNullable<VTableProps['onReady']> = useCallback(
    (instance, isInitial) => {
      resizeTable();
      onReady?.(instance, isInitial);
    },
    [onReady, resizeTable],
  );

  return (
    <div ref={containerRef} className={['base-list-table', className].filter(Boolean).join(' ')} style={style}>
      <ListTable
        {...restProps}
        ref={combinedRef}
        option={mergedOption}
        width="100%"
        height="100%"
        onReady={handleReady}
      />
    </div>
  );
});

BaseListTable.displayName = 'BaseListTable';

export { BaseListTable };
