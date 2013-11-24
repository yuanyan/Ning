function Timer(){}

Timer.prototype.schedule = function (task, when){
    var now = (new Date()).getTime();

    if(when.getTime){
        when = when.getTime();
    }

    if (when <= now){
        process.nextTick(task);
    }else {
        this.id = setTimeout(task, when - now);
    }

    return this;
}

Timer.prototype.cancel = function(){
    if(this.id){
        clearTimeout(this.id);
        this.id = null;
    }
    return this;
}

/**
 * Schedules the specified task for execution at the specified time.
 * @param task
 * @param when
 * @returns {*}
 */
exports.job = function(task, when){
    var t = new Timer();
    return t.schedule(task, when)
};

/**
 * Schedules the specified task for execution at the specified time.
 * @param task
 * @param when
 * @returns {*}
 */
exports.cron = function(task, when){

};
