## Syntax
Any identifier starting with a digit or a period (`.`) will be treated as a number. Numbers can also contain underscores between digits which can provide visual clarity without affecting the value of the number.

```tc
// These are all valid numbers:
1 0.5 .5 -1 -.823 1_000_000
```

The compiler will not prevent you from including more than 3 decimal places in a number, however the extra digits will be truncated when processed by DiamondFire due to its precision limit. 

```tc
global PI = 3.14159;
print(PI); // 3.141
```

If you absolutely require higher precision numbers, your best bet is to use [Vectors](vector.md), although Vectors cannot take advantage of Set Variable actions that operate on numbers.

## Raw %math Expressions
When writing equations, it is highly recommended to use Terracotta's powerful [Expression](../language_features/expressions.md) system instead of raw %math expressions. However, in cases where you need very fine control over compiled output, number values with arbitrary characters (e.g. %math expressions) can be created by putting `n` before a string. The contents of the string will be placed directly into the number value.

```tc
line a = 5;
player.sendMessage(n'%math(%var(a) * 2)');
```

## Operations
### + (Addition)
#### `num` + `num`: `num`
Adds the left and right Numbers together.
```tc
2 + 2 = 4 // Not 5
```

#### `num` + `str`: `str`
Converts the Number into a String and adds it onto the String.
```tc
15 + " killstreak!" = "15 killstreak!"

"Coins: " + 5 = "Coins: 5"
```

#### `num` + `txt`: `txt`
Converts the left Number into a String then adds it at the beginning of the right Styled Text.
```tc
15 + s" <red>seconds left!" = s"15 <red>seconds left!"

s"Your level: " + 20 = s"Your level: 20"

```

### - (Subtraction)

#### `num` - `num`: `num`
Subtracts the right Number from the left Number.
```tc
10 - 6 = 4
```

### * (Multiplication)

#### `num` * `num`: `num`
Multiplies the two Numbers together.
```tc
4 * 5 = 20
```

#### `vec` * `num`: `vec`
Multiplies the length of the Vector by the Number.
```tc
vec(2,0,1) * 3 = vec(6,0,3)

2 * vec(2,0,1) = vec(4,0,2)
```

### / (Division)

#### `num` / `num`: `num`
Divides the left Number by the right Number.
```tc   
2 / 4 = 0.5
```

#### `vec` / `num`: `vec`
Divides the Vector and the Number.
```tc
vec(10,5,0) / 2 = vec(5,2.5,0)

2 / vec(10,5,0) = vec(0.2,0.8,0)
```

### ** (Exponentiation)

#### `num` ** `num`: `num`
Raises the left Number to the power of the right Number.
```tc
2 ** 10 = 1024
```

### % (Remainder)

#### `num` % `num`: `num`
Returns the remainder after dividing the left Number by the right Number.
```tc
-1 % 10 = -1
```

### %% (Modulus)

#### `num` %% `num`: `num`
Returns the modulus of the left Number and the right Number.
```tc
-1 %% 10 = 9
```

### Bitwise Operations
The following bitwise operators can be used on numbers:

- `&`: And
- `|`: Or
- `^`: Exclusive Or
- `<<`: Left Shift
- `>>`: Right shift
- `>>>`: Unsigned Right Shift
- `~`: Not (used as a prefix, similar to `!`)

To use the enhanced precision versions of bitwise operations, put a `^` at the start of the operator.
(e.g. `^&` is precise AND, `^^` is precise XOR, `^>>>` is precise unsigned right shift)