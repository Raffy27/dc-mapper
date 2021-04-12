const { Builder, By, until, Key } = require('selenium-webdriver');
const { Options } = require('selenium-webdriver/chrome');

/**
 * @type import('selenium-webdriver').WebDriver
 */
let drv;
const locators = new Map([
    ['Body', By.xpath('//body')],
    ['Servers', By.xpath('//div[@aria-label="Servers"]')],
    ['Header', By.xpath('//header/h1')],
    ['Search', By.xpath('//div[@aria-label="Search"]//div[@data-contents="true"]')],
    ['Results', By.id('search-results')],
    ['Message', By.xpath('div[@role="group"]')]
]);
let items = new Map();

const asyncIterator = {
    next: async () => {
        const url = await drv.getCurrentUrl();
        await items.get('Body').sendKeys(Key.CONTROL, Key.ALT, Key.ARROW_DOWN, Key.NULL);
        const ch = await new Promise(async r => {
            let current;
            do {
                current = await drv.getCurrentUrl();
            } while(current == url);
            r(current);
        });

        if(ch.includes('/channels/@me')){
            return Promise.resolve({ done: true });
        }

        return Promise.resolve({
            value: {
                id: ch.split('/').slice(-2)[0],
                name: await (await drv.findElement(locators.get('Header'))).getText()
            },
            done: false
        });
    }
};
  
const servers = {
    [Symbol.asyncIterator]: () => asyncIterator
};

async function initSearch(){
    const sb = await drv.wait(until.elementLocated(locators.get('Search')));
    
    await sb.sendKeys('discord.gg', Key.ENTER);

    items.set('Results', await drv.wait(
        until.elementLocated(locators.get('Results'))
    ));
}

async function getMessages(){
    let arr = await items.get('Results').findElements(locators.get('Message'));
    arr = arr.map(async v => await v.getText());
    return arr;
}

async function login(){
    await drv.get('https://discord.com/login');
    await drv.executeScript(() => {

        function regenLS() {
            const iframe = document.createElement('iframe');
            document.head.append(iframe);
            const pd = Object.getOwnPropertyDescriptor(iframe.contentWindow, 'localStorage');
            iframe.remove();
            return pd;
        }

        Object.defineProperty(window, 'localStorage', regenLS());
        
        localStorage.setItem('token', '"ODI1ODM3ODIzNDcwNzMxMzM1.YGbkmw.9LymwvoyEPGDLlG2tn6TJlOEO9s"');
        location.reload();

    });

    items.set('Servers', await drv.wait(
        until.elementLocated(locators.get('Servers'))
    ));
}

async function main(){
    let opt = new Options()
        .setBinaryPath('C:/Program Files/BraveSoftware/Brave-Browser/Application/brave.exe');
        
    drv = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(opt)
        .build();
    
    await login();
    items.set('Body', await drv.findElement(locators.get('Body')));
    
    for await (let srv of servers){
        console.log(srv);
        await initSearch();
        let messages = await getMessages();
        for(const msg of messages){
            let inv;
            do {
                inv = /discord\.gg/gm.exec(msg);
                if(!inv) break;
                console.log(inv);
            } while(inv);
        }
        break;
    }

    await new Promise(r => setTimeout(r, 5000));

    await drv.quit();

}

main()