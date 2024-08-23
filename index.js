require('dotenv').config()
const { Bot, GrammyError, HttpError, Keyboard, InlineKeyboard } = require('grammy')
const { hydrate } = require('@grammyjs/hydrate')

const bot = new Bot(process.env.BOT_API_KEY)
bot.use(hydrate())
// bot.on('message', async (ctx) => {
// 	await ctx.reply('Надо подумать...')
// })

// bot.on([':media', '::url'], async (ctx) => {
// 	await ctx.reply('Получил файл или ссылку')
// })

// bot.on('msg').filter((ctx) => {
// 	return ctx.from.id === 7401352463
// }, async (ctx) => {
// 	await ctx.reply('Hello admin')
// })

// bot.on('msg', async (ctx) => {
// 	 console.log(ctx.from)
// })

// bot.hears('id', async (ctx) => {
// 	await ctx.reply(`Your id: ${ctx.from.id}`)
// })

// bot.hears(/fuck/, async (ctx) => {
// 	await ctx.reply('WTF?')
// })

bot.api.setMyCommands([
	{
		command: 'start',
		description: 'start bot',
	},
	{
		command: 'mood',
		description: 'find out the mood',
	},
	{
		command: 'share',
		description: 'share data',
	},
	{
		command: 'inline_keyboard',
		description: 'inline keyboard',
	},
	{
		command: 'menu',
		description: 'get menu'
	}
])

// bot.command('start', async (ctx) => {
// 	await ctx.reply('Hello', {
// 		reply_parameters: {message_id: ctx.msg.message_id}
// 	})
// })


// bot.command('start', async (ctx) => {
// 	await ctx.reply(
// 		'Hello! links parse_mode: <a href="https://www.youtube.com/watch?v=q-AFR0D7Vuw">link</a>',
// 		{
// 			parse_mode: 'HTML'
// 		}
// 	)
// })

// bot.command('start', async (ctx) => {
// 	await ctx.reply(
// 		'Hello! links parse_mode: <span class="tg-spoiler"><a href="https://www.youtube.com/watch?v=q-AFR0D7Vuw">link</a></span>',
// 		{
// 			parse_mode: 'HTML',
// 		}
// 	)
// })

bot.command('start', async (ctx) => {
	await ctx.react('👍')
	await ctx.reply(
		'Hello\\! *bold* _italic_ [this link](https://www.youtube.com/watch?v=q-AFR0D7Vuw)',
		{
			parse_mode: 'MarkdownV2',
			disable_web_page_preview: true
		}
	)
})

const menuKeyboard = new InlineKeyboard()
	.text('find out the order status', 'order-status')
	.text('contact support', 'support')
const backKeyboard = new InlineKeyboard().text('< back to menu', 'back')

bot.command('menu', async (ctx) => {
	await ctx.reply('check menu item', {
		reply_markup: menuKeyboard,
	})
})

bot.callbackQuery('order-status', async (ctx) => {
	await ctx.callbackQuery.message.editText('Order status: on the way', {
		reply_markup: backKeyboard
	})
	await ctx.answerCallbackQuery()
})

bot.callbackQuery('support', async (ctx) => {
	await ctx.callbackQuery.message.editText('write your request', {
		reply_markup: backKeyboard,
	})
	await ctx.answerCallbackQuery()
})

bot.callbackQuery('back', async (ctx) => {
	await ctx.callbackQuery.message.editText('check menu item', {
		reply_markup: menuKeyboard,
	})
	await ctx.answerCallbackQuery()
})

bot.command('mood', async (ctx) => {
	// const moodKeyboard = new Keyboard().text('Good').row().text('Normal').row().text('Bed').resized().oneTime()
	const moodLabels = ['Good', 'Normal', 'Bed']
	const rows = moodLabels.map((label) => {
		return [Keyboard.text(label)]
	})
	const moodKeyboard2 = Keyboard.from(rows).resized().oneTime()
	await ctx.reply('How do you feel?', {
		reply_markup: moodKeyboard2
	})
})

// bot.command('share', async (ctx) => {
// 	const shareKeyboard = new Keyboard().requestLocation('Geolocation').requestContact('Contact').requestPoll('Poll').resized().oneTime()
// 	await ctx.reply('What do you want?', {
// 		reply_markup: shareKeyboard
// 	})
// })

// bot.command('inline_keyboard', async (ctx) => {
// 	const inlineKeyboard = new InlineKeyboard()
// 		.text('1', 'button-1')
// 		.text('2', 'button-2')
// 		.text('3', 'button-3')
// 	await ctx.reply('Get a number', {
// 		reply_markup: inlineKeyboard
// 	})
// })

bot.command('inline_keyboard', async (ctx) => {
	const inlineKeyboard2 = new InlineKeyboard().url(
		'move to link',
		'https://www.youtube.com/watch?v=q-AFR0D7Vuw'
	)
	await ctx.reply('Press the button', {
		reply_markup: inlineKeyboard2
	})
})

bot.callbackQuery(/button-[1-3]/, async (ctx) => {
		await ctx.answerCallbackQuery()
		await ctx.reply(`you selected button: ${ctx.callbackQuery.data}`)
})

// bot.callbackQuery(['button-1', 'button-2', 'button-3'], async (ctx) => {
// 	await ctx.answerCallbackQuery()
// 	await ctx.reply('you selected number')
// })

// bot.on('callback_query:data', async (ctx) => {
// 	await ctx.answerCallbackQuery()
// 	await ctx.reply(`you selected button: ${ctx.callbackQuery.data}`)
// })

bot.on(':contact', async (ctx) => {
	await ctx.reply('thx for the contact')
})

bot.hears(['Good', 'Normal', 'Bed'], async (ctx) => {
	await ctx.reply('Ok')
})

bot.catch((err) => {
	const ctx = err.ctx
	console.error(`Error while handing update ${ctx.update.update_id}:`)
	const e = err.error

	if (e instanceof GrammyError) {
		console.error("Error in request", e.description)
	} else if (e instanceof HttpError) {
		console.error("Could not contact Telegram", e)
	} else {
		console.error("Unknown error:", e)
	}
})

bot.start()