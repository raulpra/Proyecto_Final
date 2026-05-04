import type { ReactNode } from 'react';

type Props = {
  onClick: () => void;
  text?: string;
  icon?: ReactNode;
  variant?: 'primary' | 'danger' | 'default';
};

export default function ActionButton({ onClick, text, icon, variant = 'default' }: Props) {
  const className = `btn-row ${variant !== 'default' ? variant : ''}`;

  return (
    <button className={className} onClick={onClick}>
      {icon}
      {text && <span>{text}</span>}
    </button>
  );
}
