---
archived: true
title: Jest testing
tags:
  - QA
  - Testing
type: Tool
---

Jest is a popular testing framework that provides a wide range of assertion functions to help you write effective tests.

## JS testing

Setup:

**Install Jest**: Install Jest as a development dependency in your project using npm:

```jsx
npm install --save-dev jest
```

**Create a Test Script**: In your **`package.json`**

```jsx
"scripts": {
"test": "jest"
}
```

**Create a Test File**: Create a folder named **`__tests__`** or **`test`** in your project directory to store your test files. Jest will automatically find and run files with names ending in **`.test.js`** or **`.spec.js`**. For example, if your code is in **`math.js`**, your test file should be named **`math.test.js`**.

**Write Your Tests**: In your test file, write test cases using Jest's assertion functions, which we'll cover in detail next.

**Run Your Tests:**

```jsx
npm test
```

## **Common Jest Assertion Functions (functions to test functions**

Jest provides a variety of assertion functions to verify the behavior of your code. Here are some commonly used ones:

### **1. `toBe()`**

```jsx
**toBe()** is used for exact equality comparisons. It checks if the received value is strictly equal (**===**) to the expected value
test('2 + 2 equals 4', () => {
  expect(2 + 2).toBe(4);
});

```

### **2. `toEqual()`**

**`toEqual()`** is used to compare the values of objects or arrays. It performs a deep comparison and checks if the received value is equal to the expected value in a recursive manner.

```jsx

test('Check if two objects are equal', () => {
  const obj1 = { name: 'Alice', age: 30 };
  const obj2 = { name: 'Alice', age: 30 };
  expect(obj1).toEqual(obj2);
});

```

### **3. `not.toBe()`**

**`not.toBe()`** is the negation of **`toBe()`**. It checks if the received value is **not** strictly equal to the expected value.

```jsx

test('3 is not equal to 4', () => {
  expect(3).not.toBe(4);
});

```

### **4. `toMatch()`**

**`toMatch()`** checks if a string matches a regular expression. It's often used for string matching in text-based tests.

```jsx

test('Check if a string contains "apple"', () => {
  expect('I love apples').toMatch(/apple/);
});

```

### **5. `toHaveLength()`**

**`toHaveLength()`** checks the length of an array or string. It verifies if the received value has the expected length.

```jsx

test('Check the length of an array', () => {
  const fruits = ['apple', 'banana', 'cherry'];
  expect(fruits).toHaveLength(3);
});

```

### **6. `toContain()`**

**`toContain()`** checks if an array or iterable contains a specific item.

```jsx

test('Check if an array contains "apple"', () => {
  const fruits = ['apple', 'banana', 'cherry'];
  expect(fruits).toContain('apple');
});

```

## TS testing:

## Setup:

**Install Dependencies**: Install the necessary dependencies for TypeScript and Jest:

```jsx
npm install --save-dev typescript ts-jest @types/jest jest
```

**Configure TypeScript**: Create a **`tsconfig.json`** file in your project directory to configure TypeScript. You can generate one by running:

```jsx
npx tsc --init
```

or you can do it manually

**Configure Jest**: Create a **`jest.config.js`** file in your project directory to configure Jest. Here's a basic configuration:

```jsx
module.exports = {
preset: 'ts-jest',
testEnvironment: 'node',
};
```

**Create a Test Script:**

```jsx
"scripts": {
"test": "jest"
}
```

**Create a Test File**: Create a folder named **`__tests__`** or **`test`** in your project directory to store your test files. Jest will automatically find and run files with names ending in **`.test.ts`** or **`.spec.ts`**. For example, if your code is in **`math.ts`**, your test file should be named **`math.test.ts`**.

**Write Your Tests**

**Run Your Tests**

```jsx
npm test
```

**TypeScript Module `math.ts`:**

```jsx
export function add(a: number, b: number): number {
return a + b;
}
```

**TypeScript Test File `math.test.ts`**

```jsx
import { add } from './math';
describe('Math functions', () => {
test('Adding two numbers', () => {
const num1 = 2;
const num2 = 3;
const result = add(num1, num2);
expect(result).toBe(5);
});
});
```

## For Next.js testing i recommend watch [THIS](https://www.youtube.com/watch?v=AS79oJ3Fcf0&ab_channel=DaveGray) video
