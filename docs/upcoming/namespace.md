# Namespaces (proposed)
!!! danger "This feature does not exist yet!"
    This is the current design for how namespaces *might* be implemented *in the future*. 

    Namespaces as documented here do not exist in any current version of Terracotta, and even when they are implemented, they might differ from what's described on this page.

    EVERYTHING HERE IS SUBJECT TO CHANGE!!

Feedback and suggestions can be given at [#namespace-feedback](https://discord.gg/tKZNgS5q8r).


## Declaring Namespaces
Namespace declarations consist of:

- The `namespace` keyword
- The namespace's name
- The namespace's body, enclosed in brackets

```tc
namespace example {
    // members go here
}
```

Namespace members must have names that are identifiers, meaning they cannot contain special characters or spaces. Each member of a namespace must have a unique name, meaning you cannot have a function and a variable that share the same name coexist in one namespace.

The namespace's own name must also be an identifier.

### Variables
Placing an identifier in the namespace's body and specifying its type will declare a variable scoped to the namespace itself. Internally, these variables always compile to game vars with a prefix representing the namespace the variable is contained in. This means different namespaces can declare variables with the same name and the variables will remain distinct.

Because of the nature of namespace variables, they cannot be accessed via `%var()` or any other percent codes. If you need to mimic the behavior of `%var()` when accessing namespace variables, see [Dynamic Access](#dynamic-member-access).

```tc
namespace one {
    foo: num;
    cool_data: list[list[str]];
}

namespace two {
    // this is a completely different variable from the 'foo' in namespace one.
    // one.foo and two.foo will not share the same value.
    foo: num;

    // because the variables are completely different, you can also assign
    // them different types
    cool_data: dict[num];
}

```

Assigning to a namespace variable in its declaration is allowed. The variable will be initialized to this value in the `PlotStartup` game event. (More specifically, these initializations occur after internal Terracotta setup like Item Libraries has completed but before any other event code runs). 

When initializing a namespace variable to a value, the variable's type can be inferred from the type of the value.

```tc
namespace example {
    initialized: num = 5;
    inferred = "wow!"; // inferred as type 'str'
}
```

!!! failure "Saved variables and variables with percent codes"
    Namespaces cannot directly store either of these types of variables. In future versions of Terracotta you will be able to work around this limitation by using macros, which will be storable in namespaces.
    ```tc
    namespace player_data {
        macro coins: num = saved "coins %uuid";
    }

    // this will compile directly to `saved "coins %uuid"`
    player_data.coins
    ```

### Functions/Processes
[Function](../code_blocks/function.md#declaring-functions) and [Process](../code_blocks/process.md#declaring-processes) declarations can be placed directly inside namespaces. Internally, these functions compile with a prefix representing the namespace the function is contained in. This means different namespaces can declare functions with the same name and the functions will remain distinct.
```tc
namespace example {
    function test(msg: str) {
        print(msg);
    }

    process loop {
        repeat {
            wait;
        }
    }
}
```

### Nested Namespaces
Namespaces can be contained inside other namespaces. This can be done by putting a path into a namespace declaration's name, or by literally nesting the declarations.
```tc
// both examples are valid ways to declare nested namespaces

// example one: nested namespace declaration
namespace plr {
    namespace damage_manager {
        function damage() {
            // ...
        }
    }
}

// example two: pathed namespace declaration
namespace plr.damage_manager {
    function damage() {
        // ...
    }
}
```

Each layer of a namespace declaration's path will be created as its own namespace if it does not already exist.
```tc
// this is allowed even if 'dingus' and 'dingus.rhombus' aren't declared
// anywhere else. 'rhombus' will be a namespace that contains 'test', and
// 'dingus' will be a namespace that contains 'rhombus'.
namespace dingus.rhombus.test {

}
```

Pathed namespace declarations and nested namespace declarations are not mutually exclusive. When nesting a pathed namespace declaration inside of another namespace declaration, the path will be relative to the containing namespace.

```tc
// this code is equivalent to the previous example
namespace dingus {
    // this sub-namespace's full path is 'dingus.rhombus.test' since the path
    // 'rhombus.test' is relative to 'dingus'
    namespace rhombus.test {

    }
}
```

### Openness/Merging
Namespaces in Terracotta are "open", meaning multiple different namespace declarations that share the same name will all be merged into one singular namespace. This means you can freely split the contents of a namespace across different files.


Because of how namespace merging works, the two examples provided below are equivalent and interchangeable.
```tc title="Example One: Everything in one file"
// file: plr.tc
namespace plr {
    health: num;
    function damage() { /* ... */ }

    is_loaded: num = 0;
    namespace events {
        function on_join() { /* ... */ }
        function on_leave() { /* ... */ }
    }
}
```

```tc title="Example Two: Contents split into multiple files"
// file: plr_health.tc
namespace plr {
    health: num;
    function damage() { /* ... */ }
}



// file: plr_events.tc
namespace plr {
    is_loaded: num = 0;
    namespace events {
        function on_join() { /* ... */ }
        function on_leave() { /* ... */ }
    }
}
```

## Accessing Namespace Members
Inside of namespaces, members and members of ancestors can be accessed by using their identifiers.
```tc
namespace wow {
    number: num;

    function amazing() {
        // `number` is naturally in scope for this function
        print(number);
        // `string` is not
    }
}

namespace wow.nested {
    string: str;

    function incredible() {
        // `number` and `string` are both naturally in scope
        print(number, string);

        // so is `amazing`
        amazing();
    }
}
```

To access namespace members in any other contexts, you must either import the entire namespace or the members you want to access. For the examples shown, refer to the below namespace.
```tc title="Reference namespace"
namespace test {
    foo: num;
    function bar(value: num) { /* ... */ }

    namespace loops {
        game_loop_started = 0;
        process game_loop() { /* ... */ }
        function lagslayer_recovery() { /* ... */ }
    }
}
```

### Importing Namespaces
Entire namespaces can be imported using the `import` keyword followed by the namespace's path. The namespace can then be referred to by its name, and its members can be accessed by putting a dot (`.`) after its name.
```tc
import test;

test.bar(test.foo);

start test.loops.game_loop();
test.loops.game_loop_started = 1;
```

### Importing Members
Namespace members, including sub-namespaces, can be directly imported by putting their path after the `import` keyword. They can then be referred to by their name (the last thing in their path).
```tc
import test.bar;
import test.foo;
import test.loops.game_loop;
import test.loops.game_loop_started;

bar(foo);

start game_loop();
game_loop_started = 1;
```

```tc
import test;
import test.loops;

test.bar(test.foo);

start loops.game_loop();
loops.game_loop_started = 1;
```

### Aliases
Imported namespaces and imported members can be given aliases by putting `as alias` after the import statement's path. To access said namespace/member, use the alias instead of its default name.
```tc
import test as thingies;
import test.loops.lagslayer_recovery as ls_recover;

thingies.bar(thingies.foo);

ls_recover(); // calls test.loops.lagslayer_recovery
```

## Reflection

The structure of a namespace can be read at runtime. The syntax for doing this is still WIP.

```tc
import some_namespace;

// get structure as lists
line keys = namespace.getKeys(some_namespace);
line values = namespace.getValues(some_namespace);

// iterate over a namespace
for (line key, line val of some_namespace) {

}

// check if a namespace has a specific member
if (namespace.has_member(some_namespace, "some_member")) {

}

```


## Schema Types

!!! abstract "Feedback is especially requested for schemas"
    First off, "Schema" is a placeholder term! If you can think of a better name for this concept, please leave a suggestion!

    Secondly, of all the things proposed here, schemas are definitely the thing that's least set-in-stone. Critiques and suggestions for modifications/alternatives to the schema system would be greatly appreciated.

    Feedback and suggestions can be given at [#namespace-feedback](https://discord.gg/tKZNgS5q8r).

Namespaces can be given a schema, which is a type that all its members must adhere to. This type can be a DF primitive (e.g. `num` or `list`), a function/process, or even a nested namespace.

Schemas are enforced anywhere the namespace is contributed to. Each namespace can only have one schema.

```tc
// file: numbers_main.tc
namespace numbers {
    schema: num; // all members must be a number

    one: 1;
    two: 2;
    three: "three"; // this throws an error
}



// file: numbers_extra.tc
namespace numbers {
    // the schema from numbers_main.tc is still in effect here
    
    four: vec(4); // which means this throws an error
    five: 5; // but this is okay
}
```

### Function Schema Type

To declare a namespace that contains functions of a specific signature, put `function(args) -> returnType` as the schema type.
```tc
namespace funcs {
    schema: function(arg: num, ...more_args: str) -> txt;
}
```

### Namespace Schema Type

To declare a namespace that contains sub-namespaces of a specific format, put the `namespace` keyword followed by the desired format as the schema type. 

By default, all members present in the schema namespace must be *initialized to values* in namespaces that adhere to the schema. For functions/processes this means an implementation must be provided, for variables this means they must be initialized to a default value.

```tc
namespace block_type {
    // the schema namespace is the "blueprint"
    schema: namespace {
        name: txt;
        hardness: num;
        function on_mined(location: loc) -> list[item];
    };
}

// all member namespaces must adhere to the blueprint
namespace block_type.stone {
    name: s"Stone";
    hardness: 5;
    function on_mined(location: loc) {
        return item("cobblestone");
    }
}
```

Variable members in the schema namespace can be made optional by putting a question mark (`?`) after their names. Namespaces adhering to the schema can choose to not define optional variable members and will inherit the definition provided in the schema namespace. Assigning a default value to a member in the schema namespace will automatically make it optional (regardless of the presence of a question mark).

```tc
namespace block_type {
    schema: namespace {
        required_tool?: str;
        extra_attributes: list[str] = [];

        name: s"Stone";
        /* ... */
    };
}

namespace block_type.stone {
    /* 
    the below definitions are "added in"/inherited automatically,
    so you don't have to include them yourself

    required_tool: str;
    extra_attributes: list[str] = [];
    */

    // name still has to be specified since it isn't optional
    name: s"Stone";

    /* ... */
}

namespace block_type.obsidian {
    // you can, of course, always choose to define optional members
    required_tool: "diamond_pickaxe";
    extra_attributes: ["portal_material"];

    name: s"Obsidian";
    /* ... */
}
```

## Dynamic Member Access
To dynamically access the members of a namespace, use square bracket syntax. Only namespaces with [Schemas](#schema-types) support dynamic access. Dynamic access can reach variables, functions, processes, and sub-namespaces.

```tc title="Example namespace"
namespace items {
    schema: namespace {
        stack: item,
        cancel_rc?: num,
        function right_click(): void,
    };


    namespace sword {
        stack: item("diamond_sword");
        function right_click() { /* ... */ }
    }
    namespace egg {
        stack: item("egg");
        cancel_rc: 1;
        function right_click() { /* ... */ }
    }
}
```

```tc title="Example of dynamic access"
import items;

playerevent rightClick {
    line item_id = default.mainHandItem.getTag("item_id");
    items[item_id].right_click();
    if (items[item_id].cancel_rc) {
        event.cancel();
    }
}

// you could also do this by storing a reference to the
// sub-namespace into a variable

playerevent rightClick {
    line item_data = items[default.mainHandItem.getTag("item_id")];
    item_data.right_click();
    if (item_data.cancel_rc) {
        event.cancel();
    }
}
```

!!! warning ""Creating" a new member is undefined behavior!"
    While the below code will compile correctly and will appear to create a new member on `dingus`, this is considered unsupported and should not be used. Members created this way will not appear in any [Reflection](#reflection) methods, and the behavior regarding these "phantom" members may change or break at any time.

    ```tc
    namespace dingus {
        schema: num;
    }

    // do not do this
    line key = "non_existent_member";
    dingus[key] = 5;
    ```

    Namespaces are designed for data whose structure is known at compile-time. If you find yourself trying to write the example shown above, you should probably be using a [Dictionary](../code_values/dictionary.md).