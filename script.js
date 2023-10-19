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