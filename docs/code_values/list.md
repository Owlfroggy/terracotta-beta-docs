## Syntax

Lists are created by enclosing values in square brackets and separating them with commas. The final value is allowed to have a trailing comma.

```tc
["apple","orange","pear"]

[
    "corn",
    "brocoli",
    "carrot", // this comma is allowed 
]
```

Although it's not required, it's recommended to always explicitly type list declarations so that Terracotta knows what's supposed to be in them. If you don't do this, you may encounter type errors when iterating over or indexing into lists.
```tc
line fruits: list[str] = ["apple","orange","pear"];
// Terracotta now knows that fruits is a guaranteed to be a list
// of strings, and it can use that information for type inference
```

Lists can hold a maximum of 10,000 values. Nested lists/dictionaries and their values count towards that total.

## Indexing
To access values inside of a list, use the [Indexing Operation](../language_features/expressions.md#indexing-operation).

Lists start at index `1`, NOT `0`.

!!! warning "DiamondFire Jank"
    Attempting to set to an index that is out of bounds of the list will instead overwrite the final value.
    ```tc
    line unlocks: list[str] = ["doubleJump","teleport"];
    unlocks[3] = "dash"; // overwrites "teleport"

    player.sendMessage(unlocks); // [doubleJump, dash]
    ```

    To add values to lists, use `list:Append()`
    ```tc
    line unlocks: list[str] = ["doubleJump","teleport"];
    
    list.append(unlocks,"dash");
    // OR
    unlocks.append("dash");

    player.sendMessage(unlocks); // [doubleJump, teleport, dash]
    ```

## Iteration
To iterate over a list, use a [For Loop](../code_blocks/repeat.md#iterating-over-values).
```tc
for (line value of [1,17,400_006]) {
    player.sendMessage(value);
}
```

As long as the variable you're iterating over has been properly declared, you shouldn't have to worry about types. However, If you NEED to override the type of a variable when iterating over it, cast the value on the right side of `of` using the `as` keyword. 
```tc
for (line value of probably_a_list_of_numbers as list[num]) {
    player.sendMessage(value);
}
```

## Nesting
Lists and dictionaries can be nested. However, it's important keep in mind that DiamondFire passes lists and dictionaries as copies and not references so behavior regarding nested data may not be intuitive.

```tc
line teamConfigurations: list[list[str]] = [
    ["red","blue"],
    ["green","yellow"]
];

// this variable will grab a COPY!
line firstEntry = teamConfigurations[1];
player.sendMessage(firstEntry); // [red, blue]

// modifications to the copy will NOT modify the original list
firstEntry[2] = "yellow";
player.sendMessage(firstEntry); // [red, yellow]
player.sendMessage(teamConfigurations[1]); // [red, blue]
```

## Operations
### + (Addition)
#### `txt` + `list`: `txt`
Stringifies the List then adds it onto the left Styled Text.
```tc
s"Abilities: " + ["doubleJump","dash"] = s"Abilities: [doubleJump, dash]"
["Red Team","Blue Team"] + s" have tied the match!" = s"[Red Team, Blue Team] have tied the match!"
```