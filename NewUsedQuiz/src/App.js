import React from 'react';
import logo from './logo.png';
import { Modal } from 'react-bootstrap';
import './App.css';

//Data for quizz
let data = require('./data.json');


class Header extends React.Component {
  render() {
      return(
      <div className='navbar' ref={'header'} >
            <div className='container'>
                <img src={logo} className='img-responsive' alt="logo"/>
            </div>
         </div>
        )
    }
}



class Overlay extends React.Component {
      constructor (props) {
        super(props);
        this.state = {
          show: false
        };
      }

      handleOpen = () => {
        this.setState({ show: true });
      };

      handleClose = () => {
        this.setState({ show: false });
      };

      componentDidMount () {

      };

      componentWillReceiveProps (nextProps) {
            // console.log('did update', nextProps);
        this.setState({ show: nextProps.show });
      };

      render () {
        return (
          <div>
            <Modal show={this.state.show} onHide={this.props.onHide}>
              <Modal.Header closeButton />
              <Modal.Body>
                <p>{this.props.children}</p>
              </Modal.Body>
            </Modal>
          </div>
        )
      }

}

class HomeView extends React.Component {

    constructor (props) {
        super(props);
        this.state = {
            show: false,
            Index: 0,
            page: 1,
            total: 0,
            progress: 0,
            answear: -1,
            points: 0,
            range: 0,
            checked: this.props.checkValue,
            answearsArray: [],
            pageView: this.props.pageView,
        }
    }

    componentDidMount () {
        this.setState({
            total: data.quiz.length
        })
    }

    buildStyle = () => {
        return ({
            progress: {
                width: this.state.progress
            }
        })
    }

    whyState = () => {
        this.setState({
            show: true
        })
    }

    goNext = (ind) => {
        if (this.state.checked) {
            let points = data.quiz[this.state.Index].value * this.state.points;
            if (this.state.page < this.state.total) {
                ind++;
                let p = this.state.page + 1;
                let cent = ((p * 100) / this.state.total);
                this.setState({
                    ...this.state,
                    Index: ind,
                    page: p,
                    progress: `${cent}%`,
                    checked: false,
                });
                this.state.answearsArray.push(points);
                //this.updateView([p, this.state.total, points]);
            } else {
                //this.props.updateView([this.state.page, this.state.total, points]);
                //this.props.resultsFunction();
                this.state.answearsArray.push(points);
                let tot = 0;
                this.state.answearsArray.map(function (ans) {
                    return tot += ans;
                })
                let totalQuestions = this.state.answearsArray.length;
                let range = (tot / totalQuestions);
                console.log("range", range);
                this.setState({
                    ...this.state,
                    pageView: 'results',
                    range: range.toFixed(1),
                })
            }
        }
    }

    goPrev = (ind) => {
        if (ind > 0) {
            --ind;
            let p = this.state.page - 1;
            let cent = ((ind * 100) / this.state.total);
            this.setState({
                Index: ind,
                page: p,
                answear: '',
                points: 0,
                progress: `${cent}%`,
                checked: false,
            });
            this.state.answearsArray.pop();
            //this.props.backFunction([ind, this.state.total])
        }
    }

    handleRadios = (event) => {
        // console.log(event.target.alt);
        this.setState({
            ...this.state,
            answear: event.target.value,
            checked: event.target.checked,
            points: event.target.alt
        })
    }

    handleClose = () => {
        this.setState({ show: false });
    };

    componentWillReceiveProps (nextProps) {
        this.setState({
            progress: `${nextProps.progress}%`,
            checked: nextProps.checkValue
        })
        // console.log('percentage', nextProps.progress)
    }

    renderQuizorResults = () => {
        if (this.state.pageView === 'quizz') {
            return (
                <div>
                    <div className='row subheaderbar' >
                        <em>{data.quizName}</em>
                    </div>
                    <h3 dangerouslySetInnerHTML={{ __html: data.quiz[this.state.Index].question }} />
                    <div className='text-left'>
                        <a className='whystate' onClick={this.whyState}>why this question? ></a>
                    </div>
                    <div className='text-left'>
                        {data.quiz[this.state.Index].response.map(function (res, r) {
                            // console.log("res.val", this.state.answear)
                            return (
                                <div className='radio' key={r}>
                                    <label>
                                        <input type='radio' name={`optionsRadios`} value={res.res} onChange={this.handleRadios} alt={res.val} checked={this.state.answear == res.res} />
                                        {res.res}
                                    </label>
                                </div>
                            )
                        }, this)}
                    </div>
                    <div className='clearfix' />
                    <div className='progress'>
                        <div className='progress-bar' role='progressbar' aria-valuenow={this.state.progress} aria-valuemin='0' aria-valuemax='100' style={this.buildStyle().progress}>
                            <span className='sr-only'>{this.state.progress} Complete</span>
                        </div>
                    </div>
                    <div className='text-right'>
                        <em>{this.state.page} of {this.state.total}</em>
                    </div>
                    <div className='clearfix' />
                    <nav aria-label='...'>
                        <ul className='pager'>
                            <li className='previous'><a href='javascript:void(0)' onClick={this.goPrev.bind(this, this.state.Index)}><span className='yellow'>&lt;</span> <em>back</em></a></li>
                            <li className='next'><a href='javascript:void(0)' onClick={this.goNext.bind(this, this.state.Index)}><em>next</em> <span className='yellow'>&gt;</span></a></li>
                        </ul>
                    </nav>
                </div>
            )
        } else if (this.state.pageView === 'results') {
            //console.log('state range', this.state.range);
            if (this.state.range >= 1.5) {
                return (
                    <div>
                        <Results />
                    </div>
                )
            } else if (this.state.range < 1.5) {
                return (
                    <div>
                        <Results2 />
                    </div>
                )
            }
        }
  }

  render () {
        // console.log('HomeView', this.props);
        // console.log('json data', data);
    return (
      <div className='buyLeaseQuizComponent container'>
        <div className='col-md-12'>
          {this.renderQuizorResults()}
        </div>
        <Overlay show={this.state.show} onHide={() => this.handleClose()}>
          {data.quiz[this.state.Index].why}
        </Overlay>
      </div>
    )
  }
}
class Results extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      heroImage: require(`./img/${data.results[0].hero}`)
    }
   }

  componentDidMount () {}

  componentWillReceiveProps (nextProps) {}

  render () {
    return (
      <div className={'results'}>
        <div className='row subheaderbar' >
          <em>{data.quizName}</em>
        </div>
        <div className='r1'>
          <img src={this.state.heroImage} className='img-responsive img-circle results' alt="hero" />
        </div>
        <div className='row2'>
          <h2>You should <b>{data.results[0].title}</b></h2>
          <a className='whystate' href="mailto:info@libertymutual.com">email my results></a>
          <p className='resultLegend'>{data.results[0].text} <a href='http://www.libertymutual.com/carbuying' >click here.</a></p>
        </div>
        <div className='clearfix' />
        <div className='col-sm-6'>
              <p className='text-center lm-blue'>
                <em>Which Is Right for you:<br />
                            Gasoline, Electric or Hybrid?</em>
              </p>
              <nav aria-label='...'>
                <ul className='pager'>
                  <li><a href='#'><em>Take this quiz <span className='yellow'>&gt;</span></em></a></li>
                </ul>
              </nav>
        </div>
        <div className='col-sm-6'>
              <p className='text-center lm-blue'>
                <em>Which Is Right for You:<br />
                            Buy or Lease?</em>
              </p>
              <nav aria-label='...'>
                <ul className='pager'>
                  <li><a href='#'><em>Take this quiz <span className='yellow'>&gt;</span></em></a></li>
                </ul>
              </nav>
        </div>
      </div>
    )
  }
}

class Results2 extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      heroImage: require(`./img/${data.results[1].hero}`)
    }
  }

  componentDidMount () {}

  componentWillReceiveProps (nextProps) {}

  render () {
    return (
      <div className={'results'}>
        <div className='row subheaderbar' >
          <em>{data.quizName}</em>
        </div>
        <div className='r1'>
          <img src={this.state.heroImage} className='img-responsive img-circle results' alt="hero" />
        </div>
        <div className='row2'>
          <h2>You should <b>{data.results[1].title}</b></h2>
          <a className='whystate' href="mailto:info@libertymutual.com">email my results></a>
          <p className='resultLegend'>{data.results[1].text} <a href='http://www.libertymutual.com/carbuying' >click here.</a></p>
        </div>
        <div className='clearfix' />
        <div className='row'>
          <div className='col-sm-6'>
            <p className='text-center lm-blue'>
              <em>Which Is Right for you:<br />
                            Gasoline, Electric or Hybrid?</em>
            </p>
            <nav aria-label='...'>
              <ul className='pager'>
                <li><a href='#'><em>Take this quiz <span className='yellow'>&gt;</span></em></a></li>
              </ul>
            </nav>
          </div>
          <div className='col-sm-6'>
            <p className='text-center lm-blue'>
              <em>Which Is Right for You:<br />
                            Buy or Lease?</em>
            </p>
            <nav aria-label='...'>
              <ul className='pager'>
                <li><a href='#'><em>Take this quiz <span className='yellow'>&gt;</span></em></a></li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    )
  }
}



class App extends React.Component {

    constructor (props) {
          super(props);
          this.state = {
              pageView: "quizz"
          }
     }
     componentDidMount () {}

     componentWillReceiveProps (nextProps) {}

      render() {
          return(
          <div className="container">
              <Header />
              <HomeView pageView={this.state.pageView}/>
          </div>
          )
      }
  }

export default App;
