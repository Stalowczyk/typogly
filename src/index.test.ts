import { describe, it, expect } from 'vitest';
import { scramble, createScrambler } from './index';

describe('scramble', () => {
  describe('basic functionality', () => {
    it('should scramble a simple word', () => {
      const result = scramble('hello');
      expect(result).toHaveLength(5);
      expect(result[0]).toBe('h');
      expect(result[4]).toBe('o');
    });

    it('should preserve whitespace', () => {
      const result = scramble('hello world');
      expect(result).toMatch(/^\w+\s\w+$/);
    });

    it('should handle empty string', () => {
      expect(scramble('')).toBe('');
    });

    it('should handle single character', () => {
      expect(scramble('a')).toBe('a');
    });

    it('should handle two characters', () => {
      expect(scramble('ab')).toBe('ab');
    });

    it('should handle three characters', () => {
      expect(scramble('abc')).toBe('abc');
    });
  });

  describe('minLength option', () => {
    it('should not scramble words shorter than minLength', () => {
      const text = 'I am happy today';
      const result = scramble(text, { minLength: 5 });
      expect(result.startsWith('I am')).toBe(true);
    });

    it('should respect custom minLength of 6', () => {
      const text = 'small words';
      const result = scramble(text, { minLength: 6 });
      expect(result).toBe('small words');
    });
  });

  describe('seed option', () => {
    it('should produce consistent results with same seed', () => {
      const text = 'hello world';
      const result1 = scramble(text, { seed: 42 });
      const result2 = scramble(text, { seed: 42 });
      expect(result1).toBe(result2);
    });

    it('should produce different results with different seeds', () => {
      const text = 'hello world';
      const result1 = scramble(text, { seed: 42 });
      const result2 = scramble(text, { seed: 43 });
      expect(result1).not.toBe(result2);
    });

    it('should produce different results without seed', () => {
      const text = 'hello world testing';
      const results = new Set();
      for (let i = 0; i < 10; i++) {
        results.add(scramble(text));
      }
      expect(results.size).toBeGreaterThan(1);
    });
  });

  describe('preserveCase option', () => {
    it('should preserve case by default', () => {
      const result = scramble('Hello', { seed: 42 });
      expect(result[0]).toBe('H');
      expect(result[result.length - 1]).toBe('o');
    });

    it('should handle all uppercase', () => {
      const result = scramble('HELLO', { seed: 42 });
      expect(result).toMatch(/^[A-Z]+$/);
    });
  });

  describe('scrambleProbability option', () => {
    it('should scramble all words with probability 1', () => {
      const text = 'hello world testing';
      const result = scramble(text, { seed: 42, scrambleProbability: 1 });
      expect(result).not.toBe(text);
    });

    it('should not scramble any words with probability 0', () => {
      const text = 'hello world';
      const result = scramble(text, { scrambleProbability: 0 });
      expect(result).toBe(text);
    });

    it('should scramble some words with probability 0.5', () => {
      const text = 'hello world testing scramble';
      const result = scramble(text, { seed: 42, scrambleProbability: 0.5 });
      const words = text.split(' ');
      const resultWords = result.split(' ');

      let scrambledCount = 0;
      words.forEach((word, i) => {
        if (word !== resultWords[i]) scrambledCount++;
      });

      expect(scrambledCount).toBeGreaterThan(0);
      expect(scrambledCount).toBeLessThan(words.length);
    });
  });

  describe('punctuation handling', () => {
    it('should preserve punctuation at end of word', () => {
      const result = scramble('hello!', { seed: 42 });
      expect(result.endsWith('!')).toBe(true);
      expect(result[0]).toBe('h');
    });

    it('should handle punctuation at start and end', () => {
      const result = scramble('"hello"', { seed: 42 });
      expect(result.startsWith('"')).toBe(true);
      expect(result.endsWith('"')).toBe(true);
    });

    it('should handle complex punctuation', () => {
      const result = scramble('(hello), "world"!', { seed: 42 });
      expect(result).toMatch(/^\([\w]+\), "[\w]+"!$/);
    });

    it('should handle apostrophes correctly', () => {
      const result = scramble("don't worry", { seed: 42 });
      expect(result).toContain("'");
    });
  });

  describe('special characters and unicode', () => {
    it('should handle numbers mixed with text', () => {
      const result = scramble('hello123', { seed: 42 });
      expect(result).toMatch(/[\w]+123/);
    });

    it('should handle unicode characters', () => {
      const result = scramble('héllo wörld', { seed: 42 });
      expect(result).toMatch(/\w+\s\w+/);
    });

    it('should handle emojis', () => {
      const result = scramble('hello 👋 world', { seed: 42 });
      expect(result).toContain('👋');
    });
  });

  describe('edge cases', () => {
    it('should handle very long words', () => {
      const longWord = 'supercalifragilisticexpialidocious';
      const result = scramble(longWord, { seed: 42 });
      expect(result[0]).toBe('s');
      expect(result[result.length - 1]).toBe('s');
      expect(result).not.toBe(longWord);
    });

    it('should handle text with multiple spaces', () => {
      const result = scramble('hello    world');
      expect(result).toMatch(/\w+\s+\w+/);
    });

    it('should handle newlines', () => {
      const result = scramble('hello\nworld');
      expect(result).toContain('\n');
    });

    it('should handle tabs', () => {
      const result = scramble('hello\tworld');
      expect(result).toContain('\t');
    });
  });

  describe('realistic text', () => {
    it('should handle a full sentence', () => {
      const text = 'The quick brown fox jumps over the lazy dog.';
      const result = scramble(text, { seed: 42 });

      expect(result.startsWith('The')).toBe(true);
      expect(result.endsWith('dog.')).toBe(true);
      expect(result.split(' ')).toHaveLength(text.split(' ').length);
    });

    it('should handle a paragraph', () => {
      const text = `According to research at Cambridge University, 
        it doesn't matter in what order the letters in a word are, 
        the only important thing is that the first and last letter be in the right place.`;

      const result = scramble(text, { seed: 42 });

      expect(result).toHaveLength(text.length);
      expect(result).not.toBe(text);
    });
  });
});

describe('createScrambler', () => {
  it('should create a scrambler with default options', () => {
    const scrambler = createScrambler({ seed: 42, minLength: 5 });
    const result = scrambler('hello world');

    expect(result).toBe(scrambler('hello world'));
  });

  it('should allow overriding options', () => {
    const scrambler = createScrambler({ seed: 42 });
    const result1 = scrambler('hello world example test');
    const result2 = scrambler('hello world example test', { seed: 99 });

    expect(result1).not.toBe(result2);
  });

  it('should maintain default options across calls', () => {
    const scrambler = createScrambler({ seed: 42 });
    const result1 = scrambler('testing');
    const result2 = scrambler('testing');

    expect(result1).toBe(result2);
  });
});
