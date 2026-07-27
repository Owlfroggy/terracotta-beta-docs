# Expressions

Expressions are one of Terracotta's most powerful features. They allow you to conveniently generate complex values in the places they're actually being used, and they let you forget about having to manually juggle all the indermediate temporary variables.

In Terracotta, you can write an expression anywhere you can put a value. If you're unsure whether or not a certain value accepts expressions, just try it! It will likely just work, and if it doesn't you'll be given a convenient error informing you of the exception.

For uses of the Set Variable block not covered by expressions, see [Set Variable](../code_blocks/set_variable.md).

```tc
line reward = num.round(game.playerCount * ks_bonus * (global "killstreak %default" + 10));

default.teleport(default.location + default.direction * global "teleport_range %default");

default.givePotionEffect(pot("Speed", 1, (10*20) + num.random(0,max_potion_bonus)));
```

## Value Operators

!!! info
    Many operators work on more types of code values than just numbers. For more info on which operators work with which code values, check out the code values' respective pages under the Code Values category.

Terracotta supports the following operators:

 - `+` - Addition
 - `-` - Subtraction
 - `*` - Multiplication
 - `/` - Division
 - `**` - Exponentiation
 - `%` - Modulo
 - [Bitwise operations](../code_values/number.md#bitwise-operations)

## Order of Operations

Terracotta operators follow a similar order of operations to most normal programming langauges. Arithmetic operations follow PEMDAS/BEDMAS/BODMAS. For a complete breakdown, expand the box below.

??? info "Operator precedence" 
    Operations closer to the top of this list are evaluated before things closer to the bottom. Operations on the same line of this list are evaluated from left to right.
    <br><br>

    > HIGHER UP: EVALUATED EARLIER (Higher Precedence)

    | Precedence | Name | Operators |
    | -- | - | - |
    | 15.| Nested expressions (parentheses), indexing into dicts/lists,<br>accessing namespace values, and calling functions
    | 14.| Logical NOT, bitwise NOT | `!`, `~`
    | 13.| Typecasting | `as`
    | 12.| Exponentiation | `^`
    | 11.| Multiplication, division, and modulo | `*`, `/`, `%`
    | 10.| Addition and subtraction | `+`, `-`
    | 9. | Bitwise Shifts | `<<`, `>>`, `>>>`
    | 8. | Relational comparisons | `<`, `>`, `<=`, `>=`
    | 7. | Equality comparisons | `==`, `!=`
    | 6. | Bitwise AND | `&`
    | 5. | Bitwise XOR | `^`
    | 4. | Bitwise OR | `|`
    | 3. | Logical AND | `&&`
    | 2. | Logical OR | `||`
    | 1. | Assignment | `=`, `+=`, `-=`, etc.

    > LOWER DOWN: EVALUATED LATER (Lower Precedence)

## Inlined Function Calls
Any function that returns a value can be used in expressions. Some actions like Set Location Coordinate still return a value even if their description doesn't say so. Generally, if an action has `Variable - Variable to set` as its first parameter, it can be inlined.

```tc
line msg = "You rolled a " + num.random(1,6) + "!";

line new_y_level = default.y.floor() + 5;

player.giveItems(
    item(var.setToRandom("cooked_porkchop","cooked_beef","golden_carrot"),16)
);
```

Custom function calls can be inlined as long as the function being called specifies a return value.
```tc
function get_coin_amount(): num {
    return num.random(5, 10);
}

playerevent killPlayer {
    saved "coins %uuid" += get_coin_amount() * saved "coin_multiplier %uuid";
}
```

For more information on calling functions, see [Action](../code_blocks/action.md#syntax), [Set Variable](../code_blocks/set_variable.md#syntax), or [Function](../code_blocks/function.md#calling-functions)

## Incrementors
Incrementors do an operation to a variable without having to write out `variablename = variablename <operation> <value>`.

```tc title="Incremetors"
global added      +=  10;
global subtracted -=  2389;
global multiplied *=  100;
global divided    /=  10;
global exponented **= 3;
global moduloed   %=  2;
```

All forms of [Bitwise operations](../code_values/number.md#bitwise-operations) can be made into incrementors by putting a `=` on the end.   

## Typecasting
Terracotta has a decent amount of type inference built in, so for most situations you won't have to worry about types. Sometimes though, the type of a value is unknown and must be specified manually in order to use it with operations. This can be done by adding `as <type>` after the value.

In the below case, assume `spawn_location`'s type is unknown. For the compiler to know what to do when adding the vector to it, you have to manually specify that it's a location.
```tc
player.teleport(spawn_location as loc + vec(1,10,1));
```

The `as` operator can be applied to anything, not just variables.

```tc
player.teleport(spawn_location_dict["main"] as loc + vec(0,10,0));

line new_tag = item.getTag(default.mainHandItem,"damage") as num + 10;
```


## Indexing Operation

Values in lists and dicts can be accessed via square bracket syntax from within expressions.

```tc
line data = {
    awesome_key: "woah"
};
player.sendMessage(data["awesome_key"]); // woah

line other_data = [1,2,"buckle my shoe"];
player.sendMessage(other_data[3]); // buckle my shoe
```

!!! warning
    Even though you *can* easily do the same index operation in multiple places, it's not recommended. Every index operation creates more codeblocks, which uses more CPU. For this reason, if you know a value is not going to change, it's best to only index once and store the result in a variable.

    !!! failure "Generates extra codeblocks"
        ```tc
        global locations: dict[loc] = {
            spawn: loc(10,50,10)
        };

        player.sendMessage("Teleporting to location", locations["spawn"]);
        player.teleport(locations["spawn"]);
        ```

    !!! success "Best performance"
        ```tc
        global locations: dict[loc] = {
            spawn: loc(10,50,10)
        };

        line selected_loc = locations["spawn"];

        player.sendMessage("Teleporting to location", selected_loc);
        player.teleport(selected_loc);
        ```

    It's true that the above example is a bit unnecessary, but in loops or when using indexing operations that traverse multiple levels the saved CPU can really add up.

Indexes can themselves be expressions.
```tc
line scores = [23,925,78,873];
player.sendMessage(scores[num.random(1,4)]);
```
```tc
line teams: dict[{points: num}] = {
    red: {points: 12},
    blue: {points: 15},
};

line points = teams[var.setToRandom("red","blue")]["points"];
```

Multiple levels can be traversed; just make sure your variables are properly typed to avoid having to typecast.
```tc
global team_data: dict[{unlocks: list[str]}] = ({
    red_team: {
        unlocks: ["damageBoost","healthBoost"]
    }
});

line first_unlock = team_data["redTeam"]["unlocks"][1];
```

You can set dictionary values by indexing into them and using an assignment operator.

```tc
global nums: dict[num] = {};
nums["key"] = 100;

player.sendMessage(nums["key"]); // 100
```

Using this syntax to change nested values will change the value in the original dictionary.
```tc
global crazy = {
    words: ["random value"]
};
crazy["words"][0] = "jeremaster";

player.sendMessage(crazy["words"][0]); // jeremaster
```

## Conditional Expressions

Conditions in Terracotta are much more capable than they are in standard DiamondFire. They can take full advantage of logical operators and the expression system, allowing you to easily write complex logic.

For more information on where conditions can be used, see [If Statements](../code_blocks/if.md), [While Loops](../code_blocks/repeat.md#while-loops), and [Select Object](../code_blocks/select_object.md#conditions).

### Condition Actions
Condition action syntax is identical to [normal action syntax](../code_blocks/action.md). Just like normal actions, conditions relating to value types can be called as [Methods](../code_blocks/set_variable.md#method-syntax).

```tc
if (event.commandEquals("spawn")) {
    player.teleport(loc(5,50,5));
}
```
```tc
select playersByCondition (saved "powerups %uuid".contains("speedBoost"));
```

??? question "Expand this box to convert If Actions to their Terracotta equivalents"
    Click on "If Player" to change to a different code block.
    <tc-action-translator block="If Player">Loading...</tc-action-translator>

### Comparison Operators
Comparison operators compare their left expression and right expression.
The following comparison operators are available:

- `==`
- `!=`
- `<`
- `>`
- `<=`
- `>=`

`==` and `!=` work with any types of values. `<`, `>`, `<=`, and `>=` only work with numbers.

```tc
if (default.y + 2 > 100) {
    // ...code here
};
```
```tc
select playersByCondition (saved "powerup %uuid" == "extraHealth");
```

### Logical Operators

The AND (`&&`) operator checks if two conditions are both true.
```tc
if (default.isFlying() && default.y > 100) {
    // this code runs if you are flying AND you are above y=100
    default.sendActionBar(s"You flew too close to the sun!");
    default.setFireTicks(20);
}
```

The OR (`||`) operator checks if at least one of two conditions is true.
```tc
if (default.hasItem(item("emerald")) || default.isStandingOnBlock(item("emerald_block"))) {
    // this code will run if you have an emerald or are standing on an emerald block
    // if both conditions are true, this code will still run
    default.sendMessage("you survive!");
}
```


The NOT operator (`!`) inverts a condition by checking if it is false. You can think of this as a more versatile version of the NOT arrow in DiamondFire.
```tc
if (!default.hasPlotPermission(permission="Developer")) {
    player.sendMessage(s"<red>You do not have permission to use this command!");
    return;
}

// you can use `!` to invert anything, not just individual condition actions
if ( !(a < b || !default.isFlying()) ) {
    // ...code
}
```

Logical expressions can get arbitrarily complex, though you should remain aware that complex expressions such as the one below can generate a large number of code blocks.
```tc
if (
    !(default.isSprinting() && default.isSneaking())
    || (game.blockEquals(default.location - vec(0,1,0), item("coal")))
    || (50 < default.y && default.y < 100)
) {
    // do... something.....
}
```

### Short-Circuit Evaluation
The `&&` and `||` operators do short-circuit evaluation. If a logical operator's second condition would not change its result, the second condition's code will not be run at all.

In the example `a && b`, `b` will not be checked at all if `a` is false. This is because if `a` is false, there is no way for the `&&` operator to ever be true, so `b` doesn't need to run.

In the example `a || b`, `b` will not be checked at all if `a` is true. This is because if `a` is true, the `||` operator will be true no matter what the value of `b` is, so `b` doesn't need to run.

!!! info "Example using `&&`"
    ```tc
    function first_func(): num {
        player.sendMessage("first func ran!");
        return 0;
    }
    function second_func(): str {
        player.sendMessage("second func ran!");
        return "literally anything";
    }

    playerevent join {
        if (first_func() == 1 && second_func() == 1) {
            // ...
        }
    }
    ```
    Compiling the above example will send `first func ran!` but not `second func ran!`. `first_func()` returned 0 and `0 == 1` is false. There is now no way for the `&&` expression to ever be true so the right-hand side of the `&&` operator doesn't need to be checked and `second_func()` will never be ran.

    If first_func() instead returned `1`, you would see both `first func ran!` and `second func ran!`. The left side of `&&` would be true, which would mean the right side *would* need to be evaluated and `second_func()` would execute.

### Conditions as Values
Conditional expressions aren't limited to contexts that expect conditions. Placing them other contexts will cause them to evaluate to `0` if the condition is false or `1` if the condition is true.

```tc
// prints "1" if the player is flying
// prints "0" if they are not
print(default.isFlying());
```

This rule also applies to more complex conditions.
```tc
// will be "1" if the player is sprint-sneaking
// will be "0" otherwise
line not_sprint_sneaking = !(default.isSprinting() && default.isSneaking());
```

### Implicit Comparison
Using a standalone value as a condition is equivalent to checking if that value != 0.
```tc
// these both do the exact same thing
if (some_variable) {
}
if (some_variable != 0) {
}

// these both do the exact same thing
if (!whatever) {
}
if (whatever == 0) {
}

// these both do the exact same thing
if (always_succeed || num.random(0,5)) {
}
if (always_succeed != 0 || num.random(0,5) != 0) {
}
```