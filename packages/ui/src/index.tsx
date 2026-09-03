import type { ButtonHTMLAttributes, ReactNode } from 'react';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
};

export const Button = ({ children, type = 'button', ...props }: ButtonProps) => (
  <button type={type} {...props}>
    {children}
  </button>
);
