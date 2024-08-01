export class LWWReg<T> {
  static zero<T>(defaultVal: T): LWWReg<T> {
    return new LWWReg(defaultVal, new Date(-8640000000000000));
  }

  static merge<T>(reg1: LWWReg<T>, reg2: LWWReg<T>): LWWReg<T> {
    if (reg1.timestamp < reg2.timestamp) {
      return reg2;
    } else {
      return reg1;
    }
  }

  _value: T;
  timestamp: Date;

  constructor(value: T, timestamp: Date) {
    this._value = value;
    this.timestamp = timestamp;
  }

  value(): T {
    return this._value;
  }

  set(timestamp: Date, value: T) {
    // 只在当前 timestamp 过期后再进行更新
    if (this.timestamp < timestamp) {
      this._value = value;
      this.timestamp = timestamp;
    }
  }
}
