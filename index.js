const config = require('./config/config.json'),
    login = require('./logic/login'),
    initSearch = require('./logic/search'),
    invite = require('./logic/invite'),
    { join, leave } = require('./logic/server'),
    { Builder } = require('selenium-webdriver'),
    { Options } = require('selenium-webdriver/chrome'),
    graphlib = require('graphlib'),
    fs = require('fs/promises');

require('./logic/events');

/**
 * @type import('selenium-webdriver').WebDriver
 */
let drv;
// Dynamically initialized middleware
let roots, pages, messages;
let g = new graphlib.Graph();

async function processServer(id){
    await initSearch(drv);

    let codes = new Set();
    for await (let page of pages){
        if(global.stopping) return new Map();
        process.stdout.write(`\r\tPage: ${page}`);
        let arr = await messages.getInvites();
        arr = arr.map(link => invite.getCode(link));
        codes = new Set([...codes, ...arr]);
    }
    console.log(`\nFound ${codes.size} unique invites`);

    let srv = new Map();
    for(const code of codes){
        if(global.stopping) return new Map();
        try {
            process.stdout.write(`\t${code.padEnd(10)}\t-->\t`);

            let info = await invite.getDetails(code);
            console.log(info.guild.name);
            if(info.guild.id == id) continue;
            if(!g.hasNode(info.guild.id)){
                g.setNode(info.guild.id, {
                    root: false,
                    name: info.guild.name,
                    icon: info.guild.icon,
                    count: info.guild.approximate_member_count
                });
                if(!config.blacklist.includes(info.guild.id)){
                    srv.set(info.guild.id, { code, name: info.guild.name });
                }
            }
            g.setEdge(id, info.guild.id);
        } catch (err) {
            console.log(err.message);
            //Invalid invite encountered, no worries
        }
    }
    console.log(`Found ${srv.size} unique servers`);

    return srv;
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

    let queue = new Map();
    
    for await (let { id, ...val } of roots){
        if(global.stopping) break;
        console.log(val.name);
        g.setNode(id, {
            root: true,
            ...val
        });
        queue = new Map([...queue, ...await processServer(id)]);
    }
    
    try {
        let level = 1;
        while(!global.stopping && queue.size){
            console.log(`BFS level ${level}`);
            let found = new Map();
            for(const [id, { code, name }] of queue){
                console.log(name);
                await join(drv, code);
                found = new Map([...found, ...await processServer(id)]);
                await leave(drv);
            }
            queue = found;
        }

        await drv.quit();
    } catch (err) { 
        console.warn(err);
    }

}

main().catch(() => {}).then(async () => {
    console.log('Dumping everything to disk...');
    const j = JSON.stringify(graphlib.json.write(g));
    await fs.writeFile('graph.json', j);
    console.log('Done!');
});