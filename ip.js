
//Initiate our container which will either be passed as a module export or as a global variable depending on environment.
const ipemotes = {};

//Our map of emoji
const emojis = ['⏰','☁','⏳','☀','☂','☃','☄','☎','☕','☘','☠','☣','🙁','🙂','♻','♿','⚠','⚡','⚰','⚽','⚾','⛏','⛷','✂','✅','✈','✉','✏','❌','❓','❗','❤','⭐','🆒','🆓','🆕','🌈','🌉','🌊','🌋','🌍','🌕','🌡','🌧','🌪','🌭','🌮','🌲','🌵','🌶','🌻','🌽','🍁','🍄','🍇','🍉','🍌','🍎','🍑','🍓','🍔','🍕','🍗','🍙','🍛','🍝','🍞','🍟','🍣','🍆','🍤','🍦','🍩','🍪','🍫','🍬','🍭','🍯','🍰','🍴','🍷','🍺','🍼','🍿','🎁','🎃','🎄','🎅','🎆','🎈','🎉','🎐','🎗','🎟','🎡','🎤','🎥','🎧','🎨','🎩','🎪','🎮','🎱','🎲','🎳','🎵','🎷','🎸','🎹','🏀','🏅','🏆','🏈','🏓','🏔','🏕','🏖','🐆','🏧','🏭','🏮','🏰','🏳','🏹','🐀','🐄','🐅','🏠','🐇','🐈','🐉','🐊','🐋','🐌','🐍','🐎','🐐','🐑','🐒','🐓','🐕','🐖','🐘','🐙','🐛','🐝','🐞','🐟','🐢','🐧','🐪','🐬','👀','👁','👂','👃','👄','👅','👓','👖','👗','👢','👣','👮','👰','👺','👻','👽','💃','💄','💉','💊','💎','💡','💢','💣','💤','💥','💧','💩','💪','💯','💰','💳','💾','💿','📁','📃','📆','📈','📋','📌','📎','📏','📕','📦','📷','📺','📼','🔊','🔋','🔌','🔍','🔑','🔒','🔔','🔥','🔦','🔧','🔨','🔪','🔫','🕊','🕵','🕷','🕸','🕹','🖕','🖖','🗽','🗿','🗺','😂','😏','😡','😤','😬','😭','😱','🚀','🚁','🚂','🚒','🚓','🚭','🚲','🚽','🚿','🛌','🛑','🛒','🛴','🛸','🤖','🤠','🤔','🤡','🤢','🤺','🥐','🥑','🥒','🥓','🥔','🥕','🥖','🥗','🥚','🥛','🥜','🥝','🥞','🥧','🥨','🥩','🥪','🦀','🦇','🦊','🦋','🦖','🧙','🧛','🧜','🧦'];
//How many of our emoji to use
const eLength = 256;

//Splits a string containing emoji into emoji, using .split('') can break some emoji that use zero width joiners and similar characters.
ipemotes.emotesToArray = (str) => {
    return Array.from(str.split(/[\ufe00-\ufe0f]/).join(""))
}

ipemotes.discoverPow = (number) => {
    let i = 0;
    while (number > Math.pow(number, i)) {i++};
    return i;
}

ipemotes.processRemainder = (number) => {
    return emojis[number];
}

//Converts a decimal number to an emoji or emojis (depending on size of number and size of eLength)
ipemotes.numToEmoji = (number) => {
    if (isNaN(number)) {
        return '';
    }
    else if (number > eLength) {
        let string = '';
        const pow = ipemotes.discoverPow(number);
        const powered = Math.pow(eLength, pow);

        const start = number/powered;
        const whole = Math.floor(start);
        const decimal = number - (whole*powered);
        //let remainder = start % 1;
        //remainder = parseInt(remainder.toString().split('.')[1]);
        
        string += ipemotes.processRemainder(whole);

        if (number > powered) {
            string += ipemotes.numToEmoji(decimal);
        }

        return string;
    } else {
        return ipemotes.processRemainder(number);
    }
}

//Convert emoji array back into a decimal number.
ipemotes.parseEmoji = (array) => {
    let number = 0;
    for (let index = 0; index < array.length; index++) {
        const element = array[index];
        let value = emojis.indexOf(element);
        if (array.length > 1 && index !== array.length-1) {
            value = value*Math.pow(eLength, (array.length-1) - index);
        }
        number += value;
    }
    return number;
}

//Splits and parses IPv6 addresses into emoji
ipemotes.convertIpv6ToEmoji = (address) => {
    address = address.replace(/ /g, '');
    address = address.split(':');
    let string = '';
    for (let index = 0; index < address.length; index++) {
        let element = address[index];
        element = parseInt(element, 16);
        string += ipemotes.numToEmoji(element)+':';
    }
    return string.substring(0, string.length-1);
}

//Splits and parses IPv4 addresses into emoji
ipemotes.convertIpv4ToEmoji = (address) => {
    subnet = address.split('/');
    address = subnet[0];
    address = address.replace(/ /g, '');
    address = address.split('.');
    let string = '';
    for (let index = 0; index < address.length; index++) {
        let element = address[index];
        element = parseInt(element);
        string += ipemotes.numToEmoji(element);
    }
    if (subnet.length > 1) {
        string+='/'+ipemotes.numToEmoji(subnet[1]);
    }
    return string;
}

//Splits and parses emoji addresses into ipv6
ipemotes.convertEmojiToIpv6 = (address) => {
    address = address.replace(/ /g, '');
    address = address.split(':');
    let string = '';
    for (let index = 0; index < address.length; index++) {
        let element = address[index];
        if (element.length === 0) {
            string += ':';
            continue;
        }
        element = ipemotes.parseEmoji(ipemotes.emotesToArray(element));
        let hexy = element.toString(16);
        while(hexy.length < 4) hexy = '0'+hexy;
        string += hexy+':';
    }
    return string.substring(0,string.length-1);
}

//Splits and parses emoji addresses into ipv4
ipemotes.convertEmojiToIpv4 = (address) => {
    subnet = address.split('/');
    address = subnet[0];
    address = address.replace(/ /g, '');
    address = ipemotes.emotesToArray(address);
    let string = '';
    for (let index = 0; index < address.length; index++) {
        let element = address[index];
        element = ipemotes.parseEmoji(ipemotes.emotesToArray(element));
        string += element+'.';
    }
    
    if (subnet.length > 1) {
        string+='/'+ipemotes.parseEmoji(ipemotes.emotesToArray(subnet[1]));
    }

    return string.substring(0,string.length-1);
}


//Attempts to convert an address into emoji
ipemotes.encode = (address) => {
    if (address.indexOf('.') >= 0) {
        return ipemotes.convertIpv4ToEmoji(address);
    } else if (address.indexOf(':') >= 0 && address.match(/^[a-z0-9]/ig) !== null) {
        return ipemotes.convertIpv6ToEmoji(address);
    } else {
        return address;
    }
}

//Attempts to convert emoji into an address
ipemotes.parse = (address) => {
    if (address.indexOf(':') >= 0 && address.match(/^[a-z0-9]/ig) === null) {
        return ipemotes.convertEmojiToIpv6(address);
    } else if (ipemotes.emotesToArray(address).length === 4) {
        return ipemotes.convertEmojiToIpv4(address);
    } else {
        return address;
    }
}

ipemotes.emojis = emojis;

if (window) {
    window.ipemotes = ipemotes;
} else {
    module.exports = ipemotes;
}
