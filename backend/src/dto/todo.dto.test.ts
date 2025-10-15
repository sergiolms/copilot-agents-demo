import { describe, it, expect } from 'vitest';
import { validateCreateTodoDto, validateUpdateTodoDto } from '../dto/todo.dto.js';

describe('Todo DTO Validation', () => {
  describe('validateCreateTodoDto', () => {
    it('should validate valid create data', () => {
      const data = { title: 'Test todo' };
      const result = validateCreateTodoDto(data);
      
      expect(result.title).toBe('Test todo');
    });

    it('should trim whitespace from title', () => {
      const data = { title: '  Test todo  ' };
      const result = validateCreateTodoDto(data);
      
      expect(result.title).toBe('Test todo');
    });

    it('should throw error when data is null', () => {
      expect(() => validateCreateTodoDto(null)).toThrow('Invalid request body');
    });

    it('should throw error when data is not an object', () => {
      expect(() => validateCreateTodoDto('string')).toThrow('Invalid request body');
    });

    it('should throw error when title is missing', () => {
      expect(() => validateCreateTodoDto({})).toThrow('Title is required and must be a non-empty string');
    });

    it('should throw error when title is empty string', () => {
      expect(() => validateCreateTodoDto({ title: '' })).toThrow('Title is required and must be a non-empty string');
    });

    it('should throw error when title is only whitespace', () => {
      expect(() => validateCreateTodoDto({ title: '   ' })).toThrow('Title is required and must be a non-empty string');
    });

    it('should throw error when title is not a string', () => {
      expect(() => validateCreateTodoDto({ title: 123 })).toThrow('Title is required and must be a non-empty string');
    });
  });

  describe('validateUpdateTodoDto', () => {
    it('should validate valid update data with title', () => {
      const data = { title: 'Updated todo' };
      const result = validateUpdateTodoDto(data);
      
      expect(result.title).toBe('Updated todo');
      expect(result.done).toBeUndefined();
    });

    it('should validate valid update data with done', () => {
      const data = { done: true };
      const result = validateUpdateTodoDto(data);
      
      expect(result.done).toBe(true);
      expect(result.title).toBeUndefined();
    });

    it('should validate valid update data with both fields', () => {
      const data = { title: 'Updated todo', done: true };
      const result = validateUpdateTodoDto(data);
      
      expect(result.title).toBe('Updated todo');
      expect(result.done).toBe(true);
    });

    it('should trim whitespace from title', () => {
      const data = { title: '  Updated todo  ' };
      const result = validateUpdateTodoDto(data);
      
      expect(result.title).toBe('Updated todo');
    });

    it('should return empty object when no valid fields provided', () => {
      const data = {};
      const result = validateUpdateTodoDto(data);
      
      expect(result).toEqual({});
    });

    it('should throw error when data is null', () => {
      expect(() => validateUpdateTodoDto(null)).toThrow('Invalid request body');
    });

    it('should throw error when data is not an object', () => {
      expect(() => validateUpdateTodoDto('string')).toThrow('Invalid request body');
    });

    it('should throw error when title is empty string', () => {
      expect(() => validateUpdateTodoDto({ title: '' })).toThrow('Title must be a non-empty string');
    });

    it('should throw error when title is only whitespace', () => {
      expect(() => validateUpdateTodoDto({ title: '   ' })).toThrow('Title must be a non-empty string');
    });

    it('should throw error when title is not a string', () => {
      expect(() => validateUpdateTodoDto({ title: 123 })).toThrow('Title must be a non-empty string');
    });

    it('should throw error when done is not a boolean', () => {
      expect(() => validateUpdateTodoDto({ done: 'true' })).toThrow('Done must be a boolean');
    });
  });
});