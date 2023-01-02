import clsx from 'clsx';
import React from 'react';
import './TabsComponent.scss';

interface Props<T> {
  tabs: T[];
  isActive: (item: T, index: number, list: T[]) => boolean;
  onSelect?: (item: T, index: number) => void;
  template: (item: T, index: number, list: T[]) => React.ReactNode;
}

function TabsComponent<T>(props: Props<T>): React.ReactElement<Props<T>> {
  const tabs = props.tabs.map((e, i, arr) => (
    <div className={clsx('tab-item', { 'tab-active': props.isActive(e, i, arr) })} onClick={() => props.onSelect?.(e, i)} key={i}>
      {props.template(e, i, arr)}
    </div>
  ));

  return (
    <div className="tabs">
      <div className="tab-items">{tabs}</div>
    </div>
  );
}

export default TabsComponent;
