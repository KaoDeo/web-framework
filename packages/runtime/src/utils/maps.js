export function mapsDiff(oldMap, newMap) {
  const oldKeys = Array.from(oldMap.keys());
  const newKeys = Array.from(newMap.keys());

  return {
    added: newKeys.filter((key) => !oldMap.has(key)),
    removed: oldKeys.filter((key) => !newMap.has(key)),
    updated: newKeys.filter(
      (key) => oldMap.has(key) && oldMap.get(key) !== newMap.get(key)
    ),
  };
}

export function makeCountMap(array) {
  const map = new Map();

  for (const item of array) {
    map.set(item, (map.get(item) || 0) + 1);
  }

  return map;
}
