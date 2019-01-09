const DefaultSettings = {
    "globallyEnabled": true,
    "me": {
        "enabled": true,
        "color": "#f38958"
    },
    "friends": {
        "enabled": true,
        "color": "#26e39b"
    },
    "others": {
        "enabled": true,
        "color": "#3399FF"
    },
    "particular": {
        "enabled": false,
        "characters": [
            {
                "name": "singleNameExample",
                "color": "#hexcolorhere"
            },
            {
                "name": ["ArraY", "oF", "NameS", "ExamplE"],
                "color": "#hexcolorhere"
            }
        ]
    }
}

function MigrateSettings(from_ver, to_ver, settings) {
    if (from_ver === undefined) {
        // Migrate legacy config file
        return Object.assign(Object.assign({}, DefaultSettings), settings);
    } else if (from_ver === null) {
        // No config file exists, use default settings
        return DefaultSettings;
    } else {
        // Migrate from older version (using the new system) to latest one
        if (from_ver + 1 < to_ver) {
            // Recursively upgrade in one-version steps
            settings = MigrateSettings(from_ver, from_ver + 1, settings);
            return MigrateSettings(from_ver + 1, to_ver, settings);
        }

        // If we reach this point it's guaranteed that from_ver === to_ver - 1, so we can implement
        // a switch for each version step that upgrades to the next version. This enables us to
        // upgrade from any version to the latest version without additional effort!
        /*
        switch(to_ver)
        {
            case 2:
                // Upgrade from v1 to v2
                // EXAMPLE: in v1, colors were specified like "reset_font_color": "green", but we support arbitrary hex colors now!
                switch(settings.reset_font_color) {
                    case "red": settings.reset_font_color = "#FF0000"; break;
                    case "green": settings.reset_font_color = "#00FF00"; break;
                    case "blue": settings.reset_font_color = "#0000FF"; break;
                    default: settings.reset_font_color = DefaultSettings.reset_font_color; break;
                }
                break;
            case 3:
                // upgrade from v2 to v3
                // EXAMPLE: setting "random_color" was removed (note that it's also absent from DefaultSettings, which should always correspond to the latest version!)
                delete settings.random_color;
                break;
            // ...
            // TODO: whenever you increment your settings version, add an entry to the switch here.
            // ...
        }
        */

        return settings;
    }
}

module.exports = MigrateSettings;