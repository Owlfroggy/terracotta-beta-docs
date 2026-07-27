## Syntax
Locations are created using the `loc` constructor. Like all constructors in Terracotta, the values passed into the constructor are [Expressions](../language_features/expressions.md) and can take full advantage of their features.

```tc
loc(x: num, y: num, z: num, pitch?: num, yaw?: num)
```

`pitch` and `yaw` are optional and will default to `0` if omitted.

## Floating-Point Behavior
Locations share the same floating-point behavior as [Vectors](vector.md#floating-point-behavior).

When locations along vectors using the `+` or `-` operators, full precision is maintained.

## Operations

### + (Addition)

#### `loc` + `vec`: `loc`
!!! warning "This operator is one-way! You can do `loc` + `vec`, but you cannot do `vec` + `loc`."
Adds the XYZ coordinates of the right Vector to the XYZ coordinates of the left Location, leaving Pitch and Yaw untouched.
```tc
loc(10, 50, 10, 90, 180) + vec(1, 2, 3) = loc(11, 52, 13, 90, 180)
```

#### `loc` + `txt`: `txt`
Stringifies the Location then adds it onto the Styled Text.
```tc
loc(10, 50, 10) + s" is the spawn point!" = s"[10, 50, 10] is the spawn point!"

s"The spawn point is: " + loc(10, 50, 10) = s"The spawn point is: [10, 50, 10]"

```

### - (Subtraction)
#### `loc` - `vec`: `loc`
!!! warning "This operator is one-way! You can do `loc` - `vec`, but you cannot do `vec` - `loc`."
Subtracts the XYZ coordinates of the right Vector from the XYZ coordinates of the left Location, leaving Pitch and Yaw untouched.
```tc
loc(10, 50, 10, 90, 180) - vec(1, 2, 3) = loc(9, 48, 7, 90, 180)
```