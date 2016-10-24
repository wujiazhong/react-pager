import React, {
  Component,
  PropTypes
} from 'react';
import ReactDOM from 'react-dom';
import {GlobalAlert} from '../alert-global.jsx';

var PagerItem = React.createClass({
  clickEvent: function(){
    this.props.onClicked(this.props.index);
  },
  render: function() {
    return (
      <li className={this.props.className} onClick={this.clickEvent}>
        <a href="javascript:void(0)">{this.props.text}</a>
      </li>
    );
  }
});

const Ellipsis = React.createClass({
  render: function() {
    return (
      <li className="pager-ellipsis"><span>...</span></li>
    )
  }
});

const propTypes = {
  showItemNum: PropTypes.number,
  prevText: PropTypes.string,
  nextText: PropTypes.string,
  btnWidth: PropTypes.number,
  totalCount: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  pagerCallBack: PropTypes.func.isRequired
};

const defaultProps = {
  showItemNum: 7, // should be more than 7
  prevText: "<",
  nextText: ">",
  btnWidth:50
};

class Pager extends Component {
  constructor(props) {
    super(props);
    this.state = {
      curPageIndex: 1,
      inputPageIndex: ''
    };
    this.onPageItemClick = this.onPageItemClick.bind(this);
    this.onGoClicked = this.onGoClicked.bind(this);
    this.inputIndexChanged = this.inputIndexChanged.bind(this);
  }

  onPageItemClick(index) {
    this.setState({curPageIndex: parseInt(index), inputPageIndex: ''});
    this.props.pagerCallBack(index);
  }

  getPageItem(item) {
    return <PagerItem key={item.Key} text={item.Text} index={item.Index} className={item.ClassName} onClicked={this.onPageItemClick}/>;
  }

  inputIndexChanged(e) {
    var val = parseInt(e.target.value);
    var inputVal = '';

    if (isNaN(val)) {
      inputVal = '';
    } else {
      inputVal = Math.min(val, this.getTotPageNum()) + '';
    }

    this.setState({inputPageIndex: inputVal});
  }

  onGoClicked() {
    var pageIndex = ~~this.state.inputPageIndex;
    if(pageIndex >0 && pageIndex != this.state.curPageIndex){
        this.onPageItemClick(pageIndex);
    }
  }

  getTotPageNum() {
    return Math.ceil(this.props.totalCount / this.props.pageSize);
  }

  // e.g. totalPages = 30, showItemNum = 7
  getPagesArr(totalPages) {
    let arr = [];
    // totalPages <= this.state.showItemNum
    // show all: < 1 2 3 4 5 6 7 >
    if (totalPages <= this.props.showItemNum) {
      for (var i=1; i<=totalPages; i++) {
        arr.push(i);
      }
    } else {
      let leftEnd = this.props.showItemNum - 3;
      let rightStart = totalPages - (this.props.showItemNum - 4);
      // curPageIndex <= showItemNum - 3
      // left: < 1 2 3 4 5 ... 30 >
      if (this.state.curPageIndex <= leftEnd) {
        for (var i=1; i<=leftEnd + 1; i++) {
          arr.push(i);
        }
        arr.push(-1);
        arr.push(totalPages);
      }
      // curPageIndex <= totalPages && curPageIndex >= totalPages - (showItemNum - 4)
      // right: < 1 ... 26 27 28 29 30 >
      else if (this.state.curPageIndex <= totalPages && this.state.curPageIndex >= rightStart) {
        arr.push(1);
        arr.push(-1);
        for (var i=rightStart - 1; i<=totalPages; i++) {
          arr.push(i);
        }
      }
      // middle: < 1 ... 26 27 28 ... 30 >
      else {
        var midItemNum = this.props.showItemNum - 4;
        arr.push(1);
        arr.push(-1);

        var startPos = this.state.curPageIndex - Math.floor(midItemNum / 2);
        var i = 0;
        for (i=0; i<midItemNum; i++) {
          arr.push(startPos + i);
        }

        arr.push(-1);
        arr.push(totalPages);
      }

    }
    return arr;
  }

  render() {
    if (this.props.totalCount === 0) return 'none';
    let totalPages = this.getTotPageNum();
    let pageItemArr = [];
    let prevDisplay = 1 === this.state.curPageIndex ? 'disabled':'';
    let lastDisplay = totalPages === this.state.curPageIndex ? 'disabled':'';

    let arr = this.getPagesArr(totalPages);

    pageItemArr.push(
      this.getPageItem({
        Key : "prev",
        Text :  this.props.prevText,
        Index : Math.max(this.state.curPageIndex - 1, 1),
        ClassName : prevDisplay
      })
    );

    for(var i=0; i<arr.length; i++) {
      if (arr[i] > 0) {
        pageItemArr.push(
          this.getPageItem({
            Key : arr[i],
            Text :  arr[i],
            Index : arr[i],
            ClassName : arr[i] === this.state.curPageIndex ? 'active':''
          })
        );
      } else {
        pageItemArr.push(<Ellipsis />);
      }
    }

    pageItemArr.push(
      this.getPageItem({
        Key : "next",
        Text :  this.props.nextText,
        Index : Math.min(this.state.curPageIndex + 1, totalPages),
        ClassName : lastDisplay
      })
    );

    pageItemArr.push(
      <li key="go">
        <div className="input-group" style={{display:'inline-block',float:'left', marginLeft:5}}>
          <input type="text" className="form-control" value={this.state.inputPageIndex} onChange={this.inputIndexChanged} style={{width:this.props.btnWidth}} />
          <span className="input-group-btn" style={{display:'inline-block'}}>
            <button className="btn btn-default" onClick={this.onGoClicked} type="button">Go</button>
          </span>
        </div>
      </li>
    );

    return (
      <ul className="pagination" style={{display:''}}>
        {pageItemArr}
      </ul>
    );
  }
};

Pager.propTypes = propTypes;
Pager.defaultProps = defaultProps;

export default Pager;
