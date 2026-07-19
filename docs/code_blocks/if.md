# If / Else
For information on how to write conditions, see [Conditional Expressions](../language_features/expressions.md#conditional-expressions).

## If Statements
If statements use the `if` keyword followed by a condition wrapped in parentheses.
```tc
if (condition) {
    // ...code
}
```

### Inverting (NOT arrow equivalent)
To invert the entirety of an if statement's condition, an exclamation point `!` can be placed in front of the condition's parentheses.
```tc
// these both do the exact same thing
if !(condition) {}
if (!condition) {}

// these both do the exact same thing
if !(a && b) {}
if (!(a && b)) {}
```

## Else Statements
Else statements can be placed immediately after an if statement using the `else` keyword.
```tc
if (condition) {
    // ...code
} else {
    // ...other code
}
```

## Else-If Statements
Else if statements are also supported. They must be placed after the if statement but before the final `else` statement.

You can have as many `else if` statements as you want and conditions can be arbitrarily complex.

```tc
if (default.xpLevel > 10 || default.hasPlotPermission(permission="Owner")) {
    // ...code
} else if (num.random(1,10) < 5) {
    // ...code
} else if (default.mainHandItem == item("emerald") && default.isSneaking()) {
    // ...code
} else {
    // ...code
}
```

