# Fox Lang

"Write once, Transpile everywhere"

## Types

A value can be one of:

- `bool`
- `int`

- `char`
- `string`

- `error`

- `nil`

## Aggregate Types

- `[]Type`
- `Type#NotNullable`

## Syntax

Keywords

All statements start with keyword

- `fn`
- `set`
- `if`, `elif` `else`
- `for`

## Operators

- `==`, `<`, `<=`, `>`, `>=`

## Literals

- `4`
- `'c'`

## Expressions

- Combination of oeprators and literals

## Modules

All packages are a single file. `dotenv.fox`

```js
fn Name(Name Type) Type {
  let var_name = 3
  let other_name = 'somestring'

  if name == 'c' {
    lang fox {

    } lang c {

    } lang cpp {

    }
  }

  if something == "blah" {

  } elseif {

  } else {

  }

  for (let i = 0; i < 900; i = i + 1) {

  }

  for (let i : array_of_string)
}
```

Dimensions:

- Mutability / Const
- Object lifetime
- References

## Errors

- Error object (Error, std::exception, error)
- Exception throwing (throw an exception)
- Error unwrapping (wrap a value with an exception)
- Error returning (return a possibly-nil error type)

- If an exception needs to throw, throw it
- Since mutiple paradigms need to be supported, manually show error
