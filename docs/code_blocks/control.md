Instead of taking the form of `block.action()` like most other actions, all parts of the control block's functionality get their own keywords.

## Print
Print exists as a function. 
    
```tc
print("Hello world!");
```

It can specify its tags just like any other action.
```tc
print(
    'error: your function had an oppsie', 
    style="Error", permission="Developer", highlighting="Error"
);
```

!!! note
    Unless the `permission` tag is changed, `print()` messages will ONLY be visible to developers and will NOT be visible to normal players on your plot.

    For messages that are intended to be seen by players, such as join/leave messages or kill messages, you should always use `player.sendMessage()`. For more information on how to do that, see [Action](action.md).

## Wait
Wait exists as a function.
```tc
wait(5); // waits 5 ticks

wait(num.random(5,10), unit="Minutes"); // waits anywhere from 5-10 minutes
print("Bored yet?");
```

`wait` can also be used as a standalone keyword, in which case it will wait for 1 tick.
```tc title="Common loop setup"
process player_loop {
    repeat {
        // the contents of this repeat will run every tick
        wait;
    }
}
```


## Return
Return uses the `return` keyword.

There is currently no way to access the `ReturnNTimes` block from Terracotta, though this may change in the future.

```tc
if (num.random(1,2) == 2) {
    return;
}

print("You got lucky!");
```

To return values, place them after the `return` keyword. For information on returning values, see [Return Types](function.md#return-types).
```tc
if (num.random(1,2) == 1) {
    return "good!";
} else {
    return "bad :(";
}
```
```tc
return "multiple", "values", "with commas!";
```

## End Thread / End All Threads
End Thread and End All Threads exist as functions.

```tc
repeat {
    if (!selectedEntity.exists()) {
        endthread();
    }
    selectedEntity.heal(100);
    wait;
}
```
```tc
function nuke() {
    endallthreads();
}
```

Like `wait`, `endthread` and `endallthreads` can also be used as standalone keywords.

`endallthreads` has a tag to control whether or not the current thread is killed. This tag defaults to true when not provided.


```tc
// these both do the same thing
endthread();
endthread;
```
```tc
// these all do the same thing
endallthreads(endCurrent="True");
endallthreads();
endallthreads;
```
```tc
// but this will let the code below it continue to run
endallthreads(endCurrent="True");
print("I'm alive!!");
```

## Continue (Skip Iteration)
The `continue` keyword acts as a SkipIteration control block.

```tc title="Prints every whole number from 1-10 except 7"
for (line i of range(1,10)) {
    if (i == 7) {
        continue;
    }
    print(i);
}
```

The continue keyword does not need to be within a loop. When placed at the top level of a function, it will skip an iteration of the loop that called that function. If the continue keyword is contained by no loops at all, it will do nothing.

```tc title="Also prints every whole number from 1-10 except 7"
function skipLogic(i: num) {
    if (i == 7) {
        continue;
    }
}

for (line i of range(1,10)) {
    skipLogic(i);
    print(i);
}
```

## Break (Stop Repeat)
The `break` keyword acts as a StopRepeat control block.

```tc title="Prints every whole number from 1-6"
for (line i of range(1,10)) {
    if (i == 7) {
        break;
    }
    print(i);
}
```

All the same placement rules that apply to `continue` apply to `break`.

```tc title="Also prints every whole number from 1-6"
function breakLogic(i: num) {
    if (i == 7) {
        break;
    }
}

for (line i of range(1,10)) {
    breakLogic(i);
    print(i);
}
```