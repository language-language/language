// To get the ball rolling

const util = {
	doEat(ctx: Context, match: RegExpMatchArray) {
		const newStartIndex = ctx.text.indexOf(match[0]) + match[0].length
		ctx.text = ctx.text.slice(newStartIndex)
	},
	makeEat(ctx: Context, regex: RegExp) {
		const match = ctx.text.match(regex)
		if (match !== null) {
			util.doEat(ctx, match)
			return {
				foundIt: true,
				match: match[0],
			}
		} else {
			return {
				foundIt: false,
				match: '',
			}
		}
	},
	logResult(ctx: Context, result: string) {
		console.log(
			'result',
			[result],
			ctx.text.slice(0, 10).replaceAll('\n', '<NL>')
		)
	},
}

type EatReturn = {
	foundIt: boolean
	match: string
}

type Context = {
	text: string
}

await main()
async function main() {
	const content = await Deno.readTextFile('test.fox')
	const ctx: Context = {
		text: content,
	}

	let foundIt, match
	while (ctx.text.length !== 0) {
		let didEat = false

		;({ foundIt, match } = eatCommentBlock(ctx))
		if (foundIt) {
			util.logResult(ctx, match)
			didEat = true
		}

		;({ foundIt, match } = eatCommentInline(ctx))
		if (foundIt) {
			util.logResult(ctx, match)
			didEat = true
		}

		;({ foundIt, match } = eatBlankLine(ctx))
		if (foundIt) {
			util.logResult(ctx, match)
			didEat = true
		}

		;({ foundIt, match } = eatLangBlock(ctx))
		if (foundIt) {
			util.logResult(ctx, match)
			didEat = true
		}

		;({ foundIt, match } = eatFunctionBlock(ctx))
		if (foundIt) {
			util.logResult(ctx, match)
			didEat = true
		}

		if (didEat === false) {
			if (ctx.text.length !== 0) {
				console.log('Exiting from parsing early')
				console.log('---')
				console.log(ctx.text)
				console.log('---')
			}
			eatAll(ctx)
			break
		}
	}
}

function eatFunctionBlock(ctx: Context): EatReturn {
	const regex = /^\s*fn\s+(?<name>[a-zA-Z_]+\s*)?\(\{(?<body>.*?)\}\)/su
	return util.makeEat(ctx, regex)
}

function eatLangBlock(ctx: Context): EatReturn {
	const regex = /^\s*lang\s+(?<language>[a-zA-Z_]+\s+)?\(\[(?<body>.*?)\]\)/su
	return util.makeEat(ctx, regex)
}

function eatCommentInline(ctx: Context): EatReturn {
	const regex = /^\s*\/\*.*?\*\//su
	return util.makeEat(ctx, regex)
}

function eatCommentBlock(ctx: Context): EatReturn {
	const regex = /^\s*#.*?\n/su
	return util.makeEat(ctx, regex)
}

function eatBlankLine(ctx: Context): EatReturn {
	const regex = /^\s*\n/su
	return util.makeEat(ctx, regex)
}

function eatAll(ctx: Context): EatReturn {
	const regex = /^.*/su
	return util.makeEat(ctx, regex)
}

function die(msg: string): never {
	console.error(`Error: ${msg}`)
	Deno.exit(1)
}
