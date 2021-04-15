process.on('SIGINT', function() {
    if(global.stopping){
        console.warn('\rAggressive shutdown request detected');
        process.exit(-1);
    }
    console.log('\rGraceful shutdown request detected');
    global.stopping = true;
});

process.on('unhandledRejection', err => {
    if(global.stopping) {
        console.warn('Stuff is crashing, but this is fine');
        console.warn(err);
        return;
    }
    console.error(err);
});