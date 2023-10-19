# Language language

First, include `compiler.m4` and write your code:

```m4
fox_shebang()dnl
fox_comment_line(`deno-lint-ignore-file')dnl
fox_comment_line(`START HERE')dnl
fox_var(a, `"Hello, "')
fox_var(b, `"World!"')
fox_function(
	`string_concat',
	`left, right',
	`fox_var(result, `left + right')
	fox_return(result)'dnl
)

fox_var(s, fox_call(`string_concat', `a, b'))
fn_print_stdout(s)dnl
```

Then, run `./language compile javascript:js`. Code will be generated:

```js
#!/usr/bin/env node
// deno-lint-ignore-file
// START HERE
let a = "Hello, "
let b = "World!"
function string_concat(left, right) {
	let result = left + right
	return result
}

let s = string_concat(a, b)
console.log(s)
```

Currently, JavaScript, Python, and Ruby are supported.

Concepts implemented:

- Functions
- Variables
