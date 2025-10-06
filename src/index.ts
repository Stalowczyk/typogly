/**
 * Typogly - A library for scrambling text while maintaining readability
 * Based on the typoglycemia phenomenon where words remain readable when only
 * first and last letters are preserved
 */

export interface TypoglycemiaOptions {
  /**
   * Minimum word length to scramble (default: 4)
   * Words shorter than this will not be scrambled
   */
  minLength?: number;

  /**
   * Random seed for reproducible scrambling
   * If provided, the same input will always produce the same output
   */
  seed?: number;

  /**
   * Whether to preserve the case of letters when scrambling (default: true)
   */
  preserveCase?: boolean;

  /**
   * Probability of scrambling each word (0-1, default: 1)
   * Allows for partial scrambling of text
   */
  scrambleProbability?: number;
}

/**
 * Simple seeded random number generator (LCG algorithm)
 */
class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed % 2147483647;
    if (this.seed <= 0) this.seed += 2147483646;
  }

  next(): number {
    this.seed = (this.seed * 16807) % 2147483647;
    return (this.seed - 1) / 2147483646;
  }
}

/**
 * Fisher-Yates shuffle algorithm
 */
function shuffle<T>(array: T[], random: () => number): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Scrambles the middle letters of a word while preserving first and last letters
 */
function scrambleWord(word: string, random: () => number, preserveCase: boolean): string {
  if (word.length <= 3) return word;

  const first = word[0];
  const last = word[word.length - 1];
  const middle = word.slice(1, -1);

  const middleChars = middle.split('');

  if (preserveCase) {
    const lowerChars = middleChars.map(c => c.toLowerCase());
    const scrambled = shuffle(lowerChars, random);

    const result = scrambled.map((char, i) => {
      return middleChars[i] === middleChars[i].toUpperCase() ? char.toUpperCase() : char;
    });

    return first + result.join('') + last;
  }

  const scrambled = shuffle(middleChars, random);
  return first + scrambled.join('') + last;
}

/**
 * Checks if a character is a letter
 */
function isLetter(char: string): boolean {
  return /\p{L}/u.test(char);
}

/**
 * Extracts pure word part from a token that might have punctuation
 */
function extractWord(token: string): { word: string; prefix: string; suffix: string } {
  let startIdx = 0;
  let endIdx = token.length;

  while (startIdx < token.length && !isLetter(token[startIdx])) {
    startIdx++;
  }

  while (endIdx > startIdx && !isLetter(token[endIdx - 1])) {
    endIdx--;
  }

  return {
    prefix: token.slice(0, startIdx),
    word: token.slice(startIdx, endIdx),
    suffix: token.slice(endIdx),
  };
}

/**
 * Scrambles text using the typoglycemia effect
 *
 * @param text - The text to scramble
 * @param options - Configuration options
 * @returns Scrambled text
 *
 * @example
 * ```typescript
 * scramble("Hello world"); // "Hlelo wlord"
 * scramble("Hello world", { seed: 42 }); // Always produces same output
 * scramble("Hello world", { minLength: 6 }); // Only scrambles words >= 6 chars
 * ```
 */
export function scramble(text: string, options: TypoglycemiaOptions = {}): string {
  const { minLength = 4, seed, preserveCase = true, scrambleProbability = 1 } = options;

  const randomGen = seed !== undefined ? new SeededRandom(seed) : null;
  const random = randomGen ? () => randomGen.next() : Math.random;

  const tokens = text.split(/(\s+)/);

  return tokens
    .map(token => {
      if (/^\s+$/.test(token)) return token;

      if (scrambleProbability < 1 && random() > scrambleProbability) {
        return token;
      }

      const { prefix, word, suffix } = extractWord(token);

      if (word.length < minLength) return token;

      const scrambled = scrambleWord(word, random, preserveCase);
      return prefix + scrambled + suffix;
    })
    .join('');
}

/**
 * Creates a typoglycemia scrambler with preset options
 *
 * @param options - Default options for this scrambler instance
 * @returns A scrambler function with preset options
 *
 * @example
 * ```typescript
 * const scrambler = createScrambler({ seed: 42, minLength: 5 });
 * scrambler("Hello world"); // Uses preset options
 * scrambler("Hello world", { minLength: 3 }); // Overrides minLength
 * ```
 */
export function createScrambler(defaultOptions: TypoglycemiaOptions = {}) {
  return (text: string, options: TypoglycemiaOptions = {}) => {
    return scramble(text, { ...defaultOptions, ...options });
  };
}

export default scramble;
