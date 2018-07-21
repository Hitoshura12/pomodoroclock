import React,{Component} from 'react'
import TimerController from './TimerController'
import accurateInterval from 'accurate-interval'

class Timer extends Component{
    constructor(props) {
        super(props);
        this.state={
            brklength:5,
            sesslength:25,
            timertype:"session",
            timerState:"stopped",
            timer:1500,
            intervalID:'',
            alarmColor:{color:'white'}
        }
        this.brklengthControl=this.brklengthControl.bind(this);
        this.sesslengthControl=this.sesslengthControl.bind(this)
        this.lengthControl = this.lengthControl.bind(this);
        this.beginCountdown=this.beginCountdown.bind(this);
        this.decrementTimer=this.decrementTimer.bind(this);
        this.timerControl=this.timerControl.bind(this);
        this.reset=this.reset.bind(this);
        this.warning=this.warning.bind(this);
        this.getTime=this.getTime.bind(this);
        this.buzzer=this.buzzer.bind(this);
    }

    brklengthControl(e){
this.lengthControl('brklength',e.currentTarget.value,this.state.brklength,'Session')
    }
    sesslengthControl(e){
        this.lengthControl('sesslength',e.currentTarget.value,this.state.sesslength,'Break')
    }


    lengthControl(stateToChange, sign, currentLength, timerType) {
        if (this.state.timerState === 'running') return;
        if (this.state.timertype === timerType) {
            if (sign === "-" && currentLength !== 1 ) {
                this.setState({[stateToChange]: currentLength - 1});
            } else if (sign === "+" && currentLength !== 60) {
                this.setState({[stateToChange]: currentLength + 1});
            }
        } else {
            if (sign === "-" && currentLength !== 1 ) {
                this.setState({[stateToChange]: currentLength - 1,
                    timer: currentLength * 60 - 60});
            } else if (sign === "+" && currentLength !== 60) {
                this.setState({[stateToChange]: currentLength + 1,
                    timer: currentLength * 60 + 60});
            }
        }
    }
timerControl(){
 let control=this.state.timerState ==="stopped" ?(
        this.beginCountdown(),
        this.setState({timerState:'running'}))
        :(this.setState({timerState:'stopped'}),
     this.state.intervalID && this.state.intervalID.clear())
}

beginCountdown(){
    this.setState({
        intervalID:accurateInterval(()=>{
            this.decrementTimer();
            this.phaseControl();
        },1000)
    });
}

getTime(){
    let minutes=Math.floor(this.state.timer/60);
    let seconds = this.state.timer-minutes *60;
    minutes= minutes<10 ?'0'+minutes :minutes;
    seconds=seconds<10? '0'+seconds:seconds;
    return minutes +':'+ seconds;
}
    decrementTimer(){
    this.setState({timer:this.state.timer-1});
    }

    phaseControl() {
        let timer = this.state.timer;
        this.warning(timer);
        this.buzzer(timer);
        if (timer < 0) {
            this.state.timertype === 'Session' ? (
                this.state.intervalID && this.state.intervalID.clear(),
                    this.beginCountdown(),
                    this.switchTimer(this.state.brklength * 60, 'Break')
            ) : (
                this.state.intervalID && this.state.intervalID.clear(),
                    this.beginCountdown(),
                    this.switchTimer(this.state.sesslength * 60, 'Session')
            );
        }
    }
    switchTimer(num,str){

        this.setState({
            timer:num,
            timertype:str,
            alarmColor:{color:'white'}
        })
    }
    warning(_timer) {
        let warn = _timer < 61 ?
            this.setState({alarmColor: {color: '#a50d0d'}}) :
            this.setState({alarmColor: {color: 'white'}});
    }

    buzzer(_timer) {
        if (_timer === 0) {
            this.audioBeep.play();
        }
    }

    reset() {
        this.setState({
            brklength: 5,
            sesslength: 25,
            timerState: 'stopped',
            timertype: 'Session',
            timer: 1500,
            intervalID: '',
            alarmColor: {color: 'white'}
        });
        this.state.intervalID && this.state.intervalID.clear();
        this.audioBeep.pause();
        this.audioBeep.currentTime = 0;

    }

    render() {
        return (
            <div className="title">
                 Pomodoro Clock
                <TimerController titleID="break-label"   minID="break-decrement"
                                 addID="break-increment" lengthID="break-length"
                                 title="Break Length"    onClick={this.brklengthControl}
                                 length={this.state.brklength}
                />
                <TimerController  titleID="session-label"   minID="session-decrement"
                                  addID="session-increment" lengthID="session-length"
                                  title="Session Length"    onClick={this.sesslengthControl}
                                  length={this.state.sesslength}/>
                <div className="timer" style={this.state.alarmColor}>
                    <div className="timer-wrapper">
                <div  id="timer-label">
                    {this.state.timertype}
                </div>
                <div id='time-left'>
                    {this.getTime()}
                </div>
                    </div>
                </div>
                <div className="timer-control">
                    <button id="start_stop" onClick={this.timerControl}>
                        <i className="fa fa-play fa-2x"/>
                        <i className="fa fa-pause fa-2x"/>
                    </button>
                    <button id="reset" onClick={this.reset}>
                        <i className="fa fa-refresh fa-2x"/>
                    </button>
                    <audio id="beep" preload="auto"
                           src="https://goo.gl/65cBl1"
                           ref={(audio) => { this.audioBeep = audio; }}/>
                </div>

            </div>

        );
    }


}
/*    constructor(props) {
        super(props);
        this.state = {
            brkLength: 5,
            seshLength: 25,
            timerState: 'stopped',
            timerType: 'Session',
            timer: 1500,
            intervalID: '',
            alarmColor: {color: 'white'}
        }
        this.setBrkLength = this.setBrkLength.bind(this);
        this.setSeshLength = this.setSeshLength.bind(this);
        this.lengthControl = this.lengthControl.bind(this);
        this.timerControl = this.timerControl.bind(this);
        this.beginCountDown = this.beginCountDown.bind(this);
        this.decrementTimer = this.decrementTimer.bind(this);
        this.phaseControl = this.phaseControl.bind(this);
        this.warning = this.warning.bind(this);
        this.buzzer = this.buzzer.bind(this);
        this.switchTimer = this.switchTimer.bind(this);
        this.clockify = this.clockify.bind(this);
        this.reset = this.reset.bind(this);
    }
    setBrkLength(e) {
        this.lengthControl('brkLength', e.currentTarget.value,
            this.state.brkLength, 'Session');
    }
    setSeshLength(e) {
        this.lengthControl('seshLength', e.currentTarget.value,
            this.state.seshLength, 'Break');
    }
    lengthControl(stateToChange, sign, currentLength, timerType) {
        if (this.state.timerState == 'running') return;
        if (this.state.timerType == timerType) {
            if (sign == "-" && currentLength != 1 ) {
                this.setState({[stateToChange]: currentLength - 1});
            } else if (sign == "+" && currentLength != 60) {
                this.setState({[stateToChange]: currentLength + 1});
            }
        } else {
            if (sign == "-" && currentLength != 1 ) {
                this.setState({[stateToChange]: currentLength - 1,
                    timer: currentLength * 60 - 60});
            } else if (sign == "+" && currentLength != 60) {
                this.setState({[stateToChange]: currentLength + 1,
                    timer: currentLength * 60 + 60});
            }
        }
    }
    timerControl() {
        let control = this.state.timerState == 'stopped' ? (
            this.beginCountDown(),
                this.setState({timerState: 'running'})
        ) : (
            this.setState({timerState: 'stopped'}),
            this.state.intervalID && this.state.intervalID.clear()
        );
    }
    beginCountDown() {
        this.setState({
            intervalID: accurateInterval(() => {
                this.decrementTimer();
                this.phaseControl();
            }, 1000)
        })
    }
    decrementTimer() {
        this.setState({timer: this.state.timer - 1});
    }
    phaseControl() {
        let timer = this.state.timer;
        this.warning(timer);
        this.buzzer(timer);
        if (timer < 0) {
            this.state.timerType == 'Session' ? (
                this.state.intervalID && this.state.intervalID.clear(),
                    this.beginCountDown(),
                    this.switchTimer(this.state.brkLength * 60, 'Break')
            ) : (
                this.state.intervalID && this.state.intervalID.clear(),
                    this.beginCountDown(),
                    this.switchTimer(this.state.seshLength * 60, 'Session')
            );
        }
    }
    warning(_timer) {
        let warn = _timer < 61 ?
            this.setState({alarmColor: {color: '#a50d0d'}}) :
            this.setState({alarmColor: {color: 'white'}});
    }
    buzzer(_timer) {
        if (_timer === 0) {
            this.audioBeep.play();
        }
    }
    switchTimer(num, str) {
        this.setState({
            timer: num,
            timerType: str,
            alarmColor: {color: 'white'}
        })
    }
    clockify() {
        let minutes = Math.floor(this.state.timer / 60);
        let seconds = this.state.timer - minutes * 60;
        seconds = seconds < 10 ? '0' + seconds : seconds;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        return minutes + ':' + seconds;
    }
    reset() {
        this.setState({
            brkLength: 5,
            seshLength: 25,
            timerState: 'stopped',
            timerType: 'Session',
            timer: 1500,
            intervalID: '',
            alarmColor: {color: 'white'}
        });
        this.state.intervalID && this.state.intervalID.clear();
        this.audioBeep.pause();
        this.audioBeep.currentTime = 0;
    }
    render() {
        return (
            <div>
                <div className="main-title">
                    Pomodoro Clock
                </div>
                <TimerController
                    titleID="break-label"   minID="break-decrement"
                    addID="break-increment" lengthID="break-length"
                    title="Break Length"    onClick={this.setBrkLength}
                    length={this.state.brkLength}/>
                <TimerController
                    titleID="session-label"   minID="session-decrement"
                    addID="session-increment" lengthID="session-length"
                    title="Session Length"    onClick={this.setSeshLength}
                    length={this.state.seshLength}/>
                <div className="timer" style={this.state.alarmColor}>
                    <div className="timer-wrapper">
                        <div id='timer-label'>
                            {this.state.timerType}
                        </div>
                        <div id='time-left'>
                            {this.clockify()}
                        </div>
                    </div>
                </div>
                <div className="timer-control">
                    <button id="start_stop" onClick={this.timerControl}>
                        <i className="fa fa-play fa-2x"/>
                        <i className="fa fa-pause fa-2x"/>
                    </button>
                    <button id="reset" onClick={this.reset}>
                        <i className="fa fa-refresh fa-2x"/>
                    </button>
                </div>
                <div className="author"> Designed and Coded by <br />
                    <a target="_blank" href="https://goo.gl/6NNLMG">
                        Peter Weinberg
                    </a>
                </div>
                <audio id="beep" preload="auto"
                       src="https://goo.gl/65cBl1"
                       ref={(audio) => { this.audioBeep = audio; }} />
            </div>
        )
    }
}*/;
export default Timer