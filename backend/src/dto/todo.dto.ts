export interface CreateTodoDto {
  title: string;
}

export interface UpdateTodoDto {
  title?: string;
  done?: boolean;
}

export interface TodoResponseDto {
  id: string;
  title: string;
  done: boolean;
  createdAt: string;
  updatedAt: string;
}

// Validation functions
export function validateCreateTodoDto(data: any): CreateTodoDto {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid request body');
  }

  if (!data.title || typeof data.title !== 'string' || data.title.trim().length === 0) {
    throw new Error('Title is required and must be a non-empty string');
  }

  return {
    title: data.title.trim()
  };
}

export function validateUpdateTodoDto(data: any): UpdateTodoDto {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid request body');
  }

  const updateDto: UpdateTodoDto = {};

  if (data.title !== undefined) {
    if (typeof data.title !== 'string' || data.title.trim().length === 0) {
      throw new Error('Title must be a non-empty string');
    }
    updateDto.title = data.title.trim();
  }

  if (data.done !== undefined) {
    if (typeof data.done !== 'boolean') {
      throw new Error('Done must be a boolean');
    }
    updateDto.done = data.done;
  }

  return updateDto;
}