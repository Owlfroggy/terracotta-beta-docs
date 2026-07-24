## Syntax
Almost all actions can be accessed by putting a dot `.` after a namespace and are called like [Functions](function.md/#calling-functions).

The primary exception is [Control](control.md) block actions, which all get their own special syntax.

```tc
//         VV action
player.sendMessage("Hello", "world!");
// ^^ namespace       ^^ args ^^
```

The argument list is allowed to have a trailing comma.
```tc
player.sendMessage(
    "this last comma", 
    "is also valid:",
);
```

### Tags
Tags can be specified by using named arguments and providing the tag option as a string. Any tags which are not specified will be automatically assigned their default values.

If you are using the VSCode extension, you can use the autocomplete shortcut (ctrl+space by default) to quickly insert tag names and values.

```tc
player.sendMessage("Wow!", align="Centered");
```
Tags can also be assigned variables. Each time the action is run, the tag will use the value of the variable at that time as its option. If the variable is not set to a valid tag option, the tag will fall back to using its default option.

To change what option the tag will fall back on in the event of the variable being invalid, put `??` and a tag option after the variable name.
```tc
line option = "Centered";
player.sendMessage(align=option);

// will fall back to "Centered" if some_random_var isn't a valid option
player.sendMessage(align=some_random_var ?? "Centered")
```

## Player/Entity Actions
Player and entity actions use the `player` and `entity` namespaces respectively.
```tc
player.givePotionEffect(pot("Speed"), particles="None", overwrite="False");
entity.damage(5);
```

??? question "Expand this box to convert Player Actions to their Terracotta equivalents"
    <tc-action-translator block="Player Action">Loading...</tc-action-translator>

??? question "Expand this box to convert Entity Actions to their Terracotta equivalents"
    <tc-action-translator block="Entity Action">Loading...</tc-action-translator>

### Targets
`player` and `entity` are equivalent to placing down a Player/Entity action and not choosing a target. 
If a selection is active they will act on the selection, otherwise they will act on the default target.

To choose a target, choose one of the namespaces from the lists below:

??? abstract "Player Action Target Namespaces"
    - `default`
    - `selected`
    - `killer`
    - `damager`
    - `shooter`
    - `victim`
    - `allPlayers`

??? abstract "Entity Action Target Namespaces"
    - `defaultEntity`
    - `selectedEntity`
    - `lastEntity`
    - `killerEntity`
    - `damagerEntity`
    - `shooterEntity`
    - `victimEntity`
    - `allEntities`
    - `allMobs`
    - `projectile`

Then, access these namespaces in the same way you would access `player` or `entity`.
```tc title="Player Action Examples"
default.setVisualShoulderParrot(shoulder="Left", type="Cyan");

allPlayers.sendMessage(s"<green>%default<white>has joined!");

selected.setToCreativeMode();

victim.heal(event.damage/2);

shooter.giveItems(item("Arrow"));
```

```tc title="Entity Action Examples"
defaultEntity.teleport(defaultEntity.location + vec(0,10,0));

line id = selectedEntity.getTag("id");

projectileEntity.setArrowNoClip(hasNoClip="Enable");

allMobs.faceLocation(default.location)

lastEntity.setTag("owner","%default");
```

## Game Actions

Most game actions use the `game` namespace.

```tc
game.spawnMob(item("zombie_spawn_egg"),event.blockLocation);

line mat = game.getBlockMaterial(default.targetBlockLocation);

game.summonLightning(victim.location);

game.setBlock(item("beacon"), loc(10,50,10));
```

Actions relating to events use the `event` namespace.

```tc
event.cancel();

event.uncancel();

event.setDeathMessage(s"%victim went kablooie :(");
```

??? question "Expand this box to convert Game Actions to their Terracotta equivalents"
    <tc-action-translator block="Entity Action">Loading...</tc-action-translator>