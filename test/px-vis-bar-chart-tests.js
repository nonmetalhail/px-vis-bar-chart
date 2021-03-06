/**
 * @license
 * Copyright (c) 2018, General Electric
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

suite('Basic Column with include all series', () => {
  let barChart;
  suiteSetup( done => {
    barChart = fixture('px-vis-bar-chart-fixture');
    const width = 800;
    const height = 500;
    const margin = {
      "left": 50,
      "top": 10,
      "bottom": 50,
      "right": 0
    };
    const chartData = [{
      "x": "A",
      "y": 0.56
    },{
      "x": "B",
      "y": 0.4
    },{
      "x": "C",
      "y": 0.43
    },{
      "x": "D",
      "y": 0.33
    },{
      "x": "E",
      "y": 0.47
    },{
      "x": "F",
      "y": 0.41
    }];
    const includeAllSeries = true;

    let renderingCB = function() {
      barChart.removeEventListener('px-data-vis-colors-applied', colorAppliedCB);
      barChart.removeEventListener('px-vis-bar-svg-rendering-ended', renderingCB);
      done();
    };

    let colorAppliedCB = function() {
      barChart.addEventListener('px-vis-bar-svg-rendering-ended', renderingCB);
    };

    barChart.addEventListener('px-data-vis-colors-applied', colorAppliedCB);

    barChart.setProperties({
      width: width,
      height: height,
      margin: margin,
      chartData: chartData,
      includeAllSeries: includeAllSeries
    });
  });

  test('axis types', () => {
    assert.equal(barChart.xAxisType, 'scaleBand');
    assert.equal(barChart.yAxisType, 'linear');
  });

  test('completeSeriesConfig', () => {
    assert.equal(barChart.completeSeriesConfig.y.color.replace(/ /g,''), "rgb(90,191,248)");
    assert.equal(barChart.completeSeriesConfig.y.name, "y");
    assert.equal(barChart.completeSeriesConfig.y.type, "bar");
    assert.equal(barChart.completeSeriesConfig.y.x, "x");
    assert.equal(barChart.completeSeriesConfig.y.y, "y");
  });

  test('_stackedChartData', () => {
    const scd = [
      [
        [0,0.56],
        [0,0.4],
        [0,0.43],
        [0,0.33],
        [0,0.47],
        [0,0.41]
      ]
    ];

    assert.deepEqual(JSON.parse(JSON.stringify(barChart._stackedChartData)), scd);
    assert.equal(barChart._stackedChartData[0].key, "y");
    assert.equal(barChart._stackedChartData[0].index, 0);
    assert.deepEqual(barChart._stackedChartData[0][0]['data'], {x:"A",y:0.56});
    assert.deepEqual(barChart._stackedChartData[0][5]['data'], {x:"F",y:0.41});
  });

  test('_ordinalKey', () => {
    assert.equal(barChart._ordinalKey, 'x');
  });

  test('dataExtents', () => {
    const de = {
      x: [],
      y: [0,0.56]
    };

    assert.deepEqual(barChart.dataExtents, de);
  });

  test('scales', () => {
    const x = ["A","B","C","D","E","F"];
    const y = [0,0.56]

    assert.deepEqual(barChart.x.domain(), x);
    assert.deepEqual(barChart.y.domain(), y);
  });

  test('baseline', () => {
    assert.isUndefined(barChart._baseline);
  });

  test('_groupScale', () => {
    assert.isUndefined(barChart._groupScale);
  });
});

suite('Basic bar chart', () => {
  let barChart;
  suiteSetup( done => {
    barChart = fixture('px-vis-bar-chart-fixture');
    const chartType = "bar";
    const width = 800;
    const height = 500;
    const margin = {
      "left": 50,
      "top": 10,
      "bottom": 50,
      "right": 0
    };
    const chartData = [{
      "ord": "A",
      "val": 0.56
    },{
      "ord": "B",
      "val": -0.4
    },{
      "ord": "C",
      "val": 0.43
    },{
      "ord": "D",
      "val": 0.33
    },{
      "ord": "E",
      "val": 0.47
    },{
      "ord": "F",
      "val": 0.41
    }];
    const seriesConfig = {
      bars: {
        x: "val",
        y: "ord",
        color: "rgb(147,205,74)",
        negativeColor: "rgb(227,129,138)"
      }
    };

    let renderingCB = function() {
      barChart.removeEventListener('px-data-vis-colors-applied', colorAppliedCB);
      barChart.removeEventListener('px-vis-bar-svg-rendering-ended', renderingCB);
      done();
    };

    let colorAppliedCB = function() {
      barChart.addEventListener('px-vis-bar-svg-rendering-ended', renderingCB);
    };

    barChart.addEventListener('px-data-vis-colors-applied', colorAppliedCB);

    barChart.setProperties({
      chartType: chartType,
      width: width,
      height: height,
      margin: margin,
      chartData: chartData,
      seriesConfig: seriesConfig
    });
  });

  test('axis types', () => {
    assert.equal(barChart.xAxisType, 'linear');
    assert.equal(barChart.yAxisType, 'scaleBand');
  });

  test('completeSeriesConfig', () => {
    assert.equal(barChart.completeSeriesConfig.bars.color.replace(/ /g,''), "rgb(147,205,74)");
    assert.equal(barChart.completeSeriesConfig.bars.negativeColor.replace(/ /g,''), "rgb(227,129,138)");
    assert.equal(barChart.completeSeriesConfig.bars.name, "bars");
    assert.equal(barChart.completeSeriesConfig.bars.type, "bar");
    assert.equal(barChart.completeSeriesConfig.bars.x, "val");
    assert.equal(barChart.completeSeriesConfig.bars.y, "ord");
  });

  test('_stackedChartData', () => {
    const scd = [
      [
        [0,0.56],
        [0,-0.4],
        [0,0.43],
        [0,0.33],
        [0,0.47],
        [0,0.41]
      ]
    ];

    assert.deepEqual(JSON.parse(JSON.stringify(barChart._stackedChartData)), scd);
    assert.equal(barChart._stackedChartData[0].key, "val");
    assert.equal(barChart._stackedChartData[0].index, 0);
    assert.deepEqual(barChart._stackedChartData[0][0]['data'], {ord:"A",val:0.56});
    assert.deepEqual(barChart._stackedChartData[0][5]['data'], {ord:"F",val:0.41});
  });

  test('_ordinalKey', () => {
    assert.equal(barChart._ordinalKey, 'ord');
  });

  test('dataExtents', () => {
    const de = {
      x: [-0.4,0.56],
      y: []
    };

    assert.deepEqual(barChart.dataExtents, de);
  });

  test('scales', () => {
    const x = [-0.4,0.56];
    const y = ["A","B","C","D","E","F"]

    assert.deepEqual(barChart.x.domain(), x);
    assert.deepEqual(barChart.y.domain(), y);
  });

  test('baseline', () => {
    assert.isDefined(barChart._baseline);
  });

  test('_groupScale', () => {
    assert.isUndefined(barChart._groupScale);
  });
});

suite('Stacked Column', () => {
  let barChart;
  suiteSetup( done => {
    barChart = fixture('px-vis-bar-chart-fixture');
    const width = 800;
    const height = 500;
    const margin = {
      "left": 50,
      "top": 10,
      "bottom": 50,
      "right": 0
    };
    const chartData = [{
      "x": "A",
      "y": 0.56,
      "y1": 0.3,
      "y2": 0.1
    },{
      "x": "B",
      "y": 0.4,
      "y1": 0.4,
      "y2": 0.2
    },{
      "x": "C",
      "y": -0.43,
      "y1": 0.3,
      "y2": 0.3
    },{
      "x": "D",
      "y": -0.33,
      "y1": -0.4,
      "y2": -0.5
    },{
      "x": "E",
      "y": 0.47,
      "y1": 0.4,
      "y2": -0.6
    },{
      "x": "F",
      "y": 0.41,
      "y1": 0.2,
      "y2": 0.5
    }];
    const seriesConfig = {
      "bar1": {
        "x":"x",
        "y":"y"
      },
      "bar2": {
        "x":"x",
        "y":"y1"
      },
      "bar3": {
        "x":"x",
        "y":"y2"
      }
    };

    let renderingCB = function() {
      barChart.removeEventListener('px-data-vis-colors-applied', colorAppliedCB);
      barChart.removeEventListener('px-vis-bar-svg-rendering-ended', renderingCB);
      done();
    };

    let colorAppliedCB = function() {
      barChart.addEventListener('px-vis-bar-svg-rendering-ended', renderingCB);
    };

    barChart.addEventListener('px-data-vis-colors-applied', colorAppliedCB);

    barChart.setProperties({
      width: width,
      height: height,
      margin: margin,
      chartData: chartData,
      seriesConfig: seriesConfig
    });
  });

  test('axis types', () => {
    assert.equal(barChart.xAxisType, 'scaleBand');
    assert.equal(barChart.yAxisType, 'linear');
  });

  test('completeSeriesConfig', () => {

    assert.equal(barChart.completeSeriesConfig.bar1.color.replace(/ /g,''), "rgb(90,191,248)");
    assert.equal(barChart.completeSeriesConfig.bar1.name, "bar1");
    assert.equal(barChart.completeSeriesConfig.bar1.type, "bar");
    assert.equal(barChart.completeSeriesConfig.bar1.x, "x");
    assert.equal(barChart.completeSeriesConfig.bar1.y, "y");

    assert.equal(barChart.completeSeriesConfig.bar2.color.replace(/ /g,''), "rgb(226,141,23)");
    assert.equal(barChart.completeSeriesConfig.bar2.name, "bar2");
    assert.equal(barChart.completeSeriesConfig.bar2.type, "bar");
    assert.equal(barChart.completeSeriesConfig.bar2.x, "x");
    assert.equal(barChart.completeSeriesConfig.bar2.y, "y1");

    assert.equal(barChart.completeSeriesConfig.bar3.color.replace(/ /g,''), "rgb(123,188,0)");
    assert.equal(barChart.completeSeriesConfig.bar3.name, "bar3");
    assert.equal(barChart.completeSeriesConfig.bar3.type, "bar");
    assert.equal(barChart.completeSeriesConfig.bar3.x, "x");
    assert.equal(barChart.completeSeriesConfig.bar3.y, "y2");

  });

  test('_stackedChartData', () => {
    const scd = [
      [
        [0,0.56],
        [0,0.4],
        [-0.43,0],
        [-0.33,0],
        [0,0.47],
        [0,0.41]
      ],[
        [0.56,0.8600000000000001],
        [0.4,0.8],
        [0,0.3],
        [-0.73,-0.33],
        [0.47,0.87],
        [0.41,0.61]
      ],[
        [0.8600000000000001,0.9600000000000001],
        [0.8,1],
        [0.3,0.6],
        [-1.23,-0.73],
        [-0.6,0],
        [0.61,1.1099999999999999]
      ]
    ];

    assert.deepEqual(JSON.parse(JSON.stringify(barChart._stackedChartData)), scd);
    assert.equal(barChart._stackedChartData[0].key, "y");
    assert.equal(barChart._stackedChartData[0].index, 0);
    assert.deepEqual(barChart._stackedChartData[0][0]['data'], {x:"A",y:0.56,y1:0.3,y2:0.1});
    assert.deepEqual(barChart._stackedChartData[0][5]['data'], {x: "F",y: 0.41,y1: 0.2,y2: 0.5});
    assert.equal(barChart._stackedChartData[1].key, "y1");
    assert.equal(barChart._stackedChartData[1].index, 1);
    assert.equal(barChart._stackedChartData[2].key, "y2");
    assert.equal(barChart._stackedChartData[2].index, 2);
  });

  test('_ordinalKey', () => {
    assert.equal(barChart._ordinalKey, 'x');
  });

  test('dataExtents', () => {
    const de = {
      "x":[],
      "y":[-1.23,1.1099999999999999]
    };

    assert.deepEqual(barChart.dataExtents, de);
  });

  test('scales', () => {
    const x = ["A","B","C","D","E","F"];
    const y = [-1.23,1.1099999999999999]

    assert.deepEqual(barChart.x.domain(), x);
    assert.deepEqual(barChart.y.domain(), y);
  });

  test('baseline', () => {
    assert.isDefined(barChart._baseline);
    assert.equal(barChart._baseline.node().tagName, 'line');
  });

  test('_groupScale', () => {
    assert.isUndefined(barChart._groupScale);
  });
});


suite('Stacked Bar', () => {
  let barChart;
  suiteSetup( done => {
    barChart = fixture('px-vis-bar-chart-fixture');
    const chartType = "bar";
    const width = 800;
    const height = 500;
    const margin = {
      "left": 50,
      "top": 10,
      "bottom": 50,
      "right": 0
    };
    const chartData = [{
      "x": "A",
      "y": 0.56,
      "y1": 0.3,
      "y2": 0.1
    },{
      "x": "B",
      "y": 0.4,
      "y1": 0.4,
      "y2": 0.2
    },{
      "x": "C",
      "y": -0.43,
      "y1": 0.3,
      "y2": 0.3
    },{
      "x": "D",
      "y": -0.33,
      "y1": -0.4,
      "y2": -0.5
    },{
      "x": "E",
      "y": 0.47,
      "y1": 0.4,
      "y2": -0.6
    },{
      "x": "F",
      "y": 0.41,
      "y1": 0.2,
      "y2": 0.5
    }];
    const seriesConfig = {
      "bar1": {
        "x":"y",
        "y":"x"
      },
      "bar2": {
        "x":"y1",
        "y":"x"
      },
      "bar3": {
        "x":"y2",
        "y":"x"
      }
    };

    let renderingCB = function() {
      barChart.removeEventListener('px-data-vis-colors-applied', colorAppliedCB);
      barChart.removeEventListener('px-vis-bar-svg-rendering-ended', renderingCB);
      done();
    };

    let colorAppliedCB = function() {
      barChart.addEventListener('px-vis-bar-svg-rendering-ended', renderingCB);
    };

    barChart.addEventListener('px-data-vis-colors-applied', colorAppliedCB);

    barChart.setProperties({
      chartType: chartType,
      width: width,
      height: height,
      margin: margin,
      chartData: chartData,
      seriesConfig: seriesConfig
    });
  });

  test('axis types', () => {
    assert.equal(barChart.xAxisType, 'linear');
    assert.equal(barChart.yAxisType, 'scaleBand');
  });

  test('completeSeriesConfig', () => {

    assert.equal(barChart.completeSeriesConfig.bar1.color.replace(/ /g,''), "rgb(90,191,248)");
    assert.equal(barChart.completeSeriesConfig.bar1.name, "bar1");
    assert.equal(barChart.completeSeriesConfig.bar1.type, "bar");
    assert.equal(barChart.completeSeriesConfig.bar1.y, "x");
    assert.equal(barChart.completeSeriesConfig.bar1.x, "y");

    assert.equal(barChart.completeSeriesConfig.bar2.color.replace(/ /g,''), "rgb(226,141,23)");
    assert.equal(barChart.completeSeriesConfig.bar2.name, "bar2");
    assert.equal(barChart.completeSeriesConfig.bar2.type, "bar");
    assert.equal(barChart.completeSeriesConfig.bar2.y, "x");
    assert.equal(barChart.completeSeriesConfig.bar2.x, "y1");

    assert.equal(barChart.completeSeriesConfig.bar3.color.replace(/ /g,''), "rgb(123,188,0)");
    assert.equal(barChart.completeSeriesConfig.bar3.name, "bar3");
    assert.equal(barChart.completeSeriesConfig.bar3.type, "bar");
    assert.equal(barChart.completeSeriesConfig.bar3.y, "x");
    assert.equal(barChart.completeSeriesConfig.bar3.x, "y2");
  });

  test('_stackedChartData', () => {
    const scd = [
      [
        [0,0.56],
        [0,0.4],
        [-0.43,0],
        [-0.33,0],
        [0,0.47],
        [0,0.41]
      ],[
        [0.56,0.8600000000000001],
        [0.4,0.8],
        [0,0.3],
        [-0.73,-0.33],
        [0.47,0.87],
        [0.41,0.61]
      ],[
        [0.8600000000000001,0.9600000000000001],
        [0.8,1],
        [0.3,0.6],
        [-1.23,-0.73],
        [-0.6,0],
        [0.61,1.1099999999999999]
      ]
    ];

    assert.deepEqual(JSON.parse(JSON.stringify(barChart._stackedChartData)), scd);
    assert.equal(barChart._stackedChartData[0].key, "y");
    assert.equal(barChart._stackedChartData[0].index, 0);
    assert.deepEqual(barChart._stackedChartData[0][0]['data'], {x:"A",y:0.56,y1:0.3,y2:0.1});
    assert.deepEqual(barChart._stackedChartData[0][5]['data'], {x: "F",y: 0.41,y1: 0.2,y2: 0.5});
    assert.equal(barChart._stackedChartData[1].key, "y1");
    assert.equal(barChart._stackedChartData[1].index, 1);
    assert.equal(barChart._stackedChartData[2].key, "y2");
    assert.equal(barChart._stackedChartData[2].index, 2);
  });

  test('_ordinalKey', () => {
    assert.equal(barChart._ordinalKey, 'x');
  });

  test('dataExtents', () => {
    const de = {
      "y":[],
      "x":[-1.23,1.1099999999999999]
    };

    assert.deepEqual(barChart.dataExtents, de);
  });

  test('scales', () => {
    const y = ["A","B","C","D","E","F"];
    const x = [-1.23,1.1099999999999999]

    assert.deepEqual(barChart.x.domain(), x);
    assert.deepEqual(barChart.y.domain(), y);
  });

  test('baseline', () => {
    assert.isDefined(barChart._baseline);
    assert.equal(barChart._baseline.node().tagName, 'line');
  });

  test('_groupScale', () => {
    assert.isUndefined(barChart._groupScale);
  });
});

suite('Stacked Column', () => {
  let barChart;
  suiteSetup( done => {
    barChart = fixture('px-vis-bar-chart-fixture');
    const grouped = true;
    const width = 800;
    const height = 500;
    const margin = {
      "left": 50,
      "top": 10,
      "bottom": 50,
      "right": 0
    };
    const chartData = [{
      "x": "A",
      "y": 0.56,
      "y1": 0.3,
      "y2": 0.1
    },{
      "x": "B",
      "y": 0.4,
      "y1": 0.4,
      "y2": 0.2
    },{
      "x": "C",
      "y": -0.43,
      "y1": 0.3,
      "y2": 0.3
    },{
      "x": "D",
      "y": -0.33,
      "y1": -0.4,
      "y2": -0.5
    },{
      "x": "E",
      "y": 0.47,
      "y1": 0.4,
      "y2": -0.6
    },{
      "x": "F",
      "y": 0.41,
      "y1": 0.2,
      "y2": 0.5
    }];
    const seriesConfig = {
      "bar1": {
        "x":"x",
        "y":"y"
      },
      "bar2": {
        "x":"x",
        "y":"y1"
      },
      "bar3": {
        "x":"x",
        "y":"y2"
      }
    };

    let renderingCB = function() {
      barChart.removeEventListener('px-data-vis-colors-applied', colorAppliedCB);
      barChart.removeEventListener('px-vis-bar-grouped-svg-rendering-ended', renderingCB);
      done();
    };

    let colorAppliedCB = function() {
      barChart.addEventListener('px-vis-bar-grouped-svg-rendering-ended', renderingCB);
    };

    barChart.addEventListener('px-data-vis-colors-applied', colorAppliedCB);

    barChart.setProperties({
      grouped: grouped,
      width: width,
      height: height,
      margin: margin,
      chartData: chartData,
      seriesConfig: seriesConfig
    });
  });

  test('axis types', () => {
    assert.equal(barChart.xAxisType, 'scaleBand');
    assert.equal(barChart.yAxisType, 'linear');
  });

  test('completeSeriesConfig', () => {

    assert.equal(barChart.completeSeriesConfig.bar1.color.replace(/ /g,''), "rgb(90,191,248)");
    assert.equal(barChart.completeSeriesConfig.bar1.name, "bar1");
    assert.equal(barChart.completeSeriesConfig.bar1.type, "bar");
    assert.equal(barChart.completeSeriesConfig.bar1.x, "x");
    assert.equal(barChart.completeSeriesConfig.bar1.y, "y");

    assert.equal(barChart.completeSeriesConfig.bar2.color.replace(/ /g,''), "rgb(226,141,23)");
    assert.equal(barChart.completeSeriesConfig.bar2.name, "bar2");
    assert.equal(barChart.completeSeriesConfig.bar2.type, "bar");
    assert.equal(barChart.completeSeriesConfig.bar2.x, "x");
    assert.equal(barChart.completeSeriesConfig.bar2.y, "y1");

    assert.equal(barChart.completeSeriesConfig.bar3.color.replace(/ /g,''), "rgb(123,188,0)");
    assert.equal(barChart.completeSeriesConfig.bar3.name, "bar3");
    assert.equal(barChart.completeSeriesConfig.bar3.type, "bar");
    assert.equal(barChart.completeSeriesConfig.bar3.x, "x");
    assert.equal(barChart.completeSeriesConfig.bar3.y, "y2");
  });

  test('_stackedChartData', () => {
    assert.deepEqual(barChart._stackedChartData, []);
  });

  test('_ordinalKey', () => {
    assert.equal(barChart._ordinalKey, 'x');
  });

  test('dataExtents', () => {
    const de = {
      "x":[],
      "y":[Infinity,-Infinity]
    };

    assert.deepEqual(barChart.dataExtents, de);
  });

  test('scales', () => {
    const x = ["A","B","C","D","E","F"];
    const y = [-0.6,0.56]

    assert.deepEqual(barChart.x.domain(), x);
    assert.deepEqual(barChart.y.domain(), y);
  });

  test('baseline', () => {
    assert.isDefined(barChart._baseline);
    assert.equal(barChart._baseline.node().tagName, 'line');
  });

  test('_groupScale', () => {
    assert.isDefined(barChart._groupScale);
    assert.deepEqual(barChart._groupScale.range(), [0, barChart.x.bandwidth()]);
    assert.deepEqual(barChart._groupScale.domain(), ['y','y1','y2']);
  });
});

suite('Stacked Bar', () => {
  let barChart;
  suiteSetup( done => {
    barChart = fixture('px-vis-bar-chart-fixture');
    const chartType = "bar";
    const grouped = true;
    const width = 800;
    const height = 500;
    const margin = {
      "left": 50,
      "top": 10,
      "bottom": 50,
      "right": 0
    };
    const chartData = [{
      "x": "A",
      "y": 0.56,
      "y1": 0.3,
      "y2": 0.1
    },{
      "x": "B",
      "y": 0.4,
      "y1": 0.4,
      "y2": 0.2
    },{
      "x": "C",
      "y": -0.43,
      "y1": 0.3,
      "y2": 0.3
    },{
      "x": "D",
      "y": -0.33,
      "y1": -0.4,
      "y2": -0.5
    },{
      "x": "E",
      "y": 0.47,
      "y1": 0.4,
      "y2": -0.6
    },{
      "x": "F",
      "y": 0.41,
      "y1": 0.2,
      "y2": 0.5
    }];
    const seriesConfig = {
      "bar1": {
        "y":"x",
        "x":"y"
      },
      "bar2": {
        "y":"x",
        "x":"y1"
      },
      "bar3": {
        "y":"x",
        "x":"y2"
      }
    };

    let renderingCB = function() {
      barChart.removeEventListener('px-data-vis-colors-applied', colorAppliedCB);
      barChart.removeEventListener('px-vis-bar-grouped-svg-rendering-ended', renderingCB);
      done();
    };

    let colorAppliedCB = function() {
      barChart.addEventListener('px-vis-bar-grouped-svg-rendering-ended', renderingCB);
    };

    barChart.addEventListener('px-data-vis-colors-applied', colorAppliedCB);

    barChart.setProperties({
      chartType: chartType,
      grouped: grouped,
      width: width,
      height: height,
      margin: margin,
      chartData: chartData,
      seriesConfig: seriesConfig
    });
  });

  test('axis types', () => {
    assert.equal(barChart.xAxisType, 'linear');
    assert.equal(barChart.yAxisType, 'scaleBand');
  });

  test('completeSeriesConfig', () => {

    assert.equal(barChart.completeSeriesConfig.bar1.color.replace(/ /g,''), "rgb(90,191,248)");
    assert.equal(barChart.completeSeriesConfig.bar1.name, "bar1");
    assert.equal(barChart.completeSeriesConfig.bar1.type, "bar");
    assert.equal(barChart.completeSeriesConfig.bar1.y, "x");
    assert.equal(barChart.completeSeriesConfig.bar1.x, "y");

    assert.equal(barChart.completeSeriesConfig.bar2.color.replace(/ /g,''), "rgb(226,141,23)");
    assert.equal(barChart.completeSeriesConfig.bar2.name, "bar2");
    assert.equal(barChart.completeSeriesConfig.bar2.type, "bar");
    assert.equal(barChart.completeSeriesConfig.bar2.y, "x");
    assert.equal(barChart.completeSeriesConfig.bar2.x, "y1");

    assert.equal(barChart.completeSeriesConfig.bar3.color.replace(/ /g,''), "rgb(123,188,0)");
    assert.equal(barChart.completeSeriesConfig.bar3.name, "bar3");
    assert.equal(barChart.completeSeriesConfig.bar3.type, "bar");
    assert.equal(barChart.completeSeriesConfig.bar3.y, "x");
    assert.equal(barChart.completeSeriesConfig.bar3.x, "y2");
  });

  test('_stackedChartData', () => {
    assert.deepEqual(barChart._stackedChartData, []);
  });

  test('_ordinalKey', () => {
    assert.equal(barChart._ordinalKey, 'x');
  });

  test('dataExtents', () => {
    const de = {
      "y":[],
      "x":[Infinity,-Infinity]
    };

    assert.deepEqual(barChart.dataExtents, de);
  });

  test('scales', () => {
    const y = ["A","B","C","D","E","F"];
    const x = [-0.6,0.56]

    assert.deepEqual(barChart.x.domain(), x);
    assert.deepEqual(barChart.y.domain(), y);
  });

  test('baseline', () => {
    assert.isDefined(barChart._baseline);
    assert.equal(barChart._baseline.node().tagName, 'line');
  });

  test('_groupScale', () => {
    assert.isDefined(barChart._groupScale);
    assert.deepEqual(barChart._groupScale.range(), [0, barChart.y.bandwidth()]);
    assert.deepEqual(barChart._groupScale.domain(), ['y','y1','y2']);
  });
});
