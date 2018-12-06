import React from 'react';

let countDown;
class BreakLength extends React.Component {
  render(){
      const name = Object.keys(this.props.timeLeft)[1];
      return(
        <div className="o-layout">
          <div id="break-label" className="o-layout__title">Break Length</div>
          <div className="o-layout__items">
            <button id="break-decrement" className="btn" onClick={()=>this.props.decrementValue(this.props.timeLeft.break.minutes, name)}>-</button>
            <div id="break-length">{this.props.timeLeft.break.minutes}</div>
            <button id="break-increment" className="btn" onClick={()=>this.props.increaseValue(this.props.timeLeft.break.minutes, name)}>+</button>  
          </div>
        </div>
    );
  }  
}

class SessionLength extends React.Component {
  render(){
    const name = Object.keys(this.props.timeLeft)[0];
    return(
        <div className="o-layout">
          <div id="session-label" className="o-layout__title">Session length</div>
          <div className="o-layout__items">
              <button id="session-decrement" className="btn" onClick={()=>this.props.decrementValue(this.props.timeLeft.session.minutes, name)}>-</button>
              <div id="session-length">{this.props.timeLeft.session.minutes}</div>
              <button id="session-increment" className="btn" onClick={()=>this.props.increaseValue(this.props.timeLeft.session.minutes, name)}>+</button>
          </div>
        </div>
    ); 
  }
}

class Timer extends React.Component {
  
  
  render(){
    const sessionLabel = Object.keys(this.props.timeLeft)[0];
    const breakLabel = Object.keys(this.props.timeLeft)[1];
    const {minutes, seconds} = this.props.timeLeft.session;
    const isPaused = this.props.isPaused;
    const isSession = this.props.isSession;
    const minutesBreak = this.props.timeLeft.break.minutes;
    const secondsBreak = this.props.timeLeft.break.seconds;
    const labelName =  (isSession)?sessionLabel:breakLabel;
    const timeType = (isSession)?(minutes + ":" + seconds):(minutesBreak + ":" + secondsBreak);
    const minuteType = (isSession)?(minutes):(minutesBreak);
    const secondType = (isSession)?(seconds):(secondsBreak);
    
    return(
      <React.Fragment>
        <div className="o-wrapper__content">
          <div className="o-layout">
            <div id="timer-label" className="o-layout__title">{labelName}</div>
            <div id="time-left" className="time-left">{timeType}</div>
          </div>
        </div>
          <div className="o-wrapper__content u-margin-top-small">
              <div className="o-layout__items">
            {!isPaused?<button id="start_stop" onClick={()=>this.props.startCounter(minuteType, secondType, labelName)} className="btn">	&#x25B7;</button>:<button className="btn" onClick={this.props.stopCounter}>&#x23F8;</button>}
            <button id="reset" onClick={this.props.resetStateValues} className="btn">&#8634;</button>
            </div>
          </div>
      </React.Fragment>
    );
  }
}

class Pomodoro extends React.Component {
  
  state = this.initialState;
  
  get initialState() {
      return {
          timeLeft: {
            session :{
              minutes: 25,
              seconds: 0  
            },
            break :{
              minutes: 5,
              seconds: 0
            }

          },
          isPaused: false,
          isSession: true
      };
  }
  stopCounter = () => {
    console.log("pause");
    this.setState({isPaused: !this.state.isPaused});
    clearInterval(countDown);
  }
  
  launchCounter =(counter, name)=> {
       countDown = setInterval(()=> {
        (counter[name].seconds === 0)?(counter[name].seconds = 60, counter[name].minutes--):null;
        counter[name].seconds--;
        if (counter[name].seconds === 0) {
          counter[name].minutes--;
          counter[name].seconds = 0;
        }
        if (counter[name].minutes <= 0) {
          counter[name].minutes= 0;
        }
 
        
        if (counter[name].seconds <= 0 && counter[name].minutes <=0) {
              console.log("zeroooooooooooooo");
              clearInterval(countDown);
              
              
              if(name==="session"){
                  this.setState({isSession: !this.state.isSession});               
                  this.launchCounter(counter, "break");                  }
              }
                         
        this.setState({timeLeft: counter}); 
      
      }, 1000);
  }
 
  startCounter = (mm, s, name) => {
    // const sessionLabel = Object.keys(this.state.timeLeft)[0];
    // const breakLabel = Object.keys(this.state.timeLeft)[1];
   
    let counter = {...this.state.timeLeft};
    //console.log(counter[name].minutes);
    counter[name].minutes = mm;
    counter[name].seconds =  s;
    
    this.setState({isPaused: !this.state.isPaused});
    console.log(name);//session
    this.launchCounter(counter, name);
    
    //handle start count into timer component => if break trigger start counter and change isSession/ if session trigger start counter
  }

  resetStateValues = () => {
    console.log('reset');
    this.setState(this.initialState);
    clearInterval(countDown);
  }

  increaseValue = (val, name) => {
    let value = val + 1;
    const timeLeft = {...this.state.timeLeft};
    
    console.log("hohohoho");
    (name==="session")?timeLeft.session.minutes = value:timeLeft.break.minutes = value;
    if(value > 60 || timeLeft[name].minutes > 60){
      return null;
    }
    this.setState({timeLeft:timeLeft});
  }
  
  decrementValue = (val, name) => {
    let value = val - 1;
    const timeLeft = {...this.state.timeLeft};
    (name==="session")?timeLeft.session.minutes = value:timeLeft.break.minutes = value;
    if(timeLeft[name].minutes < 0 || value <0){
      return null;
    }
    this.setState({timeLeft:timeLeft});

  }
  
  render(){
    return(
      <div className="o-wrapper">
        <h1>Pomodoro clock</h1>
        <div className="o-wrapper__content">
          <BreakLength increaseValue={this.increaseValue} decrementValue={this.decrementValue} timeLeft={this.state.timeLeft}/>
          <SessionLength increaseValue={this.increaseValue} decrementValue={this.decrementValue} timeLeft={this.state.timeLeft}/>
        </div>
        <Timer startCounter={this.startCounter} resetStateValues={this.resetStateValues} timeLeft={this.state.timeLeft} isPaused={this.state.isPaused} stopCounter={this.stopCounter} isSession={this.state.isSession}/>
      </div>
    );
  }
}

export default Pomodoro;

//helper
