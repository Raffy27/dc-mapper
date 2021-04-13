const config = require('./config/config.json'),
    login = require('./logic/login'),
    initSearch = require('./logic/search'),
    invite = require('./logic/invite'),
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
        console.log(val.name);

        g.setNode(id, {
            processed: true,
            root: true,
            ...val
        });
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
                process.stdout.write(`\t${code} --> `);
                let info = await invite.getDetails(code);
                g.setNode(info.guild.id, {
                    processed: false,
                    root: false,
                    name: info.guild.name
                });
                vx.add({ id: info.guild.id, name: info.guild.name });
                console.log(info.guild.name);
            } catch (err) {
                console.log(err.message);
                //Invalid invite encountered, no worries
            }
        }

    }

    await drv.quit();

}

main();