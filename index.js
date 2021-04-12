const config = require('./config/config.json'),
    login = require('./logic/login'),
    initSearch = require('./logic/search');
const { Builder, By, until, Key } = require('selenium-webdriver');
const { Options } = require('selenium-webdriver/chrome');
const { Graph } = require('graphlib');



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

    const roots = require('./iterators/roots')(drv),
        pages = require('./iterators/pages')(drv);
    
    await login(drv);

    let g = new Graph();
    
    for await (let { id, ...val } of roots){
        console.log(id, val);
        g.setNode(id, val);
        await initSearch(drv);
        for await (let page of pages){
            console.log(page);
        }
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

    await drv.quit();

}

main();