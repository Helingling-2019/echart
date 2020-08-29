/*
* @Author: Marte
* @Date:   2017-10-16 11:53:22
* @Last Modified by:   Marte
* @Last Modified time: 2017-11-03 16:01:44
*/

'use strict';
$(function(){
    var $sumprice = $(".hous_sumprice"); //房款总额
    var $percentage = $(".bus_ipt_floor");//成数
    var $rate = $(".bus_ipt_rate");//货款利率
    var $Life = $(".Life_floor");//货款年限
    var $gdmoney = $(".gd_money");//公贷金额
    var $sdmoney = $(".sd_money");//商贷金额
    var $dkmoney = $(".dk_money");//贷款总额
    var $gdlilv = $(".gd_lilv");//公贷利率
    var $sdlilv = $(".sd-lilv");//商贷利率
    var reg = /^(?!0\d)\d{1,5}(\.\d{1,2})?$/;//正则
    // 图形
    var bxarr=[0,0,0];
    var bjarr=[0,0,0];
    echartMethod("de_echart",bxarr);
    echartMethod("dj_echart",bjarr);
    // 选择户型
    $(".house").on("click","li",function(){
        pullVal2($(this),".house_type");
        var datamoney = $(this).attr("data-money");
        var moneyz = Number(datamoney/10000);
        $sumprice.val((moneyz).toFixed(2));
        fxmoney();
    });
    // 选择首付成数
    $(".floor_pull").on("click","li",function(){
        pullVal2($(this),".bus_ipt_floor");
        fxmoney();
    });
    // 选择贷款年限
    $(".Life").on("click","li",function(){
        pullVal2($(this),".Life_floor");
    });
    // 组合贷款金额分析
    $(".hous_sumprice").bind('input propertychange', function() {
        $(".pit_txt").hide();
        $(".house_type").html("请选择户型")
        var _sumprice = Number($.trim($sumprice.val())); //房款总额
        if(!reg.test(_sumprice)){
            $(this).val(0);
            $(this).nextAll(".pit_txt").show();
            return false
        }
        fxmoney();
    });
    // 组合贷款金额分析公用方法
    function fxmoney(){
        var _sumprice = Number($.trim($sumprice.val())); //房款总额
        var _percentage = Number($.trim($percentage.attr("data-id")));//成数
        // 首期付款
        var _payment = (_sumprice * _percentage).toFixed(2);
         // 贷款总额
        var _loan = (_sumprice - _payment).toFixed(2);
        var gsloan = (_loan/2).toFixed(2);
        $dkmoney.val(_loan);
        $gdmoney.val(gsloan);
        $sdmoney.val(gsloan);
    }
    $(".gd_money").bind('input propertychange', function() {
        gsmoney($sdmoney,$(this));
    });
    $(".sd_money").bind('input propertychange', function() {
        gsmoney($gdmoney,$(this));
    });
    // 公，商金额公用方法
    function gsmoney(_cla,obj){
        var _sumprice = Number($.trim($sumprice.val())); //房款总额
        var _percentage = Number($.trim($percentage.attr("data-id")));//成数
        // 首期付款
        var _payment = (_sumprice * _percentage).toFixed(2);
         // 贷款总额
        var _loan = Number((_sumprice - _payment).toFixed(2));
        var money = Number(_loan - obj.val());
        if(_sumprice == ""){
            $sumprice.nextAll(".pit_txt").show();
            obj.val();
        }else {
            if(!reg.test(Number(obj.val()))){
                obj.val(0);
                _cla.val(_loan);
                return false
            }
        }
        if(obj.val() >= _loan){
            obj.val(_loan);
            _cla.val(0);
        }else{
            _cla.val((money).toFixed(2));
        }
    }
    // 选择贷款方式
    $(".loan").on("click","li",function(){
        pullVal2($(this),".loan_floor");
        if($(".loan_floor").text() == "公积金贷款"){
            $(".bus_ipt_rate").val("3.25");
            $(".group").hide();
            $(".goods").show();
            $(".countR_box").css('height', '460px');
            $(".p_tip").text("*公积金贷款基准利率3.25%");
        }else if($(".loan_floor").text() == "商业贷款"){
            $(".bus_ipt_rate").val("4.90");
            $(".group").hide();
            $(".goods").show();
            $(".countR_box").css('height', '460px');
            $(".p_tip").text("*商业贷款基准利率为4.90%");
        }else if($(".loan_floor").text() == "组合贷款"){
            $(".group").show();
            $(".goods").hide();
            var hgt = $(".countL").height();
            $(".countR_box").css('height', hgt - 80);
            $(".p_tip").text("*公积金贷款基准利率3.25%；商业贷款利率为4.90%");
        }
    });
    // 货款利率
    $(".bus_ipt_rate").bind('input propertychange', function() {
        lilv($(this));
    });
    // 公贷利率
    $(".gd_lilv").bind('input propertychange', function() {
        lilv($(this));
    });
    // 商贷利率
    $(".sd_lilv").bind('input propertychange', function() {
        lilv($(this));
    });
    //利率公共方法
    function lilv(_cla){
        $(".pit_txt").hide();
        var reg = /^(?!0\d)\d{1,3}(\.\d{1,5})?$/;
        var lv=Number(_cla.val());
        if(lv>100 || !reg.test(lv) || lv<0){
            _cla.nextAll(".pit_txt").show();
            _cla.val("");
            return false
        }
    }
    // 开始计算
    $(".reckon_but").click(function() {
        if($(".loan_floor").text() == "公积金贷款" || $(".loan_floor").text() == "商业贷款"){
                $(".pit_txt").hide();
                // 商业贷款
                var _sumprice = $.trim($sumprice.val()); //房款总额
                var _percentage = Number($.trim($percentage.attr("data-id")));//成数
                var _rate = $.trim($rate.val());//货款利率
                var _Life = Number($.trim($Life.attr("data-id")));//货款年限
                var yue = Number(_rate/12/100);
                // 判断是否输入
                if(_sumprice == ""){
                    $sumprice.nextAll(".pit_txt").show();
                    return false
                }else if(_rate == "" ||  _rate == 0){
                    $rate.val("")
                    $rate.nextAll(".pit_txt").show();
                    return false
                }
                // 首期付款
                var _payment = (_sumprice * _percentage).toFixed(2);
                // 贷款总额
                var _loan = (_sumprice - _payment).toFixed(2);
                // 商贷本息
                var Principal = fdrCalculater.businessBx(_loan,yue,_Life);
                $(".bus_fstprice").text(_payment);// 首期付款
                $(".bus_loansum").text(_loan);// 贷款总额
                $(".bus_tab_bx .bus_bx_interest").text(Principal.bxlx);//利息总额
                $(".bus_tab_bx .avg_sum").text(Principal.bxsy);//月均还款
                var bxarr = [_payment,_loan,Principal.bxlx];//饼图
                echartMethod("de_echart",bxarr);
                // 商贷本金
                var corpus = fdrCalculater.businessBj(_loan,yue,_Life);
                $(".bus_tab_bj .sf_sum").text(corpus.bjsy);//首月还款
                $(".bus_tab_bj .monthcut").text(corpus.monthcut);//每月递减
                $(".bus_tab_bj .bus_bj_interest").text(corpus.bjlx);//利息总额
                var bjarr = [_payment,_loan,corpus.bjlx];//饼图
                echartMethod("dj_echart",bjarr);
        }else{
            var _sumprice = Number($.trim($sumprice.val())); //房款总额
            var _percentage = Number($.trim($percentage.attr("data-id")));//成数
            var _gdje = Number($.trim($gdmoney.val()));//公贷金额
            var _sdje = Number($.trim($sdmoney.val()));//商贷金额
            var _gdlv = Number($.trim($gdlilv.val()));//公贷利率
            var _sdlv = Number($.trim($sdlilv.val()));//商贷利率
            var _dkze = Number($.trim($dkmoney.val()));//贷款总额
            var _Life = Number($.trim($Life.attr("data-id")));//货款年限
            var gdyue = Number(_gdlv/12/100);//公贷利率
            var sdyue = Number(_sdlv/12/100);//公贷利率

            // 判断是否输入
            if(_sumprice == ""){
                $sumprice.nextAll(".pit_txt").show();
                return false
            }else if(_gdlv == "" || _gdlv == 0){
                $gdlilv.val("");
                $gdlilv.nextAll(".pit_txt").show();
                return false
            }else if(_sdlv =="" || _sdlv == 0){
                $sdlilv.val("");
                $sdlilv.nextAll(".pit_txt").show();
                return false
            }else if(_gdje == ""){
                $gdmoney.val(0);
            }else if(_sdje == ""){
                $sdmoney.val(0);
            }
            // 首期付款
            var _payment = (_sumprice * _percentage).toFixed(2);
            $(".bus_fstprice").text(_payment);
            $(".bus_loansum").text(_dkze);
            // 本息
            var gdPrincipal = fdrCalculater.businessBx(_gdje,gdyue,_Life);
            var sdPrincipal = fdrCalculater.businessBx(_sdje,sdyue,_Life);
            var zulx = (Number(gdPrincipal.bxlx) + Number(sdPrincipal.bxlx)).toFixed(2);//利息总额
            var zusy = (Number(gdPrincipal.bxsy) + Number(sdPrincipal.bxsy)).toFixed(2);//每月还款
            $(".bus_tab_bx .bus_bx_interest").text(zulx);//利息总额
            $(".bus_tab_bx .avg_sum").text(zusy);//月均还款
            var bxarr = [_payment,_dkze,zulx];//饼图
                echartMethod("de_echart",bxarr);
            // 本金
            var JgdPrincipal = fdrCalculater.businessBj(_gdje,gdyue,_Life);
            var JsdPrincipal = fdrCalculater.businessBj(_sdje,sdyue,_Life);
            var zuJlx = (Number(JgdPrincipal.bjlx) + Number(JsdPrincipal.bjlx)).toFixed(2);//利息总额
            var zuJsy = (Number(JgdPrincipal.bjsy) + Number(JsdPrincipal.bjsy)).toFixed(2);//每月还款
            var zuJdj = (Number(JgdPrincipal.monthcut) + Number(JsdPrincipal.monthcut)).toFixed(2);//每月递减
            $(".bus_tab_bj .bus_bj_interest").text(zuJlx);//利息总额
            $(".bus_tab_bj .sf_sum").text(zuJsy);//月均还款
            $(".bus_tab_bj .monthcut").text(zuJdj);//每月递减
            var bjarr = [_payment,_dkze,zuJlx];//饼图
                echartMethod("dj_echart",bjarr);
        }
    });
});