# Typogly

[![npm version](https://img.shields.io/npm/v/typogly.svg)](https://www.npmjs.com/package/typogly)
[![npm downloads](https://img.shields.io/npm/dm/typogly.svg)](https://www.npmjs.com/package/typogly)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A lightweight JavaScript/TypeScript library that transforms text using the **typoglycemia effect** — scrambling the middle letters of words while keeping them surprisingly readable!  

Based on the fascinating phenomenon where text remains readable when only the first and last letters of each word are preserved, even when the middle letters are scrambled.

```typescript
scramble("According to research at Cambridge University...")
// "Acncdoirg to rseearch at Cbamirdge Uinvesrtiy..."
```

## ✨ Features

- 🎯 **Simple API** - One function to scramble, easy to use
- 🎲 **Seeded randomness** - Reproducible results when needed
- 🔤 **Smart word detection** - Handles punctuation, capitalization, and Unicode
- ⚙️ **Configurable** - Control minimum word length, scrambling probability, and more
- 📦 **Zero dependencies** - Lightweight and fast
- 🎭 **TypeScript native** - Full type safety included
- 🌳 **Tree-shakeable** - ESM and CommonJS support

## 📦 Installation

```bash
# npm
npm install typogly

# yarn
yarn add typogly

# pnpm
pnpm add typogly
```

## 🚀 Quick Start

```typescript
import { scramble } from 'typogly';

const text = "Hello world! This is amazing.";
console.log(scramble(text));
// Example output: "Hlelo wlord! Tihs is amzanig."
```

## 📖 API

### `scramble(text, options?)`

Scrambles text using the typoglycemia effect.

#### Parameters

- **`text`** (string): The text to scramble
- **`options`** (object, optional): Configuration options

#### Options

```typescript
interface TypoglyOptions {
  minLength?: number;              // Minimum word length to scramble (default: 4)
  seed?: number;                   // Random seed for reproducible results
  preserveCase?: boolean;          // Preserve letter casing (default: true)
  scrambleProbability?: number;    // Probability of scrambling each word 0-1 (default: 1)
}
```

#### Examples

**Basic usage:**
```typescript
import { scramble } from 'typogly';

console.log(scramble("Hello world"));
// "Hlelo wlrod" (randomized each time)
```

**Reproducible with seed:**
```typescript
console.log(scramble("The quick brown fox jumps over the lazy dog multiple times"));
// Random output: "Tqhe kciuq bworn fox jmups oevr teh lzay dog mlutiple tmi es"

console.log(scramble("The quick brown fox jumps over the lazy dog multiple times", { seed: 42 }));
// Always produces the same output: "Teh qcuik bworn fox jmups oevr teh lzay dog mlutiple times"
console.log(scramble("The quick brown fox jumps over the lazy dog multiple times", { seed: 42 }));
// Same output again: "Teh qcuik bworn fox jmups oevr teh lzay dog mlutiple times"
```

**Only scramble longer words:**
```typescript
console.log(scramble("I am extremely happy today because of success", { minLength: 6 }));
// Random output: "I am etremxely happy today bcause of sseccus"
// (only words with 6+ letters are scrambled: "extremely", "because", "success")

```

**Partial scrambling:**
```typescript
console.log(scramble("The quick brown fox jumps", { scrambleProbability: 0.5, seed: 42 }));
// Example output: "The quick brown fox jpmus"
// Randomly scrambles about 50% of eligible words
```

**Preserve original casing:**
```typescript
console.log(scramble("HELLO World", { preserveCase: true }));
// "HLELO Wlrod"
```

### `createScrambler(defaultOptions?)`

Creates a scrambler function with preset options.

```typescript
import { createScrambler } from 'typogly';

// Create a scrambler with preset options
const myScrambler = createScrambler({ seed: 42, minLength: 5 });

// Use with preset options
console.log(myScrambler("Hello world"));
// "Hlelo wlord"

// Override specific options
console.log(myScrambler("Hello world", { minLength: 3 }));
// "Hlelo wlord" (scrambles more words)
```

## 🌐 Browser and Node.js Support

Works in all modern browsers and Node.js 18+.

### ES Modules
```typescript
import { scramble } from 'typogly';
```

### CommonJS
```javascript
const { scramble } = require('typogly');
```

## 📚 Advanced Examples

**Scramble a full paragraph:**
```typescript
const paragraph = `According to research at Cambridge University, it doesn't 
matter in what order the letters in a word are, the only important thing is 
that the first and last letter be in the right place.`;

console.log(scramble(paragraph, { seed: 42 }));
// Example output: "Aoccrding to rseearch at Cbamirdge Uinvesrtiy, it doesn't 
// mtater in what oredr the lteetrs in a word are, the only ipmorantt thing is 
// that the fsrit and last lteetr be in the rhgit plcae."
```

**Create a consistent scrambler for your app:**
```typescript
const appScrambler = createScrambler({
  seed: 12345,
  minLength: 5,
  scrambleProbability: 0.8
});

console.log(appScrambler("Welcome to our amazing website"));
// "Wleocme to our amzanig wbesite"

console.log(appScrambler("This is some interesting content"));
// "Tihs is smoe itnretseing conetnt"
```

**Gradual scrambling effect:**
```typescript
function gradualScramble(text: string, steps: number = 5) {
  const results = [];
  for (let i = 0; i <= steps; i++) {
    const probability = i / steps;
    results.push(scramble(text, { 
      scrambleProbability: probability,
      seed: 42 
    }));
  }
  return results;
}

const effect = gradualScramble("The quick brown fox jumps over the lazy dog");
console.log(effect);
// [
// "The quick brown fox jumps over the lazy dog",
// "The qciuk brwon fox jumps over the lzay dog",
// "The qciuk bwron fox jmups over the lzay dog",
// "The qciuk bwron fox jmups oevr the lzay dog",
// "The qciuk bwron fox jmups oevr the lzay dog",
// "The qciuk bwron fox jmups oevr the lzay dog"
// ]
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT © [Pawel Stalowczyk](https://github.com/Stalowczyk)

## 🔗 Links

- [GitHub Repository](https://github.com/Stalowczyk/typogly)
- [npm Package](https://www.npmjs.com/package/typogly)
- [Issue Tracker](https://github.com/Stalowczyk/typogly/issues)
