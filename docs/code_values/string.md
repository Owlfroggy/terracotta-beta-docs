## Syntax
Strings can use either single or double quotes and compile directly to DiamondFire String items.

```tc
"double quote string"
'single quote string'
```

The closing quote of a string must be on the same line of code as its opening quote.

!!! failure "Strings cannot span more than one line of code."
    ```tc
    "This multiline string
    is invalid..."
    ```

## Escape Sequences
Quotes, ampersands, and backslashes themselves can all be escaped by immediately preceeding them with a backslash.

```tc
player.sendMessage('jeff\'s',"\"amazing\"","creation"); // jeff's "amazing" creation
player.sendMessage(" / iron & diamonds \\ "); // / iron & diamonds \ 
```

Newlines can be inserted using `\n`.
```tc
player.sendMessage("%default's stats:\nCoins: %var(%default coins)\nLevel: %var(%default level)");
```

### Unicode Characters
Unicode characters be inserted using the `\u` escape code. This is especially useful when working with custom UI elements.

!!! warning
    All escape sequences are evaluated at compile time. Due to this, the following is invalid:
    ```tc title="This will NOT compile!"
    line characterCode = "2620";

    player.sendMessage("\u%var(characterCode)");
    ```

Four digit unicode characters can be inserted using `\uFFFF`, where each `F` is a hexadecimal digit.
```tc
player.sendMessage("\u2620 You died!") // ☠ You died!
```

Unicode characters with more or less than 4 digits can be inserted using `\u{}`, with any number of hexadecimal digits inside the braces.
```tc
player.sendMessage("\u{1F525}"); // 🔥
player.sendMessage("\u{44}\u{46}"); // DF
```

One-byte characters can be inserted using `\xFF`, where each `F` is a hexadecimal digit.
```tc
player.sendMessage("\x44\x46"); // DF
```

## Legacy Formatting Codes

Legacy formatting codes can be inserted by directly using the section symbol (`§`). Ampersands (`&`) will not be converted to section symbols, meaning they cannot be used for formatting codes. For formatted text, it's recommended to use [Styled Texts](styled_text.md).

```tc
"§c this string is red!"
"&c this string is not..."
```

## Operations

### + (Addition)
#### `str` + `str`: `str`
Adds the two Strings together.
```tc
"Hello " + "World!" = "Hello World!"
```

#### `str` + `txt`: `txt`
Adds the String to the Styled Text, outputting a new Styled Text. The Styled Text's formatting will carry over to the String, following the rules of the Inherit Styles tag.
```tc
"Hello " + s"<red>World!" = s"Hello <red>World!"

s"<red>Hello " + "World!" = s"<red>Hello World!"

```

#### `str` + `num`: `str`
Converts the Number into a String and adds it onto the String.
```tc
15 + " killstreak!" = "15 killstreak!"

"Coins: " + 5 = "Coins: 5"
```