import { makeAutoObservable, runInAction } from 'mobx';

export class CountdownTimer {
  private _finished = false;

  private _timeLeft: number = 0;

  public constructor(
    private params: {
      time: number;
      callbackEvery: number;
    }
  ) {
    makeAutoObservable(this, {}, { autoBind: true });
    this._timeLeft = params.time;
  }

  public get percentLeft() {
    return (this._timeLeft * 100) / this.params.time;
  }

  public start(): this {
    if (this._finished) {
      console.warn('Trying to start finished Countdown timer');
      return this;
    }
    const timer = this;
    setTimeout(function timerHandler() {
      runInAction(() => {
        timer._timeLeft = Math.max(
          0,
          timer._timeLeft - timer.params.callbackEvery
        );
        if (timer._timeLeft > 0) {
          setTimeout(timerHandler, timer.params.callbackEvery);
        } else {
          timer._finished = true;
        }
      });
    }, this.params.callbackEvery);

    return this;
  }
}
