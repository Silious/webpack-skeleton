function sleep(dutation){
    return new Promise(resolve=>{
        setTimeout(resolve,dutation);
    });
}
module.exports = {
    sleep
}
