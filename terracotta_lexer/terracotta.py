from pygments.lexer import RegexLexer
from pygments.token import _TokenType, String, Number, Whitespace, Error, Punctuation, STANDARD_TYPES, Operator, Name, Keyword, Comment
import re

__all__ = ['TerracottaLexer']

#add custom token types
STANDARD_TYPES[Punctuation.Paren] = "pp"
STANDARD_TYPES[Keyword.Scope] = "ks"

# function that lets you assign a different token to each capture group
# - WARNING! any text that is not in a capture group WILL BE REMOVED FROM THE FINAL OUTPUT!
#   so make sure that every single bit of text INCLUDING WHITESPACE is in a capture group
# - a token type of None will exclude that capture group's content from appearing in the codeblock at all
#   (useful for capture groups used for backreferencing)
def byGroup(*tokens: _TokenType): #realized after the fact that this exists built-in and i made a custom one for nothing!! i even named it basically the same thing!!!!!!
    def byGroupTokenProvider(_, m: re.Match):
        i = -1
        for token in tokens:
            i += 1
            if not m.groups()[i]: continue
            if token == None: continue

            yield m.span(i+1), token, m.group(i+1)

    return byGroupTokenProvider

def highlightEscapeSequences(_, m: re.Match):
    lastEnd = 0
    for thism in re.finditer(r'\\u[A-Fa-f0-9]{4}|\\x[A-Fa-f0-9]{2}|\\u\{[^}]*\}|\\[\'\"n\\&]',m.group(0)):
        yield (lastEnd,thism.start()), String, m.group(0)[lastEnd:thism.start()]
        yield thism.span(), String.Escape, thism.group(0)
        lastEnd = thism.end()
    yield (lastEnd, len(m.group(0))), String, m.group(0)[lastEnd:len(m.group(0))]


class TerracottaLexer(RegexLexer):
    name = 'Terracotta'
    filenames = ['*.tc']
    aliases = ['terracotta','tc']
    flags = re.MULTILINE

    tokens = {
        'root': [
            (r'[\{\}\(\)\[\]]',Punctuation.Paren),

            #comments
            (r'//.*',Comment),
            (r'/\*',Comment.Multiline, 'multilinecomment'),


            # numbers
            (r'(?:(?:(?<=\W)|^)s)?((\"|\')(?:\\\2|(?!\2).)*(?:\2|$|\\))', highlightEscapeSequences),
            (r'(?<![A-Za-z0-9_])(?!_)((?:[0-9A-fa-f]|_(?!\.))*(0[xX])\.?(?!_)(?:[0-9A-fa-f]|_(?![^0-9A-fa-f]))+)', Number),
            (r'(?<![A-Za-z0-9_])(?!_)((?:\d|_(?!\.))*\.?(0[bB])?(?!_)(?:\d|_(?![^0-9]))+)', Number),
            
            #variables
            (r'\b(local|global|saved|line)\b(\s*\w+)?(?:(\s*\:\s*)(\w+))?', byGroup(Keyword.Scope, Name.Variable, Operator, Name.Class)),

            #constructors
            (r'(?:(?<=\W)|^)(vec|snd|csnd|loc|par|item|litem|pot)(?=\s*\()',Name.Class),

            #keywords
            (r'(?:(?<=\W)|^)(select|filter|if|repeat|else|do|while|for|as|of|to|return|returnmult|break|continue|endthread|endallthreads|wait|print|perselected)(?![\w])',Keyword),
            (r'(?:(?<=\W)|^)(playerevent|entityevent|gameevent|function|process|lscancel|declare)(?![\w])',Keyword.Declaration),
            
            #call func and start process
            (r'(?:(?<=\W)|^)(call|start)(\s+\w*)',byGroup(Keyword,Name.Function)),
            #parenthetic function call
            (r'([\w]+)(?=\s*\()',Name.Function),

            #namespace being accessed
            (r'(?<!\.)(\w+\s*)((?:\.)\s*)(?=\[\]|\[(?:\\\]|[^\]])*[^\\]\]|\[.*|\w*)',byGroup(Name.Namespace,Operator)),
            # 2. Match the trailing "property" if it was preceded by a dot
            (r'(?<=[^.]\.)(\w+)\b', Name.Property),
            

            #operators
            (r'[=*+-/:?<>%^!|&]',Operator),

            #color types names as type names on their own if nothing else has claimed them already
            (r'(?:(?<=\W)|^)(str|num|vec|loc|pot|snd|txt|item|list|dict|par|any|var|csnd|litem)(?![\w])',Name.Class),
        ],
        'multilinecomment': [
            (r'[^/*]+', Comment.Multiline),            
            (r'\*/', Comment.Multiline, '#pop'),
            (r'[/*]', Comment.Multiline),
        ]
    }