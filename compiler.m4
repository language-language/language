dnl VARIABLES
define(`VAR_LANGUAGE', ARG_LANGUAGE)dnl
dnl
dnl
dnl LOWER LEVEL FUNCTIONS
define(`fox_indent',
	ifelse(
		VAR_LANGUAGE,
		`javascript',
		`	'
	)dnl
)dnl
define(`s_funcname',
	ifelse(
		VAR_LANGUAGE,
		`javascript',
		a,
		b
	)dnl
)dnl
define(`s_varname',
	ifelse(
		VAR_LANGUAGE,
		`javascript',
		a,
		b
	)dnl
)dnl
dnl
dnl
dnl HIGHER LEVEL FUNCTIONS
define(`fox_shebang',
	ifelse(
		VAR_LANGUAGE,
		`javascript',
		`#!/usr/bin/env node',
	`ifelse(
		VAR_LANGUAGE,
		`python',
		`#!/usr/bin/env python3',
	`ifelse(
		VAR_LANGUAGE,
		`ruby',
		`#!/usr/bin/env ruby',
	`ifelse(
		VAR_LANGUAGE,
		`java',
		`#!/usr/bin/env -S java --source 11',
		`UNKNOWN_LANGUAGE_SHEBANG'dnl
	)'dnl
	)'dnl
)'dnl
)
)dnl
define(`fox_main',
	ifelse(
		VAR_LANGUAGE,
		`java',
		`class Program {
			$1
}',
		`$1'
)dnl
)dnl
define(`fox_comment_line',
	ifelse(
		VAR_LANGUAGE,
		`javascript',
		`// $1
',
	ifelse(
		VAR_LANGUAGE,
		`python',
		`# $1
',
	ifelse(
		VAR_LANGUAGE,
		`ruby',
		`// $1
',
	ifelse(
		VAR_LANGUAGE,
		`java',
		`// $1
',
		`UNKNOWN_LANGUAGE_COMMENT_LINE'dnl
)dnl
)dnl
)dnl
)dnl
)dnl
define(`fox_comment_block',
	ifelse(
		VAR_LANGUAGE,
		`javascript',
		`/* $1 */',
	ifelse(
		VAR_LANGUAGE,
		`python',
		`',
		`UNKNOWN_LANGUAGE_COMMENT_BLOCK'dnl
)
	)dnl
)dnl
define(`fox_var',
	ifelse(
		VAR_LANGUAGE,
		`javascript',
		`let $1 = $2',
	ifelse(
		VAR_LANGUAGE,
		`python',
		`$1 = $2',
	ifelse(
		VAR_LANGUAGE,
		`ruby',
		`$1 = $2',
	ifelse(
		VAR_LANGUAGE,
		`java',
		`var $1 = $2',
		`UNKNOWN_LANGUAGE_VAR'dnl
)dnl
)dnl
)dnl
)dnl
)dnl
define(`fox_function',
	ifelse(
		VAR_LANGUAGE,
		`javascript',
		`function $1($2) {
	$3
}',
	ifelse(
			VAR_LANGUAGE,
			`python',
			`def $1($2):
	$3',
	ifelse(
			VAR_LANGUAGE,
			`ruby',
			`def $1($2)
	$3
end',
				`UNKNOWN_LANGUAGE_FUNCTION'
) dnl
)dnl
)dnl
)dnl
define(`fox_call',
	`$1($2)'dnl
)dnl
define(`fox_return',
	`return $1'dnl
)dnl
dnl
dnl
dnl FUNCTION BUILTINS
define(`fn_print_stdout',
	ifelse(
		VAR_LANGUAGE,
		`javascript',
		`console.log($1)',
	ifelse(
		VAR_LANGUAGE,
		`python',
		`print($1)',
	ifelse(
		VAR_LANGUAGE,
		`ruby',
		`puts($1)',
	ifelse(
		VAR_LANGUAGE,
		`java',
		`System.out.println($1)',
		`UNKNOWN_LANGUAGE_PRINT_STDOUT'
)dnl
)dnl
)dnl
)dnl
)dnl
dnl -- PROGRAM CONTENT START ---
fox_shebang()dnl
fox_comment_line(`deno-lint-ignore-file')dnl
fox_comment_line(`START HERE')dnl
fox_main(
`fox_function(
	`string_concat',
	`left, right',
	`fox_var(result, `left + right')
	fox_return(result)'dnl
)
fox_var(`a', `"Hello, "')
fox_var(`b', `"World!"')
fox_var(`s', `fox_call(`string_concat', `a, b')')
fn_print_stdout(`s')'dnl
)dnl
