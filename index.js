module.exports = function ZelekieColorfulWhispers(mod) {

    const settings = require(`./settings.json`)

    mod.hook('S_WHISPER', 2, { order: 100 }, event => {
        if (!settings.globallyEnabled) return;
        if (mod.game.me.is(event.player) && settings.me.enabled) {
            // Sent
            event.message = colorMessage(event.message, settings.me.color)
            return true
        }
        // Received
        else if (settings.particular.enabled) {
            for (let character of settings.particular.characters) {
                if (character.name.includes(event.authorName)) {
                    event.message = colorMessage(event.message, character.color)
                    return true
                }
            }
            if (settings.others.enabled) {
                event.message = colorMessage(event.message, settings.others.color)
                return true
            }
        }
        else if (settings.others.enabled) {
            event.message = colorMessage(event.message, settings.others.color)
            return true
        }
    })
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
        /* soon:tm:
        reload() {
        },
        */
        $default() { mod.command.message('Read the readme senpai! And remember it...you have forgotten me...right? - Sighs - It\'s okay, i won\'t stop loving you, i promise!') },
    })
}
