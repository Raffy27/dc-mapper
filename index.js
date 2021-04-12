const config = require('./config/config.json'),
    login = require('./logic/login'),
    initSearch = require('./logic/search'),
    { Builder } = require('selenium-webdriver'),
    { Options } = require('selenium-webdriver/chrome'),
    { Graph } = require('graphlib');

async function main(){
    let opt = new Options()
        .setBinaryPath(config.browser.binary);
        
    const drv = await new Builder()
        .forBrowser(config.browser.name)
        .setChromeOptions(opt)
        .build();

    const roots = require('./iterators/roots')(drv),
        pages = require('./iterators/pages')(drv),
        messages = require('./iterators/messages')(drv);
    
    await login(drv);

    let g = new Graph();
    
    for await (let { id, ...val } of roots){
        console.log(id, val);

        g.setNode(id, val);
        await initSearch(drv);

        for await (let page of pages){
            console.log(page);
            const invs = await messages.getInvites();
            for(const inv of invs){
                console.log('\t'+inv);
            }
        }

    }

    await drv.quit();

}

main();