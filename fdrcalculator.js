/*
* @Author: Marte
* @Date:   2017-09-26 14:33:29
* @Last Modified by:   Marte
* @Last Modified time: 2017-10-12 11:40:26
*/

'use strict';
var fdrCalculater = {
    // 限小数点前5位后5位
    "testPrice": function(val) {
        var reg = /^(?!0\d)\d{1,5}(\.\d{1,5})?$/;
        return reg.test(val);
    },
    /**
     * [商贷/公贷（等额本息还款）]
     * @param  {[type]} _dksum   [贷款总额]
     * @param  {[type]} _dkrate  [贷款利率]
     * @param  {[type]} _dklimit [贷款期限]
     */
    "businessBx": function(_dksum, _dkrate, _dklimit) {
        var busmodelBx = new Object;
        // 等额本息还款：
        //贷款总额
        var _dedk = _dksum; //贷款总额
        // 每月还款：单位（元），精确到个位数；
        // 公式：每月还款额=贷款本金×[月利率×（1+月利率）^还款月数]÷[（1+月利率）^还款月数-1]
        var _bxsy = (_dedk * 10000) * (_dkrate * Math.pow((1 + _dkrate), _dklimit)) / (Math.pow((1 + _dkrate), _dklimit) - 1);

        busmodelBx.bxsy = _bxsy.toFixed(2);
        // 利息总额：单位（万元），精确到小数点后2位；
        // 公式：总利息=还款月数×每月月供额-贷款本金
        var _bxlx = (_dklimit * _bxsy) / 10000 - _dedk;
        busmodelBx.bxlx = _bxlx.toFixed(2);
        return busmodelBx;
    },
    /**
     * [商贷/公贷（等额本金还款）]
     * @param  {[type]} _dksum   [贷款总额]
     * @param  {[type]} _dkrate  [贷款利率]
     * @param  {[type]} _dklimit [贷款期限]
     */
    "businessBj": function(_dksum, _dkrate, _dklimit) {
        var busmodelBj = new Object;

        var _dedk = _dksum; //贷款总额
        // 等额本金还款:
        // 首月还款=(贷款本金÷还款月数)+(贷款本金-已归还本金累计额)×月利率
        busmodelBj.bjsy = (((_dedk / _dklimit) + (_dedk - 0) * _dkrate) * 10000).toFixed(2);
        // 每月递减=贷款本金÷还款月数×月利率
        busmodelBj.monthcut = ((_dedk / _dklimit * _dkrate) * 10000).toFixed(2);
        // 利息总额=总贷款数×月利率×（还款次数＋1）÷2
        busmodelBj.bjlx = (_dedk * _dkrate * (_dklimit + 1) / 2).toFixed(2);
        return busmodelBj;
    },
    /**
     * [税费计算]
     * @param  {[type]} _type     [购房性质类型 1首套房，2二套房]
     * @param  {[type]} _sigprice [房屋单价]
     * @param  {[type]} _sigarea  [房屋类型]
     */
    "sfCount": function(_type, _sigprice, _sigarea) {
        var sfmodel = new Object;
        var _rate = 0;
        if (_sigarea <= 90) {
            _rate = 0.01;
        } else {
            if (_type == 1) {
                _rate = 0.015;
            } else if (_type == 2) {
                _rate = 0.02;
            }
        }
        //房屋总价：房屋单价*房屋面积；
        //契税：房屋总价*税率；
        var _houseSum = (Number(_sigprice) * Number(_sigarea) / 10000).toFixed(2);
        sfmodel.sumprice = _houseSum; //房屋总价
        sfmodel.sumtax = (_houseSum * 10000 * _rate).toFixed(2); //契税
        return sfmodel;
    },
    /**
     * [购房能力评估]
     * @param  {[type]} _payment   [现有首付金额]
     * @param  {[type]} _pay       [每月购房支出]
     * @param  {[type]} _limittext [期望贷款年限文字]
     * @param  {[type]} _limitnum  [期望贷款年限数字]
     * @param  {[type]} _area      [期望购房面积]
     */
    "buyHouseAccess": function(_payment, _pay, _limittext, _limitnum, _area) {
        // 可贷款金额=月供*还款年限*商贷标准月利率
        var accessmodel = new Object;
        var _monthrate = 0.049 / 12; //月利率
        //可贷款金额
        // 每月还款额=贷款本金×[月利率×（1+月利率）^还款月数]÷[（1+月利率）^还款月数-1]
        var _mp = Math.pow((1 + _monthrate), _limitnum);
        var _dkprice = (((_mp - 1) * _pay) / (10000 * _monthrate * _mp)).toFixed(2);
        var _paysum = ((Number(_payment) + Number(_dkprice))).toFixed(2); //可购房总价（万元）
        var _sigprice = ((_paysum * 10000) / Number(_area)).toFixed(2); //(元)
        accessmodel.paysum = _paysum;
        accessmodel.housearea = _area;
        accessmodel.sigprice = _sigprice;
        accessmodel.limit = _limittext;
        return accessmodel;

    }

};