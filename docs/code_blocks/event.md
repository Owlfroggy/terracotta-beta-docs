## Declaring Events
Events declarations consist of:

- The type of the event, indicated by one of three keywords (`playerevent`, `entityevent`, or `gameevent`)
- The name of the event
- The event body, enclosed in brackets


All code inside an event declaration's body will run with that event. 

```tc
playerevent join {
    // ...code here
}

entityevent death {
    // ...code here
}

gameevent startup {
    // ...code here
}
```

Individual files can contain multiple different declarations by placing them one after the other.

Each event can only be declared once per project: If you have already declared the Join player event, all code to be run when a player joins must exist within that one declaration since you cannot declare the Join event anywhere else.

## Accessing Event Actions and Values

The `event` namespace can be used to access actions and game values related to events.

```tc
playerevent damagePlayer {
    if (event.attackIsCritical()) {
        event.setDamage(event.damage / 2);
    } else {
        event.cancel();
    }
}
```


## Lagslayer-Cancel

If an event is clickable with the cancel scythe, the `lscancel` keyword can be used to automatically cancel it if the plot code is halted due to LagSlayer. It MUST come before anything else in the event declaration.

```tc
// nobody will ever be able to jump!
// muahahahahaha!!
lscancel playerevent jump {
    event.cancel();
}
```