const config = require('./config/config.json'),
    login = require('./logic/login');
const { Builder, By, until, Key } = require('selenium-webdriver');
const { Options } = require('selenium-webdriver/chrome');

async function initSearch(){
    const sb = await drv.wait(until.elementLocated(locators.get('Search')));
    
    await sb.sendKeys('discord.gg', Key.ENTER);

    items.set('Results', await drv.wait(
        until.elementLocated(locators.get('Results'))
    ));
}

async function getMessages(){
    let arr = await items.get('Results').findElements(locators.get('Message'));
    for(let i = 0; i < arr.length; i++){
        arr[i] = await arr[i].getText();
    }
    return arr;
}

async function main(){
    let opt = new Options()
        .setBinaryPath(config.browser.binary);
        
    const drv = await new Builder()
        .forBrowser(config.browser.name)
        .setChromeOptions(opt)
        .build();

    const roots = require('./iterators/roots')(drv);
    
    await login(drv);
    
    for await (let srv of roots){
        console.log(srv);
        /*let list = new Set();
        await initSearch();
        let messages = await getMessages();
        for(const msg of messages){
            let invs = msg.match(/discord\.gg\/[a-zA-Z0-9]+/gm);
            if(!invs) continue;
            for(const inv of invs){
                list.add(inv);
            }
        }
        console.log(list);*/
    }

}

main();