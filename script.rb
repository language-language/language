#!/usr/bin/env ruby
# deno-lint-ignore-file
# START HERE
a = "Hello, "
b = "World!"
def string_concat(left, right)
	result = left + right
	return result
end 

s = string_concat(a, b)
puts(s)