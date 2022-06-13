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
	const content = await Deno.readTextFile('test.fox')
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
