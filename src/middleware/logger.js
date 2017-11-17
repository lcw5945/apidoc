/**
 * Created by Cray on 2017/7/7.
 */
export default ({getState}) => next => action => {
    console.log('will dispatch', action);
    let returnValue = next(action);
    console.log('state after dispatch', getState());
    return returnValue;
}