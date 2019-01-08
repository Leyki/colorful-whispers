module.exports = function ZelekieColorfulWhispers(mod) {

	const settings = require(`./settings.json`); // todo: migrate settings to caali's format.
	let friendList = [];

	mod.hook('S_WHISPER', 2, { order: 100 }, event => { // Does this even work with potty mouth?
		if (!settings.globallyEnabled) return;

		if(mod.game.me.is(event.player) && settings.me.enabled){
			// Sent
			event.message = colorMessage(event.message, settings.me.color);
			return true;
		}
		// Received
		if(settings.particular.enabled){ // todo: rewrite in a more proper way
			for (let character of settings.particular.characters){
				if (character.name.includes(event.authorName)){
					event.message = colorMessage(event.message, character.color);
					return true;
				}
			}
		}
		if(settings.friends.enabled){ // ...
			for (let friend of friendList){
				if(friend.name == event.authorName){
					event.message = colorMessage(event.message, settings.friends.color);
					return true;
				}
			}
		}
		if(settings.others.enabled){
			event.message = colorMessage(event.message, settings.others.color);
			return true;
		}
	});
	
	mod.hook('S_FRIEND_LIST', 1, { order: 100 }, event => { friendList = event.friends; }); // ...
	
	mod.hook('S_UPDATE_FRIEND_INFO', 1, { order: 100 }, event => { friendList = event.friends; });
	
	
	// Simple function to replace <FONT> with the desired color
	function colorMessage(Message, Color) {
		return Message.replace(/<FONT>/g, ('<FONT COLOR=\"' + Color + '\">'))
	}
	// Commands ugly big fat thingy
	mod.command.add('cw', {
		on() {
			settings.globallyEnabled = true
			mod.command.message('Whispers coloring enabled.')
		},
		off() {
			settings.globallyEnabled = false
			mod.command.message('Whispers coloring disabled.')
		},
		me: {
			on() {
				settings.me.enabled = true
				mod.command.message('Own whispers coloring enabled.')
			},
			off() {
				settings.me.enabled = false
				mod.command.message('Own whispers coloring disabled.')
			},
		},
		friends: {
			on() {
				settings.friends.enabled = true
				mod.command.message('Friends coloring whispers enabled.')
			},
			off() {
				settings.friends.enabled = false
				mod.command.message('Friends coloring whispers disabled.')
			},
		},
		others: {
			on() {
				settings.others.enabled = true
				mod.command.message('Others coloring whispers enabled.')
			},
			off() {
				settings.others.enabled = false
				mod.command.message('Others coloring whispers disabled.')
			},
		},
		particular: {
			on() {
				settings.particular.enabled = true
				mod.command.message('Particular coloring whispers enabled.')
			},
			off() {
				settings.particular.enabled = false
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