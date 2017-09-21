// From: https://github.com/reactjs/react-redux

const hasOwnProp = Object.prototype.hasOwnProperty;

export default function shallowEqual(
  objA: { [key: string]: any },
  objB: { [key: string]: any }
) {
  if (objA === objB) {
    return true;
  }

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  for (let i = 0; i < keysA.length; i++) {
    const keyA = keysA[i];
    if (!hasOwnProp.call(objB, keyA) || objA[keyA] !== objB[keyA]) {
      return false;
    }
  }

  return true;
}
