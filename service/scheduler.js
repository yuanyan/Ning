var schedule = require('node-schedule');

exports.Job = schedule.Job;
exports.Range = schedule.Range;
exports.RecurrenceRule = schedule.RecurrenceRule;
exports.Invocation = schedule.Invocation;
exports.scheduleJob = schedule.scheduleJob;
exports.scheduledJobs = schedule.scheduledJobs;
exports.cancelJob = schedule.cancelJob;

/**
 * Schedules the specified task for execution at the specified time.
 * @param task
 * @param when
 * @returns {*}
 */
exports.job = schedule.scheduleJob;

/**
 * Schedules the specified task for execution at the specified time.
 * @param task
 * @param when
 * @returns {*}
 */
exports.cron = schedule.scheduleJob;
