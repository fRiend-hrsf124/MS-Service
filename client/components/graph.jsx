import React from 'react';
import { ajax } from 'jquery';
import styled from 'styled-components';
function formatNumber(num) {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}
const Xaxis = styled.text`
  font: bold;
  font-size: 10px;
  fill: gray;
  font-family: 'Libre Franklin', sans-serif;
  font-weight: 300;
`;
const Yaxis = styled.text`
  font: italic;
  font-size: 9px;
  fill: gray;
  font-family: 'Libre Franklin', sans-serif;
  font-weight: 300;
`;
const Yline = styled.line`
  z-index: 1;
  stroke: gainsboro;
  stroke-opacity: 0.3;
`;
const GraphLine = styled.line`
  z-index: 2;
  position: absolute;
`;
const InvisLine = styled.line`
  stroke-opacity: 0;
`;
const PopText = styled.text`
  z-index: 90;
  position: absolute;
  fill: green;
  font-size: 8px;
  font-family: 'Libre Franklin', sans-serif;
`;
const PopCircle = styled.circle`
  position: absolute;
  fill: black;
`;
const InfoText = styled.text`
  z-index: 99;
  position: absolute;
  font-size: 20px;
  font-family: 'Libre Franklin', sans-serif;
  font-weight: 300;
`;
const HeadText = styled.text`
  z-index: 99;
  position: absolute;
  font-size: ${props => props.fontsize || '13px'};
  font-family: 'Libre Franklin', sans-serif;
  font-weight: 300;
`;
const ClickLink = styled.a`
  fill: darkcyan;
`;
const Selection = styled.g`
  .year text{
    font-size: 9px;
    font-family: 'Libre Franklin', sans-serif;
    font-weight: 400;
  }
  .year a{
    fill: ${props => props.color || 'black'};
    text-decoration: ${props => props.decoration || 'none'};
  }
`;
const TrackButton = styled.g`
  .button rect {
    z-index: 5;
    stroke: gray;
    stroke-width: 0.5;
    stroke-opacity: 0.1:
    z-index: -1;
    x: 460;
    y: 35;
    rx: 1;
    ry: 1;
    width: 115;
    height: 23;
    fill: darkgray;
    fill-opacity: 0.2;
  }
  .button text{
    z-index: 10;
    fill: black;
    fill-opacity: 0.8;
    font-size: 10px;
    font-family: 'Libre Franklin', sans-serif;
    font-weight: 500;
  }
  .button rect:hover{
    fill: gray;
  }
`;
class Graph extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      prices: [],
      pop: 0,
      current: {price: 0},
      time: 5,
      five: 'black',
      one: 'gray',
      fivedec: 'underline',
      onedec: 'none',
    };
    this.showPrice = this.showPrice.bind(this);
    this.selectGraph = this.selectGraph.bind(this);
  }

  componentDidMount() {
    const api = function () {
      let result = '/api/estimates/pricing/1';
      if (window.location.pathname.length > 1) {
        result = `/api/estimates/pricing${window.location.pathname}`;
      }
      return result;
    };
    const api1 = function () {
      let result = '/api/estimates/houseinfo/1';
      if (window.location.pathname.length > 1) {
        result = `/api/estimates/houseinfo${window.location.pathname}`;
      }
      return result;
    };
    ajax({
      url: api(),
      method: 'GET',
      success: (data) => {
        data.sort((a, b) => {
          if (a.date_id < b.date_id) {
            return -1;
          } if (a.date_id > b.date_id) {
            return 1;
          }
          return 0;
        });
        this.setState({
          prices: data,
        });
      },
    });
    ajax({
      url: api1(),
      method: 'GET',
      success: (data) => {
        this.setState({
          current: data[0],
        });
      },
    });
  }

  showPrice(e) {
    const { id } = e.target;
    e.preventDefault();
    this.setState({
      pop: id,
    });
  };

  selectGraph(e){
    var result = Number(e.target.innerHTML[0])
    if(result === 5){
      this.setState({
        five: 'black',
        fivedec: 'underline',
        one: 'gray',
        onedec: 'none',
        time: 5
      })
    } else if(result === 1) {
      this.setState({
        one: 'black',
        onedec: 'underline',
        five: 'gray',
        fivedec: 'none',
        time: 1
      })
    }
    this.setState({
      time: result
    })
  };

  render() {
    let estimates;
    let xaxis;
    let popup;
    if (this.state.prices.length > 0) {
      if(this.state.time === 5){
        estimates = this.state.prices.map((price, key) => {
          if (price.date_id < 60) {
            const next = this.state.prices[key + 1];
            return(
              <g onMouseOver={this.showPrice}>
                <InvisLine x1={40 + (8 * price.date_id)} x2={48 + (8 * price.date_id)} y1="230" y2="110" id={price.date_id} stroke="white" strokeWidth="3" position="relative" />
                <GraphLine x1={40 + (8 * price.date_id)} x2={48 + (8 * price.date_id)} y1={250 - (price.price * 0.0001)} y2={250 - (next.price * 0.0001)} stroke="black" strokeWidth="1" fill="none" />
              </g>
            );
          }
          return (
              <g onMouseOver={this.showPrice}>
                <InvisLine x1={40 + (8 * price.date_id)} x2={40 + (8 * price.date_id)} y1="230" y2="110" id={price.date_id} stroke="white" stroke-width="3" />
              </g>
          );
        });
        xaxis = (
          <g>
            <Xaxis x="40" y="220">2015</Xaxis>
            <Xaxis x="136" y="220">2016</Xaxis>
            <Xaxis x="232" y="220">2017</Xaxis>
            <Xaxis x="328" y="220">2018</Xaxis>
            <Xaxis x="424" y="220">2019</Xaxis>
          </g>
        );
      }
      else if (this.state.time===1){
        let arr = this.state.prices.slice(48, 60)
        estimates = arr.map((price, key)=>{
          if(key < 11){
            const next = arr[key + 1];
            key += 1
            return(
              <g onMouseOver={this.showPrice}>
                <InvisLine x1={(45 * key)} x2={(45 * key)} y1="230" y2="110" id={price.date_id} stroke="white" strokeWidth="7" position="relative" />
                <GraphLine x1={(45 * key)} x2={45 + (45 * key)} y1={250 - (price.price * 0.0001)} y2={250 - (next.price * 0.0001)} stroke="black" strokeWidth="1" fill="none" />
              </g>
            )
          }
          else {
            return(
              <g onMouseOver={this.showPrice}>
                <InvisLine x1={(45 * key) + 45} x2={(45 * key) + 45} y1="230" y2="110" id={price.date_id} stroke="white" stroke-width="7" />
              </g>
            )
          }
        })
        xaxis = (
          <g>
            <Xaxis x="80" y="220">Feb</Xaxis>
            <Xaxis x="170" y="220">Apr</Xaxis>
            <Xaxis x="260" y="220">Jun</Xaxis>
            <Xaxis x="350" y="220">Aug</Xaxis>
            <Xaxis x="440" y="220">Oct</Xaxis>
            <Xaxis x="530" y="220">Dec</Xaxis>
          </g>
        );
      }
    }
    else { estimates = <h2>none</h2>; }

    if (this.state.pop > 0) {
      const temp = this.state.prices[this.state.pop - 1];
      const date = (num) => {
        const months = [
          'December', 'January', 'February', 'March', 'April', 'May',
          'June', 'July', 'August', 'September',
          'October', 'November',
        ];
        const obj = {
          year: Math.floor((num - 1) / 12),
          month: num % 12,
        };
        return `${months[obj.month]} 20${15 + obj.year}`;
      };
      if(this.state.time === 5) {
        popup = (
          <g>
            <PopText x={40 + (8 * temp.date_id)} y="110">
              {date(temp.date_id)}
            </PopText>
            <PopText x={40 + (8 * temp.date_id)} y="120">
              {temp.price}
            </PopText>
            <line x1={40 + (8 * temp.date_id)} x2={40 + (8 * temp.date_id)} y1="200" y2="110" id={temp.date_id} stroke="darkcyan" strokeWidth="1.25" />
            <PopCircle cx={40 + (8 * temp.date_id)} cy={250 - (temp.price * 0.0001)} r="3" />
          </g>
        );
      } else {
        popup = (
          <g>
            <PopText x={45 * (temp.date_id - 48)} y="110">
              {date(temp.date_id)}
            </PopText>
            <PopText x={45 * (temp.date_id - 48)} y="120">
              {temp.price}
            </PopText>
            <line x1={45 * (temp.date_id - 48)} x2={45 * (temp.date_id - 48)} y1="200" y2="110" id={temp.date_id} stroke="darkcyan" strokeWidth="1.25" />
            <PopCircle cx={45 * (temp.date_id - 48)} cy={250 - (temp.price * 0.0001)} r="3" />
          </g>
        );
      }
    } else {
      popup = null;
    }
    return (
      <div>
        <svg width="800" height="85%" viewBox="0 -90 750 350" preserveAspectRatio="xMinYMin meet">
          {estimates}
          <TrackButton>
            <g class="button">
              <rect tabindex='1'/>
              <text x="472" y="50">Track This Estimate</text>
            </g>
          </TrackButton>
          <Selection color={this.state.one} className="1" decoration={this.state.onedec} onClick={this.selectGraph}>
            <g class="year">
              <text x="500" y="75"><a href="#">1 year</a></text>
            </g>
          </Selection>
          <Selection color={this.state.five} className="5" decoration={this.state.fivedec} onClick={this.selectGraph}>
            <g class="year">
              <text x="535" y="75"><a href="#">5 years</a></text>
            </g>
          </Selection>
          <HeadText x="35" y="-50" fontsize="20px">Redfin Estimate for {this.state.current.address1}</HeadText>
          <HeadText x="35" y="-20"><ClickLink href="#">Edit Home Facts</ClickLink> to improve accuracy.</HeadText>
          <HeadText x="35" y="10" ><ClickLink href="#">Create an Owner Estimate</ClickLink></HeadText>
          <InfoText x="35" y="50">${formatNumber(this.state.current.price)}</InfoText>
          {xaxis}
          <Yaxis x="550" y="192">$600K</Yaxis>
          <Yaxis x="550" y="172">$800K</Yaxis>
          <Yaxis x="550" y="152">$1.0M</Yaxis>
          <Yaxis x="550" y="132">$1.2M</Yaxis>
          <Yaxis x="550" y="112">$1.4M</Yaxis>
          <Yline x1="40" x2="540" y1="190" y2="190" />
          <Yline x1="40" x2="540" y1="170" y2="170" />
          <Yline x1="40" x2="540" y1="150" y2="150" />
          <Yline x1="40" x2="540" y1="130" y2="130" />
          <Yline x1="40" x2="540" y1="110" y2="110" />
          {popup}
        </svg>
      </div>
    );
  }
}

export default Graph;
