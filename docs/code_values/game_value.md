## Syntax
Game values can be accessed by putting a dot . after a namespace and putting the value's name after the dot.
namespace.value
```tc
namespace.value
```

Values in the `Event Values` category can be accessed with the `event` namespace.
```tc
event.item
event.damageCause
event.blockLocation
```

Values in the `Plot Values` category can be accessed with the `game` namespace.
```tc
game.serverTPS
game.playerCount
game.cpuUsage
```

Values that apply to entities can be accessed using the following namespaces:

- `defaultEntity`
- `selectedEntity`
- `killerEntity`
- `damagerEntity`
- `shooterEntity`
- `victimEntity`
- `projectile`
- `lastEntity`

```tc
selectedEntity.saddleItem
victimEntity.health
lastEntity.uuid
```

Values that apply to players can be accessed using the following namespaces:

- `default`
- `selected`
- `killer`
- `damager`
- `shooter`
- `victim`

```tc
default.name
victim.eyeLocation
selected.attackCooldownTicks
```

The `player` and `entity` namespaces themselves cannot be used to access player/entity values since these values require you to specify a target.

## Convert Game Values to Terracotta 

To convert game values into their Terracotta namespace and name, use this tool. 
<tc-action-translator block="Game Value">Loading...</tc-action-translator>
<br/><br/><br/><br/><br/><br/>