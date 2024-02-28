// update.decorator.spec.ts

import { ExecutionContext } from '@nestjs/common';
import { UpdateDecorator } from './update.decorator';

describe('UpdateDecorator', () => {
  it('should extract update from context', () => {
    const mockContext: Partial<ExecutionContext> = {};
    const update = UpdateDecorator(null, mockContext);
    expect(update).toBeDefined();
  });
});
