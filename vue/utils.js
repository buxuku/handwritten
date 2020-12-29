export function isFunction(value){
    return typeof value === 'function';
}

export function isObject(data){
    return typeof data === 'object' && data !== null;
}