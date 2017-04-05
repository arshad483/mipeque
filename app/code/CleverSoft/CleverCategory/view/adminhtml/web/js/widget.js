/**
 * @category    CleverSoft
 * @package     CleverProduct
 * @copyright   Copyright © 2017 CleverSoft., JSC. All Rights Reserved.
 * @author 		ZooExtension.com
 * @email       magento.cleversoft@gmail.com
 */

define([
    "jquery"
],function($) {
    'use strict';
    var CleverWidgetChooser = new function(){
        var t = this;
        t._init = function (url) {
            t.url = url;
            return t;
        },
            t.hideEntityChooser = function (container) {
                if ($(container)) {
                    $(container).addClass('no-display').hide();
                }
            },
            t.displayEntityChooser = function (container) {
                var params = {};
                params.url = t.url;
                if (container && params.url) {
                    container = $(container);
                    params.data = {
                        id: container.attr('id'),
                        selected: container.closest('div.admin__field-control').find('input[type="text"].entities').first().val()
                    };
                    t.displayChooser(params, container);
                }
            },
            t.displayChooser = function (params, container) {
                container = $(container);
                if (params.url && container) {
                    if (container.html() == '') {
                        $.ajax({
                            url: params.url,
                            method: 'post',
                            showLoader: true,
                            data: params.data,
                            success: function (transport) {
                                try {
                                    if (transport) {
                                        container.prepend(transport);
                                        container.removeClass('no-display').show();
                                    }
                                } catch (e) {
                                    alert('Error occurs during loading chooser.');
                                }
                            }
                        });
                    } else {
                        container.removeClass('no-display').show();
                    }
                }
            },
            t.checkCategory = function (event) {
                var node = event.memo.node;
                var container = event.target.closest('div.admin__field-control');
                var elm = $(container).find('input[type="text"].entities').first();
                t.updateEntityValue(node.id, elm, node.attributes.checked);
            },
            t.checkProduct = function (event) {
                var input = event.memo.element,
                    container = event.target.closest('div.admin__field-control'),
                    elm = container.find('input[type="text"].entities').first();
                if (!isNaN(input.val())) t.updateEntityValue(input.val(), elm, input.is(':checked'));
            },
            t.updateEntityValue = function (value, elm, isAdd) {
                var values = $(elm).val().strip();
                if (values) values = values.split(',');
                else values = [];
                if (isAdd) {
                    if (-1 === values.indexOf(value)) {
                        values.push(value);
                        $(elm).val(values.join(','));
                    }
                } else {
                    if (-1 != values.indexOf(value)) {
                        values.splice(values.indexOf(value), 1);
                        $(elm).val(values.join(','));
                    }
                }
            },
            t.clearEntityValue = function (container) {
                var elm = $(container).closest('div.admin__field-control').find('input[type="text"].entities').first();
                if (elm) elm.val('');
                var hidden = $(container).find('input[type="hidden"]').first();
                if (hidden) hidden.val('');
                $(container).find('input[type="checkbox"]').each(function () {
                    $(this).prop('checked', false);
                });
            }
    };

    window.CleverLayoutPreview = new function(){
        var t = this;
        var MAX_COLUMN = 12;
        var COLUMN_WIDTH = 50;
        var TITLES = {};
        t._init = function (container, fieldset, layout) {
            t.container = $(container);
            if (t.container.init) return;
            t.container.init = true;
            t.layout = layout;
            t.fieldset = fieldset;
            t.target = $(fieldset + '_block_ids');
            t.defaultElm = $(fieldset + '_block_' + layout);

            for (var i = 0; i < t.target.options.length; i++) {
                t.TITLES.data(t.target.options[i].val(), t.target.options[i].innerHTML);
            }

            $(document).on('layout:order', function (ev) {
                t.updateFlexGridOrder(ev.target.blocks);
            });

            t.COLUMNS = {};
            t.CLASSES = {};

            t.initFlexGrid();
        },
            t.initFlexGrid = function () {
                $(t.target).on('change', function () {
                    t.collectFlexGridValues(false);
                });

                t.collectFlexGridValues(true);
            },
            t.updateFlexGridOrder = function (blocks) {
                var items = [];
                blocks.each(function (block) {
                    block = $(this);
                    var obj = {};
                    obj.id = block;
                    obj.text = t.TITLES.data(block);
                    obj.column = t.COLUMNS.data(block);
                    obj.classes = t.CLASSES.data(block);
                    items.push(obj);
                });
                t.renderFlexGrid(items);
            },
            t.collectFlexGridValues = function (isInit) {
                var items = [];

                if (isInit) {
                    var defaultValues = t.defaultElm.val() ? t.defaultElm.val().split('|') : [];
                    if (defaultValues.length) {
                        defaultValues.each(function (i,value) {
                            value = value.split(',');
                            items.push({
                                text: t.TITLES.data(value[0]),
                                id: value[0],
                                column: value[1],
                                classes: value[2] ? value[2].strip().split(' ') : []
                            });
                        });
                    }
                } else {
                    var values = t.target.val(),
                        count = values.length;

                    if (!count) return;

                    var average_col = Math.floor(t.MAX_COLUMN / count),
                        last_col,
                        i = 0;

                    if (average_col == 0) {
                        average_col = 1;
                        last_col = 0;
                    } else {
                        last_col = t.MAX_COLUMN - (average_col * count);
                    }

                    values.each(function (i,value) {
                        var obj = {};
                        obj.id = value;
                        obj.text = t.TITLES.data(value);
                        if (i++ < count - 1) {
                            obj.column = average_col;
                        } else {
                            if (last_col == 0) obj.column = average_col;
                            else obj.column = last_col + average_col;
                        }
                        obj.classes = [];
                        items.push(obj);
                    });
                }

                t.renderFlexGrid(items);
            },
            t.renderFlexGrid = function (items) {
                var count = items.size();
                if (isNaN(count) || count <= 0) return;

                t.container.html('');
                items.each(function (item) {
                    item = $(this);
                    t.container.prepend(t.renderFlexGridItem(item));
                });

                t.bindFlexGridEvent();
            },
            t.renderFlexGridItem = function (item) {
                var hide = item.attr('class').indexOf('hidden-' + t.layout) != -1,
                    width = item.column * t.COLUMN_WIDTH;

                var divElm = $('<div/>', {
                    'class': 'flex-grid',
                    'data-bid': item.id,
                    'data-column': item.column,
                    'data-classes': item.classes
                });
                divElm.css({width: width + 'px'});
                divElm.bid = item.id;

                var nameElm = $('<span/>', {'class': 'flex-grid-name'});
                nameElm.html(item.text);

                var columnElm = $('<a/>');
                columnElm.html(item.column);

                var hideElm = $('<span/>', {'class': 'flex-grid-hide'});
                divElm.addClass(hide ? 'hidden' : '');
                $(hideElm).on('click', function (ev) {
                    var me = $(this),
                        parent = me.closest(),
                        store = $(t.fieldset + '_block_' + t.layout);

                    if (parent && store) {
                        var oldValue = store.val(),
                            newValue = [],
                            hideMe = !parent.hasClass('hidden');

                        oldValue.split('|').each(function (key,str) {
                            var parts = str.split(','),
                                cls = 'hidden-' + t.layout;

                            if (parts[0] == parent.bid) {
                                if (parts.length === 2) {
                                    if (hideMe) {
                                        parts.push(cls);
                                        //jquery need
                                        t.CLASSES.data(parent.bid, cls);
                                        parent.attr('data-classes', cls);
                                    }
                                } else if (parts.length === 3) {
                                    var classes = parts[2].split(' '),
                                        index = classes.indexOf(cls);

                                    if (hideMe) {
                                        if (index == -1) {
                                            classes.push(cls);
                                            t.CLASSES.data(parent.bid, cls);
                                            parent.attr('data-classes', cls);
                                        }
                                    } else {
                                        if (index != -1) {
                                            classes.splice(index, 1);
                                        }
                                    }
                                    parts[2] = classes.join(' ').strip();
                                    t.CLASSES.data(parent.bid, parts[2]);
                                    parent.attr('data-classes', parts[2]);
                                }
                                newValue.push(parts.join(','));
                            } else {
                                newValue.push(str);
                            }
                        });
                        if (newValue.length) store.val(newValue.join('|'));
                        parent.toggleClass('hidden');
                    }
                });

                divElm.prepend(nameElm);
                divElm.prepend(columnElm);
                divElm.prepend(hideElm);

                return divElm;
            },
            t.bindFlexGridEvent = function () {
                var self = this,
                    layout = t.layout,
                    container = $('#layout_'+t.fieldset+'_preview_' + layout),
                    items = container.find('.flex-grid'),
                    fieldset = t.fieldset,
                    max_column = t.MAX_COLUMN,
                    col_width = t.COLUMN_WIDTH;

                function storeFlexGrid() {
                    var values = [];
                    container.find('.flex-grid').each(function (item) {
                        var item = $(item),
                            tmp = [];

                        tmp.push(item.attr('data-bid'));
                        tmp.push(item.attr('data-column'));
                        tmp.push(item.attr('data-classes'));
                        values.push(tmp.join(','));
                    });
                    $('#' + fieldset + '_block_' + layout).val(values.join('|'));
                    self.storeFlexGridValues(values);
                }

                container.sortable({
                    appendTo: 'parent',
                    containment: 'parent',
                    stop: function () {
                        storeFlexGrid();
                        self.triggerFlexGridOrder();
                    }
                });

                items.resizable({
                    grid: [col_width],
                    handles: 'e',
                    maxWidth: max_column * col_width,
                    resize: function (ev, ui) {
                        var width = ui.size.width,
                            column = Math.floor(width / 50);

                        ui.element.find('a').text(column);
                        ui.element.attr('data-column', column);
                    },
                    stop: function () {
                        storeFlexGrid();
                    }
                });

                storeFlexGrid();
            },
            t.triggerFlexGridOrder = function () {
                var blocks = [];
                t.container.find('.flex-grid').each(function (item) {
                    item = $(this);
                    blocks.push(item.bid);
                });
                t.container.trigger('layout:order', {blocks: blocks});
            },
            t.storeFlexGridValues = function (values) {
                values.each(function (i,value) {
                    value = value.split(',');
                    t.COLUMNS.data(value[0], value[1]);
                    t.CLASSES.data(value[0], value[2].strip());
                });
            }
    };
    return window.CleverWidgetChooser = CleverWidgetChooser;
});