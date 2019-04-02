export default class ChartOption {
  constructor (type) {
    switch (type) {
      case 'bar':
        return {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'line'
            }
          },
          legend: {
            data: []
          },
          grid: {
            left: '3%',
            right: '4%',
            top: 20,
            bottom: 5,
            containLabel: true
          },
          xAxis: {
            type: 'category',
            data: [],
            axisLabel: {
              interval: 0,
              fontSize: 12,
              verticalAlign: 'middle'
            },
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            }
          },
          yAxis: {
            type: 'value',
            minInterval: 1,
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            splitLine: {
              lineStyle: {
                type: 'dashed'
              }
            }
          },
          series: [{
            data: [],
            type: 'bar',
            barWidth: 16,
            itemStyle: {
              color: '#51A4E4'
            }
          }]
        }
      case 'pie':
        return {
          tooltip: {
            trigger: 'item'
          },
          legend: {
            orient: 'vertical',
            right: 10,
            top: 20,
            bottom: 20
          },
          series: [
            {
              type: 'pie',
              radius: '55%',
              center: ['40%', '50%']
            }
          ]
        }
    }
  }
}
