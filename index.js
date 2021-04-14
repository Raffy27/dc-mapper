const config = require('./config/config.json'),
    login = require('./logic/login'),
    initSearch = require('./logic/search'),
    invite = require('./logic/invite'),
    { Builder } = require('selenium-webdriver'),
    { Options } = require('selenium-webdriver/chrome'),
    { Graph } = require('graphlib');

/**
 * @type import('selenium-webdriver').WebDriver
 */
let drv;
// Dynamically initialized middleware
let roots, pages, messages;
let g = new Graph();

async function processServer(id){
    await initSearch(drv);

    let set = new Set();
    for await (let page of pages){
        process.stdout.write(`\r\tPage: ${page}`);
        const invs = await messages.getInvites();
        set = new Set([...set, ...invs]);
    }
    console.log(`\n\tFound ${set.size} unique invites`);

    let vx = new Set();
    for(const inv of set){
        try {
            let code = invite.getCode(inv);
            process.stdout.write(`\t${code.padEnd(10)}\t-->\t`);

            let info = await invite.getDetails(code);
            if(info.guild.id == id) continue;
            if(!g.hasNode(info.guild.id)){
                g.setNode(info.guild.id, {
                    root: false,
                    name: info.guild.name
                });
            }
            g.setEdge(id, info.guild.id);
            vx.add(info.guild.id);
            
            console.log(info.guild.name);
        } catch (err) {
            console.log(err.message);
            //Invalid invite encountered, no worries
        }
    }

    return vx;
}

async function main(){
    let opt = new Options()
        .setBinaryPath(config.browser.binary);
        
    drv = await new Builder()
        .forBrowser(config.browser.name)
        .setChromeOptions(opt)
        .build();

    roots = require('./iterators/roots')(drv),
    pages = require('./iterators/pages')(drv),
    messages = require('./iterators/messages')(drv);
    
    await login(drv);

    let queue = new Set();
    
    for await (let { id, ...val } of roots){
        console.log(val.name);

        g.setNode(id, {
            root: true,
            ...val
        });
        
        queue = new Set([...queue, ...await processServer(drv, id)]);

    }

    console.log('Done!');
    console.log(queue);

    await drv.quit();

}

main();