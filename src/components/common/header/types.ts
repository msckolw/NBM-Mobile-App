
import type {ReactNode} from 'react';

export type AppHeaderVariant = 'home' | 'screen';

export type AppHeaderProps = {
  variant?: AppHeaderVariant;
  title?: string;
  subtitle?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  rightAction?: ReactNode;
};
