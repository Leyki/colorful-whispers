module.exports = function ColorfulWhispers(mod) {

	let friendList = {};

	mod.hook('S_WHISPER', 2, { order: 100 }, event => { // Does this even work with potty mouth?
		if (!mod.settings.globallyEnabled) return;

		if (mod.game.me.is(event.gameId) && mod.settings.me.enabled) {
			// Sent
			event.message = colorMessage(event.message, mod.settings.me.color);
			return true;
		}
		// Received
		if (mod.settings.particular.enabled) {
			for (let character of mod.settings.particular.characters) {
				if (character.name.includes(event.name)) {
					event.message = colorMessage(event.message, character.color);
					return true;
				}
			}
		}
		if (mod.settings.friends.enabled && friendList[event.name]) { // ...
			event.message = colorMessage(event.message, mod.settings.friends.color);
			return true;
		}
		if (mod.settings.others.enabled) {
			event.message = colorMessage(event.message, mod.settings.others.color);
			return true;
		}
	});
	// Get & Update relevant friend list
	mod.hook('S_UPDATE_FRIEND_INFO', 1, event => {
		const temptFriendlist = {};
		event.friends.forEach(entry => temptFriendlist[entry.name] = entry.id);
		if (friendList != temptFriendlist)
			friendList = temptFriendlist;
	})
	// Clean up past friends :(
	mod.hook('S_DELETE_FRIEND', 1, event => {
		for (let [key, value] of Object.entries(friendList))
			if (value === event.id) {
				delete friendList[key];
				break;
			}
	})

	// Replace <FONT> with the desired color
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
				mod.command.message('Friends whispers coloring enabled.')
			},
			off() {
				mod.settings.friends.enabled = false
				mod.command.message('Friends whispers coloring disabled.')
			},
		},
		others: {
			on() {
				mod.settings.others.enabled = true
				mod.command.message('Others whispers coloring enabled.')
			},
			off() {
				mod.settings.others.enabled = false
				mod.command.message('Others whispers coloring disabled.')
			},
		},
		particular: {
			on() {
				mod.settings.particular.enabled = true
				mod.command.message('Particular whispers coloring enabled.')
			},
			off() {
				mod.settings.particular.enabled = false
				mod.command.message('Particular whispers coloring disabled.')
			},
		},
		color(Color) {
			mod.send('S_WHISPER', 3, {
				name: "some-name",
				recipient: mod.game.me.name,
				message: '<font color="' + Color + '">Hello 1234567890</font>'
			})
		},
		$default() { mod.command.message('Read the readme ree.') },
		$none() { mod.command.message('It seems like someone forgot something!') }
	})
}