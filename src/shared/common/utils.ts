export const sleep = (ms?: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * randomly get a number in an interval
 *
 * @param minNum
 * @param maxNum
 */
export const randomNum = (minNum: number, maxNum: number): number => {
  return Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
};

export class Snowflake {
  twepoch: bigint;
  workerIdBits: bigint;
  dataCenterIdBits: bigint;
  maxWrokerId: bigint;
  maxDataCenterId: bigint;
  sequenceBits: bigint;
  workerIdShift: bigint;
  dataCenterIdShift: bigint;
  timestampLeftShift: bigint;
  sequenceMask: bigint;
  lastTimestamp: bigint;
  workerId: bigint;
  dataCenterId: bigint;
  sequence: bigint;

  constructor(_workerId: bigint, _dataCenterId: bigint, _sequence: bigint) {
    this.twepoch = 1288834974657n;
    //this.twepoch = 0n;
    this.workerIdBits = 5n;
    this.dataCenterIdBits = 5n;
    this.maxWrokerId = -1n ^ (-1n << this.workerIdBits); // 值为：31
    this.maxDataCenterId = -1n ^ (-1n << this.dataCenterIdBits); // 值为：31
    this.sequenceBits = 12n;
    this.workerIdShift = this.sequenceBits; // 值为：12
    this.dataCenterIdShift = this.sequenceBits + this.workerIdBits; // 值为：17
    this.timestampLeftShift =
      this.sequenceBits + this.workerIdBits + this.dataCenterIdBits; // 值为：22
    this.sequenceMask = -1n ^ (-1n << this.sequenceBits); // 值为：4095
    this.lastTimestamp = -1n;
    //设置默认值,从环境变量取
    this.workerId = 1n;
    this.dataCenterId = 1n;
    this.sequence = 0n;
    if (this.workerId > this.maxWrokerId || this.workerId < 0) {
      throw new Error(
        '_workerId must max than 0 and small than maxWrokerId-[' +
          this.maxWrokerId +
          ']',
      );
    }
    if (this.dataCenterId > this.maxDataCenterId || this.dataCenterId < 0) {
      throw new Error(
        '_dataCenterId must max than 0 and small than maxDataCenterId-[' +
          this.maxDataCenterId +
          ']',
      );
    }

    this.workerId = BigInt(_workerId);
    this.dataCenterId = BigInt(_dataCenterId);
    this.sequence = BigInt(_sequence);
  }

  tilNextMillis(lastTimestamp: bigint) {
    let timestamp = this.timeGen();
    while (timestamp <= lastTimestamp) {
      timestamp = this.timeGen();
    }
    return BigInt(timestamp);
  }

  timeGen() {
    return BigInt(Date.now());
  }

  nextId() {
    let timestamp = this.timeGen();
    if (timestamp < this.lastTimestamp) {
      throw new Error(
        'Clock moved backwards. Refusing to generate id for ' +
          (this.lastTimestamp - timestamp),
      );
    }
    if (this.lastTimestamp === timestamp) {
      this.sequence = (this.sequence + 1n) & this.sequenceMask;
      if (this.sequence === 0n) {
        timestamp = this.tilNextMillis(this.lastTimestamp);
      }
    } else {
      this.sequence = 0n;
    }
    this.lastTimestamp = timestamp;
    return (
      ((timestamp - this.twepoch) << this.timestampLeftShift) |
      (this.dataCenterId << this.dataCenterIdShift) |
      (this.workerId << this.workerIdShift) |
      this.sequence
    );
  }
}
