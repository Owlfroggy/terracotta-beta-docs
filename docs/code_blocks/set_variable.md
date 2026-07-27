!!! info
    Math operations can be done much easier with Expressions. You should only do math via Set Variable actions when you want absolute control over a template's codeblocks, otherwise it's easier to let the compiler handle it for you.
## Syntax
Set Variable action syntax is identical to [normal Action](action.md) syntax, just with different namespaces. 

Most Set Variable actions use a namespace named after the type they operate on (e.g. particle-related actions use `par`, number-related actions use `num`). Actions that don't fit with any individual type are placed into the `var` namespace, and actions that interact with the world are placed into the `game` namespace.

To access the results of Set Variable actions, assign the action call to a variable or use it in an expression.

```tc title="Examples"
// you can nest actions as much as you like!
line rng = num.random(1,num.random(5, 20));

line block_mat = game.getBlockMaterial(default.targetBlockLocation);

default.sendMessage("Purple hex code:", var.setToRGBColor(128, 0, 255));
```

## Method Syntax
Many Set Variable actions can also be called directly on the variables/values that they are associated with, as if the variable/value was the namespace itself. When you call an action this way, you are calling it as a method.

```tc
// alternative to `txt.clearFormatting(defaultEntity.name)`
line clean_name = defaultEntity.name.clearFormatting();

default.setItemInSlot(
    // alternative to `item.addEnchant(default.mainHandItem, "sharpness", 2)`
    default.mainHandItem.addEnchant("sharpness", 2),
    default.heldSlot
);
```

Method calls can also be chained by calling a method on the result of a previous method call.
```tc
line de_underscored = default.name.clearFormatting().replace("_","");

line god_sword = item("netherite_sword")
    .addEnchant("sharpness", 5)
    .setName(s"<red>GOD SWORD!!")
    .addLore(s"<orange>forged in the depths...");
```

!!! bug "Known bug"
    Lots of standalone method calls currently don't work as expected. The below example *looks* like it should edit the name of "cool_item", but it does not.
    This is because `setName()` returns a modified item but does not modify the variable that was passed in.
    !!! failure "This example does NOT work!"
        ```tc
        line cool_item = item("grass_block");
        // cool_item is not modified here
        cool_item.setName(s"Very cool!!");
        ```
    To get around this, assign the result of `setName()` back to `cool_item`.
    !!! success "These examples DO work!"
        ```tc
        line cool_item = item("grass_block");
        cool_item = cool_item.setName(s"Very cool!!");
        ```
        In this specific example, you could could also just write it all on one line.
        ```tc
        line cool_item = item("grass_block").setName(s"Very cool!!");
        ```
    
## Convert DF Actions to Terracotta
To convert Set Variable actions into their Terracotta namespace and name, use this tool.
<tc-action-translator block="Set Variable">Loading...</tc-action-translator>
<br/><br/><br/><br/><br/><br/>