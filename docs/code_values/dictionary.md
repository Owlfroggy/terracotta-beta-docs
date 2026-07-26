## Syntax
Dictionaries are created by enclosing key-value pairs in curly braces and separating them with commas. Keys must be strings; if you try to use other types as keys they will be cast to strings. Values are expressions by default, but to use expressions for keys you have wrap the expression in parentheses.

```tc
{name: "Void Sword", damage: 14 + num.random(0,3), rarity: "Rare"}

{
    (var.setToRandom("expression", "key")): "random!!!",
    "name with spaces": "wow!", // Trailing commas are allowed
}
```


Although it's not required, it's recommended to always explicitly type dictionary declarations so that Terracotta knows what's supposed to be in them. If you don't do this, you may encounter type errors when iterating over or indexing into lists.
```tc
line scores: dict[num] = {
    Jeremaster: 5,
    Notch: 4
};
// Terracotta now knows that scores is a guaranteed to be a dictionary
// of numbers, and it can use that information for type inference
```

Dictionaries can hold a maximum of 5,000 values. Nested lists/dictionaries and their values count towards that total.

## Indexing
To access values inside of a dictionary, use the [Indexing Operation](../language_features/expressions.md#indexing-operation).

## Iteration
To iterate over a dictionary, use a [For Loop](../code_blocks/repeat.md#iterating-over-values).
```tc
for (line key, line value of {name: "Greg", age: 32}) {
    player.sendMessage(key,"is equal to",value);
}
```

As long as the variable you're iterating over has been properly declared, you shouldn't have to worry about types. However, If you NEED to override the type of a variable when iterating over it, cast the value on the right side of `of` using the `as` keyword. 
```tc
for (line value of probably_a_dict_of_numbers as dict[num]) {
    player.sendMessage(key,"is equal to",value);
}
```

## Nesting
Lists and dictionaries can be nested. However, it's important keep in mind that DiamondFire tends to pass lists and dictionaries as copies not references so behavior regarding nested data may not be intuitive.

```tc
line itemData: {name: str, enchantments: dict[num]} = {
    name: "Diamond Sword",
    enchantments: {
        sharpness: 5
    }
};

// this variable will grab a COPY!
line enchantments = itemData["enchantments"];
player.sendMessage(enchantments); // {sharpness: 5}

//  modifications to the copy will NOT modify the original dictionary
enchantments["knockback"] = 2;
default.sendMessage(enchantments); // {sharpness: 5, knockback: 2}
default.sendMessage(itemData["enchantments"]); // {sharpness: 5}
```

## Operations
### + (Addition)
#### `txt` + `dict`: `txt`
Stringifies the Dictionary then adds it onto the Styled Text.
```tc
s"Settings: " + {theme: "dark"} = s"Settings: {theme: dark}"
{theme: "light"} + s" is concerning..." = s"{theme: light} is concerning..."
```