## Declaring Processes
Processes are declared using all the same syntax rules as [Functions](function.md#declaring-functions) except they use the `process` keyword instead of `function`.

Unlike functions, processes cannot declare return types and cannot return values.

```tc
process player_loop {
    // ...code here
}

process game_loop(round_mode: str) {
    // ...code here
}

process "process with special chars!!"(epic_arg) {
    // ...code here
}
```

## Starting Processes
Processes can be started using the `start` keyword followed by the process' name. 

```tc
start player_loop;
start "process with special chars!!"(10);
start "entity_loop_%var(entityId)"();
```

To change local variable and target behavior, use tags in the same way you would for any other action.

```tc
start game_loop("FFA", targetMode="With no targets", localVariables="Don't copy");
```