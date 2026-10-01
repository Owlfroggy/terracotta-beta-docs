!!! warning "Bucket variables are still rough around the edges!"
    Terracotta can do everything with bucket variables that normal DiamondFire can, but there are no convenience features added yet. More improvements to bucket variables will be made in a future update.

## Syntax
Bucket variables can be accessed with syntax similar to constructors.

```tc
bvar(bucket: str, variableName: str, namespaceAlias?: str)
```

Variables/expressions can be passed into the `bucket` and `variableName` parameters.

`namespaceAlias` is optional and will use the plot's default namespace if omitted.

!!! warning "Bucket variables currently cannot be assigned types like normal variables can, so you will have to use the `as` keyword to typecast frequently. **This will almost certainly change soon.**"

## Usage

Assigning to and reading from bucket variables works as expected.
```tc
bvar("player %uuid","name") = "Jeff";

print(bvar("player %uuid", "name")); // Jeff
```

However, due to their current inability to specify types, typecasting will be required in most situations.
```tc
bvar("player %uuid","launch_power") as num += 5;
player.launchUp(bvar("player %uuid", "launch_power") as num);
```

## Bucket Variable Actions
To use actions related to bucket variable, access `bvar` as a namespace.

```tc
bvar.load("cool_bucket");
bvar("cool_bucket","v") = 10;
bvar.saveAndUnload("cool_bucket");

line v, line status = bvar.getVariable("cool_bucket","v");
if (status == "success") {
    print(v) // 10
} else {
    print(status, highlighting="Error");
}
```