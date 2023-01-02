import clsx from 'clsx';
import React from 'react';
import './CardComponent.scss';

interface Props extends React.HTMLAttributes<HTMLElement> {
}

const CardComponent: React.FC<Props> = (props) => {
  const { children, ...rest } = props;

  return (
    <>
      <div {...rest} className={clsx(rest.className, 'card')}>
        {children}
      </div>
    </>
  );
};

export default CardComponent;
