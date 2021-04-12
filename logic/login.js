const config = require('../config/config.json'),
    { Parts } = require('./dynamic_parts'),
    { until } = require('selenium-webdriver');

/**
 * 
 * @param {import('selenium-webdriver').WebDriver} drv 
 */
async function login(drv){
    await drv.get('https://discord.com/login');

    const qr = await drv.wait(until.elementLocated(Parts.get('LoginQR')));
    
    await drv.executeScript(() => {
        console.log(arguments);
        function regenLS() {
            const iframe = document.createElement('iframe');
            document.head.append(iframe);
            const pd = Object.getOwnPropertyDescriptor(iframe.contentWindow, 'localStorage');
            iframe.remove();
            return pd;
        }

        Object.defineProperty(window, 'localStorage', regenLS());
        
        localStorage.setItem('token', `"${arguments[0]}"`);
        location.reload();

    }, config.token);

    await drv.wait(until.elementLocated(Parts.get('Servers')));
}

module.exports = login;