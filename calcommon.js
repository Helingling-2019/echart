/*
* @Author: Marte
* @Date:   2017-09-26 14:33:29
* @Last Modified by:   Marte
* @Last Modified time: 2018-03-26 16:37:34
*/

'use strict';
/**
 * [公共的饼图方法]
 * @param  {[type]} id  [图形存放位置]
 * @param  {[type]} arr [比例数组]
 */
function echartMethod(id, arr) {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById(id));
    // 指定图表的配置项和数据
    var option = {
        series: [{
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            color: ["#fbae35","#608cfb", "#ff794f"],
            labelLine: {
                normal: {
                    show: false
                }
            },
            data: arr
        }]
    };
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
}

/**
 * [公共的线形图方法]
 * @param  {[type]} id  [图形存放位置]
 * @param  {[type]} arr [比例数组]
 */
function echartlinear(id,tit,hour,dataTitle,dataColor,obj) {

    var myChart = echarts.init(document.getElementById(id));
    var option = {
            title: {
                text: dataTitle,
                left: 'center',
                top: '50',
                textStyle: {
                    color: '#888',
                    fontSize:'12',
                    fontWeight:'normal'
                }
            },
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b} : {c}'
            },
            color:dataColor,
            legend: {
                bottom: 'bottom',
                data: tit
            },
            xAxis: {
                type: 'category',
                splitLine: {show: false},
                data: hour
            },
            grid: {
				top: '30%',
                left: '6%',
                right: '6%',
                bottom: '15%',
                containLabel: true
            },
            yAxis: {
                type: 'log'
            },
            series: obj
        };
    myChart.setOption(option);
}

var dataTitle = lineData.dataTitle;
var dataTit = lineData.nameList;
var dataList = lineData.timeList;
var dataArr = lineData.dataList;
var dataColor = lineData.dataColor;
var titleList = lineData.dataTitleList;
var array = [];
for (var i = 0; i < dataTit.length; i++) {
    array.push(
        {
            name: dataTit[i],
            type: 'line',
            data:dataArr[i]
        }
    );
	if(titleList[i] != ""){
        $(".trends_Box").append('<li style="border: 1px solid '+dataColor[i]+'">'+titleList[i]+'</li>');
    }
};
echartlinear("x_echart",dataTit,dataList,dataTitle,dataColor,array);

//贷款-计算结果切换
$(".tabs-hd").on("click","li",function(){

    var _idx=$(this).index();
    $(this).addClass('active').siblings().removeClass("active");
    $(".bus_tab_box").eq(_idx).show().siblings(".bus_tab_box").hide();

});
/**
 * [下拉框赋值]
 * @param  {[type]} ele [下拉框赋值]
 * @param  {[type]} $this [下拉框]
 */
function pullVal2($this,ele){
    var _txt=$.trim($this.text());
    var _id=$.trim($this.data("val"));
    $(ele).text(_txt);
    $(ele).attr("data-id",_id);
    $this.parent().hide();
}

