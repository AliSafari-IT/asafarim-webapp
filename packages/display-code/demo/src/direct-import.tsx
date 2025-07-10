// Direct import of DisplayCode component from source
// This file serves as a bridge between the demo and the source code

import { DisplayCode as SourceDisplayCode } from '../../src/components/DisplayCode';
import { DisplayCodeProps } from '../../src/types';

// Re-export the component with the same interface
export const DisplayCode = (props: DisplayCodeProps) => {
  return <SourceDisplayCode {...props} />;
};

// Re-export types
export type { DisplayCodeProps };
