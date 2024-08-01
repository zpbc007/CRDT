import { ReplicaId } from "./GCounter";
import { Order, VTime } from "./VClock";

export class ORSet<T> {
  static zero<T>(): ORSet<T> {
    return new ORSet(new Map(), new Map());
  }

  static merge<T>(aSet: ORSet<T>, bSet: ORSet<T>): ORSet<T> {
    const mergeMap = (
      aMap: Map<T, VTime>,
      bMap: Map<T, VTime>
    ): Map<T, VTime> => {
      return Array.from(bMap).reduce((acc, [k, bValue]) => {
        const aValue = aMap.get(k);
        if (aValue) {
          return acc.set(k, VTime.merge(aValue, bValue));
        } else {
          return acc.set(k, bValue);
        }
      }, new Map(aMap));
    };

    const addMap = mergeMap(aSet.addMap, bSet.addMap);
    const removeMap = mergeMap(aSet.removeMap, bSet.removeMap);

    const resultAdd = Array.from(removeMap).reduce((acc, [k, remTime]) => {
      const addTime = acc.get(k);

      // 添加时间小于删除时间，在结果中删除
      if (addTime && VTime.compare(addTime, remTime) === Order.lt) {
        acc.delete(k);
      }

      return acc;
    }, new Map(addMap));

    const resultRemove = Array.from(addMap).reduce((acc, [k, addTime]) => {
      const removeTime = acc.get(k);

      if (removeTime && VTime.compare(addTime, removeTime) === Order.lt) {
        // 添加时间小于删除时间，在结果中保留
        return acc;
      } else {
        // 等于、大于、冲突都不在 delete 中保留
        acc.delete(k);
        return acc;
      }

      return acc;
    }, new Map(removeMap));

    return new ORSet(resultAdd, resultRemove);
  }

  addMap: Map<T, VTime>;
  removeMap: Map<T, VTime>;
  constructor(addMap: Map<T, VTime>, removeMap: Map<T, VTime>) {
    this.addMap = addMap;
    this.removeMap = removeMap;
  }

  value(): Map<T, VTime> {
    // 遍历 remove
    return Array.from(this.removeMap).reduce<Map<T, VTime>>(
      (acc, [k, vTimeInRem]) => {
        const vTimeInAdd = acc.get(k);
        if (vTimeInAdd) {
          // 如果添加在删除之后，则删除元素
          // 对于并发操作，则保留元素
          if (VTime.compare(vTimeInAdd, vTimeInRem) === Order.lt) {
            acc.delete(k);
          }
        }

        return acc;
      },
      new Map(this.addMap)
    );
  }

  add(replicaId: ReplicaId, value: T) {
    const addExist = this.addMap.has(value);
    const remExist = this.removeMap.has(value);

    if (addExist || remExist) {
      // 在 add || rem 中存在，更新 vTime
      const vTime = addExist
        ? this.addMap.get(value)!
        : this.removeMap.get(value)!;
      // 更新 vTime
      vTime.inc(replicaId);

      this.addMap.set(value, vTime);
    } else {
      // 不存在，初始化
      const vTime = VTime.zero();
      vTime.inc(replicaId);
      this.addMap.set(value, vTime);
    }
  }

  remove(replicaId: ReplicaId, value: T) {
    const addExist = this.addMap.has(value);
    const remExist = this.removeMap.has(value);

    if (addExist || remExist) {
      // 在 add || rem 中存在，更新 vTime
      const vTime = addExist
        ? this.addMap.get(value)!
        : this.removeMap.get(value)!;
      // 更新 vTime
      vTime.inc(replicaId);

      // 在 add 中删除
      this.addMap.delete(value);
      // 在 remove 中增加
      this.removeMap.set(value, vTime);
    } else {
      // 不存在，初始化
      const vTime = VTime.zero();
      vTime.inc(replicaId);
      this.removeMap.set(value, vTime);
    }
  }
}
