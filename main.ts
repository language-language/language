import * as path from 'https://deno.land/std@0.148.0/path/mod.ts'
import * as fs from 'https://deno.land/std@0.148.0/fs/mod.ts'

// To get the ball rolling

const util = {
	doEat(ctx: Context, match: RegExpMatchArray) {
		const newStartIndex = ctx.text.indexOf(match[0]) + match[0].length
		ctx.text = ctx.text.slice(newStartIndex)

		ctx.position += newStartIndex

		return { start: ctx.position - newStartIndex, end: ctx.position - 1 }
	},
	makeEat(ctx: Context, regex: RegExp) {
		const match = ctx.text.match(regex)
		if (match !== null) {
			const { start, end } = util.doEat(ctx, match)
			ctx.didEat = true

			return {
				foundIt: true,
				start,
				end,
				data: match.groups,
				content: match[0],
			}
		} else {
			return {
				foundIt: false,
				start: 0,
				end: 0,
				content: '',
			}
		}
	},
	logResult(ctx: Context, result: Node) {
		console.log(
			'result',
			result,
			ctx.text.slice(0, 10).replaceAll('\n', '<NL>')
		)
	},
}

type Node = {
	foundIt?: boolean
	type: 'comment' | 'language' | 'function' | 'empty'
	start: number
	end: number
	data?: Record<string, unknown>
	content: string
	children?: Node[]
	parent?: Node
}
type Ast = Node[]

type Context = {
	text: string
	position: number
	didEat: boolean
}

await main()
async function main() {
	const fileName = Deno.args[0] ? Deno.args[0] : 'test.fox'
	const testMode = fileName === 'test.fox'

	const content = await Deno.readTextFile(fileName)
	const ctx: Context = {
		text: content,
		position: 0,
		didEat: false,
	}

	const ast: Ast = []
	let node: Node
	let mode: 'default' | 'in-function' = 'default'
	while (ctx.text.length !== 0) {
		ctx.didEat = false

		if (mode === 'default') {
			eatCommentBlock(ctx, ast)
			eatCommentInline(ctx, ast)
			eatBlankLine(ctx, ast)
			eatLanguageBlock(ctx, ast)
			eatFunctionBlock(ctx, ast)
		} else if (mode === 'in-function') {
			eatCommentBlock(ctx, ast)
			eatCommentInline(ctx, ast)
			eatBlankLine(ctx, ast)
			eatLanguageBlock(ctx, ast)
		}

		if (ctx.didEat === false && ctx.text.length !== 0) {
			console.log('Exiting from parsing early')
			console.log('---')
			console.log(ctx.text)
			console.log('---')
			eatAll(ctx)
			break
		}
	}

	console.log(ast)
	if (testMode) return

	const languages: LanguageName[] = []
	for (const node of ast) {
		if (node.type === 'language') {
			if (node.data?.language) {
				languages.push(node.data.language as LanguageName)
			}
		}
	}

	for (const language of languages) {
		let fileContent = ''

		for (const node of ast) {
			if (node.type === 'language') {
				if (node.data?.language == language) {
					fileContent += (node.data?.body as string)
						.split('\n')
						.map((line) => {
							return line[0] == '\t' ? line.slice(1) : line
						})
						.join('\n')
				}
			} else if (node.type === 'empty') {
				fileContent += node.content
			}
		}

		const dir = path.join('languages', language)
		await Deno.mkdir(dir, { recursive: true })
		await Deno.writeTextFile(
			path.join(
				dir,
				`${path.basename(fileName).split('.')[0]}.${getExt(language)}`
			),
			fileContent
		)
	}
}

function eatFunctionBlock(ctx: Context, ast: Ast): Node {
	const regex = /^\s*fn\s+(?<name>[a-zA-Z_]+\s*)?\(\{(?<body>.*?)\}\)/su
	const node: Node = { type: 'function', ...util.makeEat(ctx, regex) }
	if (node.foundIt) {
		ast.push(node)
	}
	return node
}

function eatLanguageBlock(ctx: Context, ast: Ast): Node {
	const regex = /^\s*lang\s+(?<language>[a-zA-Z_]+\s+)?\(\[(?<body>.*?)\]\)/su
	const node: Node = { type: 'language', ...util.makeEat(ctx, regex) }
	if (node.foundIt) {
		ast.push(node)
	}
	return node
}

function eatCommentInline(ctx: Context, ast: Ast): Node {
	const regex = /^\s*\/\*(?<comment>.*?)\*\//su
	const node: Node = { type: 'comment', ...util.makeEat(ctx, regex) }
	if (node.foundIt) {
		ast.push(node)
	}
	return node
}

function eatCommentBlock(ctx: Context, ast: Ast): Node {
	const regex = /^\s*(#|\/\/)(?<comment>.*?)\n/su
	const node: Node = { type: 'comment', ...util.makeEat(ctx, regex) }
	if (node.foundIt) {
		ast.push(node)
	}
	return node
}

function eatBlankLine(ctx: Context, ast: Ast): Node {
	const regex = /^\s*\n/su
	const node: Node = { type: 'empty', ...util.makeEat(ctx, regex) }
	if (node.foundIt) {
		ast.push(node)
	}
	return node
}

function eatAll(ctx: Context): void {
	const regex = /^.*/su
	util.makeEat(ctx, regex)
}

function die(msg: string): never {
	console.error(`Error: ${msg}`)
	Deno.exit(1)
}

type LanguageName =
	| 'python'
	| 'c'
	| 'c-header'
	| 'java'
	| 'cpp'
	| 'cpp-header'
	| 'c#'
	| 'javascript'
	| 'swift'
	| 'php'
	| 'go'
	| 'delphi'
	| 'ruby'
	| 'objective-c'
	| 'perl'
	| 'fortran'
	| 'r'
	| 'lua'
	| 'cobol'
	| 'julia'
	| 'd'
	| 'rust'
	| 'ada'
	| 'dart'
	| 'haskell'
	| 'scala'
	| 'kotlin'
	| 'typescript'
	| 'awk'
	| 'powershell'
	| 'bash'
	| 'nim'
	| 'crystal'
	| 'odin'
	| 'hare'
	| 'elm'
	| 'v'

function getExt(languageName: LanguageName) {
	switch (languageName.trim()) {
		case 'python':
			return 'py'
		case 'c':
			return 'c'
		case 'c-header':
			return 'h'
		case 'java':
			return 'java'
		case 'cpp':
			return 'cpp'
		case 'cpp-header':
			return 'hpp'
		case 'cs':
			return 'cs'
		case 'javascript':
			return 'js'
		case 'swift':
		case 'php':
		case 'go':
			return languageName
		case 'delphi':
			return 'dpr'
		case 'ruby':
			return 'rb'
		case 'objective-c':
			return 'm'
		case 'perl':
			return 'perl'
		case 'fortran':
			return 'f90'
		case 'r':
			return 'r'
		case 'lua':
			return 'lua'
		case 'cobol':
			return 'cbl'
		case 'julia':
			return 'jl'
		case 'd':
			return 'd'
		case 'rust':
			return 'rs'
		case 'ada':
			return 'ads'
		case 'dart':
			return 'dart'
		case 'haskell':
			return 'hs'
		case 'scala':
			return 'sc'
		case 'kotlin':
			return 'kt'
		case 'deno':
			return 'ts'
		case 'nodejs':
			return 'ts'
		case 'awk':
			return 'awk'
		case 'powershell':
			return 'awk'
		case 'bash':
			return 'sh'
		case 'nim':
			return 'nim'
		case 'crystal':
			return 'cr'
		case 'odin':
			return 'odin'
		case 'hare':
			return 'fa'
		case 'elm':
			return 'elm'
		case 'v':
			return 'v'
		default:
			console.error(`Unexpected language: ${languageName}`)
			Deno.exit(1)
	}
}
