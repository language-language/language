# Fox Lang

Write once, transpile everywhere.

> Ease multi-language authoring by limiting interfaces to those that are both pure and commonplace. Non-traditional interfaces are trivially hand-written, composing the transpiled output

STATUS: EARLY DEVELOPMENT

## Use when

- FFI doesn't cut it
- Performance overhead is negligible
- Code is rather generic (in terms of types and their behavior)

## Usage

Don't use yet.

1. A custom GitHub organization for holding the transpiled code. Usually, it has the name of `$USER-fox`
2. A custom GitHub bot for making commits (so your main account doesn't rack up hundreds of commits in a single day)

## Examples

- [./test.fox](./test.fox)
- [fox-xdg-base-dir](https://github.com/hyperupcall/fox-xdg-base-dir)
