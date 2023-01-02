import clsx from 'clsx';
import React, { CSSProperties } from 'react';
import './ListComponent.scss';

interface Props<T> {
  className?: string;
  readOnly: boolean;
  list: T[];
  template: (item: T, index: number, list: T[]) => React.ReactNode;
  onAdd?: (list: T[]) => void;
  onRemove?: (item: T, index: number, list: T[]) => void;
  addBtnStyle?: CSSProperties;
  removeBtnStyle?: CSSProperties;
}

function ListComponent<T>(props: Props<T>): React.ReactElement<Props<T>> {
  const list = props.list.map((e, i, arr) => (
    <div className="list-item" key={i}>
      {props.template(e, i, arr)}
      {!props.readOnly && !!props.onRemove && (
        <button type="button" className="list-remove" onClick={() => props.onRemove?.(e, i, arr)} style={props.removeBtnStyle}>
          <i className="fas fa-trash"></i>
        </button>
      )}
    </div>
  ));

  return (
    <div className={clsx('list', props.className)}>
      <div className="list-items">{list}</div>
      {!props.readOnly && !!props.onAdd && (
        <button type="button" className="list-add" onClick={() => props.onAdd?.(props.list)} style={props.addBtnStyle}>
          <i className="fas fa-plus"></i>
        </button>
      )}
    </div>
  );
}

export default ListComponent;
