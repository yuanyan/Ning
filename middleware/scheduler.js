
/**
 * Date-based scheduler
 * @param date
 * @param job
 * @returns {*}
 */
exports.runOnDate = function (date, job){
    var now = (new Date()).getTime();
    var then = date.getTime();

    if (then < now){
        process.nextTick(job);
        return null;
    }

    return setTimeout(job, (then - now));
};