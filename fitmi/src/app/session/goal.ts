export class Goal {

  type: string;
  threshold: number;
  unit: string;

  constructor(type: string, threshold: number) {
    this.type = type;
    this.threshold = threshold;
  }
}
