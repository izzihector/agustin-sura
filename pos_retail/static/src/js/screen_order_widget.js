"use strict";
odoo.define('pos_retail.screen_order_widget', function (require) {

    var screens = require('point_of_sale.screens');
    var core = require('web.core');
    var _t = core._t;
    var field_utils = require('web.field_utils');
    var Click = -1;
    screens.OrderWidget.include({
        init: function (parent, options) {
            var self = this;
            this.mouse_down = false;
            this.moved = false;
            this.auto_tooltip;
            this.line_mouse_down_handler = function (event) {
                self.line_mouse_down(this.orderline, event);
            };
            this.line_mouse_move_handler = function (event) {
                self.line_mouse_move(this.orderline, event);
            };
            this.inputbuffer = "";
            this.firstinput = true;
            this.decimal_point = _t.database.parameters.decimal_point;
            this.keyboard_keydown_handler = function (event) {
                var current_screen = self.pos.gui.get_current_screen();
                if (current_screen != 'products' || self.gui.has_popup()) {
                    self.remove_event_keyboard();
                    return true;

                }
                if (event.keyCode === 8 || event.keyCode === 46) { // Backspace and Delete
                    event.preventDefault();
                    self.keyboard_handler(event);
                }
                if (event.keyCode === 38 || event.keyCode === 40) { // Up and Down
                    event.preventDefault();
                    self.change_line_selected(event.keyCode);
                }
                if (event.keyCode === 187) { // plus
                    event.preventDefault();
                    self.keyboard_handler(event);
                }
                if (event.keyCode === 27) { // key: esc
                    event.preventDefault();
                    self.keyboard_handler(event);
                }

            };
            document.onkeyup = function (event){
                if (event.altKey && event.keyCode === 65 && self.pos.config.add_client) {  // key: alt + a
                        console.log('1');
                        $('.add-new-customer').click();
                    }
                //
                //if (event.altKey && event.keyCode === 65 && self.pos.config.add_client) {  // key: alt + a
                    //$('.add-new-customer').click();
                  //  console.log('1');
                //} 
                //
                else if (event.altKey && event.keyCode === 66){ //key: alt + b
                    $('.show_hide_buttons').click() 
                    console.log('2');                                            
                }
                else if (event.altKey && event.keyCode === 67&& self.pos.config.allow_customer) { // key: alt + c
                        $('.set-customer').click()
                        console.log('3');
                    }
                    //
                    //else if (event.altKey && event.keyCode === 67 && self.pos.config.allow_customer) { // key: alt + c
                      //  $('.set-customer').click()
                        //console.log('3');
                        //}
                    //
                else if (event.shiftKey && event.keyCode === 68 && self.pos.config.allow_discount) { // key: shift + d
                        self.numpad_state.changeMode('discount');
                        self.pos.trigger('change:mode');
                        console.log('4');
                    }
                    //
                    //else if (event.altKey && event.keyCode === 68 && self.pos.config.allow_discount) { // key: shift + d
                        //self.numpad_state.changeMode('discount');
                        //self.pos.trigger('change:mode');
                      //  console.log('4');
                    //}
                    //
                else if (event.altKey &&  event.keyCode === 87) { // key: alt + w
                    console.log('5');
                        self.pos.gui.show_popup('popup_create_product', {
                        title: 'Add New Product',
                        })
                        
                    }
                else if (event.altKey && event.keyCode === 72) { // key: alt + h 
                        $('.show_hide_pad').click();
                        console.log('6');
                    }
                else if (event.altKey && event.ctrlKey && event.keyCode === 70  && self.pos.config.quickly_payment_full && self.pos.config.quickly_payment_full_journal_id) {// key: ctrl + alt + f
                        console.log('7');
                        $('.quickly_paid').click();
                    }

                    //
                    //else if (event.key === 'AltGraph' && event.keyCode === 49 && self.pos.config.quickly_payment_full && self.pos.config.quickly_payment_full_journal_id) {// key: ctrl + f
                        //$('.quickly_paid').click();
                      //  console.log('7');
                    //}
                    //
              
                else if (event.altKey && event.keyCode === 73 && self.pos.config.management_invoice){ // key: alt + i
                    self.pos.gui.show_screen('invoices');
                    console.log('8');
                }
                //
                //else if (event.altKey && event.keyCode === 73 && self.pos.config.management_invoice){ // key: ctrl + i
                    //self.pos.gui.show_screen('invoices');
                    //console.log('8');
                //}
                //
                else if (event.altKey && event.keyCode === 75) {//key: alt + k
                    console.log('9');
                    $('.find_partner_input').focus();
                }
                else if (event.altKey && event.keyCode === 76){//key: alt + l
                    console.log('10');
                    if (self.gui.chrome.widget['lock_session_widget']) {
                        self.gui.chrome.widget['lock_session_widget'].el.click();
                }   
                }
                else if(event.altKey && event.keyCode === 78 && self.pos.config.allow_add_order){// key: alt + n
                    console.log('11');
                    self.pos.add_new_order();
                }
                //
                //else if(event.altKey && event.keyCode === 78 && self.pos.config.allow_add_order){// key; alt + n
                    //self.pos.add_new_order();
                    //console.log('11');
                //}
                //
                else if (event.altKey && event.keyCode === 79 && self.pos.config.pos_orders_management) { // key: alt + o
                    self.pos.gui.show_screen('pos_orders_screen');
                    console.log('12');
                }
                //
                //else if (event.altKey && event.keyCode === 79 && self.pos.config.pos_orders_management) { // key: alt + o
                  //  self.pos.gui.show_screen('pos_orders_screen');
                  // console.log('12');
                //}
                //

                else if (event.altKey && event.keyCode === 82 && self.pos.config.allow_remove_order) { // key: alt + r
                    console.log('13')
                    $('.deleteorder-button').click();
                }

                //
                //else if (event.altKey && event.keyCode === 82 && self.pos.config.allow_remove_order) { // key: alt + r
                    //console.log('13')
                  //  $('.deleteorder-button').click();
                //}
                //
                else if (event.altKey && event.keyCode === 83) { //key: alt + s
                    console.log('14');
                    $('.search-products').focus();
                }
                else if(event.altKey && event.keyCode === 86){ //key:  alt + v
                    console.log('15');
                    self.gui.chrome.widget['products_view_widget'].el.click();
                }
                else if (event.altKey && event.ctrlKey && event.keyCode === 80) { // key:  alt + w
                    console.log('16');
                    self.pos.gui.show_popup('popup_create_pos_category', {
                        title: 'Add New Product Category'
                        })
                }
                
            }
                //else if (event.keyCode === 103) {
                //}
            this.Key_product_handler = function(event){ 
                if (event.type === "keydown") {
                if (event.keyCode === 38 ||event.keyCode === 40||event.keyCode === 13)     {
                    if (event.keyCode == 38){
                        console.log("key_up");
                    }
                    if (event.keyCode == 40){
                        console.log("key_down");
                    }
                    if (event.keyCode == 13){
                        console.log("Enter");
                    }
                    self.productKeys(event.keyCode);
                } 
               
            }
            }
            this.keyboard_handler = function (event) {
                var current_screen = self.pos.gui.get_current_screen();
                if (current_screen != 'products' || self.gui.has_popup()) {
                    self.remove_event_keyboard();
                    return true;
                }
                
                var key = '';
                if (event.type === "keypress") {
                    if (event.keyCode === 32) { // Space
                        $('.pay').click();
                    } else if (event.keyCode === 190 || // Dot
                        event.keyCode === 188 ||  // Comma
                        event.keyCode === 46) {  // Numpad dot
                        key = self.decimal_point;
                    } else if (event.keyCode >= 48 && event.keyCode <= 57) { // Numbers
                        key = '' + (event.keyCode - 48);
                    } else if (event.keyCode === 45) { // Minus
                        key = '-';
                    } else if (event.keyCode === 43) { // Plus
                        key = '+';
                    } 
                    
                    
    
                    
                     //else if (event.keyCode === 97 && self.pos.config.add_client) {  // key: a
                       //  $('.add-new-customer').click();
                     //}
                    // } else if (event.keyCode === 98) {  // key: b
                    //     $('.show_hide_buttons').click()
                    // } else if (event.keyCode === 99 && self.pos.config.allow_customer) { // key: c
                    //     $('.set-customer').click()
                    // } else if (event.keyCode === 100 && self.pos.config.allow_discount) { // key: d
                    //     self.numpad_state.changeMode('discount');
                    //     self.pos.trigger('change:mode');
                    // } else if (event.keyCode === 101) { // key: w
                    //     self.pos.gui.show_popup('popup_create_product', {
                    //         title: 'Add New Product',
                    //     })
                    // } else if (event.keyCode === 104) { // key: h
                    //     $('.show_hide_pad').click();
                    // } else if (event.keyCode === 102 && self.pos.config.quickly_payment_full && self.pos.config.quickly_payment_full_journal_id) { // key: f
                    //     $('.quickly_paid').click();
                    // } else if (event.keyCode === 103) {
                    //
                    // } else if (event.keyCode === 105 && self.pos.config.management_invoice) { // key: i
                    //     self.pos.gui.show_screen('invoices');
                    // } else if (event.keyCode === 107) { // key: k
                    //     $('.find_partner_input').focus();
                    // } else if (event.keyCode === 108) { // key: l
                    //     if (self.gui.chrome.widget['lock_session_widget']) {
                    //         self.gui.chrome.widget['lock_session_widget'].el.click();
                    //     }
                    // } else if (event.keyCode === 110 && self.pos.config.allow_add_order) { // key: n
                    //     self.pos.add_new_order();
                    // } else if (event.keyCode === 111 && self.pos.config.pos_orders_management) { // key: o
                    //     self.pos.gui.show_screen('pos_orders_screen');
                    // }
                    
                    
                    else if (event.keyCode === 112 && self.pos.config.allow_price) { // key: p
                        self.numpad_state.changeMode('price');
                        self.pos.trigger('change:mode');
                    } else if (event.keyCode === 113 && self.pos.config.allow_qty) { // key q
                        self.numpad_state.changeMode('quantity');
                        self.pos.trigger('change:mode');
                    } 
                    
                    // else if (event.keyCode === 114 && self.pos.config.allow_remove_order) { // key: r
                    //     $('.deleteorder-button').click();
                    // } else if (event.keyCode === 115) { // key:  s
                    //     $('.search-products').focus();
                    // } else if (event.keyCode === 118) { // key:  v
                    //     self.gui.chrome.widget['products_view_widget'].el.click();
                    // } else if (event.keyCode === 119) { // key:  w
                    //     self.pos.gui.show_popup('popup_create_pos_category', {
                    //         title: 'Add New Product Category'
                    //     })
                    // }
                } else {
                    if (event.keyCode === 46) { // key: del
                        key = 'REMOVE';
                    } else if (event.keyCode === 8) { // Backspace
                        key = 'BACKSPACE';
                    } else if (event.keyCode === 187) { // Backspace
                        key = '+';
                    } else if (event.keyCode === 27) { // Key: ESC
                        key = 'ESC';
                    }
                }
                self.press_keyboard(key);
                event.preventDefault();
            };
            this._super(parent, options);
            this.pos.bind('change:mode', function () {
                self.change_mode();
            });
            this.pos.bind('back:order', function () {
                self.add_event_keyboard()
            });
        },
        press_keyboard: function (input) {
            if ((input == "CLEAR" || input == "BACKSPACE") && this.inputbuffer == "") {
                var order = this.pos.get_order();
                if (order.get_selected_orderline()) {
                    var mode = this.numpad_state.get('mode');
                    if (mode === 'quantity') {
                        this.inputbuffer = order.get_selected_orderline()['quantity'].toString();
                    } else if (mode === 'discount') {
                        this.inputbuffer = order.get_selected_orderline()['discount'].toString();
                    } else if (mode === 'price') {
                        this.inputbuffer = order.get_selected_orderline()['price'].toString();
                    }
                }
            }
            if (input == "REMOVE") {
                var order = this.pos.get_order();
                if (order.get_selected_orderline()) {
                    this.set_value('remove');
                }
            }
            if (input == "ESC") { // Clear Search
                var input = $('input'); // find all input elements and clear
                input.val("");
                var products_screen = this.gui.screen_instances['products'];
                var product_categories_widget = products_screen.product_categories_widget;
                product_categories_widget.clear_search();
            }
            if (this.gui.has_popup()) {
                return;
            }
            if (input != '-' && input != '+') {
                var newbuf = this.gui.numpad_input(this.inputbuffer, input, {'firstinput': this.firstinput});
                this.firstinput = (newbuf.length === 0);
                if (newbuf !== this.inputbuffer) {
                    this.inputbuffer = newbuf;
                    var amount = field_utils.parse.float(this.inputbuffer);
                    this.set_value(amount);
                }
            }
            if (input == '-' || input == '+') {
                if (input == '-') {
                    var value = parseFloat(prompt("Ingrese el valor a descontar"));
                    if(isNaN(value)){
                        value = 0.00;
                    }
                    var newbuf = parseFloat(this.inputbuffer) - value;
                } else {
                    var value = parseFloat(prompt("Ingrese el valor a incrementar"));
                    if(isNaN(value)){
                        value = 0.00;
                    }
                    var newbuf = parseFloat(this.inputbuffer) + value;
                }
                this.firstinput = (newbuf.length === 0);
                this.inputbuffer = newbuf.toString();
                this.set_value(this.inputbuffer)
            }
        },
        change_line_selected: function (keycode) {
            var order = this.pos.get_order();
            var line_selected = order.get_selected_orderline();
            if (!line_selected && order && order.orderlines.models.length > 0) {
                this.pos.get_order().select_orderline(order.orderlines.models[0]);
                this.numpad_state.reset();
            }
            if (line_selected && order && order.orderlines.models.length > 1) {
                for (var i = 0; i < order.orderlines.models.length; i++) {
                    var line_check = order.orderlines.models[i];
                    if (line_check.cid == line_selected.cid) {
                        if (keycode == 38) {
                            if ((i - 1) >= 0) {
                                var line_will_select = order.orderlines.models[i - 1];
                                this.pos.get_order().select_orderline(line_will_select);
                                this.numpad_state.reset();
                                break;
                            }
                        } else {
                            var line_will_select = order.orderlines.models[i + 1];
                            this.pos.get_order().select_orderline(line_will_select);
                            this.numpad_state.reset();
                            break;
                        }
                    }
                }
            }
        },
        click_line: function (orderline, event) {
            this._super(orderline, event);
            var order = this.pos.get_order();
            if (order && order.get_selected_orderline()) {
                var line = order.get_selected_orderline();
                this.add_event_keyboard();
                this.inputbuffer = "";
                this.firstinput = true;
                var mode = this.numpad_state.get('mode');
                if (mode === 'quantity') {
                    this.inputbuffer = line['quantity'].toString();
                } else if (mode === 'discount') {
                    this.inputbuffer = line['discount'].toString();
                } else if (mode === 'price') {
                    this.inputbuffer = line['price'].toString();
                }
            }
        },
        change_mode: function () {
            this.inputbuffer = "";
            this.firstinput = true;
        },
        add_event_keyboard: function () {
            
            if (this.pos.config.mobile_responsive) {
                return;
            }
            this.remove_event_keyboard();
            if (this.pos.config.keyboard_event) {
                if (this.pos.server_version == 10) {
                    $('.leftpane').keypress(this.keyboard_handler);
                    $('.leftpane').keydown(this.keyboard_keydown_handler);
                }
                if (this.pos.server_version != 10) {
                    $('body').keypress(this.keyboard_handler);
                    // $('body').keydown(this.keyboard_keydown_handler);
                }
                window.document.body.addEventListener('keypress', this.keyboard_handler);
                window.document.body.addEventListener('keydown', this.keyboard_keydown_handler);
            }
        },
        
        remove_event_keyboard: function () {
            if (this.pos.server_version == 10) {
                $('.leftpane').off('keypress', this.keyboard_handler);
                // $('.leftpane').off('keydown', this.keyboard_keydown_handler);
            }
            if (this.pos.server_version != 10) {
                $('body').off('keypress', this.keyboard_handler);
                // $('body').off('keydown', this.keyboard_keydown_handler);
            }
            window.document.body.removeEventListener('keypress', this.keyboard_handler);
            window.document.body.removeEventListener('keydown', this.keyboard_keydown_handler);
        }, 
        productKeys: function (keyCode) {
            var self = this;

                //Seleccionar ID (Solo se esta seleccionando mun ID)
                var ID = document.querySelector('.product-list-contents');
                //Seleccionar
                var nodo = document.querySelector(".product");//roo - Fila
                var bla = document.querySelector(".product-list-contents");//table-body
                function up(){                
                    if (Click == 0) {
                        console.log("Ha llegado al m??nimo");		
                    }   
                    else {
                        var nodo = document.querySelector(".product");//roo - Fila
                        var bla = document.querySelector(".product-list-contents");//table-body
                        Click --;
                        nodo = bla.children[Click];
                        console.log(nodo);
                        console.log(bla);
                        $('.product-list').css('background','white');
                        $('.product-list').css('color','black');
                        $(nodo).css('background','rgb(110, 200, 155)');
                        $(nodo).css('color','white');
                        var scr = Click;
                        document.querySelector(".product-list-contents").children[scr].scrollIntoView({behavior: 'auto', block: 'nearest' , inline:'nearest'});
                    }
                }
                function down(){
                    var nodo = document.querySelector(".product");//roo - Fila
                    var bla = document.querySelector(".product-list-contents");//table-body
                    var max = bla.children.length;
                    
                    if (Click == max-1) {
                        console.log("Ha llegado al m??ximo");
                        $('.product-list').css('background','white');
                        $('.product-list').css('color','black');
                        $(nodo).css('background','rgb(110, 200, 155)');
                        $(nodo).css('color','white');
                    }else{    
                        Click++;
                        nodo = bla.children[Click];
                        //$.product-list-container;
                        //$("nodo").addClass("tr:hover");
                        console.log(nodo);	
                        console.log(bla);
                        $('.product-list').css('background','white');
                        $('.product-list').css('color','black');
                        $(nodo).css('background','rgb(110, 200, 155)');
                        $(nodo).css('color','white');
                        var scr = Click;
                        document.querySelector(".product-list-contents").children[scr].scrollIntoView({behavior: 'auto', block: 'nearest' , inline:'nearest'});
                        }
                    }
                    function enter(){
                        console.log();
                        if (Click == null || Click < 0|| document.querySelector(".product-list-contents").children[Click] == undefined){
                            console.log(document.querySelector(".product-list-contents").children[Click]);
                            console.log("no");
                        }else{
                        console.log(document.querySelector(".product-list-contents").children[Click]);
                        document.querySelector(".product-list-contents").children[Click].click();
                        status = 1;
                        }

                        // remover event listener despues de haber "dado click" al producto
                        self.remove_event_keyboard();
                    }
                   if (keyCode == 38 ){
                       up();
                   } 
                   if (keyCode == 40 ){
                       down();
                   }
                   if (keyCode == 13){
                       enter();
                   }
        },

        add_event_keyboard_products: function () {
            this.remove_event_keyboard_products();
                    $('.search-products').keydown(this.Key_product_handler);
                //window.document.body.addEventListener('keyup', this.Key_product_handler);
        },
        remove_event_keyboard_products: function () {
                $('.search-products').off('keydown', this.Key_product_handler);
                // $('.leftpane').off('keydown', this.keyboard_keydown_handler);
            
            window.document.body.removeEventListener('keydown', this.Key_product_handler);
        }, 
        renderElement: function (scrollbottom) {
            var self = this;
            this._super(scrollbottom);
            this.add_event_keyboard();
            setTimeout(function () {
                self.event_input_linked_keyboard_event()
            }, 2000);
        },
        event_input_linked_keyboard_event: function () {
            var self = this;
            $(".search-products").focus(function () {
                console.log('in search-products');
                self.remove_event_keyboard();
                self.add_event_keyboard_products();
            }).blur(function () {
                console.log('out search-products');
                self.add_event_keyboard();
                self.remove_event_keyboard_products();
            });
            $(".find_partner_input").focus(function () {
                console.log('in find_partner_input');
                self.remove_event_keyboard();
            }).blur(function () {
                console.log('out find_partner_input');
                self.add_event_keyboard();
            });
        },
        orderline_change: function (line) {
            this._super(line);
            this.pos._update_cart_qty_by_order([line.product.id]);
        },
        change_selected_order: function () {
            var res = this._super();
            var order = this.pos.get_order();
            if (order && order.lock && this.pos.config.lock_order_printed_receipt) {
                this.pos.lock_order();
            } else {
                this.pos.unlock_order();
            }
            var $qty = $('.cart_qty');
            $qty.addClass('oe_hidden');
            if (order) {
                var product_ids = [];
                for (var i = 0; i < order.orderlines.models.length; i++) {
                    product_ids.push(order.orderlines.models[i].product.id)
                }
                this.pos._update_cart_qty_by_order(product_ids);
            }
        },
        touch_start: function (product, x, y) {
            var self = this;
            this.auto_tooltip = setTimeout(function () {
                if (!self.moved) {
                    var inner_html = self.gui.screen_instances.products.product_list_widget.generate_html(product);
                    $('.product-screen').prepend(inner_html);
                    $(".close_button").on("click", function () {
                        $('#info_tooltip').remove();
                    });
                }
            }, 30);
        },
        touch_end: function () {
            if (this.auto_tooltip) {
                clearTimeout(this.auto_tooltip);
            }
        },
        line_mouse_down: function (line, event) {
            var self = this;
            if (event.which == 1) {
                $('.info_tooltip').remove();
                self.moved = false;
                self.mouse_down = true;
                self.touch_start(line.product, event.pageX, event.pageY);
            }
        },
        line_mouse_move: function (line, event) {
            var self = this;
            if (self.mouse_down) {
                self.moved = true;
            }
        },
        render_orderline: function (orderline) {
            var self = this;
            try {
                var el_node = this._super(orderline);
            } catch (e) {
                return
            }

            if (this.pos.config.tooltip) {
                el_node.addEventListener('mousedown', this.line_mouse_down_handler);
                el_node.addEventListener('mousemove', this.line_mouse_move_handler);
            }
            // -----------------------------
            // Signature order
            // -----------------------------
            var el_order_signature = $('.order_signature');
            if (el_order_signature) {
                el_order_signature.click(function () {
                    var order = self.pos.get_order();
                    if (order) {
                        self.pos.gui.show_popup('popup_order_signature', {
                            order: order,
                            title: 'Signature Order'
                        });
                    }
                });
            }
            // -----------------------------
            // Note order
            // -----------------------------
            var el_note = $('.pos_note');
            if (el_note) {
                el_note.click(function () {
                    var order = self.pos.get_order();
                    if (order) {
                        self.pos.gui.show_popup('textarea', {
                            title: _t('Add Note'),
                            value: order.get_note(),
                            confirm: function (note) {
                                order.set_note(note);
                                order.trigger('change', order);
                            }
                        });
                    }
                });
            }
            // -----------------------------
            // Remove line
            // -----------------------------
            var el_remove_line = el_node.querySelector('.remove_line');
            if (el_remove_line) {
                el_remove_line.addEventListener('click', (function () {
                    var order = self.pos.get_order();
                    var selected_orderline = order.selected_orderline;
                    if (order && selected_orderline) {
                        return order.remove_orderline(selected_orderline);
                    }
                }.bind(this)));
            }
            // -----------------------------
            // Multi lots
            // line multi lots
            // -----------------------------
            var el_multi_lots = el_node.querySelector('.multi_lots');
            if (el_multi_lots) {
                el_multi_lots.addEventListener('click', (function () {
                    var order = self.pos.get_order();
                    var selected_orderline = order.selected_orderline;
                    if (selected_orderline) {
                        if (!selected_orderline.lot_ids) {
                            selected_orderline.lot_ids = [];
                        }
                        self.pos.gui.show_popup('popup_set_multi_lots', {
                            'title': 'Add lots',
                            'selected_orderline': selected_orderline,
                            confirm: function (lot_ids) {
                                var order = self.pos.get_order();
                                var selected_orderline = order.selected_orderline;
                                var sum = 0;
                                for (var i = 0; i < lot_ids.length; i++) {
                                    var lot_added = lot_ids[i];
                                    var lot_check = self.pos.lot_by_name[lot_added['name']];
                                    if (!lot_check) {
                                        return self.pos.gui.show_popup('dialog', {
                                            'title': 'Warning',
                                            'body': 'Please checking again lot name: ' + lot_added['name'] + ' , because this lot have not exist'
                                        })
                                    } else {
                                        sum += parseFloat(lot_added['quantity']);
                                    }
                                }
                                if (sum > selected_orderline['quantity'] || sum < selected_orderline['quantity']) {
                                    return self.pos.gui.show_popup('dialog', {
                                        'title': 'Warning',
                                        'body': 'Total quantities of lots added have not the same quantities of line selected'
                                    })
                                }
                                selected_orderline.lot_ids = lot_ids;
                                selected_orderline.trigger('change', selected_orderline);
                                selected_orderline.trigger('trigger_update_line');
                            }
                        })
                    }

                }.bind(this)));
            }
            // -----------------------------
            // Edit voucher vard
            // -----------------------------
            var el_edit_voucher_card = el_node.querySelector('.edit_voucher_card');
            if (el_edit_voucher_card) {
                el_edit_voucher_card.addEventListener('click', (function () {
                    var order = self.pos.get_order();
                    if (order) {
                        order.show_popup_create_voucher();
                    }
                }.bind(this)));
            }
            // -----------------------------
            // Multi variant
            // -----------------------------
            var el_multi_variant = el_node.querySelector('.multi_variant');
            if (el_multi_variant) {
                el_multi_variant.addEventListener('click', (function () {
                    var order = self.pos.get_order();
                    var selected_orderline = order.selected_orderline;
                    if (self.pos.variant_by_product_tmpl_id[selected_orderline.product.product_tmpl_id]) {
                        return self.gui.show_popup('pop_up_select_variants', {
                            variants: self.pos.variant_by_product_tmpl_id[selected_orderline.product.product_tmpl_id],
                            selected_orderline: selected_orderline,
                        });
                    } else {
                        return self.pos.gui.show_popup('dialog', {
                            title: 'Warning',
                            body: 'Product checked to variant checkbox but page variants datas not add any records',
                        })
                    }
                }.bind(this)));
            }
            // -----------------------------
            // Add sale person to line
            // -----------------------------
            var el_add_sale_person = el_node.querySelector('.add_sale_person');
            if (el_add_sale_person) {
                el_add_sale_person.addEventListener('click', (function () {
                    var sellers = self.pos.sellers;
                    var list = [];
                    for (var i = 0; i < sellers.length; i++) {
                        var seller = sellers[i];
                        list.push({
                            'label': seller['name'],
                            'item': seller
                        })
                    }
                    if (list.length > 0) {
                        return self.pos.gui.show_popup('selection', {
                            title: _t('Select sale person'),
                            list: list,
                            confirm: function (seller) {
                                orderline.set_sale_person(seller);
                            }
                        });
                    } else {
                        return this.pos.gui.show_popup('dialog', {
                            title: 'Warning',
                            body: 'Your pos config have not add sellers'
                        });
                    }

                }.bind(this)));
            }
            // -----------------------------
            // Change unit of measure of line
            // -----------------------------
            var el_change_unit = el_node.querySelector('.change_unit');
            if (el_change_unit) {
                el_change_unit.addEventListener('click', (function () {
                    var order = self.pos.get_order();
                    var selected_orderline = order.selected_orderline;
                    if (order) {
                        if (selected_orderline) {
                            selected_orderline.change_unit();
                        } else {
                            return self.pos.gui.show_popup('confirm', {
                                title: 'Warning',
                                body: 'Please select line',
                                confirm: function () {
                                    return self.gui.close_popup();
                                },
                                cancel: function () {
                                    return self.gui.close_popup();
                                }
                            });
                        }
                    } else {
                        return self.pos.gui.show_popup('dialog', {
                            title: 'Warning',
                            body: 'Order Lines is empty',
                        });
                    }

                }.bind(this)));
            }
            // -----------------------------
            // Change combo of line
            // -----------------------------
            var el_change_combo = el_node.querySelector('.change_combo');
            if (el_change_combo) {
                el_change_combo.addEventListener('click', (function () {
                    var order = self.pos.get_order();
                    if (order) {
                        var selected_orderline = order.selected_orderline;
                        if (selected_orderline) {
                            selected_orderline.change_combo();
                        }
                    }
                }.bind(this)));
            }
            // -----------------------------
            // Add cross sale
            // -----------------------------
            var el_change_cross_selling = el_node.querySelector('.change_cross_selling');
            if (el_change_cross_selling) {
                el_change_cross_selling.addEventListener('click', (function () {
                    var order = self.pos.get_order();
                    if (order) {
                        var selected_orderline = order.selected_orderline;
                        if (selected_orderline) {
                            selected_orderline.change_cross_selling();
                        }
                    }
                }.bind(this)));
            }
            // -----------------------------
            // Add cross sale
            // -----------------------------
            var el_change_line_note = el_node.querySelector('.change_line_note');
            if (el_change_line_note) {
                el_change_line_note.addEventListener('click', (function () {
                    var order = self.pos.get_order();
                    if (order) {
                        var selected_orderline = order.selected_orderline;
                        if (selected_orderline) {
                            this.gui.show_popup('popup_add_order_line_note', {
                                title: _t('Add Note'),
                                value: selected_orderline.get_line_note(),
                                confirm: function (note) {
                                    selected_orderline.set_line_note(note);
                                }
                            });
                        }
                    }
                }.bind(this)));
            }
            // -----------------------------
            //  Add tags
            // -----------------------------
            var el_change_tags = el_node.querySelector('.change_tags');
            if (el_change_tags) {
                el_change_tags.addEventListener('click', (function () {
                    var order = self.pos.get_order();
                    if (order) {
                        var selected_orderline = order.selected_orderline;
                        if (selected_orderline) {
                            return this.gui.show_popup('popup_selection_tags', {
                                selected_orderline: selected_orderline,
                                title: 'Add tags'
                            });
                        }
                    }
                }.bind(this)));
            }
            // -----------------------------
            // Add discount
            // -----------------------------
            var el_change_tags = el_node.querySelector('.add_discount');
            if (el_change_tags) {
                el_change_tags.addEventListener('click', (function () {
                    var list = [];
                    for (var i = 0; i < self.pos.discounts.length; i++) {
                        var discount = self.pos.discounts[i];
                        list.push({
                            'label': discount.name,
                            'item': discount
                        });
                    }
                    this.pos.gui.show_popup('selection', {
                        title: _t('Select discount'),
                        list: list,
                        confirm: function (discount) {
                            var order = self.pos.get_order();
                            if (order && order.selected_orderline) {
                                order.selected_orderline.set_global_discount(discount);
                            }
                        }
                    });
                }.bind(this)));
            }
            // -----------------------------
            // Add packaging/box
            // -----------------------------
            var el_add_packaging = el_node.querySelector('.product_packaging');
            if (el_add_packaging) {
                el_add_packaging.addEventListener('click', (function () {
                    var order = self.pos.get_order();
                    if (order) {
                        var selected_orderline = order.selected_orderline;
                        if (selected_orderline) {
                            var product_id = selected_orderline.product.id;
                            var list = [];
                            var packagings = self.pos.packaging_by_product_id[product_id];
                            if (packagings) {
                                for (var j = 0; j < packagings.length; j++) {
                                    var packaging = packagings[j];
                                    list.push({
                                        'label': packaging.name + ' with price: ' + packaging.list_price + ' and qty: ' + packaging.qty,
                                        'item': packaging
                                    });
                                }
                            }
                            if (list.length) {
                                return this.pos.gui.show_popup('selection', {
                                    title: _t('Select packaging'),
                                    list: list,
                                    confirm: function (packaging) {
                                        var order = self.pos.get_order();
                                        if (order && order.selected_orderline && packaging.list_price > 0 && packaging.qty > 0) {
                                            var selected_orderline = order.selected_orderline;
                                            selected_orderline.packaging = packaging;
                                            return self.pos.gui.show_popup('number', {
                                                title: 'How many boxes',
                                                body: 'How many boxes you need to sell ?',
                                                confirm: function (number) {
                                                    if (number > 0) {
                                                        var order = self.pos.get_order();
                                                        if (!order) {
                                                            return self.pos.gui.show_popup('dialog', {
                                                                title: 'Warning',
                                                                body: 'Could not find order selected',
                                                            })
                                                        }
                                                        var selected_orderline = order.selected_orderline;
                                                        if (!selected_orderline) {
                                                            return self.pos.gui.show_popup('dialog', {
                                                                title: 'Warning',
                                                                body: 'Could not find order line selected',
                                                            })
                                                        }
                                                        selected_orderline.packaging = packaging;
                                                        selected_orderline.set_quantity(packaging.qty * number);
                                                        selected_orderline.set_unit_price(packaging.list_price / packaging.qty);
                                                        selected_orderline.price_manually_set = true;
                                                        return self.pos.gui.show_popup('dialog', {
                                                            title: 'Success',
                                                            body: 'Great job ! You just add ' + number + ' box/boxes for ' + selected_orderline.product.display_name,
                                                            color: 'success'
                                                        })
                                                    } else {
                                                        return self.pos.gui.show_popup('dialog', {
                                                            title: 'Warning',
                                                            body: 'Number of packaging/box could not smaller than 0',
                                                        })
                                                    }
                                                }
                                            })
                                        }
                                        if (packaging.list_price <= 0 || packaging.qty <= 0) {
                                            self.pos.gui.show_popup('dialog', {
                                                title: 'Warning',
                                                body: 'Your packaging selected have price or quantity smaller than or equal 0'
                                            })
                                        }
                                    }
                                });
                            }
                        }
                    }
                }.bind(this)));
            }
            return el_node;
        },
        remove_orderline: function (order_line) {
            try {
                this.pos._update_cart_qty_by_order(order_line.product.id);
                this._super(order_line);
            } catch (ex) {
                console.log('dont worries, client without table select');
            }
        },
        set_value: function (val) {
            var self = this;
            var mode = this.numpad_state.get('mode');
            var order = this.pos.get_order();
            if (!order) {
                return false;
            }
            var line_selected = order.get_selected_orderline();
            if (!line_selected) {
                return false;
            }
            /*
            Security limit discount filter by cashiers
             */
            if (mode == 'discount' && this.pos.config.discount_limit && line_selected) {
                this.gui.show_popup('number', {
                    'title': _t('Which percentage of discount would you apply ?'),
                    'value': self.pos.config.discount_limit_amount,
                    'confirm': function (discount) {
                        if (discount > self.pos.config.discount_limit_amount) {
                            if (self.pos.config.discount_unlock_limit) {
                                var manager_user_id = self.pos.config.discount_unlock_limit_user_id[0];
                                var manager_user = self.pos.user_by_id[manager_user_id];
                                if (!manager_user) {
                                    return;
                                }
                                return this.pos.gui.show_popup('ask_password', {
                                    title: 'Blocked',
                                    body: _t('Discount limited, need approve by ' + manager_user.name + '. Please input pos security pin of manager'),
                                    confirm: function (password) {
                                        if (manager_user) {
                                            if (manager_user['pos_security_pin'] != password) {
                                                self.pos.gui.show_popup('dialog', {
                                                    title: 'Error',
                                                    body: 'POS Security pin of ' + manager_user.name + ' not correct !'
                                                });
                                            } else {
                                                order.get_selected_orderline().set_discount(discount);
                                            }
                                        }
                                    }
                                });
                            } else {
                                return self.gui.show_popup('dialog', {
                                    title: _t('Warning'),
                                    body: 'You can not set discount bigger than ' + self.pos.config.discount_limit_amount + '. Please contact your pos manager and set bigger than',
                                })
                            }
                        } else {
                            order.get_selected_orderline().set_discount(discount);
                        }
                    }
                });
            } else {
                this._super(val);
            }
        },
        set_lowlight_order: function (buttons) {
            for (var button_name in buttons) {
                buttons[button_name].highlight(false);
            }
        },
        active_button_combo: function (buttons, selected_order) { // active button set combo
            if (selected_order.selected_orderline && buttons && buttons.button_combo) {
                var is_combo = selected_order.selected_orderline.is_combo();
                buttons.button_combo.highlight(is_combo);
            }
        },
        active_button_combo_item_add_lot: function (buttons, selected_order) { // active button set combo
            if (selected_order.selected_orderline && buttons && buttons.button_combo_item_add_lot) {
                var has_combo_item_tracking_lot = selected_order.selected_orderline.has_combo_item_tracking_lot();
                buttons.button_combo_item_add_lot.highlight(has_combo_item_tracking_lot);
            }
        },
        active_internal_transfer_button: function (buttons, selected_order) { // active button set combo
            if (buttons && buttons.internal_transfer_button) {
                var active = selected_order.validation_order_can_do_internal_transfer();
                buttons.internal_transfer_button.highlight(active);
            }
        },
        active_button_create_purchase_order: function (buttons, selected_order) {
            if (buttons.button_create_purchase_order) {
                if (selected_order.orderlines.length > 0 && selected_order.get_client()) {
                    buttons.button_create_purchase_order.highlight(true);
                } else {
                    buttons.button_create_purchase_order.highlight(false);
                }
            }
        },
        active_button_change_unit: function (buttons, selected_order) {
            if (buttons.button_change_unit) {
                if (selected_order.selected_orderline && selected_order.selected_orderline.is_multi_unit_of_measure()) {
                    buttons.button_change_unit.highlight(true);
                } else {
                    buttons.button_change_unit.highlight(false);
                }
            }
        },
        active_button_set_tags: function (buttons, selected_order) {
            if (buttons.button_set_tags) {
                if (selected_order.selected_orderline && selected_order.selected_orderline.is_has_tags()) {
                    buttons.button_set_tags.highlight(true);
                } else {
                    buttons.button_set_tags.highlight(false);
                }
            }
        },
        active_lock_unlock_order: function (buttons, selected_order) {
            if (buttons.button_lock_unlock_order) {
                if (selected_order['lock']) {
                    buttons.button_lock_unlock_order.highlight(true);
                    buttons.button_lock_unlock_order.$el.html('<i class="fa fa-lock" /> UnLock Order')
                } else {
                    buttons.button_lock_unlock_order.highlight(false);
                    buttons.button_lock_unlock_order.$el.html('<i class="fa fa-unlock" /> Lock Order')
                }
            }
        },
        active_button_global_discount: function (buttons, selected_order) {
            if (buttons.button_global_discount) {
                if (selected_order.selected_orderline && this.pos.config.discount_ids) {
                    buttons.button_global_discount.highlight(true);
                } else {
                    buttons.button_global_discount.highlight(false);
                }
            }
        },
        active_button_variants: function (buttons, selected_order) {
            if (buttons.button_add_variants) {
                if (selected_order.selected_orderline && this.pos.variant_by_product_tmpl_id[selected_order.selected_orderline.product.product_tmpl_id]) {
                    buttons.button_add_variants.highlight(true);
                } else {
                    buttons.button_add_variants.highlight(false);
                }
            }
        },
        active_medical_insurance: function (buttons, selected_order) {
            if (buttons.button_medical_insurance_screen) {
                if (selected_order.medical_insurance) {
                    buttons.button_medical_insurance_screen.highlight(true);
                } else {
                    buttons.button_medical_insurance_screen.highlight(false);
                }
            }
        },
        active_reprint_last_order: function (buttons, selected_order) {
            if (buttons.button_print_last_order) {
                if (this.pos.posbox_report_xml && this.pos.report_xml) {
                    buttons.button_print_last_order.highlight(true);

                } else {
                    buttons.button_print_last_order.highlight(false);
                }
            }
        },
        active_button_cash_management: function (buttons) {
            if (buttons.button_cash_management) {
                buttons.button_cash_management.highlight(true);
            }
        },
        set_total_gift: function (total_gift) {
            $('.total_gift').html(total_gift);
        },
        set_amount_total: function (amount_total) {
            var amount_total = this.format_currency_no_symbol(amount_total);
            $('.amount_total').html(amount_total);
        },
        set_total_items: function (count) {
            $('.set_total_items').html(count);
        },
        update_summary: function () {
            this._super();
            var self = this;
            $('.mode-button').click(function () {
                self.change_mode();
            });
            var selected_order = this.pos.get_order();
            var buttons = this.getParent().action_buttons;
            if (selected_order && buttons) {
                this.active_button_cash_management(buttons);
                this.active_reprint_last_order(buttons, selected_order);
                this.active_medical_insurance(buttons, selected_order);
                this.active_button_combo(buttons, selected_order);
                this.active_button_combo_item_add_lot(buttons, selected_order);
                this.active_internal_transfer_button(buttons, selected_order);
                this.active_button_variants(buttons, selected_order);
                this.active_button_create_purchase_order(buttons, selected_order);
                this.active_button_change_unit(buttons, selected_order);
                this.active_button_set_tags(buttons, selected_order);
                this.active_lock_unlock_order(buttons, selected_order);
                this.active_button_global_discount(buttons, selected_order);
                try { // try catch because may be customer not installed pos_restaurant
                    var changes = selected_order.hasChangesToPrint();
                    if (buttons && buttons.button_kitchen_receipt_screen) {
                        buttons.button_kitchen_receipt_screen.highlight(changes);
                    }
                } catch (e) {

                }
                var $signature = $('.signature');
                if ($signature) {
                    $signature.attr('src', selected_order.get_signature());
                }
                var $note = this.el.querySelector('.order-note');
                if ($note) {
                    $note.textContent = selected_order.get_note();
                }
                if (selected_order.selected_orderline) {
                    var check = selected_order.selected_orderline.is_multi_variant();
                    var buttons = this.getParent().action_buttons;
                    if (buttons && buttons.button_add_variants) {
                        buttons.button_add_variants.highlight(check);
                    }
                    var has_variants = selected_order.selected_orderline.has_variants();
                    if (buttons && buttons.button_remove_variants) {
                        buttons.button_remove_variants.highlight(has_variants);
                    }
                }
                /*
                    Header order list
                */
                this.set_total_items(selected_order.orderlines.length);
                this.set_amount_total(selected_order.get_total_with_tax());
                var promotion_lines = _.filter(selected_order.orderlines.models, function (line) {
                    return line.promotion;
                });
                if (promotion_lines.length > 0) {
                    this.set_total_gift(promotion_lines.length)
                }
            }
        }
    });
});