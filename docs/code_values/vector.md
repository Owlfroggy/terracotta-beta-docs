## Syntax
Vectors are created using the `vec` constructor. Like all constructors in Terracotta, the values passed into the constructor are [Expressions](../language_features/expressions.md) and can take full advantage of their features.

```tc
vec(x: num, y: num, z: num)
```

The `vec` constructor can also be passed a single number, creating a Vector with its X, Y, and Z components all set to that number. `vec(n)` is equivalent to `vec(n, n, n)`
```tc
vec(value: num)
```

## Floating-Point Behavior
Unlike numbers which have a fixed precision 3 decimal points, the components of Vectors are stored internally by DiamondFire as floating-point numbers. This means they benefit from greatly increased precision. However, any time you store a component of a Vector into a Number, that extra precision is lost.

Arithmetic operators (`+`, `-`, `*`, and `/`) preserve their operands' full precision when operating directly on a Vector.
```tc
vec(2) / 3 = vec(0.66666666666...)
vec(1,2,4) / vec(3,7,3) = vec(0.333333..., 0.285714285..., 1.333333...);
```

However, any operations that don't include Vectors can still "pollute" an entire equation: Operations between numbers are always imprecise, and that imprecision *can* go on to affect Vectors that they don't directly touch.
```tc
// (1/3) is evaluated to '0.333'. vec(2) is then multiplied by the
// truncated '0.333', resulting in the imprecise vector output
vec(2) * (1/3) = vec(0.666, 0.666, 0.666)


// again, 1/3 is evaluated to '0.333' since it's an operation between 
// two numbers. that '0.333' is what the vec constructor receives.
vec(1/3) = vec(0.333, 0.333, 0.333);
```

A similar problem appears when trying to modify components of Vectors by extracting them as Numbers.
```tc
line test = vec(1)/3; // vec(0.33333333333...)

test = test.setComponent(test.getComponent(comp="X"), comp="X");
// test now is vec(0.333, 0.333333333..., 0.333333333...)
// just by extracting the component to a number, precision is already lost.
```

!!! info "But wait! Aren't vectors limited to two decimal places??"
    Whenever DiamondFire displays a vector's components, either on the vector item's lore or when a vector is converted to a string, its *stringified form* is truncated to two decimal places. However, this is merely visual, and the full precision is still stored inside the vector. 
    
    You can test this yourself by running `/vec get 3.14159 0 0`, then running `/i tag list` while holding the vector you just got.

    When debugging vector issues, though, it can be very helpful to see a vector's un-truncated components. Below is a function which can be used to do that. Note that this function is fairly CPU intensive, and therefore should only be used for debugging purposes.
    ??? abstract "Click to view code"
        ```tc
        function precise_vector_stringify(
            /** the vector to visualize */
            v: vec, 
            /** displays this many decimal places more than df's normal stringify would. */
            extra_decimal_places: num = 6
        ): str {
            if (extra_decimal_places < 1) {
                print(
                    "Vector stringify param 'extra_decimal_places' must be >= 1.", 
                    style="Error", sound="Error"
                );
                return "error";
            }
            v *= 10 ** extra_decimal_places;
            
            line output_strings: list[str] = [];
            for (line c of ["X", "Y", "Z"]) {
                line string_value = str.setToString(v.getComponent(comp=c));
                
                // remove negative sign while digits are being operated on
                line prefix = "";
                if (string_value.startsWith("-")) {
                    prefix = "-";
                    string_value = string_value.trim(2);
                }
                
                // remove existing decimal point
                line dot_pos = string_value.find(".");
                line original_decimal_count = 0;
                if (dot_pos > 0) {
                    original_decimal_count = string_value.len() - dot_pos;
                    line int_str = string_value.trim(1, dot_pos - 1);
                    line dec_str = string_value.trim(dot_pos + 1);
                    string_value = int_str + dec_str;
                }

                // add leading zeros if necessary
                line total_shift = extra_decimal_places + original_decimal_count;
                while (string_value.len() <= total_shift) {
                    string_value = "0" + string_value;
                }
                
                // put the decimal point back at the right spot
                line split_idx = string_value.len() - total_shift;
                line int_part = string_value.trim(1, split_idx);
                line dec_part = string_value.trim(split_idx + 1);
                
                string_value = prefix + int_part + "." + dec_part;

                output_strings.append(string_value);
            }
            return "<" + output_strings.join(", ") + ">";
        }
        ```
    ```tc title="Example usage"
    line v = vec(1,2,4) / vec(3,7,3);
    print(precise_vector_stringify(v));
    ```

## Operations

### + (Addition)

#### `vec` + `vec`: `vec`
Adds the XYZ coordinates of the Vectors together.
```tc
vec(5,10,15) + vec(3,2,1) = vec(8,12,16)
```

#### `loc` + `vec`: `loc`
!!! warning "This operator is one-way! You can do `loc` + `vec`, but you cannot do `vec` + `loc`."
Adds the XYZ coordinates of the right Vector to the XYZ coordinates of the left Location, leaving Pitch and Yaw untouched.
```tc
loc(10, 50, 10, 90, 180) + vec(1, 2, 3) = loc(11, 52, 13, 90, 180)
```

#### `vec` + `txt`: `txt`
Converts the left Vector into a String then adds it at the beginning of the right Styled Text.
```tc
vec(0, 42, 0) + s" is a cool vector!" = s"<0, 42, 0> is a cool vector!"

s"Very cool vector: " + vec(0, 42, 0) = s"Very cool vector: <0, 42, 0>"
```

### - (Subtraction)

#### `vec` - `vec`: `vec`
Subtracts the XYZ coordinates of the right Vector from the XYZ coordinates of the left Vector.
```tc
vec(5,10,15) - vec(3,2,1) = vec(2,8,14)
```

#### `loc` - `vec`: `loc`
!!! warning "This operator is one-way! You can do `loc` - `vec`, but you cannot do `vec` - `loc`."
Subtracts the XYZ coordinates of the right Vector from the XYZ coordinates of the left Location, leaving Pitch and Yaw untouched.
```tc
loc(10, 50, 10, 90, 180) - vec(1, 2, 3) = loc(9, 48, 7, 90, 180)
```

### * (Multiplication)

#### `vec` * `vec`: `vec`
Multiplies the X, Y, and Z coordinates of the left Vector by their corresponding X, Y, and Z coordinates in the right vector.
```tc
vec(1,1,2) * vec(0,5,2.5) = vec(0,5,5)
```

#### `vec` * `num`: `vec`
Multiplies the length of the left Vector by the right Number.
```tc
vec(2,0,1) * 3 = vec(6,0,3)
```

### / (Division)

#### `vec` / `vec`: `vec`
Multiplies the X, Y, and Z coordinates of the left Vector by their corresponding X, Y, and Z coordinates in the right vector.
```tc
vec(1,1,1) / vec(1,2,4) = vec(1,0.5,0.25)
```

#### `vec` / `num`: `vec`
Divides the length of the left Vector by the right Number.
```tc
vec(10,5,0) / 2 = vec(5,2.5,0)
```