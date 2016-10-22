import React, {
  Component,
  PropTypes
} from 'react';
import ReactDOM from 'react-dom';

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
  pageShowNum: PropTypes.number,
  prevText: PropTypes.string,
  nextText: PropTypes.string,
  btnWidth: PropTypes.number
};

const defaultProps = {
  pageShowNum: 7,
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
    if (!isNaN(val) && val>0) {
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

  getPagesArr(pageNum) {
    let arr = [];
    if (pageNum <=7) {
      for (var i=1; i<=pageNum; i++) {
        arr.push(i);
      }
    } else {
      if (this.state.curPageIndex <= 4 ) {
        for (var i=1; i<=5; i++) {
          arr.push(i);
        }
        arr.push(-1);
        arr.push(pageNum);
      } else if (this.state.curPageIndex <= pageNum && this.state.curPageIndex >= pageNum - 3) {
        arr.push(1);
        arr.push(-1);
        for (var i=pageNum - 4; i<=pageNum; i++) {
          arr.push(i);
        }
      } else {
        arr.push(1);
        arr.push(-1);
        arr.push(this.state.curPageIndex - 1);
        arr.push(this.state.curPageIndex);
        arr.push(this.state.curPageIndex + 1);
        arr.push(-1);
        arr.push(pageNum);
      }

    }
    return arr;
  }

  render() {
    if (this.props.totalCount === 0) return 'none';
    let totalPages = this.getTotPageNum();
    let pageItemArr = [];
    let prevDisplay = 1 === this.state.curPageIndex ? 'disabled':'';
    let lastDisplay = totalPages == this.state.curPageIndex ? 'disabled':'';

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
            ClassName : arr[i] == this.state.curPageIndex ? 'active':''
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
