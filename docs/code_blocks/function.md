## Declaring Functions
Function declarations consist of:

- The `function` keyword
- The name of the function
- (optional) The function's parameters
- (optional) The function's return types
- The function's body, enclosed in brackets

Function declarations are global, meaning they are available to be called from anywhere in any file.

Individual files can contain multiple different declarations by placing them one after the other.

The function's name may be provided with or without quotes. If you want to use special characters (e.g. spaces, dashes, slashes, etc.), you must wrap the name in quotes
```tc
function foo {
    // ...code here
}

function "function with special chars!!!" {
    // ...code here
}
```

### Parameters
Functions may specify a list of parameters that the caller can supply values to.
Parameters take the form `param_name: type`.
They can be made plural by prefixing the name with `...` and made optional by suffixing the name with `?`.

```tc
function foo(
    required_param: str, 
    optional_param?: any, 
    ...plural_param: num, 
    ...optional_plural?: list
) {
    // ...code here
}
```

Optional parameters may be placed before or after required parameters, and can be assigned default values putting `=` and a value after the parameter declaration (see the `name` parameter in the example below). 

Default values must be constant, i.e. they cannot produce codeblocks when evaluated.

```tc
function sendMessageFrom(name?: str = "Anonymous", message: txt) {
    allPlayers.sendMessage(name + ": ",messageParts);
}
```

!!! tip
    Assigning a default value to a parameter will automatically make it optional, meaning these two parameter declarations are both valid and function exactly the same:
    ```tc
    name?: str = "Anonymous"
    name: str = "Anonymous"
    ```

Parameters can be declared without types and will default to type `any`, though this is generally discouraged as type annotations allow for values to be used in expressions and enable increased autocomplete accuracy.

```tc
// not advised :(
function bar(typeless, these_are_any_type) {
    // ...code here
}
```


#### Variable Type Parameters
By default, values passed into functions are copied. This means that if a dict, list, or any other value is passed to a normal parameter, the function cannot modify the value that was passed in since it was handed a copy.
!!! failure "This example DOES NOT work!"
    ```tc
    // list_val will be a COPY of the list that was passed in, 
    // so changing it will not change the original list
    function append_five(list_val: list) {
        list_val.append(5);
    }
    
    playerevent sneak() {
        line l = [];
        append_five(l);
        print(l) // [] (empty list)
    }
    ```

To get around this, parameters can be typed as `var`. Parameters typed this way will grab a *reference* to whatever variable was passed in, meaning they can modify the contents of that variable and the changes will be visible to the caller.

Variable parameters can specify what type of variable should be passed in by including the type in brackets after `var`, e.g. `var[list]` or `var[str]`

!!! success "Using the `var` type lets this function work correctly"
    ```tc
    function append_five(list_val: var[list]) {
        list_val.append(5);
    }
    
    playerevent sneak() {
        line l = [];
        append_five(l);
        print(l) // [5]
    }
    ```

#### Accessing Parameters
To access the value passed into a parameter, use a line variable of the same name.

Plural parameters will be typed as `list[whatever type the param was actually declared as]`.

```tc
function send_joined_message(joiner: txt, ...parts: txt) {
    // when accessed as a variable, parts has type list[txt]
    default.sendMessage(parts.joinStyled(joiner));
}
```

### Return Types
Functions may indicate that they will return values placing a colon followed by any number of types after the parameter list. If there is no parameter list, the colon should be placed after the function's name.

Functions MUST indicate their return types in order to return values.

```tc
function waste_cpu(input: any): any {
    return input;
}

function return_seven: num {
    return 7;
}

function return_multiple(): num, str {
    return 42, "yee haw";
}
```


## Calling Functions
!!! note "Note: All functions called in these examples have been declared in previous examples on this page"

Functions can be called by putting `()` after the function's name. Arguments can be passed to the function inside the parentheses.
```tc
foo()
bar(5, "ten")
```

If you want to call functions with special characters in their name, or you want to be more explicit about calling a function, use the `call` keyword. When using the `call` keyword to call a function you can leave off the arguments list to pass in no arguments.

```tc title="All of these are valid"
call bar(5, "ten")
call "bar"(5, "ten")
call "function with special chars!!!"
call "function with special chars!!!"()

// you can use `call` to use %var() in function calls
call "return_%var(variable)"();
```

### Accessing Return Values
If a function returns a single value, you can access that value by using it in an expression.
```tc
line seven = return_seven();
print(seven) // 7
print(waste_cpu("input") + " with a suffix"); // "input with a suffix"

// you can also do this with the call keyword
print(call waste_cpu("input") + " with a suffix"); // "input with a suffix"
```

If a function returns multiple values, you must assign variables and cannot use them directly in an expression.
```tc
print(return_multiple()) // error! you must grab the result in vars first

line first, line second = return_multiple();

// you do not have to grab every value that is returned from
// a function, here the second value is being thrown away
line first = return_multiple();
```


## Limitations
Due to the quirks of DiamondFire, functions have a few limitations that are uncommon to encounter but still important to know about:

- Functions cannot have more than 26 parameters.
- Return types count towards the number of parameters.
- Parameters that are both optional *and* plural cannot specify default values.
- Parameters typed as lists or dictionaries cannot specify default values.
- Parameters typed as variables cannot have the optional or plural modifiers applied.    