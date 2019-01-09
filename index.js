module.exports = function ZelekieColorfulWhispers(mod) {

				const friendList = {};

	mod.hook('S_WHISPER', 2, { order: 100 }, event => { // Does this even work with potty mouth?
		if (!mod.settings.globallyEnabled) return;

		if(mod.game.me.is(event.player) && mod.settings.me.enabled){
			// Sent
			event.message = colorMessage(event.message, mod.settings.me.color);
			return true;
		}
		// Received
		if(mod.settings.particular.enabled){
			for (let character of mod.settings.particular.characters){
				if (character.name.includes(event.authorName)){
					event.message = colorMessage(event.message, character.color);
					return true;
				}
			}
		}
		if(mod.settings.friends.enabled && friendList[event.authorName]){ // ...
			event.message = colorMessage(event.message, mod.settings.friends.color);
			return true;
		}
		if(mod.settings.others.enabled){
			event.message = colorMessage(event.message, mod.settings.others.color);
			return true;
		}
	});

	// Gather friend list
	mod.hook('S_UPDATE_FRIEND_INFO', 1, { order: 100 }, event => {
		event.friends.forEach(function(element) { friendList[element.name] = true })
	})
	// Clean up past friends :( / WTB S opcode
	mod.hook('C_DELETE_FRIEND', 1, { order: 100 }, event => { delete friendList[event.name]  })
	
	
	// Simple function to replace <FONT> with the desired color
	function colorMessage(Message, Color) {
		return Message.replace(/<FONT>/g, ('<FONT COLOR=\"' + Color + '\">'))
	}

	// Commands ugly big fat thingy
	mod.command.add('cw', {
		on() {
			mod.settings.globallyEnabled = true
			mod.command.message('Whispers coloring enabled.')
		},
		off() {
			mod.settings.globallyEnabled = false
			mod.command.message('Whispers coloring disabled.')
		},
		me: {
			on() {
				mod.settings.me.enabled = true
				mod.command.message('Own whispers coloring enabled.')
			},
			off() {
				mod.settings.me.enabled = false
				mod.command.message('Own whispers coloring disabled.')
			},
		},
		friends: {
			on() {
				mod.settings.friends.enabled = true
				mod.command.message('Friends coloring whispers enabled.')
			},
			off() {
				mod.settings.friends.enabled = false
				mod.command.message('Friends coloring whispers disabled.')
			},
		},
		others: {
			on() {
				mod.settings.others.enabled = true
				mod.command.message('Others coloring whispers enabled.')
			},
			off() {
				mod.settings.others.enabled = false
				mod.command.message('Others coloring whispers disabled.')
			},
		},
		particular: {
			on() {
				mod.settings.particular.enabled = true
				mod.command.message('Particular coloring whispers enabled.')
			},
			off() {
				mod.settings.particular.enabled = false
				mod.command.message('Particular coloring whispers disabled.')
			},
		},
		color(Color) {
			mod.send('S_WHISPER', 2, {
				authorName: "Kouhai-chan", // tbh tho, apparently the senpai/kouhai thingy really sucks, animey stuff aside.
				recipient: mod.game.me.name,
				message: '<font color="' + Color + '">Hello Senpai!</font>'
			})
		},
		$default() { mod.command.message('Read the readme senpai! And remember it...you have forgotten me...right? - Sighs - It\'s okay, i won\'t stop loving you, i promise!') },
		$none() { mod.command.message('It seems like someone forgot something!') }
	})
}