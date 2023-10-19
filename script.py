#!/usr/bin/env python3
# deno-lint-ignore-file
# START HERE
a = "Hello, "
b = "World!"
def string_concat(left, right):
	result = left + right
	return result

s = string_concat(a, b)
print(s)