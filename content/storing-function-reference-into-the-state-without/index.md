---
title: Storing function reference into the state without executing the function
tags:
  - React
type:
  - Tutorial / How To
---

Remember that the state behaves differently than the variable. If we want to save a reference on a function into the variable, this code will save the function reference into the variable and the function will not be executed:

```jsx
const randomFunction = () => {
  return true;
};

const functionHolder = randomFunction;
```

[https://codesandbox.io/s/nice-robinson-ozbslk?file=/src/index.js](https://codesandbox.io/s/nice-robinson-ozbslk?file=/src/index.js)

But when we want to store the function not in variable but in the state, the function reference is executed:

```jsx
const [functionHolder, setFunctionHolder] = useState();

  const randomFunction = () => {
    console.log("Function was executed!");
  };

  useEffect(() => {
    setFunctionHolder(randomFunction);
  }, []);
```

[https://codesandbox.io/s/restless-moon-vcickp?file=/src/App.js](https://codesandbox.io/s/restless-moon-vcickp?file=/src/App.js)

This is happening because `setState` accepts as a parameter only a value or a function that returns a value. In other words, `setState` always executes not only the function but also the reference on a function. The solution to not execute the function is done like this:

```jsx
setFunctionHolder(() => randomFunction);
```

Now `setState` executes the root function, which returns the reference on the `randomFunction` itself.
