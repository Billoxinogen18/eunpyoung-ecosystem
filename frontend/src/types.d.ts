declare module 'react-hot-toast' {
  export interface Toast {
    id: string;
    type: 'success' | 'error' | 'loading' | 'blank' | 'custom';
    message: string;
    icon?: React.ReactNode;
    duration?: number;
    position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  }

  export interface ToastOptions {
    id?: string;
    icon?: React.ReactNode;
    duration?: number;
    position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
    style?: React.CSSProperties;
    className?: string;
    ariaProps?: {
      role: string;
      'aria-live': 'assertive' | 'off' | 'polite';
    };
  }

  export interface ToastFunction {
    (message: string, options?: ToastOptions): string;
    success: (message: string, options?: ToastOptions) => string;
    error: (message: string, options?: ToastOptions) => string;
    loading: (message: string, options?: ToastOptions) => string;
    dismiss: (toastId?: string) => void;
    remove: (toastId?: string) => void;
    promise: <T>(promise: Promise<T>, msgs: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((err: unknown) => string);
    }, opts?: ToastOptions) => Promise<T>;
  }

  export const toast: ToastFunction;
  export function Toaster(props: Record<string, unknown>): JSX.Element;
  export default toast;
}

declare module 'framer-motion' {
  import * as React from 'react';
  
  export interface AnimationProps {
    initial?: Record<string, unknown>;
    animate?: Record<string, unknown>;
    exit?: Record<string, unknown>;
    transition?: Record<string, unknown>;
    variants?: Record<string, unknown>;
    whileHover?: Record<string, unknown>;
    whileTap?: Record<string, unknown>;
    whileInView?: Record<string, unknown>;
    viewport?: Record<string, unknown>;
    layout?: boolean | string;
    layoutId?: string;
    drag?: boolean | 'x' | 'y';
    dragConstraints?: Record<string, unknown>;
    onAnimationComplete?: () => void;
  }
  
  export interface MotionProps extends AnimationProps, React.HTMLAttributes<HTMLElement> {}
  
  export const motion: {
    [K in keyof JSX.IntrinsicElements]: React.ForwardRefExoticComponent<
      MotionProps & JSX.IntrinsicElements[K] & React.RefAttributes<Element>
    >;
  };
  
  export const AnimatePresence: React.FC<{
    children?: React.ReactNode;
    exitBeforeEnter?: boolean;
    initial?: boolean;
    onExitComplete?: () => void;
  }>;
}

declare module 'lucide-react' {
  import * as React from 'react';
  
  export interface IconProps extends React.SVGProps<SVGSVGElement> {
    size?: number | string;
    color?: string;
    strokeWidth?: number | string;
  }
  
  export type Icon = React.FC<IconProps>;
  
  export const Sparkles: Icon;
  export const Coins: Icon;
  export const Heart: Icon;
  export const Activity: Icon;
  export const Store: Icon;
  export const Users: Icon;
  export const Shield: Icon;
  export const Zap: Icon;
  export const Globe: Icon;
  export const TrendingUp: Icon;
  export const LayoutDashboard: Icon;
  export const Vote: Icon;
  export const Award: Icon;
  export const Lock: Icon;
  export const Unlock: Icon;
  export const RefreshCw: Icon;
} 