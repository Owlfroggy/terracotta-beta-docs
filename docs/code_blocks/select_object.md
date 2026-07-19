## Creating and Filtering Selections

Selections in Terracotta work 1:1 with how they work in DiamondFire. Abstractions on top of selections may be implemented in the future, but the 1:1 system described on this page will always be available. 

Selections can be created using the `select` keyword followed by an action. They can be filtered by using the `filter` keyword.

For more information on action syntax, see [Action](action.md#syntax).

```tc
select allPlayers();
filter randomly(2);

global "isHunter %selected" = 1;
```


To reset the selection (equivalent to the block Select Object -> Reset) use:
```tc
select nothing();
```

Unlike normal actions, select actions can optionally exclude their arguments list. This is equivalent to passing in no arguments.
```tc
// these do the exact same thing
select nothing;
select nothing();

// these do the exact same thing
select allPlayers;
select allPlayers();
```

## Conditions

For selection actions that use a condition, put the condition inside the parentheses following the action name. For information on how to write conditions, see [Conditional Expressions](../language_features/expressions.md#conditional-expressions).

```tc
select playersByCondition (player.isLookingAtBlock(item("emerald_block")));
filter byCondition (global "isInGame %selected" == 1);

selected.sendMessage("You live!");

select inverse;
filter byCondition (global "%default isInGame" == 1);

selected.damage(999);
```

!!! tip
    **When using condition actions (e.g. `player.isLookingAtBlock()`), it's best to use `player` / `entity` as opposed to targeted namespaces like `default` or `selectedEntity`.**
    
    When using `player` or `entity` the compiler can put the condition inside the Select Object block itself. When you specify a target, the compiler has to generate extra code to make sure the target is properly accounted for.

Selection conditions can take full advantage of conditional expressions.
```tc
// magic
select playersByCondition (
    (player.isSprinting() && player.isSprinting()) 
    || global "level %selected" > 10
);
```

## Inverting (NOT arrow equivalent)
An exclamation point `!` can be placed in front of the action's name to invert it.
```tc
// selects everyone EXCEPT default
select !playersByName(default.uuid);
```

Selection actions which take conditions can also place the `!` in front of the condition's parentheses in the same way that if statements can.
```tc title="Alternative way to select everyone except default"
select playersByCondition !(player.nameEquals(selected.uuid));
```