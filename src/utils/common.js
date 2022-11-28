import crypto from 'crypto';

/**
 * Helper function to determine if a given param is an object
 * @param  { any } target target entity to determine
 * @return {boolean}
 * */
export const isObject = (target) => {
    const type = typeof target;
    return type === 'function' || type === 'object' && !!target;
};
/**
 * Convenience function to group an object[] by one of the object's keys
 * @param {Record<string, any>[]} objectArray Target objects array
 * @param {Function} keyGetterFunction A function that returns the grouping key
 * @return {Record<string, Record<string, any>[]>}
 * */
export const groupByObjectKey = (objectArray, keyGetterFunction) => {
    return objectArray.reduce((accumulator, arrayItem) => {
        return ((accumulator[keyGetterFunction(arrayItem)] ||= []).push(arrayItem), accumulator);
    }, {});
};
/**
 * Generator function util to return chunks from an array
 * @param {Array} target target array
 * @param {number} size chunk's size
 * */
export function* arrayToChunks(target, size) {
    for (let i = 0; i < target.length; i += size) {
        yield target.slice(i, i + size);
    }
}
/**
 * small efficient functions to generate uuid v4 strings
 * @return {string}
 * */
export const uuidV4 = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
});
/**
 * Adds number of days to a date, in UTC preserving time
 * @param {Date} d Original date object
 * @param {number} days Number of days to add
 * @return {Date}
 * */
const addUTCDaysToDate = (d, days) => {
    return new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + days, d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds());
};
/**
 * Get days between 2 date objects
 * @param {Date} d1 Starting date objects
 * @param {Date} d2 Ending date object
 * @return {number}
 * */
export const getDaysBetweenDates = (d1, d2) => {
    const startDate = Date.UTC(d1.getUTCFullYear(), d1.getUTCMonth(), d1.getUTCDate(), 1, 1, 0, 0);
    const endDate = Date.UTC(d2.getUTCFullYear(), d2.getUTCMonth(), d2.getUTCDate(), 23, 59, 0, 0);
    return Math.round((endDate - startDate) / 86400000);
};
/**
 * Adds number of days to a date, preserving time
 * @param {Date} d Original date object
 * @param {number} days Number of days to add
 * @return {Date}
 * */
export const addDaysToDate = (d, days) => {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate() + days, d.getHours(), d.getMinutes(), d.getSeconds());
};
export const getDayLimits = (target = null ) => {
    const date = target ? new Date(target) : new Date();
    const eastOffset = -300; // Timezone offset for EST in minutes.
    const sod = new Date(date.getTime() + eastOffset * 60 * 1000);
    const eod = addDaysToDate(sod, 1);
    sod.setUTCHours(11, 30, 0, 0);
    eod.setUTCHours(11, 29, 59, 999);
    return {sod, eod};
};
export const getCurrentWeekTimeWindows = ()=>{
    const curr = new Date();
    const week = [];
    const todayNum = new Date().getDay();
    for (let i = 1; i <= 7; i++) {
        const first = curr.getDate() - curr.getDay() + i;
        const day = new Date(curr.setDate(first));
        const {sod, eod} = getDayLimits(day);
        week.push({
            dayNumber: day.getDay(),
            sod: sod,
            eod: eod,
            isToday: day.getDay() === todayNum,
        });
    }
    return week;
};
const yesterday = ((date) => date.setDate(date.getDate() - 1) && date)(new Date());
export default {
    isObject,
    uuidV4,
    groupByObjectKey,
    arrayToChunks,
};
