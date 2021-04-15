const graphlib = require('graphlib'),
    fs = require('fs');

process.on('SIGINT', function() {
    if(global.stopping){
        console.warn('\rDamn, chill out');
        console.log('Dumping everything to disk...');
        const j = JSON.stringify(graphlib.json.write(global.g));
        fs.writeFile('graph.json', j, () => {
            console.log('Bye now');
            process.exit(-1);
        });
    }
    console.log('\rShutting down...');
    global.stopping = true;
    global.ac?.abort();
});

process.on('unhandledRejection', err => {
    if(global.stopping) {
        console.warn('Stuff is crashing, but this is fine');
        console.warn(err);
        return;
    }
    console.error(err);
});