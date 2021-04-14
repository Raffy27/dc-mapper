process.on('SIGINT', function() {
    console.log('Graceful shutdown request detected');
    global.stopping = true;
});

process.on('unhandledRejection', err => {
    if(global.stopping) return;
    console.error(err);
});