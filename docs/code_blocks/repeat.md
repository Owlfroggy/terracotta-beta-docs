# Repeat
!!! info "Features relevant to loops"
    For information on how to use the Wait, SkipIteration, and StopRepeat control blocks, see [Wait](control.md#wait), [Continue](control.md#continue-skip-iteration), and [Break](control.md#break-stop-repeat) on the Control block page.

## Repeat Loops
Repeat Forever loops use the `repeat` keyword.
```tc
// this will repeat infinitely unless it contains a break keyword
repeat {
    // ...code here
}
```

Repeat Multiple loops use the `repeat` keyword followed by the number of times it should repeat wrapped in parentheses.
```tc
// will repeat 10 times
repeat (10) {
    // ...code here
}
```
The index can be stored into a variable using the `to` keyword.
```tc
repeat (line index to 3) {
    /// code...
}
```

## For Loops
For loops use the `for` keyword and the `of` keyword. Variables being set go before `of`, and the thing to iterate over comes after `of`.
```tc
for (line value of iterable) {
    // code...
}
```

### Built-in Repeat Actions
For loops are used to access repeat actions like `Repeat On Path` and `Repeat Adjacently`. On the right side of the `of` keyword, these actions can be called as if they were normal functions.

```tc
for (line value of action(args)) {
    // code...
}
```

The following actions are supported:

- `adjacent`
- `grid`
- `path`
- `range`
- `sphere`

```tc
for (line l of path(damager.eyeLocation,victim.location)) {
    allPlayers.displayParticleEffect(par("Flame"), l);
}

for (line i of range(5,10,2)) {
    print(i); // prints 5, then 7, then 9
}

for (line l of adjacent(event.blockLocation, pattern="Cube (26 blocks)")) {
    game.setBlock(item("gold_block"), l);
}
```

### Iterating over Values
For loops can be used to iterate over lists and dictionaries. 
```tc
for (line value of list_variable) {

}
for (line key, line value of dict_variable) {

}

```
The values can be inlined, or variables can be used.
```tc title="Variable Example"
line data: dict[str] = {
    key: "value",
    apples: "oranges"
};

for (line k, line v of data) {
    default.sendMessage(k, v);
}
```
```tc title="Inlining Example"
for (line particle of [par("Flame"),par("Cloud")]) {
    allPlayers.displayParticleEffect(default.location,particle);
}
```

The variables on the left side of `of` will be typed based on the type of the variable being iterated over. For this reason, it's extra important to always provide a type when declaring variables that contain lists or dictionaries.
!!! failure "Not specifying a list's or dict's type may cause unexpected behavior"
    ```tc 
    line values = [5, 10, 20]; // the type of 'values' defaults to list[any]
    for (line val of values) {
        // val will have type 'any' in here, causing its use in this expression to throw an error
        print(val * 2) // error: operation '*' is not supported for case: any * num
    }
    ```

!!! success "When declaring values as a list[num], this code works as expected"
    ```tc 
    line values: list[num] = [5, 10, 20];
    for (line val of values) {
        // val will now have type 'num' in here since it gets it from the list's type
        print(val * 2) // prints 10, then 20, then 40
    }
    ```

!!! info "When using inlined lists or dicts, it doesn't matter"
    ```tc
    for (line val of [5, 10, 20]) {
        // val will have the correct type of 'num' in here
    }
    ```

If you NEED to override the type of a variable when iterating over it, cast the value on the right side of `of` using the `as` keyword.
```tc
for (line val of some_unknonwn_list as list[num]) {
    // val will now have type 'num' in here,
    // even if some_unknown_list is a list[any], list[str], list[txt], etc...
}
```

## While Loops

While loops use the `while` keyword followed by a condition wrapped in parentheses.

```tc title="Example"
while (condition) {
    // ...code here
}
```

The condition will be re-evaluated for every iteration, meaning actions and functions in the condition will be called repeatedly.

For information on how to write conditions, see [Conditional Expressions](../language_features/expressions.md#conditional-expressions).


```tc
while (num.random(1,10) != 10) {
    player.sendMessage("Still going!");
    wait;
}

while (!player.isStandingOnBlock(item("obsidian"))) {
    player.damage(1);
    wait(20);
}
```

!!! tip
    **When calling condition actions (e.g. `player.isLookingAtBlock()`), it's best to use `player` / `entity` as opposed to targeted namespaces like `default` or `selectedEntity`.**
    
    When using `player` or `entity` the compiler can put the condition inside the Repeat block itself. When you specify a target, the compiler has to generate extra code to make sure the target is properly accounted for.

### Do-While loops
While loops evaluate their condition *before* the loop runs, whereas do-while loops evaluate their condition *after* the loop runs. This means the loop body will always run at least once.
```tc
do {
    // ...code here
} while (condition);
```

### Inverting
While loops and do-while loops can place a `!` in front of the condition's parentheses to invert the entire condition in the same way that if statements can.
```tc
// wait until the player starts sprinting or starts sneaking
while !(player.isSneaking() || player.isSprinting()) {
    wait;
}

do {
    default.launchUp(5);
} while !(default.heldSlot == 1)
```