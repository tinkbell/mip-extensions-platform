/**
 * @file mip-linktion-try 组件
 * @author
 */

define(function (require) {
    'use strict';
    var $ = require('jquery');

    var customElement = require('customElement').create();

    /**
     * 第一次进入可视区回调，只会执行一次
     */
    customElement.prototype.firstInviewCallback = function () {
        var $el = $(this.element);
        var that = this;
        var tryBtn = $el.find('#try-btn');
        var inputWrap = tryBtn.parents().siblings('.modal-input-info').children('.form-group');
        var inputs = inputWrap.children('input');
        var formItem = tryBtn.parents('.modal-body').children('form')[0];
        function hideTry(that) {
            that.addEventAction('close', function (event) {
                $el.css('display', 'none');
            });
        }
        function hideHints() {
            setTimeout(function () {
                $el.find('.web-hint').fadeOut();
            }, 6000);
        }
        function showTips(text, status) {
            var hintsHtml = '';
            if (status === 'err') {
                hintsHtml = '<div class="web-error web-hint">'
                            + '<p>' + text + '</p>'
                            + '</div>';
            }
            else if (status === 'success') {
                hintsHtml = '<div class="web-hint web-succeed">'
                            + ' <p>' + text + '</p>'
                            + ' </div>';
            }
            $el.find('.hints').html(hintsHtml);
            hideHints();
        }
        function sendData(body) {
            var aipUrl = tryBtn.data('url');
            if (aipUrl.length !== 0) {
                $.ajax({
                    url: aipUrl,
                    type: 'post',
                    data: body
                }).done(function (data) {
                    if (data.code === 1009) {
                        showTips('请登录', 'err');
                    }
                    else if (data.code === 0) {
                        if ($(window).width() < 769) {
                            showTips('提交成功', 'success');
                            $el.find('#insurance-modal').hide();
                            $el.find('#MIP-LLIGTBOX-MASK').hide();
                            setTimeout(function () {
                                $el.css('display', 'none');
                            }, 3000);
                        } else {
                            $el.find('.form-close').trigger('click');
                            $el.find('.try-btn-end').trigger('click');
                            hideTry(that);
                        }

                    }
                });
            }
        }
        function eachCheckBox(checkedbox, checkedboxArry) {
            checkedbox.each(function (index, item) {
                checkedboxArry.push(item.getAttribute('value'));
            });
            return checkedboxArry;
        }
        that.addEventAction('open', function (event) {
            var body = {};
            body.type = tryBtn.data('type');
            inputs.each(function (i, item) {
                var inputKey = item.getAttribute('id');
                var inputVal = item.value;
                if (inputVal === '') {
                    showTips('请完整填写表单', 'err');
                    return false;
                } else {
                    body[inputKey] = inputVal;
                    if (i === inputs.length - 1) {
                        if ($el.find('.select-checkbox').length !== 0) {
                            var choiceKey = $('.select-checkbox').attr('id');
                            var choiceType = $('.select-checkbox').data('choicetype');
                            var checkboxWrap = tryBtn.parents().siblings('.select-checkbox').children('.form-group');
                            if (choiceType === 'radio') {
                                var checked = checkboxWrap.children('input[type=radio]:checked').val();
                                if (checked === '') {
                                    showTips('请完至少勾选一个选项', 'err');
                                } else {
                                    body[choiceKey] = checked;
                                    sendData(body);
                                }
                            }
                            else if (choiceType === 'checkbox') {
                                var checkedbox = checkboxWrap.children('input[type=checkbox]:checked');
                                var checkedboxArry = [];
                                checkedboxArry = eachCheckBox(checkedbox, checkedboxArry);
                                if (checkedboxArry.length === '') {
                                    showTips('请完至少勾选一个选项', 'err');
                                } else {
                                    body[choiceKey] = checkedboxArry;
                                    sendData(body);
                                }
                            }
                        }
                        else {
                            sendData(body);
                        }
                    }
                }
            });
        });
    };
    return customElement;
});
