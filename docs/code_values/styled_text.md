To turn a [String](string.md) into a Styled Text, prefix it with `s`.

```tc
player.sendMessage(s"<green><bold>Welcome to", s'<rainbow>amazing skyminer');
```

[Escape Sequences](string.md/#escape-sequences) work the same in Styled Texts as they do in Strings.

For a complete list of tags that are available in Styled Texts, see [MiniMessage Format](https://docs.papermc.io/adventure/minimessage/format/){target=_blank}.

## Operations
### + (Addition)
#### `txt` + `any`: `txt`
Stringifies the value and adds it onto the Styled Text.
```tc
s"Spawn point: " + loc(10,50,10) = s"Spawn point: [10,50,10]"
s"Unlocks: " + ["Diamond Sword", "Health Up"] = s"Unlocks: [Diamond Sword, Health Up]"

15 + s" <red>seconds left!" = s"15 <red>seconds left!"
```