/**
 * Cấu trúc Bootstrap
 * Template transition
 * Template Dropdown
 * Template Tab
 * Template Collapse
 * Template Modal
 * Template Tooltip
 * Template Popover
 * Template Carousel
 * Template Alert
 * Template Button
 * Template Affix
 * Template Scrollspy
 * -- More
 * Template Datepicker
 * Template Switch
 * Template Valid
 * Template Growl
 * Template Arrow
 * Template Max Length
***/

if (typeof jQuery === 'undefined') { throw new Error('Bootstrap\'s JavaScript requires jQuery') }

/**
 * Template Transition
***/
+ function ($) {
   'use strict';

   // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
   // ============================================================

   function transitionEnd() {
      var el = document.createElement('bootstrap')

      var transEndEventNames = {
         WebkitTransition: 'webkitTransitionEnd',
         MozTransition: 'transitionend',
         OTransition: 'oTransitionEnd otransitionend',
         transition: 'transitionend'
      }

      for (var name in transEndEventNames) {
         if (el.style[name] !== undefined) {
            return {
               end: transEndEventNames[name]
            }
         }
      }

      return false // explicit for ie8 (  ._.)
   }

   // http://blog.alexmaccaw.com/css-transitions
   $.fn.emulateTransitionEnd = function (duration) {
      var called = false
      var $el = this
      $(this).one('bsTransitionEnd', function () {
         called = true
      })
      var callback = function () {
         if (!called) $($el).trigger($.support.transition.end)
      }
      setTimeout(callback, duration)
      return this
   }

   $(function () {
      $.support.transition = transitionEnd()

      if (!$.support.transition) return

      $.event.special.bsTransitionEnd = {
         bindType: $.support.transition.end,
         delegateType: $.support.transition.end,
         handle: function (e) {
            if ($(e.target).is(this)) return e.handleObj.handler.apply(this, arguments)
         }
      }
   })

}(jQuery);
/********************************* End Template Transition */

/**
 * Template Dropdown
***/
+ function ($) {
   "use strict";

   // DROPDOWN CLASS DEFINITION
   // =========================

   var backdrop = '.dropdown-backdrop'
   var hover = '[data-hover=dropdown]'
   var toggle = '[data-toggle=dropdown]'
   var Dropdown = function (element) {
      var $el = $(element).on('click.bs.dropdown', this.toggle)
   }

   Dropdown.prototype.toggle = function (e) {
      var $this = $(this)
      // Nếu như có .disabled thì dừng lại
      if ($this.is('.disabled, :disabled')) return

      if (e.type == 'mouseenter' || e.type == 'mouseleave')
         var $this = $this;
      else
         var $this = getParent($this)

      var isActive = $this.hasClass('open')

      clearMenus()

      if (!isActive) {
         $this.trigger(e = $.Event('show.bs.dropdown'))

         if (e.isDefaultPrevented()) return

         $this
            .toggleClass('open')
            .trigger('shown.bs.dropdown')
      } else {
         $this
            .removeClass('open')
            .trigger('shown.bs.dropdown')
      }

      return false
   }

   function clearMenus() {

      $(backdrop).remove()

      $(toggle).each(function (e) {
         var $parent = getParent($(this))
         if (!$parent.hasClass('open')) return
         $parent.trigger(e = $.Event('hide.bs.dropdown'))
         if (e.isDefaultPrevented()) return
         $parent.removeClass('open').trigger('hidden.bs.dropdown')
      })
   }

   function getParent($this) {
      var selector = $this.attr('data-target')

      if (!selector) {
         selector = $this.attr('href')
         selector = selector && /#/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
      }

      var $parent = selector && $(selector)

      return $parent && $parent.length ? $parent : $this.parent()
   }


   // DROPDOWN PLUGIN DEFINITION
   // ==========================

   var old = $.fn.dropdown

   $.fn.dropdown = function (option) {
      return this.each(function () {
         var $this = $(this)
         var data = $this.data('dropdown')

         if (!data) $this.data('dropdown', (data = new Dropdown(this)))
         if (typeof option == 'string') data[option].call($this)
      })
   }

   $.fn.dropdown.Constructor = Dropdown


   // DROPDOWN NO CONFLICT
   // ====================

   $.fn.dropdown.noConflict = function () {
      $.fn.dropdown = old
      return this
   }


   // APPLY TO STANDARD DROPDOWN ELEMENTS
   // ===================================

   $(document)
      .on('click.bs.dropdown.data-api', '.dropdown, .dropdown form', function (e) {
         e.stopPropagation()
      })
      .on('mouseenter mouseleave', hover, Dropdown.prototype.toggle)
      .on('click.bs.dropdown.data-api', toggle, Dropdown.prototype.toggle)
      .on('click.bs.dropdown.data-api', clearMenus)

}(window.jQuery);
/********************************* End Template Dropdown */

/**
 * Template Tab
***/
+ function ($) {
   'use strict';

   // TAB CLASS DEFINITION
   // ====================

   var Tab = function (element) {
      this.element = $(element)
   }

   Tab.VERSION = '3.2.0'

   Tab.prototype.show = function () {
      var $this = this.element
      var $ul = $this.closest('ul:not(.dropdown-menu)')
      var selector = $this.data('target')

      if (!selector) {
         selector = $this.attr('href')
         selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
      }

      if ($this.parent('li').hasClass('active')) return

      var previous = $ul.find('.active:last a')[0]
      var e = $.Event('show.bs.tab', {
         relatedTarget: previous
      })

      $this.trigger(e)

      if (e.isDefaultPrevented()) return

      var $target = $(selector)

      this.activate($this.closest('li'), $ul)
      this.activate($target, $target.parent(), function () {
         $this.trigger({
            type: 'shown.bs.tab',
            relatedTarget: previous
         })
      })
   }

   Tab.prototype.activate = function (element, container, callback) {
      var $active = container.find('> .active')
      var transition = callback && $.support.transition && $active.hasClass('fade')

      function next() {
         $active
            .removeClass('active')
            .find('> .dropdown-menu > .active')
            .removeClass('active')

         element.addClass('active')

         if (transition) {
            element[0].offsetWidth // reflow for transition
            element.addClass('in')
         } else {
            element.removeClass('fade')
         }

         if (element.parent('.dropdown-menu')) {
            element.closest('li.dropdown').addClass('active')
         }

         callback && callback()
      }

      transition ?
         $active
         .one('bsTransitionEnd', next)
         .emulateTransitionEnd(150) :
         next()

      $active.removeClass('in')
   }


   // TAB PLUGIN DEFINITION
   // =====================

   function Plugin(option) {
      return this.each(function () {
         var $this = $(this)
         var data = $this.data('bs.tab')

         if (!data) $this.data('bs.tab', (data = new Tab(this)))
         if (typeof option == 'string') data[option]()
      })
   }

   var old = $.fn.tab

   $.fn.tab = Plugin
   $.fn.tab.Constructor = Tab


   // TAB NO CONFLICT
   // ===============

   $.fn.tab.noConflict = function () {
      $.fn.tab = old
      return this
   }


   // TAB DATA-API
   // ============

   $(document).on('click.bs.tab.data-api', '[data-toggle="tab"], [data-toggle="pill"]', function (e) {
      e.preventDefault()
      Plugin.call($(this), 'show')
   })

}(jQuery);
/********************************* End Template Tab */

/**
 * Template Collapse
***/
+ function ($) {
   'use strict';

   // COLLAPSE PUBLIC CLASS DEFINITION
   // ================================

   var Collapse = function (element, options) {
      this.$element = $(element)
      this.options = $.extend({}, Collapse.DEFAULTS, options)
      this.transitioning = null

      if (this.options.parent) this.$parent = $(this.options.parent)
      if (this.options.toggle) this.toggle()
   }

   Collapse.VERSION = '3.2.0'

   Collapse.DEFAULTS = {
      toggle: true
   }

   Collapse.prototype.dimension = function () {
      var hasWidth = this.$element.hasClass('width')
      return hasWidth ? 'width' : 'height'
   }

   Collapse.prototype.show = function () {
      if (this.transitioning || this.$element.hasClass('in')) return

      var startEvent = $.Event('show.bs.collapse')
      this.$element.trigger(startEvent)
      if (startEvent.isDefaultPrevented()) return

      var actives = this.$parent && this.$parent.find('> .panel > .in')

      if (actives && actives.length) {
         var hasData = actives.data('bs.collapse')
         if (hasData && hasData.transitioning) return
         Plugin.call(actives, 'hide')
         hasData || actives.data('bs.collapse', null)
      }

      var dimension = this.dimension()

      this.$element
         .removeClass('collapse')
         .addClass('collapsing')[dimension](0)

      this.transitioning = 1

      var complete = function () {
         this.$element
            .removeClass('collapsing')
            .addClass('collapse in')[dimension]('')
         this.transitioning = 0
         this.$element
            .trigger('shown.bs.collapse')
      }

      if (!$.support.transition) return complete.call(this)

      var scrollSize = $.camelCase(['scroll', dimension].join('-'))

      this.$element
         .one('bsTransitionEnd', $.proxy(complete, this))
         .emulateTransitionEnd(350)[dimension](this.$element[0][scrollSize])
   }

   Collapse.prototype.hide = function () {
      if (this.transitioning || !this.$element.hasClass('in')) return

      var startEvent = $.Event('hide.bs.collapse')
      this.$element.trigger(startEvent)
      if (startEvent.isDefaultPrevented()) return

      var dimension = this.dimension()

      this.$element[dimension](this.$element[dimension]())[0].offsetHeight

      this.$element
         .addClass('collapsing')
         .removeClass('collapse')
         .removeClass('in')

      this.transitioning = 1

      var complete = function () {
         this.transitioning = 0
         this.$element
            .trigger('hidden.bs.collapse')
            .removeClass('collapsing')
            .addClass('collapse')
      }

      if (!$.support.transition) return complete.call(this)

      this.$element[dimension](0)
         .one('bsTransitionEnd', $.proxy(complete, this))
         .emulateTransitionEnd(350)
   }

   Collapse.prototype.toggle = function () {
      this[this.$element.hasClass('in') ? 'hide' : 'show']()
   }


   // COLLAPSE PLUGIN DEFINITION
   // ==========================

   function Plugin(option) {
      return this.each(function () {
         var $this = $(this)
         var data = $this.data('bs.collapse')
         var options = $.extend({}, Collapse.DEFAULTS, $this.data(), typeof option == 'object' && option)

         if (!data && options.toggle && option == 'show') option = !option
         if (!data) $this.data('bs.collapse', (data = new Collapse(this, options)))
         if (typeof option == 'string') data[option]()
      })
   }

   var old = $.fn.collapse

   $.fn.collapse = Plugin
   $.fn.collapse.Constructor = Collapse


   // COLLAPSE NO CONFLICT
   // ====================

   $.fn.collapse.noConflict = function () {
      $.fn.collapse = old
      return this
   }


   // COLLAPSE DATA-API
   // =================

   $(document).on('click.bs.collapse.data-api', '[data-toggle="collapse"]', function (e) {
      var href
      var $this = $(this)
      var target = $this.attr('data-target') || e.preventDefault() || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') // strip for ie7
      var $target = $(target)
      var data = $target.data('bs.collapse')
      var option = data ? 'toggle' : $this.data()
      var parent = $this.attr('data-parent')
      var $parent = parent && $(parent)

      if (!data || !data.transitioning) {
         if ($parent) $parent.find('[data-toggle="collapse"][data-parent="' + parent + '"]').not($this).addClass('collapsed')
         $this[$target.hasClass('in') ? 'addClass' : 'removeClass']('collapsed')
      }

      Plugin.call($target, option)
   })

}(jQuery);
/********************************* End Template Collapse */

/**
 * Template Modal
 * Add more md-effect delay 300ms on prototype.hide
 * .appendTo(this.$body) => .appendTo(this.$element.parent())
***/
+ function ($) {
   'use strict';

   // MODAL CLASS DEFINITION
   // ======================

   var Modal = function (element, options) {
      this.options = options
      this.$body = $(document.body)
      this.$element = $(element)
      this.$backdrop =
         this.isShown = null
      this.scrollbarWidth = 0

      if (this.options.remote) {
         this.$element
            .find('.modal-content')
            .load(this.options.remote, $.proxy(function () {
               this.$element.trigger('loaded.bs.modal')
            }, this))
      }
   }

   Modal.VERSION = '3.2.0'

   Modal.DEFAULTS = {
      backdrop: true,
      keyboard: true,
      show: true
   }

   Modal.prototype.toggle = function (_relatedTarget) {
      return this.isShown ? this.hide() : this.show(_relatedTarget)
   }

   Modal.prototype.show = function (_relatedTarget) {
      var that = this
      var e = $.Event('show.bs.modal', {
         relatedTarget: _relatedTarget
      })

      this.$element.trigger(e)

      if (this.isShown || e.isDefaultPrevented()) return

      this.isShown = true

      this.checkScrollbar()
      this.$body.addClass('modal-open')

      this.setScrollbar()
      this.escape()

      this.$element.on('click.dismiss.bs.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this))

      this.backdrop(function () {
         var transition = $.support.transition && that.$element.hasClass('fade')

         if (!that.$element.parent().length) {
            that.$element.appendTo(that.$body) // don't move modals dom position
         }

         that.$element
            .show()
            .scrollTop(0)

         if (transition) {
            that.$element[0].offsetWidth // force reflow
         }

         that.$element
            .addClass('in')
            .attr('aria-hidden', false)

         that.enforceFocus()

         var e = $.Event('shown.bs.modal', {
            relatedTarget: _relatedTarget
         })

         transition ?
            that.$element.find('.modal-dialog') // wait for modal to slide in
            .one('bsTransitionEnd', function () {
               that.$element.trigger('focus').trigger(e)
            })
            .emulateTransitionEnd(300) :
            that.$element.trigger('focus').trigger(e)
      })
   }

   Modal.prototype.hide = function (e) {
      if (e) e.preventDefault()

      e = $.Event('hide.bs.modal')

      this.$element.trigger(e)

      if (!this.isShown || e.isDefaultPrevented()) return

      this.isShown = false

      this.$body.removeClass('modal-open')

      this.resetScrollbar()
      this.escape()

      $(document).off('focusin.bs.modal')

      this.$element
         .removeClass('in')
         .attr('aria-hidden', true)
         .off('click.dismiss.bs.modal')

      $.support.transition && (this.$element.hasClass('fade') || this.$element.hasClass('md-effect')) ?
         this.$element
         .one('bsTransitionEnd', $.proxy(this.hideModal, this))
         .emulateTransitionEnd(300) :
         this.hideModal()
   }

   Modal.prototype.enforceFocus = function () {
      $(document)
         .off('focusin.bs.modal') // guard against infinite focus loop
         .on('focusin.bs.modal', $.proxy(function (e) {
            if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
               this.$element.trigger('focus')
            }
         }, this))
   }

   Modal.prototype.escape = function () {
      if (this.isShown && this.options.keyboard) {
         this.$element.on('keyup.dismiss.bs.modal', $.proxy(function (e) {
            e.which == 27 && this.hide()
         }, this))
      } else if (!this.isShown) {
         this.$element.off('keyup.dismiss.bs.modal')
      }
   }

   Modal.prototype.hideModal = function () {
      var that = this
      this.$element.hide()
      this.backdrop(function () {
         that.$element.trigger('hidden.bs.modal')
      })
   }

   Modal.prototype.removeBackdrop = function () {
      this.$backdrop && this.$backdrop.remove()
      this.$backdrop = null
   }

   Modal.prototype.backdrop = function (callback) {
      var that = this
      var animate = this.$element.hasClass('fade') ? 'fade' : ''

      if (this.isShown && this.options.backdrop) {
         var doAnimate = $.support.transition && animate

         this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
            /* .appendTo(this.$body) */
            .appendTo(this.$element.parent())

         this.$element.on('click.dismiss.bs.modal', $.proxy(function (e) {
            if (e.target !== e.currentTarget) return
            this.options.backdrop == 'static' ? this.$element[0].focus.call(this.$element[0]) : this.hide.call(this)
         }, this))

         if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

         this.$backdrop.addClass('in')

         if (!callback) return

         doAnimate ?
            this.$backdrop
            .one('bsTransitionEnd', callback)
            .emulateTransitionEnd(150) :
            callback()

      } else if (!this.isShown && this.$backdrop) {
         this.$backdrop.removeClass('in')

         var callbackRemove = function () {
            that.removeBackdrop()
            callback && callback()
         }
         $.support.transition && this.$element.hasClass('fade') ?
            this.$backdrop
            .one('bsTransitionEnd', callbackRemove)
            .emulateTransitionEnd(150) :
            callbackRemove()

      } else if (callback) {
         callback()
      }
   }

   Modal.prototype.checkScrollbar = function () {
      if (document.body.clientWidth >= window.innerWidth) return
      this.scrollbarWidth = this.scrollbarWidth || this.measureScrollbar()
   }

   Modal.prototype.setScrollbar = function () {
      var bodyPad = parseInt((this.$body.css('padding-right') || 0), 10)
      if (this.scrollbarWidth) this.$body.css('padding-right', bodyPad + this.scrollbarWidth)
   }

   Modal.prototype.resetScrollbar = function () {
      this.$body.css('padding-right', '')
   }

   Modal.prototype.measureScrollbar = function () { // thx walsh
      var scrollDiv = document.createElement('div')
      scrollDiv.className = 'modal-scrollbar-measure'
      this.$body.append(scrollDiv)
      var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth
      this.$body[0].removeChild(scrollDiv)
      return scrollbarWidth
   }


   // MODAL PLUGIN DEFINITION
   // =======================

   function Plugin(option, _relatedTarget) {
      return this.each(function () {
         var $this = $(this)
         var data = $this.data('bs.modal')
         var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option)

         if (!data) $this.data('bs.modal', (data = new Modal(this, options)))
         if (typeof option == 'string') data[option](_relatedTarget)
         else if (options.show) data.show(_relatedTarget)
      })
   }

   var old = $.fn.modal

   $.fn.modal = Plugin
   $.fn.modal.Constructor = Modal


   // MODAL NO CONFLICT
   // =================

   $.fn.modal.noConflict = function () {
      $.fn.modal = old
      return this
   }


   // MODAL DATA-API
   // ==============

   $(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function (e) {
      var $this = $(this)
      var href = $this.attr('href')
      var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) // strip for ie7
      var option = $target.data('bs.modal') ? 'toggle' : $.extend({
         remote: !/#/.test(href) && href
      }, $target.data(), $this.data())

      if ($this.is('a')) e.preventDefault()

      $target.one('show.bs.modal', function (showEvent) {
         if (showEvent.isDefaultPrevented()) return // only register focus restorer if modal will actually get shown
         $target.one('hidden.bs.modal', function () {
            $this.is(':visible') && $this.trigger('focus')
         })
      })
      Plugin.call($target, option, this)
   })

}(jQuery);
/********************************* End Template Modal */

/**
 * Template Tooltip
***/
+ function ($) {
   'use strict';

   // TOOLTIP PUBLIC CLASS DEFINITION
   // ===============================

   var Tooltip = function (element, options) {
      this.type =
         this.options =
         this.enabled =
         this.timeout =
         this.hoverState =
         this.$element = null

      this.init('tooltip', element, options)
   }

   Tooltip.VERSION = '3.2.0'

   Tooltip.DEFAULTS = {
      animation: true,
      placement: 'top',
      selector: false,
      template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
      trigger: 'hover focus',
      title: '',
      delay: 0,
      html: false,
      container: false,
      viewport: {
         selector: 'body',
         padding: 0
      }
   }

   Tooltip.prototype.init = function (type, element, options) {
      this.enabled = true
      this.type = type
      this.$element = $(element)
      this.options = this.getOptions(options)
      this.$viewport = this.options.viewport && $(this.options.viewport.selector || this.options.viewport)

      var triggers = this.options.trigger.split(' ')

      for (var i = triggers.length; i--;) {
         var trigger = triggers[i]

         if (trigger == 'click') {
            this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
         } else if (trigger != 'manual') {
            var eventIn = trigger == 'hover' ? 'mouseenter' : 'focusin'
            var eventOut = trigger == 'hover' ? 'mouseleave' : 'focusout'

            this.$element.on(eventIn + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
            this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
         }
      }

      this.options.selector ?
         (this._options = $.extend({}, this.options, {
            trigger: 'manual',
            selector: ''
         })) :
         this.fixTitle()
   }

   Tooltip.prototype.getDefaults = function () {
      return Tooltip.DEFAULTS
   }

   Tooltip.prototype.getOptions = function (options) {
      options = $.extend({}, this.getDefaults(), this.$element.data(), options)

      if (options.delay && typeof options.delay == 'number') {
         options.delay = {
            show: options.delay,
            hide: options.delay
         }
      }

      return options
   }

   Tooltip.prototype.getDelegateOptions = function () {
      var options = {}
      var defaults = this.getDefaults()

      this._options && $.each(this._options, function (key, value) {
         if (defaults[key] != value) options[key] = value
      })

      return options
   }

   Tooltip.prototype.enter = function (obj) {
      var self = obj instanceof this.constructor ?
         obj : $(obj.currentTarget).data('bs.' + this.type)

      if (!self) {
         self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
         $(obj.currentTarget).data('bs.' + this.type, self)
      }

      clearTimeout(self.timeout)

      self.hoverState = 'in'

      if (!self.options.delay || !self.options.delay.show) return self.show()

      self.timeout = setTimeout(function () {
         if (self.hoverState == 'in') self.show()
      }, self.options.delay.show)
   }

   Tooltip.prototype.leave = function (obj) {
      var self = obj instanceof this.constructor ?
         obj : $(obj.currentTarget).data('bs.' + this.type)

      if (!self) {
         self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
         $(obj.currentTarget).data('bs.' + this.type, self)
      }

      clearTimeout(self.timeout)

      self.hoverState = 'out'

      if (!self.options.delay || !self.options.delay.hide) return self.hide()

      self.timeout = setTimeout(function () {
         if (self.hoverState == 'out') self.hide()
      }, self.options.delay.hide)
   }

   Tooltip.prototype.show = function () {
      var e = $.Event('show.bs.' + this.type)

      if (this.hasContent() && this.enabled) {
         this.$element.trigger(e)

         var inDom = $.contains(document.documentElement, this.$element[0])
         if (e.isDefaultPrevented() || !inDom) return
         var that = this

         var $tip = this.tip()

         var tipId = this.getUID(this.type)

         this.setContent()
         $tip.attr('id', tipId)
         this.$element.attr('aria-describedby', tipId)

         if (this.options.animation) $tip.addClass('fade')

         var placement = typeof this.options.placement == 'function' ?
            this.options.placement.call(this, $tip[0], this.$element[0]) :
            this.options.placement

         var autoToken = /\s?auto?\s?/i
         var autoPlace = autoToken.test(placement)
         if (autoPlace) placement = placement.replace(autoToken, '') || 'top'

         $tip
            .detach()
            .css({
               top: 0,
               left: 0,
               display: 'block'
            })
            .addClass(placement)
            .data('bs.' + this.type, this)

         this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)

         var pos = this.getPosition()
         var actualWidth = $tip[0].offsetWidth
         var actualHeight = $tip[0].offsetHeight

         if (autoPlace) {
            var orgPlacement = placement
            var $parent = this.$element.parent()
            var parentDim = this.getPosition($parent)

            placement = placement == 'bottom' && pos.top + pos.height + actualHeight - parentDim.scroll > parentDim.height ? 'top' :
               placement == 'top' && pos.top - parentDim.scroll - actualHeight < 0 ? 'bottom' :
               placement == 'right' && pos.right + actualWidth > parentDim.width ? 'left' :
               placement == 'left' && pos.left - actualWidth < parentDim.left ? 'right' :
               placement

            $tip
               .removeClass(orgPlacement)
               .addClass(placement)
         }

         var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight)

         this.applyPlacement(calculatedOffset, placement)

         var complete = function () {
            that.$element.trigger('shown.bs.' + that.type)
            that.hoverState = null
         }

         $.support.transition && this.$tip.hasClass('fade') ?
            $tip
            .one('bsTransitionEnd', complete)
            .emulateTransitionEnd(150) :
            complete()
      }
   }

   Tooltip.prototype.applyPlacement = function (offset, placement) {
      var $tip = this.tip()
      var width = $tip[0].offsetWidth
      var height = $tip[0].offsetHeight

      // manually read margins because getBoundingClientRect includes difference
      var marginTop = parseInt($tip.css('margin-top'), 10)
      var marginLeft = parseInt($tip.css('margin-left'), 10)

      // we must check for NaN for ie 8/9
      if (isNaN(marginTop)) marginTop = 0
      if (isNaN(marginLeft)) marginLeft = 0

      offset.top = offset.top + marginTop
      offset.left = offset.left + marginLeft

      // $.fn.offset doesn't round pixel values
      // so we use setOffset directly with our own function B-0
      $.offset.setOffset($tip[0], $.extend({
         using: function (props) {
            $tip.css({
               top: Math.round(props.top),
               left: Math.round(props.left)
            })
         }
      }, offset), 0)

      $tip.addClass('in')

      // check to see if placing tip in new offset caused the tip to resize itself
      var actualWidth = $tip[0].offsetWidth
      var actualHeight = $tip[0].offsetHeight

      if (placement == 'top' && actualHeight != height) {
         offset.top = offset.top + height - actualHeight
      }

      var delta = this.getViewportAdjustedDelta(placement, offset, actualWidth, actualHeight)

      if (delta.left) offset.left += delta.left
      else offset.top += delta.top

      var arrowDelta = delta.left ? delta.left * 2 - width + actualWidth : delta.top * 2 - height + actualHeight
      var arrowPosition = delta.left ? 'left' : 'top'
      var arrowOffsetPosition = delta.left ? 'offsetWidth' : 'offsetHeight'

      $tip.offset(offset)
      this.replaceArrow(arrowDelta, $tip[0][arrowOffsetPosition], arrowPosition)
   }

   Tooltip.prototype.replaceArrow = function (delta, dimension, position) {
      this.arrow().css(position, delta ? (50 * (1 - delta / dimension) + '%') : '')
   }

   Tooltip.prototype.setContent = function () {
      var $tip = this.tip()
      var title = this.getTitle()

      $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
      $tip.removeClass('fade in top bottom left right')
   }

   Tooltip.prototype.hide = function () {
      var that = this
      var $tip = this.tip()
      var e = $.Event('hide.bs.' + this.type)

      this.$element.removeAttr('aria-describedby')

      function complete() {
         if (that.hoverState != 'in') $tip.detach()
         that.$element.trigger('hidden.bs.' + that.type)
      }

      this.$element.trigger(e)

      if (e.isDefaultPrevented()) return

      $tip.removeClass('in')

      $.support.transition && this.$tip.hasClass('fade') ?
         $tip
         .one('bsTransitionEnd', complete)
         .emulateTransitionEnd(150) :
         complete()

      this.hoverState = null

      return this
   }

   Tooltip.prototype.fixTitle = function () {
      var $e = this.$element
      if ($e.attr('title') || typeof ($e.attr('data-original-title')) != 'string') {
         $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
      }
   }

   Tooltip.prototype.hasContent = function () {
      return this.getTitle()
   }

   Tooltip.prototype.getPosition = function ($element) {
      $element = $element || this.$element
      var el = $element[0]
      var isBody = el.tagName == 'BODY'
      return $.extend({}, (typeof el.getBoundingClientRect == 'function') ? el.getBoundingClientRect() : null, {
         scroll: isBody ? document.documentElement.scrollTop || document.body.scrollTop : $element.scrollTop(),
         width: isBody ? $(window).width() : $element.outerWidth(),
         height: isBody ? $(window).height() : $element.outerHeight()
      }, isBody ? {
         top: 0,
         left: 0
      } : $element.offset())
   }

   Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
      return placement == 'bottom' ? {
            top: pos.top + pos.height,
            left: pos.left + pos.width / 2 - actualWidth / 2
         } :
         placement == 'top' ? {
            top: pos.top - actualHeight,
            left: pos.left + pos.width / 2 - actualWidth / 2
         } :
         placement == 'left' ? {
            top: pos.top + pos.height / 2 - actualHeight / 2,
            left: pos.left - actualWidth
         } :
         /* placement == 'right' */
         {
            top: pos.top + pos.height / 2 - actualHeight / 2,
            left: pos.left + pos.width
         }

   }

   Tooltip.prototype.getViewportAdjustedDelta = function (placement, pos, actualWidth, actualHeight) {
      var delta = {
         top: 0,
         left: 0
      }
      if (!this.$viewport) return delta

      var viewportPadding = this.options.viewport && this.options.viewport.padding || 0
      var viewportDimensions = this.getPosition(this.$viewport)

      if (/right|left/.test(placement)) {
         var topEdgeOffset = pos.top - viewportPadding - viewportDimensions.scroll
         var bottomEdgeOffset = pos.top + viewportPadding - viewportDimensions.scroll + actualHeight
         if (topEdgeOffset < viewportDimensions.top) { // top overflow
            delta.top = viewportDimensions.top - topEdgeOffset
         } else if (bottomEdgeOffset > viewportDimensions.top + viewportDimensions.height) { // bottom overflow
            delta.top = viewportDimensions.top + viewportDimensions.height - bottomEdgeOffset
         }
      } else {
         var leftEdgeOffset = pos.left - viewportPadding
         var rightEdgeOffset = pos.left + viewportPadding + actualWidth
         if (leftEdgeOffset < viewportDimensions.left) { // left overflow
            delta.left = viewportDimensions.left - leftEdgeOffset
         } else if (rightEdgeOffset > viewportDimensions.width) { // right overflow
            delta.left = viewportDimensions.left + viewportDimensions.width - rightEdgeOffset
         }
      }

      return delta
   }

   Tooltip.prototype.getTitle = function () {
      var title
      var $e = this.$element
      var o = this.options

      title = $e.attr('data-original-title') || (typeof o.title == 'function' ? o.title.call($e[0]) : o.title)

      return title
   }

   Tooltip.prototype.getUID = function (prefix) {
      do prefix += ~~(Math.random() * 1000000)
      while (document.getElementById(prefix))
      return prefix
   }

   Tooltip.prototype.tip = function () {
      return (this.$tip = this.$tip || $(this.options.template))
   }

   Tooltip.prototype.arrow = function () {
      return (this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow'))
   }

   Tooltip.prototype.validate = function () {
      if (!this.$element[0].parentNode) {
         this.hide()
         this.$element = null
         this.options = null
      }
   }

   Tooltip.prototype.enable = function () {
      this.enabled = true
   }

   Tooltip.prototype.disable = function () {
      this.enabled = false
   }

   Tooltip.prototype.toggleEnabled = function () {
      this.enabled = !this.enabled
   }

   Tooltip.prototype.toggle = function (e) {
      var self = this
      if (e) {
         self = $(e.currentTarget).data('bs.' + this.type)
         if (!self) {
            self = new this.constructor(e.currentTarget, this.getDelegateOptions())
            $(e.currentTarget).data('bs.' + this.type, self)
         }
      }

      self.tip().hasClass('in') ? self.leave(self) : self.enter(self)
   }

   Tooltip.prototype.destroy = function () {
      clearTimeout(this.timeout)
      this.hide().$element.off('.' + this.type).removeData('bs.' + this.type)
   }


   // TOOLTIP PLUGIN DEFINITION
   // =========================

   function Plugin(option) {
      return this.each(function () {
         var $this = $(this)
         var data = $this.data('bs.tooltip')
         var options = typeof option == 'object' && option

         if (!data && option == 'destroy') return
         if (!data) $this.data('bs.tooltip', (data = new Tooltip(this, options)))
         if (typeof option == 'string') data[option]()
      })
   }

   var old = $.fn.tooltip

   $.fn.tooltip = Plugin
   $.fn.tooltip.Constructor = Tooltip


   // TOOLTIP NO CONFLICT
   // ===================

   $.fn.tooltip.noConflict = function () {
      $.fn.tooltip = old
      return this
   }

}(jQuery);
/********************************* End Template Tooltip */

/**
 * Template Popover
***/
+ function ($) {
   'use strict';

   // POPOVER PUBLIC CLASS DEFINITION
   // ===============================

   var Popover = function (element, options) {
      this.init('popover', element, options)
   }

   if (!$.fn.tooltip) throw new Error('Popover%20requires%20tooltip.html')

   Popover.VERSION = '3.2.0'

   Popover.DEFAULTS = $.extend({}, $.fn.tooltip.Constructor.DEFAULTS, {
      placement: 'right',
      trigger: 'click',
      content: '',
      template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
   })


   // NOTE: POPOVER EXTENDS tooltip.js
   // ================================

   Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype)

   Popover.prototype.constructor = Popover

   Popover.prototype.getDefaults = function () {
      return Popover.DEFAULTS
   }

   Popover.prototype.setContent = function () {
      var $tip = this.tip()
      var title = this.getTitle()
      var content = this.getContent()

      $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title)
      $tip.find('.popover-content').empty()[ // we use append for html objects to maintain js events
         this.options.html ? (typeof content == 'string' ? 'html' : 'append') : 'text'
      ](content)

      $tip.removeClass('fade top bottom left right in')

      // IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
      // this manually by checking the contents.
      if (!$tip.find('.popover-title').html()) $tip.find('.popover-title').hide()
   }

   Popover.prototype.hasContent = function () {
      return this.getTitle() || this.getContent()
   }

   Popover.prototype.getContent = function () {
      var $e = this.$element
      var o = this.options

      return $e.attr('data-content') || (typeof o.content == 'function' ?
         o.content.call($e[0]) :
         o.content)
   }

   Popover.prototype.arrow = function () {
      return (this.$arrow = this.$arrow || this.tip().find('.arrow'))
   }

   Popover.prototype.tip = function () {
      if (!this.$tip) this.$tip = $(this.options.template)
      return this.$tip
   }


   // POPOVER PLUGIN DEFINITION
   // =========================

   function Plugin(option) {
      return this.each(function () {
         var $this = $(this)
         var data = $this.data('bs.popover')
         var options = typeof option == 'object' && option

         if (!data && option == 'destroy') return
         if (!data) $this.data('bs.popover', (data = new Popover(this, options)))
         if (typeof option == 'string') data[option]()
      })
   }

   var old = $.fn.popover

   $.fn.popover = Plugin
   $.fn.popover.Constructor = Popover


   // POPOVER NO CONFLICT
   // ===================

   $.fn.popover.noConflict = function () {
      $.fn.popover = old
      return this
   }

}(jQuery);
/********************************* End Template Popover */

/**
 * Template Carousel
***/
+ function ($) {
   'use strict';

   // CAROUSEL CLASS DEFINITION
   // =========================

   var Carousel = function (element, options) {
      this.$element = $(element).on('keydown.bs.carousel', $.proxy(this.keydown, this))
      this.$indicators = this.$element.find('.carousel-indicators')
      this.options = options
      this.paused =
         this.sliding =
         this.interval =
         this.$active =
         this.$items = null

      this.options.pause == 'hover' && this.$element
         .on('mouseenter.bs.carousel', $.proxy(this.pause, this))
         .on('mouseleave.bs.carousel', $.proxy(this.cycle, this))
   }

   Carousel.VERSION = '3.2.0'

   Carousel.DEFAULTS = {
      interval: 5000,
      pause: 'hover',
      wrap: true
   }

   Carousel.prototype.keydown = function (e) {
      switch (e.which) {
         case 37:
            this.prev();
            break
         case 39:
            this.next();
            break
         default:
            return
      }

      e.preventDefault()
   }

   Carousel.prototype.cycle = function (e) {
      e || (this.paused = false)

      this.interval && clearInterval(this.interval)

      this.options.interval && !this.paused && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))

      return this
   }

   Carousel.prototype.getItemIndex = function (item) {
      this.$items = item.parent().children('.item')
      return this.$items.index(item || this.$active)
   }

   Carousel.prototype.to = function (pos) {
      var that = this
      var activeIndex = this.getItemIndex(this.$active = this.$element.find('.item.active'))

      if (pos > (this.$items.length - 1) || pos < 0) return

      if (this.sliding) return this.$element.one('slid.bs.carousel', function () {
            that.to(pos)
         }) // yes, "slid"
      if (activeIndex == pos) return this.pause().cycle()

      return this.slide(pos > activeIndex ? 'next' : 'prev', $(this.$items[pos]))
   }

   Carousel.prototype.pause = function (e) {
      e || (this.paused = true)

      if (this.$element.find('.next, .prev').length && $.support.transition) {
         this.$element.trigger($.support.transition.end)
         this.cycle(true)
      }

      this.interval = clearInterval(this.interval)

      return this
   }

   Carousel.prototype.next = function () {
      if (this.sliding) return
      return this.slide('next')
   }

   Carousel.prototype.prev = function () {
      if (this.sliding) return
      return this.slide('prev')
   }

   Carousel.prototype.slide = function (type, next) {
      var $active = this.$element.find('.item.active')
      var $next = next || $active[type]()
      var isCycling = this.interval
      var direction = type == 'next' ? 'left' : 'right'
      var fallback = type == 'next' ? 'first' : 'last'
      var that = this

      if (!$next.length) {
         if (!this.options.wrap) return
         $next = this.$element.find('.item')[fallback]()
      }

      if ($next.hasClass('active')) return (this.sliding = false)

      var relatedTarget = $next[0]
      var slideEvent = $.Event('slide.bs.carousel', {
         relatedTarget: relatedTarget,
         direction: direction
      })
      this.$element.trigger(slideEvent)
      if (slideEvent.isDefaultPrevented()) return

      this.sliding = true

      isCycling && this.pause()

      if (this.$indicators.length) {
         this.$indicators.find('.active').removeClass('active')
         /*
         this.$element.one('slid.bs.carousel', function () {
            var $nextIndicator = $(that.$indicators.children()[that.getActiveIndex()])
            $nextIndicator && $nextIndicator.addClass('active')
         })
         */
         var $nextIndicator = $(that.$indicators.children()[$next.index()])
         $nextIndicator && $nextIndicator.addClass('active')
      }

      var slidEvent = $.Event('slid.bs.carousel', {
            relatedTarget: relatedTarget,
            direction: direction
         }) // yes, "slid"
      if ($.support.transition && this.$element.hasClass('slide')) {
         $next.addClass(type)
         $next[0].offsetWidth // force reflow
         $active.addClass(direction)
         $next.addClass(direction)
         $active
            .one('bsTransitionEnd', function () {
               $next.removeClass([type, direction].join(' ')).addClass('active')
               $active.removeClass(['active', direction].join(' '))
               that.sliding = false
               setTimeout(function () {
                  that.$element.trigger(slidEvent)
               }, 0)
            })
            .emulateTransitionEnd($active.css('transition-duration').slice(0, -1) * 1000)
      } else {
         $active.removeClass('active')
         $next.addClass('active')
         this.sliding = false
         this.$element.trigger(slidEvent)
      }

      isCycling && this.cycle()

      return this
   }


   // CAROUSEL PLUGIN DEFINITION
   // ==========================

   function Plugin(option) {
      return this.each(function () {
         var $this = $(this)
         var data = $this.data('bs.carousel')
         var options = $.extend({}, Carousel.DEFAULTS, $this.data(), typeof option == 'object' && option)
         var action = typeof option == 'string' ? option : options.slide

         if (!data) $this.data('bs.carousel', (data = new Carousel(this, options)))
         if (typeof option == 'number') data.to(option)
         else if (action) data[action]()
         else if (options.interval) data.pause().cycle()
      })
   }

   var old = $.fn.carousel

   $.fn.carousel = Plugin
   $.fn.carousel.Constructor = Carousel


   // CAROUSEL NO CONFLICT
   // ====================

   $.fn.carousel.noConflict = function () {
      $.fn.carousel = old
      return this
   }


   // CAROUSEL DATA-API
   // =================

   $(document).on('click.bs.carousel.data-api', '[data-slide], [data-slide-to]', function (e) {
      var href
      var $this = $(this)
      var $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) // strip for ie7
      if (!$target.hasClass('carousel')) return
      var options = $.extend({}, $target.data(), $this.data())
      var slideIndex = $this.attr('data-slide-to')
      if (slideIndex) options.interval = false

      Plugin.call($target, options)

      if (slideIndex) {
         $target.data('bs.carousel').to(slideIndex)
      }

      e.preventDefault()
   })

   $(window).on('load', function () {
      $('[data-ride="carousel"]').each(function () {
         var $carousel = $(this)
         Plugin.call($carousel, $carousel.data())
      })
   })

}(jQuery);
/********************************* End Template Carousel */

/**
 * Template Alert
***/
+ function ($) {
   'use strict';

   // ALERT CLASS DEFINITION
   // ======================

   var dismiss = '[data-dismiss="alert"]'
   var Alert = function (el) {
      $(el).on('click', dismiss, this.close)
   }

   Alert.VERSION = '3.2.0'

   Alert.prototype.close = function (e) {
      var $this = $(this)
      var selector = $this.attr('data-target')

      if (!selector) {
         selector = $this.attr('href')
         selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
      }

      var $parent = $(selector)

      if (e) e.preventDefault()

      if (!$parent.length) {
         $parent = $this.hasClass('alert') ? $this : $this.parent()
      }

      $parent.trigger(e = $.Event('close.bs.alert'))

      if (e.isDefaultPrevented()) return

      $parent.removeClass('in')

      function removeElement() {
         // detach from parent, fire event then clean up data
         $parent.detach().trigger('closed.bs.alert').remove()
      }

      $.support.transition && $parent.hasClass('fade') ?
         $parent
         .one('bsTransitionEnd', removeElement)
         .emulateTransitionEnd(150) :
         removeElement()
   }


   // ALERT PLUGIN DEFINITION
   // =======================

   function Plugin(option) {
      return this.each(function () {
         var $this = $(this)
         var data = $this.data('bs.alert')

         if (!data) $this.data('bs.alert', (data = new Alert(this)))
         if (typeof option == 'string') data[option].call($this)
      })
   }

   var old = $.fn.alert

   $.fn.alert = Plugin
   $.fn.alert.Constructor = Alert


   // ALERT NO CONFLICT
   // =================

   $.fn.alert.noConflict = function () {
      $.fn.alert = old
      return this
   }


   // ALERT DATA-API
   // ==============

   $(document).on('click.bs.alert.data-api', dismiss, Alert.prototype.close)

}(jQuery);
/********************************* End Template Alert */

/**
 * Template Button
***/
+ function ($) {
   'use strict';

   // BUTTON PUBLIC CLASS DEFINITION
   // ==============================

   var Button = function (element, options) {
      this.$element = $(element)
      this.options = $.extend({}, Button.DEFAULTS, options)
      this.isLoading = false
   }

   Button.VERSION = '3.2.0'

   Button.DEFAULTS = {
      loadingText: 'loading...'
   }

   Button.prototype.setState = function (state) {
      var d = 'disabled'
      var $el = this.$element
      var val = $el.is('input') ? 'val' : 'html'
      var data = $el.data()

      state = state + 'Text'

      if (data.resetText == null) $el.data('resetText', $el[val]())

      $el[val](data[state] == null ? this.options[state] : data[state])

      // push to event loop to allow forms to submit
      setTimeout($.proxy(function () {
         if (state == 'loadingText') {
            this.isLoading = true
            $el.addClass(d).attr(d, d)
         } else if (this.isLoading) {
            this.isLoading = false
            $el.removeClass(d).removeAttr(d)
         }
      }, this), 0)
   }

   Button.prototype.toggle = function () {
      var changed = true
      var $parent = this.$element.closest('[data-toggle="buttons"]')

      if ($parent.length) {
         var $input = this.$element.find('input')
         if ($input.prop('type') == 'radio') {
            if ($input.prop('checked') && this.$element.hasClass('active')) changed = false
            else $parent.find('.active').removeClass('active')
         }
         if (changed) $input.prop('checked', !this.$element.hasClass('active')).trigger('change')
      }

      if (changed) this.$element.toggleClass('active')
   }


   // BUTTON PLUGIN DEFINITION
   // ========================

   function Plugin(option) {
      return this.each(function () {
         var $this = $(this)
         var data = $this.data('bs.button')
         var options = typeof option == 'object' && option

         if (!data) $this.data('bs.button', (data = new Button(this, options)))

         if (option == 'toggle') data.toggle()
         else if (option) data.setState(option)
      })
   }

   var old = $.fn.button

   $.fn.button = Plugin
   $.fn.button.Constructor = Button


   // BUTTON NO CONFLICT
   // ==================

   $.fn.button.noConflict = function () {
      $.fn.button = old
      return this
   }


   // BUTTON DATA-API
   // ===============

   $(document).on('click.bs.button.data-api', '[data-toggle^="button"]', function (e) {
      var $btn = $(e.target)
      if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn')
      Plugin.call($btn, 'toggle')
      e.preventDefault()
   })

}(jQuery);
/********************************* End Template Button */

/**
 * Template Affix
***/
+ function ($) {
   'use strict';

   // AFFIX CLASS DEFINITION
   // ======================

   var Affix = function (element, options) {
      this.options = $.extend({}, Affix.DEFAULTS, options)

      this.$target = $(this.options.target)
         .on('scroll.bs.affix.data-api', $.proxy(this.checkPosition, this))
         .on('click.bs.affix.data-api', $.proxy(this.checkPositionWithEventLoop, this))

      this.$element = $(element)
      this.affixed =
         this.unpin =
         this.pinnedOffset = null

      this.checkPosition()
   }

   Affix.VERSION = '3.2.0'

   Affix.RESET = 'affix affix-top affix-bottom'

   Affix.DEFAULTS = {
      offset: 0,
      target: window
   }

   Affix.prototype.getPinnedOffset = function () {
      if (this.pinnedOffset) return this.pinnedOffset
      this.$element.removeClass(Affix.RESET).addClass('affix')
      var scrollTop = this.$target.scrollTop()
      var position = this.$element.offset()
      return (this.pinnedOffset = position.top - scrollTop)
   }

   Affix.prototype.checkPositionWithEventLoop = function () {
      setTimeout($.proxy(this.checkPosition, this), 1)
   }

   Affix.prototype.checkPosition = function () {
      if (!this.$element.is(':visible')) return

      var scrollHeight = $(document).height()
      var scrollTop = this.$target.scrollTop()
      var position = this.$element.offset()
      var offset = this.options.offset
      var offsetTop = offset.top
      var offsetBottom = offset.bottom

      if (typeof offset != 'object') offsetBottom = offsetTop = offset
      if (typeof offsetTop == 'function') offsetTop = offset.top(this.$element)
      if (typeof offsetBottom == 'function') offsetBottom = offset.bottom(this.$element)

      var affix = this.unpin != null && (scrollTop + this.unpin <= position.top) ? false :
         offsetBottom != null && (position.top + this.$element.height() >= scrollHeight - offsetBottom) ? 'bottom' :
         offsetTop != null && (scrollTop <= offsetTop) ? 'top' : false

      if (this.affixed === affix) return
      if (this.unpin != null) this.$element.css('top', '')

      var affixType = 'affix' + (affix ? '-' + affix : '')
      var e = $.Event(affixType + '.bs.affix')

      this.$element.trigger(e)

      if (e.isDefaultPrevented()) return

      this.affixed = affix
      this.unpin = affix == 'bottom' ? this.getPinnedOffset() : null

      this.$element
         .removeClass(Affix.RESET)
         .addClass(affixType)
         .trigger($.Event(affixType.replace('affix', 'affixed')))

      if (affix == 'bottom') {
         this.$element.offset({
            top: scrollHeight - this.$element.height() - offsetBottom
         })
      }
   }


   // AFFIX PLUGIN DEFINITION
   // =======================

   function Plugin(option) {
      return this.each(function () {
         var $this = $(this)
         var data = $this.data('bs.affix')
         var options = typeof option == 'object' && option

         if (!data) $this.data('bs.affix', (data = new Affix(this, options)))
         if (typeof option == 'string') data[option]()
      })
   }

   var old = $.fn.affix

   $.fn.affix = Plugin
   $.fn.affix.Constructor = Affix


   // AFFIX NO CONFLICT
   // =================

   $.fn.affix.noConflict = function () {
      $.fn.affix = old
      return this
   }


   // AFFIX DATA-API
   // ==============

   $(window).on('load', function () {
      $('[data-spy="affix"]').each(function () {
         var $spy = $(this)
         var data = $spy.data()

         data.offset = data.offset || {}

         if (data.offsetBottom) data.offset.bottom = data.offsetBottom
         if (data.offsetTop) data.offset.top = data.offsetTop

         Plugin.call($spy, data)
      })
   })

}(jQuery);
/********************************* End Template Affix */

/**
 * Template Scrollspy
***/
+ function ($) {
   'use strict';

   // SCROLLSPY CLASS DEFINITION
   // ==========================

   function ScrollSpy(element, options) {
      var process = $.proxy(this.process, this)

      this.$body = $('body')
      this.$scrollElement = $(element).is('body') ? $(window) : $(element)
      this.options = $.extend({}, ScrollSpy.DEFAULTS, options)
      this.selector = (this.options.target || '') + ' .nav li > a'
      this.offsets = []
      this.targets = []
      this.activeTarget = null
      this.scrollHeight = 0

      this.$scrollElement.on('scroll.bs.scrollspy', process)
      this.refresh()
      this.process()
   }

   ScrollSpy.VERSION = '3.2.0'

   ScrollSpy.DEFAULTS = {
      offset: 10
   }

   ScrollSpy.prototype.getScrollHeight = function () {
      return this.$scrollElement[0].scrollHeight || Math.max(this.$body[0].scrollHeight, document.documentElement.scrollHeight)
   }

   ScrollSpy.prototype.refresh = function () {
      var offsetMethod = 'offset'
      var offsetBase = 0

      if (!$.isWindow(this.$scrollElement[0])) {
         offsetMethod = 'position'
         offsetBase = this.$scrollElement.scrollTop()
      }

      this.offsets = []
      this.targets = []
      this.scrollHeight = this.getScrollHeight()

      var self = this

      this.$body
         .find(this.selector)
         .map(function () {
            var $el = $(this)
            var href = $el.data('target') || $el.attr('href')
            var $href = /^#./.test(href) && $(href)

            return ($href && $href.length && $href.is(':visible') && [
               [$href[offsetMethod]().top + offsetBase, href]
            ]) || null
         })
         .sort(function (a, b) {
            return a[0] - b[0]
         })
         .each(function () {
            self.offsets.push(this[0])
            self.targets.push(this[1])
         })
   }

   ScrollSpy.prototype.process = function () {
      var scrollTop = this.$scrollElement.scrollTop() + this.options.offset
      var scrollHeight = this.getScrollHeight()
      var maxScroll = this.options.offset + scrollHeight - this.$scrollElement.height()
      var offsets = this.offsets
      var targets = this.targets
      var activeTarget = this.activeTarget
      var i

      if (this.scrollHeight != scrollHeight) {
         this.refresh()
      }

      if (scrollTop >= maxScroll) {
         return activeTarget != (i = targets[targets.length - 1]) && this.activate(i)
      }

      if (activeTarget && scrollTop <= offsets[0]) {
         return activeTarget != (i = targets[0]) && this.activate(i)
      }

      for (i = offsets.length; i--;) {
         activeTarget != targets[i] && scrollTop >= offsets[i] && (!offsets[i + 1] || scrollTop <= offsets[i + 1]) && this.activate(targets[i])
      }
   }

   ScrollSpy.prototype.activate = function (target) {
      this.activeTarget = target

      $(this.selector)
         .parentsUntil(this.options.target, '.active')
         .removeClass('active')

      var selector = this.selector +
         '[data-target="' + target + '"],' +
         this.selector + '[href="' + target + '"]'

      var active = $(selector)
         .parents('li')
         .addClass('active')

      if (active.parent('.dropdown-menu').length) {
         active = active
            .closest('li.dropdown')
            .addClass('active')
      }

      active.trigger('activate.bs.scrollspy')
   }


   // SCROLLSPY PLUGIN DEFINITION
   // ===========================

   function Plugin(option) {
      return this.each(function () {
         var $this = $(this)
         var data = $this.data('bs.scrollspy')
         var options = typeof option == 'object' && option

         if (!data) $this.data('bs.scrollspy', (data = new ScrollSpy(this, options)))
         if (typeof option == 'string') data[option]()
      })
   }

   var old = $.fn.scrollspy

   $.fn.scrollspy = Plugin
   $.fn.scrollspy.Constructor = ScrollSpy


   // SCROLLSPY NO CONFLICT
   // =====================

   $.fn.scrollspy.noConflict = function () {
      $.fn.scrollspy = old
      return this
   }


   // SCROLLSPY DATA-API
   // ==================

   $(window).on('load.bs.scrollspy.data-api', function () {
      $('[data-spy="scroll"]').each(function () {
         var $spy = $(this)
         Plugin.call($spy, $spy.data())
      })
   })

}(jQuery);
/********************************* End Template Scrollspy */

/**
 * Template Datepicker
***/
!function ($, moment) {

    var DateRangePicker = function (element, options, cb) {

        // by default, the daterangepicker element is placed at the bottom of HTML body
        this.parentEl = 'body';

        //element that triggered the date range picker
        this.element = $(element);

        //create the picker HTML object
        //create the picker HTML object
        var DRPTemplate = '<div class="daterangepicker">' +
                              '<div class="calendar left"></div>' +
                              '<div class="calendar right"></div>' +
                              '<div class="ranges"></div>' +
                              '<div class="clear"></div>' +
                              '<div class="range_inputs">' +
                                 '<div class="daterangepicker_start_input">' +
                                    '<label for="daterangepicker_start"></label>' +
                                    '<input class="input-mini" type="text" name="daterangepicker_start" value="" disabled="disabled" />' +
                                 '</div>' +
                                 '<div class="daterangepicker_end_input">' +
                                    '<label for="daterangepicker_end"></label>' +
                                    '<input class="input-mini" type="text" name="daterangepicker_end" value="" disabled="disabled" />' +
                                 '</div>' +
                                 '<button class="applyBtn" disabled="disabled"></button>&nbsp;' +
                                 '<button class="cancelBtn"></button>' +
                              '</div>' +
                           '</div>';

        //custom options
        if (typeof options !== 'object' || options === null)
            options = {};

        this.parentEl = (typeof options === 'object' && options.parentEl && $(options.parentEl).length) ? $(options.parentEl) : $(this.parentEl);
        this.container = $(DRPTemplate).appendTo(this.parentEl);

        this.setOptions(options, cb);

        //apply CSS classes and labels to buttons
        var c = this.container;
        $.each(this.buttonClasses, function (idx, val) {
            c.find('button').addClass(val);
        });
        this.container.find('.daterangepicker_start_input label').html(this.locale.fromLabel);
        this.container.find('.daterangepicker_end_input label').html(this.locale.toLabel);
        if (this.applyClass.length)
            this.container.find('.applyBtn').addClass(this.applyClass);
        if (this.cancelClass.length)
            this.container.find('.cancelBtn').addClass(this.cancelClass);
        this.container.find('.applyBtn').html(this.locale.applyLabel);
        this.container.find('.cancelBtn').html(this.locale.cancelLabel);

        //event listeners

        this.container.find('.calendar')
            .on('click.daterangepicker', '.prev', $.proxy(this.clickPrev, this))
            .on('click.daterangepicker', '.next', $.proxy(this.clickNext, this))
            .on('click.daterangepicker', 'td.available', $.proxy(this.clickDate, this))
            .on('mouseenter.daterangepicker', 'td.available', $.proxy(this.enterDate, this))
            .on('mouseleave.daterangepicker', 'td.available', $.proxy(this.updateFormInputs, this))
            .on('change.daterangepicker', 'select.yearselect', $.proxy(this.updateMonthYear, this))
            .on('change.daterangepicker', 'select.monthselect', $.proxy(this.updateMonthYear, this))
            .on('change.daterangepicker', 'select.hourselect,select.minuteselect,select.ampmselect', $.proxy(this.updateTime, this));

        this.container.find('.ranges')
            .on('click.daterangepicker', 'li', $.proxy(this.clickRange, this))
            .on('mouseenter.daterangepicker', 'li', $.proxy(this.enterRange, this))
            .on('mouseleave.daterangepicker', 'li', $.proxy(this.updateFormInputs, this));

         this.container.find('.range_inputs')
            .on('click.daterangepicker', 'button.applyBtn', $.proxy(this.clickApply, this))
            .on('click.daterangepicker', 'button.cancelBtn', $.proxy(this.clickCancel, this))
            .on('click.daterangepicker', '.daterangepicker_start_input,.daterangepicker_end_input', $.proxy(this.showCalendars, this));

        if (this.element.is('input')) {
            this.element.on({
                'click.daterangepicker': $.proxy(this.show, this),
                'focus.daterangepicker': $.proxy(this.show, this),
                'keyup.daterangepicker': $.proxy(this.updateFromControl, this)
            });
        } else {
            this.element.on('click.daterangepicker', $.proxy(this.toggle, this));
        }

    };

    DateRangePicker.prototype = {

        constructor: DateRangePicker,

        setOptions: function(options, callback) {

            this.startDate = moment().startOf('day');
            this.endDate = moment().endOf('day');
            this.minDate = false;
            this.maxDate = false;
            this.dateLimit = false;

            this.showDropdowns = false;
            this.showWeekNumbers = false;
            this.timePicker = false;
            this.timePickerIncrement = 30;
            this.timePicker12Hour = true;
            this.singleDatePicker = false;
            this.ranges = {};

            this.opens = 'right';
            if (this.element.hasClass('pull-right'))
                this.opens = 'left';

            this.buttonClasses = ['btn', 'btn-small'];
            this.applyClass = 'btn-success';
            this.cancelClass = 'btn-default';

            this.format = 'MM/DD/YYYY';
            this.separator = ' - ';

            this.locale = {
                applyLabel: 'Apply',
                cancelLabel: 'Cancel',
                fromLabel: 'From',
                toLabel: 'To',
                weekLabel: 'W',
                customRangeLabel: 'Custom Range',
                daysOfWeek: moment()._lang._weekdaysMin.slice(),
                monthNames: moment()._lang._monthsShort.slice(),
                firstDay: 0
            };

            this.cb = function () { };

            if (typeof options.format === 'string')
                this.format = options.format;

            if (typeof options.separator === 'string')
                this.separator = options.separator;

            if (typeof options.startDate === 'string')
                this.startDate = moment(options.startDate, this.format);

            if (typeof options.endDate === 'string')
                this.endDate = moment(options.endDate, this.format);

            if (typeof options.minDate === 'string')
                this.minDate = moment(options.minDate, this.format);

            if (typeof options.maxDate === 'string')
                this.maxDate = moment(options.maxDate, this.format);

            if (typeof options.startDate === 'object')
                this.startDate = moment(options.startDate);

            if (typeof options.endDate === 'object')
                this.endDate = moment(options.endDate);

            if (typeof options.minDate === 'object')
                this.minDate = moment(options.minDate);

            if (typeof options.maxDate === 'object')
                this.maxDate = moment(options.maxDate);

            if (typeof options.applyClass === 'string')
                this.applyClass = options.applyClass;

            if (typeof options.cancelClass === 'string')
                this.cancelClass = options.cancelClass;

            if (typeof options.dateLimit === 'object')
                this.dateLimit = options.dateLimit;

            // update day names order to firstDay
            if (typeof options.locale === 'object') {

                if (typeof options.locale.daysOfWeek === 'object') {
                    // Create a copy of daysOfWeek to avoid modification of original
                    // options object for reusability in multiple daterangepicker instances
                    this.locale.daysOfWeek = options.locale.daysOfWeek.slice();
                }

                if (typeof options.locale.monthNames === 'object') {
                  this.locale.monthNames = options.locale.monthNames.slice();
                }

                if (typeof options.locale.firstDay === 'number') {
                    this.locale.firstDay = options.locale.firstDay;
                    var iterator = options.locale.firstDay;
                    while (iterator > 0) {
                        this.locale.daysOfWeek.push(this.locale.daysOfWeek.shift());
                        iterator--;
                    }
                }

                if (typeof options.locale.applyLabel === 'string') {
                  this.locale.applyLabel = options.locale.applyLabel;
                }

                if (typeof options.locale.cancelLabel === 'string') {
                  this.locale.cancelLabel = options.locale.cancelLabel;
                }

                if (typeof options.locale.fromLabel === 'string') {
                  this.locale.fromLabel = options.locale.fromLabel;
                }

                if (typeof options.locale.toLabel === 'string') {
                  this.locale.toLabel = options.locale.toLabel;
                }

                if (typeof options.locale.weekLabel === 'string') {
                  this.locale.weekLabel = options.locale.weekLabel;
                }

                if (typeof options.locale.customRangeLabel === 'string') {
                  this.locale.customRangeLabel = options.locale.customRangeLabel;
                }
            }

            if (typeof options.opens === 'string')
                this.opens = options.opens;

            if (typeof options.showWeekNumbers === 'boolean') {
                this.showWeekNumbers = options.showWeekNumbers;
            }

            if (typeof options.buttonClasses === 'string') {
                this.buttonClasses = [options.buttonClasses];
            }

            if (typeof options.buttonClasses === 'object') {
                this.buttonClasses = options.buttonClasses;
            }

            if (typeof options.showDropdowns === 'boolean') {
                this.showDropdowns = options.showDropdowns;
            }

            if (typeof options.singleDatePicker === 'boolean') {
                this.singleDatePicker = options.singleDatePicker;
            }

            if (typeof options.timePicker === 'boolean') {
                this.timePicker = options.timePicker;
            }

            if (typeof options.timePickerIncrement === 'number') {
                this.timePickerIncrement = options.timePickerIncrement;
            }

            if (typeof options.timePicker12Hour === 'boolean') {
                this.timePicker12Hour = options.timePicker12Hour;
            }

            var start, end, range;

            //if no start/end dates set, check if an input element contains initial values
            if (typeof options.startDate === 'undefined' && typeof options.endDate === 'undefined') {
                if ($(this.element).is('input[type=text]')) {
                    var val = $(this.element).val();
                    var split = val.split(this.separator);
                    start = end = null;
                    if (split.length == 2) {
                        start = moment(split[0], this.format);
                        end = moment(split[1], this.format);
                    } else if (this.singleDatePicker) {
                        start = moment(val, this.format);
                        end = moment(val, this.format);
                    }
                    if (start !== null && end !== null) {
                        this.startDate = start;
                        this.endDate = end;
                    }
                }
            }


            if (typeof options.ranges === 'undefined') {
               this.container.find('.ranges').remove();
            }

            if (typeof options.ranges === 'object') {
                for (range in options.ranges) {

                    start = moment(options.ranges[range][0]);
                    end = moment(options.ranges[range][1]);

                    // If we have a min/max date set, bound this range
                    // to it, but only if it would otherwise fall
                    // outside of the min/max.
                    if (this.minDate && start.isBefore(this.minDate))
                        start = moment(this.minDate);

                    if (this.maxDate && end.isAfter(this.maxDate))
                        end = moment(this.maxDate);

                    // If the end of the range is before the minimum (if min is set) OR
                    // the start of the range is after the max (also if set) don't display this
                    // range option.
                    if ((this.minDate && end.isBefore(this.minDate)) || (this.maxDate && start.isAfter(this.maxDate))) {
                        continue;
                    }

                    this.ranges[range] = [start, end];
                }

                var list = '<ul>';
                for (range in this.ranges) {
                    list += '<li>' + range + '</li>';
                }
                list += '<li>' + this.locale.customRangeLabel + '</li>';
                list += '</ul>';
                this.container.find('.ranges ul').remove();
                this.container.find('.ranges').prepend(list);
            }

            if (typeof callback === 'function') {
                this.cb = callback;
            }

            if (!this.timePicker) {
                this.startDate = this.startDate.startOf('day');
                this.endDate = this.endDate.endOf('day');
            }

            if (this.singleDatePicker) {
                this.opens = 'right';
                this.container.find('.calendar.right').show();
                this.container.find('.calendar.left').hide();
                this.container.find('.ranges').hide();
                if (!this.container.find('.calendar.right').hasClass('single'))
                    this.container.find('.calendar.right').addClass('single');
            } else {
                this.container.find('.calendar.right').removeClass('single');
                this.container.find('.ranges').show();
            }

            this.oldStartDate = this.startDate.clone();
            this.oldEndDate = this.endDate.clone();
            this.oldChosenLabel = this.chosenLabel;

            this.leftCalendar = {
                month: moment([this.startDate.year(), this.startDate.month(), 1, this.startDate.hour(), this.startDate.minute()]),
                calendar: []
            };

            this.rightCalendar = {
                month: moment([this.endDate.year(), this.endDate.month(), 1, this.endDate.hour(), this.endDate.minute()]),
                calendar: []
            };

            if (this.opens == 'right') {
                //swap calendar positions
                var left = this.container.find('.calendar.left');
                var right = this.container.find('.calendar.right');
                left.removeClass('left').addClass('right');
                right.removeClass('right').addClass('left');
            }

            if (typeof options.ranges === 'undefined' && !this.singleDatePicker) {
                this.container.addClass('show-calendar');
            }

            this.container.addClass('opens' + this.opens);

            this.updateView();
            this.updateCalendars();

        },

        setStartDate: function(startDate) {
            if (typeof startDate === 'string')
                this.startDate = moment(startDate, this.format);

            if (typeof startDate === 'object')
                this.startDate = moment(startDate);

            if (!this.timePicker)
                this.startDate = this.startDate.startOf('day');

            this.oldStartDate = this.startDate.clone();

            this.updateView();
            this.updateCalendars();
        },

        setEndDate: function(endDate) {
            if (typeof endDate === 'string')
                this.endDate = moment(endDate, this.format);

            if (typeof endDate === 'object')
                this.endDate = moment(endDate);

            if (!this.timePicker)
                this.endDate = this.endDate.endOf('day');

            this.oldEndDate = this.endDate.clone();

            this.updateView();
            this.updateCalendars();
        },

        updateView: function () {
            this.leftCalendar.month.month(this.startDate.month()).year(this.startDate.year());
            this.rightCalendar.month.month(this.endDate.month()).year(this.endDate.year());
            this.updateFormInputs();
        },

        updateFormInputs: function () {
            this.container.find('input[name=daterangepicker_start]').val(this.startDate.format(this.format));
            this.container.find('input[name=daterangepicker_end]').val(this.endDate.format(this.format));

            if (this.startDate.isSame(this.endDate) || this.startDate.isBefore(this.endDate)) {
                this.container.find('button.applyBtn').removeAttr('disabled');
            } else {
                this.container.find('button.applyBtn').attr('disabled', 'disabled');
            }
        },

        updateFromControl: function () {
            if (!this.element.is('input')) return;
            if (!this.element.val().length) return;

            var dateString = this.element.val().split(this.separator),
                start = null,
                end = null;

            if(dateString.length === 2) {
                start = moment(dateString[0], this.format);
                end = moment(dateString[1], this.format);
            }

            if (this.singleDatePicker || start === null || end === null) {
                start = moment(this.element.val(), this.format);
                end = start;
            }

            if (end.isBefore(start)) return;

            this.oldStartDate = this.startDate.clone();
            this.oldEndDate = this.endDate.clone();

            this.startDate = start;
            this.endDate = end;

            if (!this.startDate.isSame(this.oldStartDate) || !this.endDate.isSame(this.oldEndDate))
                this.notify();

            this.updateCalendars();
        },

        notify: function () {
            this.updateView();
            this.cb(this.startDate, this.endDate, this.chosenLabel);
        },

        move: function () {
            var parentOffset = { top: 0, left: 0 };
            if (!this.parentEl.is('body')) {
                parentOffset = {
                    top: this.parentEl.offset().top - this.parentEl.scrollTop(),
                    left: this.parentEl.offset().left - this.parentEl.scrollLeft()
                };
            }

            if (this.opens == 'left') {
                this.container.css({
                    top: this.element.offset().top + this.element.outerHeight() - parentOffset.top,
                    right: $(window).width() - this.element.offset().left - this.element.outerWidth() - parentOffset.left,
                    left: 'auto'
                });
                if (this.container.offset().left < 0) {
                    this.container.css({
                        right: 'auto',
                        left: 9
                    });
                }
            } else {
                this.container.css({
                    top: this.element.offset().top + this.element.outerHeight() - parentOffset.top,
                    left: this.element.offset().left - parentOffset.left,
                    right: 'auto'
                });
                if (this.container.offset().left + this.container.outerWidth() > $(window).width()) {
                    this.container.css({
                        left: 'auto',
                        right: 0
                    });
                }
            }
        },

        toggle: function (e) {
            if (this.element.hasClass('active')) {
                this.hide();
            } else {
                this.show();
            }
        },

        show: function (e) {
            this.element.addClass('active');
            this.container.show();
            this.move();

            // Create a click proxy that is private to this instance of datepicker, for unbinding
            this._outsideClickProxy = $.proxy(function (e) { this.outsideClick(e); }, this);
            // Bind global datepicker mousedown for hiding and
            $(document)
              .on('mousedown.daterangepicker', this._outsideClickProxy)
              // also explicitly play nice with Bootstrap dropdowns, which stopPropagation when clicking them
              .on('click.daterangepicker', '[data-toggle=dropdown]', this._outsideClickProxy)
              // and also close when focus changes to outside the picker (eg. tabbing between controls)
              .on('focusin.daterangepicker', this._outsideClickProxy);

            this.element.trigger('show.daterangepicker', this);
        },

        outsideClick: function (e) {
            var target = $(e.target);
            // if the page is clicked anywhere except within the daterangerpicker/button
            // itself then call this.hide()
            if (
                target.closest(this.element).length ||
                target.closest(this.container).length ||
                target.closest('.calendar-date').length
                ) return;
            this.hide();
        },

        hide: function (e) {
            $(document)
              .off('mousedown.daterangepicker', this._outsideClickProxy)
              .off('click.daterangepicker', this._outsideClickProxy)
              .off('focusin.daterangepicker', this._outsideClickProxy);

            this.element.removeClass('active');
            this.container.hide();

            if (!this.startDate.isSame(this.oldStartDate) || !this.endDate.isSame(this.oldEndDate))
                this.notify();

            this.oldStartDate = this.startDate.clone();
            this.oldEndDate = this.endDate.clone();

            this.element.trigger('hide.daterangepicker', this);
        },

        enterRange: function (e) {
            // mouse pointer has entered a range label
            var label = e.target.innerHTML;
            if (label == this.locale.customRangeLabel) {
                this.updateView();
            } else {
                var dates = this.ranges[label];
                this.container.find('input[name=daterangepicker_start]').val(dates[0].format(this.format));
                this.container.find('input[name=daterangepicker_end]').val(dates[1].format(this.format));
            }
        },

        showCalendars: function() {
            this.container.addClass('show-calendar');
            this.move();
        },

        hideCalendars: function() {
            this.container.removeClass('show-calendar');
        },

        updateInputText: function() {
            if (this.element.is('input') && !this.singleDatePicker) {
                this.element.val(this.startDate.format(this.format) + this.separator + this.endDate.format(this.format));
            } else if (this.element.is('input')) {
                this.element.val(this.startDate.format(this.format));
            }
        },

        clickRange: function (e) {
            var label = e.target.innerHTML;
            this.chosenLabel = label;
            if (label == this.locale.customRangeLabel) {

               console.log(this.container.hasClass('show-calendar'));

               this.container.hasClass('show-calendar') ? this.hideCalendars() : this.showCalendars();

            } else {
                var dates = this.ranges[label];

                this.startDate = dates[0];
                this.endDate = dates[1];

                if (!this.timePicker) {
                    this.startDate.startOf('day');
                    this.endDate.endOf('day');
                }

                this.leftCalendar.month.month(this.startDate.month()).year(this.startDate.year()).hour(this.startDate.hour()).minute(this.startDate.minute());
                this.rightCalendar.month.month(this.endDate.month()).year(this.endDate.year()).hour(this.endDate.hour()).minute(this.endDate.minute());
                this.updateCalendars();

                this.updateInputText();

                this.hideCalendars();
                this.hide();
                this.element.trigger('apply.daterangepicker', this);
            }
        },

        clickPrev: function (e) {
            var cal = $(e.target).parents('.calendar');
            if (cal.hasClass('left')) {
                this.leftCalendar.month.subtract('month', 1);
            } else {
                this.rightCalendar.month.subtract('month', 1);
            }
            this.updateCalendars();
        },

        clickNext: function (e) {
            var cal = $(e.target).parents('.calendar');
            if (cal.hasClass('left')) {
                this.leftCalendar.month.add('month', 1);
            } else {
                this.rightCalendar.month.add('month', 1);
            }
            this.updateCalendars();
        },

        enterDate: function (e) {

            var title = $(e.target).attr('data-title');
            var row = title.substr(1, 1);
            var col = title.substr(3, 1);
            var cal = $(e.target).parents('.calendar');

            if (cal.hasClass('left')) {
                this.container.find('input[name=daterangepicker_start]').val(this.leftCalendar.calendar[row][col].format(this.format));
            } else {
                this.container.find('input[name=daterangepicker_end]').val(this.rightCalendar.calendar[row][col].format(this.format));
            }

        },

        clickDate: function (e) {
            var title = $(e.target).attr('data-title');
            var row = title.substr(1, 1);
            var col = title.substr(3, 1);
            var cal = $(e.target).parents('.calendar');

            var startDate, endDate;
            if (cal.hasClass('left')) {
                startDate = this.leftCalendar.calendar[row][col];
                endDate = this.endDate;
                if (typeof this.dateLimit === 'object') {
                    var maxDate = moment(startDate).add(this.dateLimit).startOf('day');
                    if (endDate.isAfter(maxDate)) {
                        endDate = maxDate;
                    }
                }
            } else {
                startDate = this.startDate;
                endDate = this.rightCalendar.calendar[row][col];
                if (typeof this.dateLimit === 'object') {
                    var minDate = moment(endDate).subtract(this.dateLimit).startOf('day');
                    if (startDate.isBefore(minDate)) {
                        startDate = minDate;
                    }
                }
            }

            if (this.singleDatePicker && cal.hasClass('left')) {
                endDate = startDate.clone();
            } else if (this.singleDatePicker && cal.hasClass('right')) {
                startDate = endDate.clone();
            }

            cal.find('td').removeClass('active');

            if (startDate.isSame(endDate) || startDate.isBefore(endDate)) {
                $(e.target).addClass('active');
                this.startDate = startDate;
                this.endDate = endDate;
                this.chosenLabel = this.locale.customRangeLabel;
            } else if (startDate.isAfter(endDate)) {
                $(e.target).addClass('active');
                var difference = this.endDate.diff(this.startDate);
                this.startDate = startDate;
                this.endDate = moment(startDate).add('ms', difference);
                this.chosenLabel = this.locale.customRangeLabel;
            }

            this.leftCalendar.month.month(this.startDate.month()).year(this.startDate.year());
            this.rightCalendar.month.month(this.endDate.month()).year(this.endDate.year());
            this.updateCalendars();

            if (!this.timePicker)
                endDate.endOf('day');

            if (this.singleDatePicker)
                this.clickApply();
        },

        clickApply: function (e) {
            this.updateInputText();
            this.hide();
            this.element.trigger('apply.daterangepicker', this);
        },

        clickCancel: function (e) {
            this.startDate = this.oldStartDate;
            this.endDate = this.oldEndDate;
            this.chosenLabel = this.oldChosenLabel;
            this.updateView();
            this.updateCalendars();
            this.hide();
            this.element.trigger('cancel.daterangepicker', this);
        },

        updateMonthYear: function (e) {
            var isLeft = $(e.target).closest('.calendar').hasClass('left'),
                leftOrRight = isLeft ? 'left' : 'right',
                cal = this.container.find('.calendar.'+leftOrRight);

            // Month must be Number for new moment versions
            var month = parseInt(cal.find('.monthselect').val(), 10);
            var year = cal.find('.yearselect').val();

            this[leftOrRight+'Calendar'].month.month(month).year(year);
            this.updateCalendars();
        },

        updateTime: function(e) {

            var cal = $(e.target).closest('.calendar'),
                isLeft = cal.hasClass('left');

            var hour = parseInt(cal.find('.hourselect').val(), 10);
            var minute = parseInt(cal.find('.minuteselect').val(), 10);

            if (this.timePicker12Hour) {
                var ampm = cal.find('.ampmselect').val();
                if (ampm === 'PM' && hour < 12)
                    hour += 12;
                if (ampm === 'AM' && hour === 12)
                    hour = 0;
            }

            if (isLeft) {
                var start = this.startDate.clone();
                start.hour(hour);
                start.minute(minute);
                this.startDate = start;
                this.leftCalendar.month.hour(hour).minute(minute);
            } else {
                var end = this.endDate.clone();
                end.hour(hour);
                end.minute(minute);
                this.endDate = end;
                this.rightCalendar.month.hour(hour).minute(minute);
            }

            this.updateCalendars();
        },

        updateCalendars: function () {
            this.leftCalendar.calendar = this.buildCalendar(this.leftCalendar.month.month(), this.leftCalendar.month.year(), this.leftCalendar.month.hour(), this.leftCalendar.month.minute(), 'left');
            this.rightCalendar.calendar = this.buildCalendar(this.rightCalendar.month.month(), this.rightCalendar.month.year(), this.rightCalendar.month.hour(), this.rightCalendar.month.minute(), 'right');
            this.container.find('.calendar.left').empty().html(this.renderCalendar(this.leftCalendar.calendar, this.startDate, this.minDate, this.maxDate));
            this.container.find('.calendar.right').empty().html(this.renderCalendar(this.rightCalendar.calendar, this.endDate, this.startDate, this.maxDate));

            this.container.find('.ranges li').removeClass('active');
            var customRange = true;
            var i = 0;
            for (var range in this.ranges) {
                if (this.timePicker) {
                    if (this.startDate.isSame(this.ranges[range][0]) && this.endDate.isSame(this.ranges[range][1])) {
                        customRange = false;
                        this.chosenLabel = this.container.find('.ranges li:eq(' + i + ')')
                            .addClass('active').html();
                    }
                } else {
                    //ignore times when comparing dates if time picker is not enabled
                    if (this.startDate.format('YYYY-MM-DD') == this.ranges[range][0].format('YYYY-MM-DD') && this.endDate.format('YYYY-MM-DD') == this.ranges[range][1].format('YYYY-MM-DD')) {
                        customRange = false;
                        this.chosenLabel = this.container.find('.ranges li:eq(' + i + ')')
                            .addClass('active').html();
                    }
                }
                i++;
            }
            if (customRange) {
                this.chosenLabel = this.container.find('.ranges li:last')
                    .addClass('active').html();
            }
        },

        buildCalendar: function (month, year, hour, minute, side) {
            var firstDay = moment([year, month, 1]);
            var lastMonth = moment(firstDay).subtract('month', 1).month();
            var lastYear = moment(firstDay).subtract('month', 1).year();

            var daysInLastMonth = moment([lastYear, lastMonth]).daysInMonth();

            var dayOfWeek = firstDay.day();

            var i;

            //initialize a 6 rows x 7 columns array for the calendar
            var calendar = [];
            for (i = 0; i < 6; i++) {
                calendar[i] = [];
            }

            //populate the calendar with date objects
            var startDay = daysInLastMonth - dayOfWeek + this.locale.firstDay + 1;
            if (startDay > daysInLastMonth)
                startDay -= 7;

            if (dayOfWeek == this.locale.firstDay)
                startDay = daysInLastMonth - 6;

            var curDate = moment([lastYear, lastMonth, startDay, 12, minute]);
            var col, row;
            for (i = 0, col = 0, row = 0; i < 42; i++, col++, curDate = moment(curDate).add('hour', 24)) {
                if (i > 0 && col % 7 === 0) {
                    col = 0;
                    row++;
                }
                calendar[row][col] = curDate.clone().hour(hour);
                curDate.hour(12);
            }

            return calendar;
        },

        renderDropdowns: function (selected, minDate, maxDate) {
            var currentMonth = selected.month();
            var monthHtml = '<select class="monthselect">';
            var inMinYear = false;
            var inMaxYear = false;

            for (var m = 0; m < 12; m++) {
                if ((!inMinYear || m >= minDate.month()) && (!inMaxYear || m <= maxDate.month())) {
                    monthHtml += "<option value='" + m + "'" +
                        (m === currentMonth ? " selected='selected'" : "") +
                        ">" + this.locale.monthNames[m] + "</option>";
                }
            }
            monthHtml += "</select>";

            var currentYear = selected.year();
            var maxYear = (maxDate && maxDate.year()) || (currentYear + 5);
            var minYear = (minDate && minDate.year()) || (currentYear - 50);
            var yearHtml = '<select class="yearselect">';

            for (var y = minYear; y <= maxYear; y++) {
                yearHtml += '<option value="' + y + '"' +
                    (y === currentYear ? ' selected="selected"' : '') +
                    '>' + y + '</option>';
            }

            yearHtml += '</select>';

            return monthHtml + yearHtml;
        },

        renderCalendar: function (calendar, selected, minDate, maxDate) {

            var html = '<div class="calendar-date">';
            html += '<table class="table-condensed">';
            html += '<thead>';
            html += '<tr>';

            // add empty cell for week number
            if (this.showWeekNumbers)
                html += '<th></th>';

            if (!minDate || minDate.isBefore(calendar[1][1])) {
                html += '<th class="prev available"><i class="fa fa-arrow-left icon-arrow-left icon icon-arrow-left"></i></th>';
            } else {
                html += '<th></th>';
            }

            var dateHtml = this.locale.monthNames[calendar[1][1].month()] + calendar[1][1].format(" YYYY");

            if (this.showDropdowns) {
                dateHtml = this.renderDropdowns(calendar[1][1], minDate, maxDate);
            }

            html += '<th colspan="5" class="month">' + dateHtml + '</th>';
            if (!maxDate || maxDate.isAfter(calendar[1][1])) {
                html += '<th class="next available"><i class="fa fa-arrow-right icon-arrow-right icon icon-arrow-right"></i></th>';
            } else {
                html += '<th></th>';
            }

            html += '</tr>';
            html += '<tr>';

            // add week number label
            if (this.showWeekNumbers)
                html += '<th class="week">' + this.locale.weekLabel + '</th>';

            $.each(this.locale.daysOfWeek, function (index, dayOfWeek) {
                html += '<th>' + dayOfWeek + '</th>';
            });

            html += '</tr>';
            html += '</thead>';
            html += '<tbody>';

            for (var row = 0; row < 6; row++) {
                html += '<tr>';

                // add week number
                if (this.showWeekNumbers)
                    html += '<td class="week">' + calendar[row][0].week() + '</td>';

                for (var col = 0; col < 7; col++) {
                    var cname = 'available ';
                    cname += (calendar[row][col].month() == calendar[1][1].month()) ? '' : 'off';

                    if ((minDate && calendar[row][col].isBefore(minDate, 'day')) || (maxDate && calendar[row][col].isAfter(maxDate, 'day'))) {
                        cname = ' off disabled ';
                    } else if (calendar[row][col].format('YYYY-MM-DD') == selected.format('YYYY-MM-DD')) {
                        cname += ' active ';
                        if (calendar[row][col].format('YYYY-MM-DD') == this.startDate.format('YYYY-MM-DD')) {
                            cname += ' start-date ';
                        }
                        if (calendar[row][col].format('YYYY-MM-DD') == this.endDate.format('YYYY-MM-DD')) {
                            cname += ' end-date ';
                        }
                    } else if (calendar[row][col] >= this.startDate && calendar[row][col] <= this.endDate) {
                        cname += ' in-range ';
                        if (calendar[row][col].isSame(this.startDate)) { cname += ' start-date '; }
                        if (calendar[row][col].isSame(this.endDate)) { cname += ' end-date '; }
                    }

                    var title = 'r' + row + 'c' + col;
                    html += '<td class="' + cname.replace(/\s+/g, ' ').replace(/^\s?(.*?)\s?$/, '$1') + '" data-title="' + title + '">' + calendar[row][col].date() + '</td>';
                }
                html += '</tr>';
            }

            html += '</tbody>';
            html += '</table>';
            html += '</div>';

            var i;
            if (this.timePicker) {

                html += '<div class="calendar-time">';
                html += '<select class="hourselect">';
                var start = 0;
                var end = 23;
                var selected_hour = selected.hour();
                if (this.timePicker12Hour) {
                    start = 1;
                    end = 12;
                    if (selected_hour >= 12)
                        selected_hour -= 12;
                    if (selected_hour === 0)
                        selected_hour = 12;
                }

                for (i = start; i <= end; i++) {
                    if (i == selected_hour) {
                        html += '<option value="' + i + '" selected="selected">' + i + '</option>';
                    } else {
                        html += '<option value="' + i + '">' + i + '</option>';
                    }
                }

                html += '</select> : ';

                html += '<select class="minuteselect">';

                for (i = 0; i < 60; i += this.timePickerIncrement) {
                    var num = i;
                    if (num < 10)
                        num = '0' + num;
                    if (i == selected.minute()) {
                        html += '<option value="' + i + '" selected="selected">' + num + '</option>';
                    } else {
                        html += '<option value="' + i + '">' + num + '</option>';
                    }
                }

                html += '</select> ';

                if (this.timePicker12Hour) {
                    html += '<select class="ampmselect">';
                    if (selected.hour() >= 12) {
                        html += '<option value="AM">AM</option><option value="PM" selected="selected">PM</option>';
                    } else {
                        html += '<option value="AM" selected="selected">AM</option><option value="PM">PM</option>';
                    }
                    html += '</select>';
                }

                html += '</div>';

            }

            return html;

        },

        remove: function() {

            this.container.remove();
            this.element.off('.daterangepicker');
            this.element.removeData('daterangepicker');

        }

    };

    $.fn.daterangepicker = function (options, cb) {
        this.each(function () {
            var el = $(this);
            if (el.data('daterangepicker'))
                el.data('daterangepicker').remove();
            el.data('daterangepicker', new DateRangePicker(el, options, cb));
        });
        return this;
    };

}(window.jQuery, window.moment);
/********************************* End Template Datepicker */


/**
 * Template Switch
***/
(function() {
  var __slice = [].slice;

  (function($, window) {
    "use strict";
    var BootstrapSwitch;
    BootstrapSwitch = (function() {
      function BootstrapSwitch(element, options) {
        if (options == null) {
          options = {};
        }
        this.$element = $(element);
        this.options = $.extend({}, $.fn.bootstrapSwitch.defaults, options, {
          state: this.$element.is(":checked"),
          size: this.$element.data("size"),
          animate: this.$element.data("animate"),
          disabled: this.$element.is(":disabled"),
          readonly: this.$element.is("[readonly]"),
          indeterminate: this.$element.data("indeterminate"),
          onColor: this.$element.data("on-color"),
          offColor: this.$element.data("off-color"),
          onText: this.$element.data("on-text"),
          offText: this.$element.data("off-text"),
          onLabel: this.$element.data("on-label") || this.$element.data("off-label"),
          offLabel: this.$element.data("off-label") || this.$element.data("on-label"),
          baseClass: this.$element.data("base-class"),
          wrapperClass: this.$element.data("wrapper-class")
        });
        this.$wrapper = $("<div>", {
          "class": (function(_this) {
            return function() {
              var classes;
              classes = ["" + _this.options.baseClass].concat(_this._getClasses(_this.options.wrapperClass));
              classes.push(_this.options.state ? "" + _this.options.baseClass + "-on" : "" + _this.options.baseClass + "-off");
              if (_this.options.size != null) {
                classes.push("" + _this.options.baseClass + "-" + _this.options.size);
              }
              if (_this.options.animate) {
                classes.push("" + _this.options.baseClass + "-animate");
              }
              if (_this.options.disabled) {
                classes.push("" + _this.options.baseClass + "-disabled");
              }
              if (_this.options.readonly) {
                classes.push("" + _this.options.baseClass + "-readonly");
              }
              if (_this.options.indeterminate) {
                classes.push("" + _this.options.baseClass + "-indeterminate");
              }
              if (_this.$element.attr("id")) {
                classes.push("" + _this.options.baseClass + "-id-" + (_this.$element.attr("id")));
              }
              return classes.join(" ");
            };
          })(this)()
        });
        this.$container = $("<div>", {
          "class": "" + this.options.baseClass + "-container"
        });
        this.$on = $("<span>", {
          html: this.options.onText,
          "class": "" + this.options.baseClass + "-handle-on " + this.options.baseClass + "-" + this.options.onColor
        });
        this.$off = $("<span>", {
          html: this.options.offText,
          "class": "" + this.options.baseClass + "-handle-off " + this.options.baseClass + "-" + this.options.offColor
        });
        this.$label = $("<label>", {
          "for": this.$element.attr("id"),
          html: this.options.state ? this.options.onLabel : this.options.offLabel,
          "class": "" + this.options.baseClass + "-label"
        });
        if (this.options.indeterminate) {
          this.$element.prop("indeterminate", true);
        }
        this.$element.on("init.bootstrapSwitch", (function(_this) {
          return function() {
            return _this.options.onInit.apply(element, arguments);
          };
        })(this));
        this.$element.on("switchChange.bootstrapSwitch", (function(_this) {
          return function() {
            return _this.options.onSwitchChange.apply(element, arguments);
          };
        })(this));
        this.$container = this.$element.wrap(this.$container).parent();
        this.$wrapper = this.$container.wrap(this.$wrapper).parent();
        this.$element.before(this.$on).before(this.$label).before(this.$off).trigger("init.bootstrapSwitch");
        this._elementHandlers();
        this._handleHandlers();
        this._labelHandlers();
        this._formHandler();
      }

      BootstrapSwitch.prototype._constructor = BootstrapSwitch;

      BootstrapSwitch.prototype.state = function(value, skip) {
        if (typeof value === "undefined") {
          return this.options.state;
        }
        if (this.options.disabled || this.options.readonly || this.options.indeterminate) {
          return this.$element;
        }
        value = !!value;
        this.$element.prop("checked", value).trigger("change.bootstrapSwitch", skip);
        return this.$element;
      };

      BootstrapSwitch.prototype.toggleState = function(skip) {
        if (this.options.disabled || this.options.readonly || this.options.indeterminate) {
          return this.$element;
        }
        return this.$element.prop("checked", !this.options.state).trigger("change.bootstrapSwitch", skip);
      };

      BootstrapSwitch.prototype.size = function(value) {
        if (typeof value === "undefined") {
          return this.options.size;
        }
        if (this.options.size != null) {
          this.$wrapper.removeClass("" + this.options.baseClass + "-" + this.options.size);
        }
        if (value) {
          this.$wrapper.addClass("" + this.options.baseClass + "-" + value);
        }
        this.options.size = value;
        return this.$element;
      };

      BootstrapSwitch.prototype.animate = function(value) {
        if (typeof value === "undefined") {
          return this.options.animate;
        }
        value = !!value;
        this.$wrapper[value ? "addClass" : "removeClass"]("" + this.options.baseClass + "-animate");
        this.options.animate = value;
        return this.$element;
      };

      BootstrapSwitch.prototype.disabled = function(value) {
        if (typeof value === "undefined") {
          return this.options.disabled;
        }
        value = !!value;
        this.$wrapper[value ? "addClass" : "removeClass"]("" + this.options.baseClass + "-disabled");
        this.$element.prop("disabled", value);
        this.options.disabled = value;
        return this.$element;
      };

      BootstrapSwitch.prototype.toggleDisabled = function() {
        this.$element.prop("disabled", !this.options.disabled);
        this.$wrapper.toggleClass("" + this.options.baseClass + "-disabled");
        this.options.disabled = !this.options.disabled;
        return this.$element;
      };

      BootstrapSwitch.prototype.readonly = function(value) {
        if (typeof value === "undefined") {
          return this.options.readonly;
        }
        value = !!value;
        this.$wrapper[value ? "addClass" : "removeClass"]("" + this.options.baseClass + "-readonly");
        this.$element.prop("readonly", value);
        this.options.readonly = value;
        return this.$element;
      };

      BootstrapSwitch.prototype.toggleReadonly = function() {
        this.$element.prop("readonly", !this.options.readonly);
        this.$wrapper.toggleClass("" + this.options.baseClass + "-readonly");
        this.options.readonly = !this.options.readonly;
        return this.$element;
      };

      BootstrapSwitch.prototype.indeterminate = function(value) {
        if (typeof value === "undefined") {
          return this.options.indeterminate;
        }
        value = !!value;
        this.$wrapper[value ? "addClass" : "removeClass"]("" + this.options.baseClass + "-indeterminate");
        this.$element.prop("indeterminate", value);
        this.options.indeterminate = value;
        return this.$element;
      };

      BootstrapSwitch.prototype.toggleIndeterminate = function() {
        this.$element.prop("indeterminate", !this.options.indeterminate);
        this.$wrapper.toggleClass("" + this.options.baseClass + "-indeterminate");
        this.options.indeterminate = !this.options.indeterminate;
        return this.$element;
      };

      BootstrapSwitch.prototype.onColor = function(value) {
        var color;
        color = this.options.onColor;
        if (typeof value === "undefined") {
          return color;
        }
        if (color != null) {
          this.$on.removeClass("" + this.options.baseClass + "-" + color);
        }
        this.$on.addClass("" + this.options.baseClass + "-" + value);
        this.options.onColor = value;
        return this.$element;
      };

      BootstrapSwitch.prototype.offColor = function(value) {
        var color;
        color = this.options.offColor;
        if (typeof value === "undefined") {
          return color;
        }
        if (color != null) {
          this.$off.removeClass("" + this.options.baseClass + "-" + color);
        }
        this.$off.addClass("" + this.options.baseClass + "-" + value);
        this.options.offColor = value;
        return this.$element;
      };

      BootstrapSwitch.prototype.onText = function(value) {
        if (typeof value === "undefined") {
          return this.options.onText;
        }
        this.$on.html(value);
        this.options.onText = value;
        return this.$element;
      };

      BootstrapSwitch.prototype.offText = function(value) {
        if (typeof value === "undefined") {
          return this.options.offText;
        }
        this.$off.html(value);
        this.options.offText = value;
        return this.$element;
      };

      BootstrapSwitch.prototype.onLabel = function(value) {
        if (typeof value === "undefined") {
          return this.options.onLabel;
        }
        this.$label.html(value);
        this.options.onLabel = value;
        return this.$element;
      };

      BootstrapSwitch.prototype.offLabel = function(value) {
        if (typeof value === "undefined") {
          return this.options.offLabel;
        }
        this.$label.html(value);
        this.options.offLabel = value;
        return this.$element;
      };

      BootstrapSwitch.prototype.baseClass = function(value) {
        return this.options.baseClass;
      };

      BootstrapSwitch.prototype.wrapperClass = function(value) {
        if (typeof value === "undefined") {
          return this.options.wrapperClass;
        }
        if (!value) {
          value = $.fn.bootstrapSwitch.defaults.wrapperClass;
        }
        this.$wrapper.removeClass(this._getClasses(this.options.wrapperClass).join(" "));
        this.$wrapper.addClass(this._getClasses(value).join(" "));
        this.options.wrapperClass = value;
        return this.$element;
      };

      BootstrapSwitch.prototype.onInit = function(value) {
        if (typeof value === "undefined") {
          return this.options.onInit;
        }
        if (!value) {
          value = $.fn.bootstrapSwitch.defaults.onInit;
        }
        this.options.onInit = value;
        return this.$element;
      };

      BootstrapSwitch.prototype.onSwitchChange = function(value) {
        if (typeof value === "undefined") {
          return this.options.onSwitchChange;
        }
        if (!value) {
          value = $.fn.bootstrapSwitch.defaults.onSwitchChange;
        }
        this.options.onSwitchChange = value;
        return this.$element;
      };

      BootstrapSwitch.prototype.destroy = function() {
        var $form;
        $form = this.$element.closest("form");
        if ($form.length) {
          $form.off("reset.bootstrapSwitch").removeData("bootstrap-switch");
        }
        this.$container.children().not(this.$element).remove();
        this.$element.unwrap().unwrap().off(".bootstrapSwitch").removeData("bootstrap-switch");
        return this.$element;
      };

      BootstrapSwitch.prototype._elementHandlers = function() {
        return this.$element.on({
          "change.bootstrapSwitch": (function(_this) {
            return function(e, skip) {
              var checked;
              e.preventDefault();
              e.stopPropagation();
              e.stopImmediatePropagation();
              checked = _this.$element.is(":checked");
              if (checked === _this.options.state) {
                return;
              }
              _this.options.state = checked;
              _this.$wrapper.removeClass(checked ? "" + _this.options.baseClass + "-off" : "" + _this.options.baseClass + "-on").addClass(checked ? "" + _this.options.baseClass + "-on" : "" + _this.options.baseClass + "-off");
              checked ? _this.$label.html(_this.options.onLabel) : _this.$label.html(_this.options.offLabel);
              if (!skip) {
                if (_this.$element.is(":radio")) {
                  $("[name='" + (_this.$element.attr('name')) + "']").not(_this.$element).prop("checked", false).trigger("change.bootstrapSwitch", true);
                }
                return _this.$element.trigger("switchChange.bootstrapSwitch", [checked]);
              }
            };
          })(this),
          "focus.bootstrapSwitch": (function(_this) {
            return function(e) {
              e.preventDefault();
              e.stopPropagation();
              e.stopImmediatePropagation();
              return _this.$wrapper.addClass("" + _this.options.baseClass + "-focused");
            };
          })(this),
          "blur.bootstrapSwitch": (function(_this) {
            return function(e) {
              e.preventDefault();
              e.stopPropagation();
              e.stopImmediatePropagation();
              return _this.$wrapper.removeClass("" + _this.options.baseClass + "-focused");
            };
          })(this),
          "keydown.bootstrapSwitch": (function(_this) {
            return function(e) {
              if (!e.which || _this.options.disabled || _this.options.readonly || _this.options.indeterminate) {
                return;
              }
              switch (e.which) {
                case 32:
                  e.preventDefault();
                  e.stopPropagation();
                  e.stopImmediatePropagation();
                  return _this.toggleState();
                case 37:
                  e.preventDefault();
                  e.stopPropagation();
                  e.stopImmediatePropagation();
                  return _this.state(false);
                case 39:
                  e.preventDefault();
                  e.stopPropagation();
                  e.stopImmediatePropagation();
                  return _this.state(true);
              }
            };
          })(this)
        });
      };

      BootstrapSwitch.prototype._handleHandlers = function() {
        this.$on.on("click.bootstrapSwitch", (function(_this) {
          return function(e) {
            _this.state(false);
            return _this.$element.trigger("focus.bootstrapSwitch");
          };
        })(this));
        return this.$off.on("click.bootstrapSwitch", (function(_this) {
          return function(e) {
            _this.state(true);
            return _this.$element.trigger("focus.bootstrapSwitch");
          };
        })(this));
      };

      BootstrapSwitch.prototype._labelHandlers = function() {
        return this.$label.on({
          "mousemove.bootstrapSwitch touchmove.bootstrapSwitch": (function(_this) {
            return function(e) {
              var left, pageX, percent, right;
              if (!_this.drag) {
                return;
              }
              e.preventDefault();
              pageX = e.pageX || e.originalEvent.touches[0].pageX;
              percent = ((pageX - _this.$wrapper.offset().left) / _this.$wrapper.width()) * 100;
              left = 25;
              right = 75;
              if (percent < left) {
                percent = left;
              } else if (percent > right) {
                percent = right;
              }
              _this.$container.css("margin-left", "" + (percent - right) + "%");
              return _this.$element.trigger("focus.bootstrapSwitch");
            };
          })(this),
          "mousedown.bootstrapSwitch touchstart.bootstrapSwitch": (function(_this) {
            return function(e) {
              if (_this.drag || _this.options.disabled || _this.options.readonly || _this.options.indeterminate) {
                return;
              }
              e.preventDefault();
              _this.drag = true;
              if (_this.options.animate) {
                _this.$wrapper.removeClass("" + _this.options.baseClass + "-animate");
              }
              return _this.$element.trigger("focus.bootstrapSwitch");
            };
          })(this),
          "mouseup.bootstrapSwitch touchend.bootstrapSwitch": (function(_this) {
            return function(e) {
              if (!_this.drag) {
                return;
              }
              e.preventDefault();
              _this.drag = false;
              _this.$element.prop("checked", parseInt(_this.$container.css("margin-left"), 10) > -(_this.$container.width() / 6)).trigger("change.bootstrapSwitch");
              _this.$container.css("margin-left", "");
              if (_this.options.animate) {
                return _this.$wrapper.addClass("" + _this.options.baseClass + "-animate");
              }
            };
          })(this),
          "mouseleave.bootstrapSwitch": (function(_this) {
            return function(e) {
              return _this.$label.trigger("mouseup.bootstrapSwitch");
            };
          })(this),
          "click.bootstrapSwitch": (function(_this) {
            return function(e) {
              _this.toggleState();
              return _this.$element.trigger("focus.bootstrapSwitch");
            };
          })(this)
        });
      };

      BootstrapSwitch.prototype._formHandler = function() {
        var $form;
        $form = this.$element.closest("form");
        if ($form.data("bootstrap-switch")) {
          return;
        }
        return $form.on("reset.bootstrapSwitch", function() {
          return window.setTimeout(function() {
            return $form.find("input").filter(function() {
              return $(this).data("bootstrap-switch");
            }).each(function() {
              return $(this).bootstrapSwitch("state", this.checked);
            });
          }, 1);
        }).data("bootstrap-switch", true);
      };

      BootstrapSwitch.prototype._getClasses = function(classes) {
        var c, cls, _i, _len;
        if (!$.isArray(classes)) {
          return ["" + this.options.baseClass + "-" + classes];
        }
        cls = [];
        for (_i = 0, _len = classes.length; _i < _len; _i++) {
          c = classes[_i];
          cls.push("" + this.options.baseClass + "-" + c);
        }
        return cls;
      };

      return BootstrapSwitch;

    })();
    $.fn.bootstrapSwitch = function() {
      var args, option, ret;
      option = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      ret = this;
      this.each(function() {
        var $this, data;
        $this = $(this);
        data = $this.data("bootstrap-switch");
        if (!data) {
          $this.data("bootstrap-switch", data = new BootstrapSwitch(this, option));
        }
        if (typeof option === "string") {
          return ret = data[option].apply(data, args);
        }
      });
      return ret;
    };
    $.fn.bootstrapSwitch.Constructor = BootstrapSwitch;
    return $.fn.bootstrapSwitch.defaults = {
      state: true,
      size: null,
      animate: true,
      disabled: false,
      readonly: false,
      indeterminate: false,
      onColor: "primary",
      offColor: "default",
      onText: "Bật",
      offText: "Tắt",
      onLabel: "&nbsp;",
      offLabel: "&nbsp;",
      baseClass: "bootstrap-switch",
      wrapperClass: "wrapper",
      onInit: function() {},
      onSwitchChange: function() {}
    };
  })(window.jQuery, window);

}).call(this);
/********************************* End Template Switch */

/**
 * Template Valid
 * BootstrapValidator (http://bootstrapvalidator.com)
 * @copyright (c) 2013 - 2014 Nguyen Huu Phuoc
***/
(function($) {
    var BootstrapValidator = function(form, options) {
        this.$form   = $(form);
        this.options = $.extend({}, BootstrapValidator.DEFAULT_OPTIONS, options);

        this.$invalidFields = $([]);    // Array of invalid fields
        this.$submitButton  = null;     // The submit button which is clicked to submit form

        // Validating status
        this.STATUS_NOT_VALIDATED = 'NOT_VALIDATED';
        this.STATUS_VALIDATING    = 'VALIDATING';
        this.STATUS_INVALID       = 'INVALID';
        this.STATUS_VALID         = 'VALID';

        // Determine the event that is fired when user change the field value
        // Most modern browsers supports input event except IE 7, 8.
        // IE 9 supports input event but the event is still not fired if I press the backspace key.
        // Get IE version
        // https://gist.github.com/padolsey/527683/#comment-7595
        var ieVersion = (function() {
            var v = 3, div = document.createElement('div'), a = div.all || [];
            while (div.innerHTML = '<!--[if gt IE '+(++v)+']><br><![endif]-->', a[0]);
            return v > 4 ? v : !v;
        }());

        var el = document.createElement('div');
        this._changeEvent = (ieVersion === 9 || !('oninput' in el)) ? 'keyup' : 'input';

        // The flag to indicate that the form is ready to submit when a remote/callback validator returns
        this._submitIfValid = null;

        // Field elements
        this._cacheFields = {};

        this._init();
    };

    // The default options
    BootstrapValidator.DEFAULT_OPTIONS = {
        // The form CSS class
        elementClass: 'bv-form',

        // Default invalid message
        message: 'This value is not valid',

        // The error messages container
        // It can be:
        // * 'tooltip' if you want to use Bootstrap tooltip to show error messages
        // * 'popover' if you want to use Bootstrap popover to show error messages
        // * a CSS selector indicating the container
        //
        // In the first two cases, since the tooltip/popover should be small enough, the plugin only shows only one error message
        // You also can define the message container for particular field
        container: null,

        // The field will not be live validated if its length is less than this number of characters
        threshold: null,

        // Indicate fields which won't be validated
        // By default, the plugin will not validate the following kind of fields:
        // - disabled
        // - hidden
        // - invisible
        //
        // The setting consists of jQuery filters. Accept 3 formats:
        // - A string. Use a comma to separate filter
        // - An array. Each element is a filter
        // - An array. Each element can be a callback function
        //      function($field, validator) {
        //          $field is jQuery object representing the field element
        //          validator is the BootstrapValidator instance
        //          return true or false;
        //      }
        //
        // The 3 following settings are equivalent:
        //
        // 1) ':disabled, :hidden, :not(:visible)'
        // 2) [':disabled', ':hidden', ':not(:visible)']
        // 3) [':disabled', ':hidden', function($field) {
        //        return !$field.is(':visible');
        //    }]
        excluded: [':disabled', ':hidden', ':not(:visible)'],

        // Shows ok/error/loading icons based on the field validity.
        // This feature requires Bootstrap v3.1.0 or later (http://getbootstrap.com/css/#forms-control-validation).
        // Since Bootstrap doesn't provide any methods to know its version, this option cannot be on/off automatically.
        // In other word, to use this feature you have to upgrade your Bootstrap to v3.1.0 or later.
        //
        // Examples:
        // - Use Glyphicons icons:
        //  feedbackIcons: {
        //      valid: 'glyphicon glyphicon-ok',
        //      invalid: 'glyphicon glyphicon-remove',
        //      validating: 'glyphicon glyphicon-refresh'
        //  }
        // - Use FontAwesome icons:
        //  feedbackIcons: {
        //      valid: 'fa fa-check',
        //      invalid: 'fa fa-times',
        //      validating: 'fa fa-refresh'
        //  }
        feedbackIcons: {
            valid: 'icon icon-ok',
            invalid: 'icon icon-remove',
            validating: 'icon icon-refresh'
        },

        // The submit buttons selector
        // These buttons will be disabled to prevent the valid form from multiple submissions
        submitButtons: '[type="submit"]',

        // The custom submit handler
        // It will prevent the form from the default submission
        //
        //  submitHandler: function(validator, form) {
        //      - validator is the BootstrapValidator instance
        //      - form is the jQuery object presenting the current form
        //  }
        submitHandler: null,

        // Live validating option
        // Can be one of 3 values:
        // - enabled: The plugin validates fields as soon as they are changed
        // - disabled: Disable the live validating. The error messages are only shown after the form is submitted
        // - submitted: The live validating is enabled after the form is submitted
        live: 'enabled',

        // Map the field name with validator rules
        fields: {}
    };

    BootstrapValidator.prototype = {
        constructor: BootstrapValidator,

        /**
         * Init form
         */
        _init: function() {
            var that    = this,
                options = {
                    excluded:       this.$form.attr('data-bv-excluded'),
                    trigger:        this.$form.attr('data-bv-trigger'),
                    message:        this.$form.attr('data-bv-message'),
                    container:      this.$form.attr('data-bv-container'),
                    submitButtons:  this.$form.attr('data-bv-submitbuttons'),
                    threshold:      this.$form.attr('data-bv-threshold'),
                    live:           this.$form.attr('data-bv-live'),
                    fields:         {},
                    feedbackIcons: {
                        valid:      this.$form.attr('data-bv-feedbackicons-valid'),
                        invalid:    this.$form.attr('data-bv-feedbackicons-invalid'),
                        validating: this.$form.attr('data-bv-feedbackicons-validating')
                    }
                };

            this.$form
                // Disable client side validation in HTML 5
                .attr('novalidate', 'novalidate')
                .addClass(this.options.elementClass)
                // Disable the default submission first
                .on('submit.bv', function(e) {
                    e.preventDefault();
                    that.validate();
                })
                .on('click.bv', this.options.submitButtons, function() {
                    that.$submitButton  = $(this);
					// The user just click the submit button
					that._submitIfValid = true;
                })
                // Find all fields which have either "name" or "data-bv-field" attribute
                .find('[name], [data-bv-field]')
                    .each(function() {
                        var $field = $(this);
                        if (that._isExcluded($field)) {
                            return;
                        }

                        var field = $field.attr('name') || $field.attr('data-bv-field'),
                            opts  = that._parseOptions($field);
                        if (opts) {
                            $field.attr('data-bv-field', field);
                            options.fields[field] = $.extend({}, opts, options.fields[field]);
                        }
                    });

            this.options = $.extend(true, this.options, options);
            for (var field in this.options.fields) {
                this._initField(field);
            }

            this.$form.trigger($.Event('init.form.bv'), {
                options: this.options
            });
        },

        /**
         * Parse the validator options from HTML attributes
         *
         * @param {jQuery} $field The field element
         * @returns {Object}
         */
        _parseOptions: function($field) {
            var field      = $field.attr('name') || $field.attr('data-bv-field'),
                validators = {},
                validator,
                v,          // Validator name
                enabled,
                optionName,
                optionValue,
                html5AttrName,
                html5AttrMap;

            for (v in $.fn.bootstrapValidator.validators) {
                validator    = $.fn.bootstrapValidator.validators[v];
                enabled      = $field.attr('data-bv-' + v.toLowerCase()) + '';
                html5AttrMap = ('function' == typeof validator.enableByHtml5) ? validator.enableByHtml5($field) : null;

                if ((html5AttrMap && enabled != 'false')
                    || (html5AttrMap !== true && ('' == enabled || 'true' == enabled)))
                {
                    // Try to parse the options via attributes
                    validator.html5Attributes = validator.html5Attributes || { message: 'message' };
                    validators[v] = $.extend({}, html5AttrMap == true ? {} : html5AttrMap, validators[v]);

                    for (html5AttrName in validator.html5Attributes) {
                        optionName  = validator.html5Attributes[html5AttrName];
                        optionValue = $field.attr('data-bv-' + v.toLowerCase() + '-' + html5AttrName);
                        if (optionValue) {
                            if ('true' == optionValue) {
                                optionValue = true;
                            } else if ('false' == optionValue) {
                                optionValue = false;
                            }
                            validators[v][optionName] = optionValue;
                        }
                    }
                }
            }

            var opts = {
                    feedbackIcons: $field.attr('data-bv-feedbackicons'),
                    trigger:       $field.attr('data-bv-trigger'),
                    message:       $field.attr('data-bv-message'),
                    container:     $field.attr('data-bv-container'),
                    selector:      $field.attr('data-bv-selector'),
                    threshold:     $field.attr('data-bv-threshold'),
                    validators:    validators
                },
                emptyOptions    = $.isEmptyObject(opts),        // Check if the field options are set using HTML attributes
                emptyValidators = $.isEmptyObject(validators);  // Check if the field validators are set using HTML attributes

            if (!emptyValidators || (!emptyOptions && this.options.fields[field])) {
                opts.validators = validators;
                return opts;
            } else {
                return null;
            }
        },

        /**
         * Init field
         *
         * @param {String|jQuery} field The field name or field element
         */
        _initField: function(field) {
            var fields = $([]);
            switch (typeof field) {
                case 'object':
                    fields = field;
                    field  = field.attr('data-bv-field');
                    break;
                case 'string':
                    fields = this.getFieldElements(field);
                    fields.attr('data-bv-field', field);
                    break;
                default:
                    break;
            }

            if (this.options.fields[field] == null || this.options.fields[field].validators == null) {
                return;
            }

            // We don't need to validate non-existing fields
            if (fields.length == 0) {
                delete this.options.fields[field];
                return;
            }
            for (var validatorName in this.options.fields[field].validators) {
                if (!$.fn.bootstrapValidator.validators[validatorName]) {
                    delete this.options.fields[field].validators[validatorName];
                }
            }
            if (this.options.fields[field]['enabled'] == null) {
                this.options.fields[field]['enabled'] = true;
            }

            var that      = this,
                total     = fields.length,
                type      = fields.attr('type'),
                updateAll = (total == 1) || ('radio' == type) || ('checkbox' == type);

            for (var i = 0; i < total; i++) {
                var $field    = fields.eq(i),
                    $parent   = $field.parents('.form-group'),
                    // Allow user to indicate where the error messages are shown
                    container = this.options.fields[field].container || this.options.container,
                    $message  = (container && container != 'tooltip' && container != 'popover') ? $(container) : this._getMessageContainer($field);

                if (container && container != 'tooltip' && container != 'popover') {
                    $message.addClass('has-error');
                }

                // Remove all error messages and feedback icons
                $message.find('.help-block[data-bv-validator][data-bv-for="' + field + '"]').remove();
                $parent.find('i[data-bv-icon-for="' + field + '"]').remove();

                // Whenever the user change the field value, mark it as not validated yet
                var event = ('radio' == type || 'checkbox' == type || 'file' == type || 'SELECT' == $field.get(0).tagName) ? 'change' : this._changeEvent;
                $field.off(event + '.update.bv').on(event + '.update.bv', function() {
                    // Reset the flag
                    that._submitIfValid = false;
                    that.updateStatus($(this), that.STATUS_NOT_VALIDATED);
                });

                // Create help block elements for showing the error messages
                $field.data('bv.messages', $message);
                for (var validatorName in this.options.fields[field].validators) {
                    $field.data('bv.result.' + validatorName, this.STATUS_NOT_VALIDATED);

                    if (!updateAll || i == total - 1) {
                        $('<small/>')
                            .css('display', 'none')
                            .addClass('help-block')
                            .attr('data-bv-validator', validatorName)
                            .attr('data-bv-for', field)
                            .attr('data-bv-result', this.STATUS_NOT_VALIDATED)
                            .html(this.options.fields[field].validators[validatorName].message || this.options.fields[field].message || this.options.message)
                            .appendTo($message);
                    }
                }

                // Prepare the feedback icons
                // Available from Bootstrap 3.1 (http://getbootstrap.com/css/#forms-control-validation)
                if (this.options.fields[field].feedbackIcons !== false && this.options.fields[field].feedbackIcons !== 'false'
                    && this.options.feedbackIcons
                    && this.options.feedbackIcons.validating && this.options.feedbackIcons.invalid && this.options.feedbackIcons.valid
                    && (!updateAll || i == total - 1))
                {
                    $parent.removeClass('has-success').removeClass('has-error').addClass('has-feedback');
                    var $icon = $('<i/>')
                                    .css('display', 'none')
                                    .addClass('form-control-feedback')
                                    .attr('data-bv-icon-for', field)
                                    // Place it after the label containing the checkbox/radio
                                    // so when clicking the icon, it doesn't effect to the checkbox/radio element
                                    .insertAfter(('checkbox' == type || 'radio' == type) ? $field.parent() : $field);

                    // The feedback icon does not render correctly if there is no label
                    // https://github.com/twbs/bootstrap/issues/12873
                    if ($parent.find('label').length == 0) {
                        $icon.css('top', 0);
                    }
                    // Fix feedback icons in input-group
                    if ($parent.find('.input-group-addon').length != 0) {
                        $icon.css({
                            'top': 0,
                            'z-index': 100
                        });
                    }
                }
            }

            // Set live mode
            var trigger = this.options.fields[field].trigger || this.options.trigger || event,
                events  = $.map(trigger.split(' '), function(item) {
                    return item + '.live.bv';
                }).join(' ');
            switch (this.options.live) {
                case 'submitted':
                    break;
                case 'disabled':
                    fields.off(events);
                    break;
                case 'enabled':
                default:
                    fields.off(events).on(events, function() {
                        if (that._exceedThreshold($(this))) {
                            that.validateField($(this));
                        }
                    });
                    break;
            }

            this.$form.trigger($.Event('init.field.bv'), {
                field: field,
                element: fields
            });
        },

        /**
         * Get the element to place the error messages
         *
         * @param {jQuery} $field The field element
         * @returns {jQuery}
         */
        _getMessageContainer: function($field) {
            var $parent = $field.parent();
            if ($parent.hasClass('form-group')) {
                return $parent;
            }

            var cssClasses = $parent.attr('class');
            if (!cssClasses) {
                return this._getMessageContainer($parent);
            }

            cssClasses = cssClasses.split(' ');
            var n = cssClasses.length;
            for (var i = 0; i < n; i++) {
                if (/^col-(xs|sm|md|lg)-\d+$/.test(cssClasses[i]) || /^col-(xs|sm|md|lg)-offset-\d+$/.test(cssClasses[i])) {
                    return $parent;
                }
            }

            return this._getMessageContainer($parent);
        },

        /**
         * Called when all validations are completed
         */
        _submit: function() {
            var isValid   = this.isValid(),
                eventType = isValid ? 'success.form.bv' : 'error.form.bv',
                e         = $.Event(eventType);

            this.$form.trigger(e);

            // Call default handler
            // Check if whether the submit button is clicked
            if (this.$submitButton) {
                isValid ? this._onSuccess(e) : this._onError(e);
            }
        },

        /**
         * Check if the field is excluded.
         * Returning true means that the field will not be validated
         *
         * @param {jQuery} $field The field element
         * @returns {Boolean}
         */
        _isExcluded: function($field) {
            if (this.options.excluded) {
                // Convert to array first
                if ('string' == typeof this.options.excluded) {
                    this.options.excluded = $.map(this.options.excluded.split(','), function(item) {
                        // Trim the spaces
                        return $.trim(item);
                    });
                }

                var length = this.options.excluded.length;
                for (var i = 0; i < length; i++) {
                    if (('string' == typeof this.options.excluded[i] && $field.is(this.options.excluded[i]))
                        || ('function' == typeof this.options.excluded[i] && this.options.excluded[i].call(this, $field, this) == true))
                    {
                        return true;
                    }
                }
            }

            return false;
        },

        /**
         * Check if the number of characters of field value exceed the threshold or not
         *
         * @param {jQuery} $field The field element
         * @returns {Boolean}
         */
        _exceedThreshold: function($field) {
            var field     = $field.attr('data-bv-field'),
                threshold = this.options.fields[field].threshold || this.options.threshold;
            if (!threshold) {
                return true;
            }
            var cannotType = $.inArray($field.attr('type'), ['button', 'checkbox', 'file', 'hidden', 'image', 'radio', 'reset', 'submit']) != -1;
            return (cannotType || $field.val().length >= threshold);
        },

        // --- Events ---

        /**
         * The default handler of error.form.bv event.
         * It will be called when there is a invalid field
         *
         * @param {jQuery.Event} e The jQuery event object
         */
        _onError: function(e) {
            if (e.isDefaultPrevented()) {
                return;
            }

            if ('submitted' == this.options.live) {
                // Enable live mode
                this.options.live = 'enabled';
                var that = this;
                for (var field in this.options.fields) {
                    (function(f) {
                        var fields  = that.getFieldElements(f);
                        if (fields.length) {
                            var type    = $(fields[0]).attr('type'),
                                event   = ('radio' == type || 'checkbox' == type || 'file' == type || 'SELECT' == $(fields[0]).get(0).tagName) ? 'change' : that._changeEvent,
                                trigger = that.options.fields[field].trigger || that.options.trigger || event,
                                events  = $.map(trigger.split(' '), function(item) {
                                    return item + '.live.bv';
                                }).join(' ');

                            fields.off(events).on(events, function() {
                                if (that._exceedThreshold($(this))) {
                                    that.validateField($(this));
                                }
                            });
                        }
                    })(field);
                }
            }

            var $invalidField = this.$invalidFields.eq(0);
            if ($invalidField) {
                // Activate the tab containing the invalid field if exists
                var $tabPane = $invalidField.parents('.tab-pane'), tabId;
                if ($tabPane && (tabId = $tabPane.attr('id'))) {
                    $('a[href="#' + tabId + '"][data-toggle="tab"]').tab('show');
                }

                // Focus to the first invalid field
                $invalidField.focus();
            }
        },

        /**
         * The default handler of success.form.bv event.
         * It will be called when all the fields are valid
         *
         * @param {jQuery.Event} e The jQuery event object
         */
        _onSuccess: function(e) {
            if (e.isDefaultPrevented()) {
                return;
            }

            // Call the custom submission if enabled
            if (this.options.submitHandler && 'function' == typeof this.options.submitHandler) {
                // If you want to submit the form inside your submit handler, please call defaultSubmit() method
                this.options.submitHandler.call(this, this, this.$form);
            } else {
                this.disableSubmitButtons(true).defaultSubmit();
            }
        },

        /**
         * Called after validating a field element
         *
         * @param {jQuery} $field The field element
         * @param {String} [validatorName] The validator name
         */
        _onFieldValidated: function($field, validatorName) {
            var field         = $field.attr('data-bv-field'),
                validators    = this.options.fields[field].validators,
                counter       = {},
                numValidators = 0;

            // Trigger an event after given validator completes
            if (validatorName) {
                var data = {
                    field: field,
                    element: $field,
                    validator: validatorName
                };
                switch ($field.data('bv.result.' + validatorName)) {
                    case this.STATUS_INVALID:
                        this.$form.trigger($.Event('error.validator.bv'), data);
                        break;
                    case this.STATUS_VALID:
                        this.$form.trigger($.Event('success.validator.bv'), data);
                        break;
                    default:
                        break;
                }
            }

            counter[this.STATUS_NOT_VALIDATED] = 0;
            counter[this.STATUS_VALIDATING]    = 0;
            counter[this.STATUS_INVALID]       = 0;
            counter[this.STATUS_VALID]         = 0;

            for (var v in validators) {
                numValidators++;
                var result = $field.data('bv.result.' + v);
                if (result) {
                    counter[result]++;
                }
            }

            if (counter[this.STATUS_VALID] == numValidators) {
                // Remove from the list of invalid fields
                this.$invalidFields = this.$invalidFields.not($field);

                this.$form.trigger($.Event('success.field.bv'), {
                    field: field,
                    element: $field
                });
            }
            // If all validators are completed and there is at least one validator which doesn't pass
            else if (counter[this.STATUS_NOT_VALIDATED] == 0 && counter[this.STATUS_VALIDATING] == 0 && counter[this.STATUS_INVALID] > 0) {
                // Add to the list of invalid fields
                this.$invalidFields = this.$invalidFields.add($field);

                this.$form.trigger($.Event('error.field.bv'), {
                    field: field,
                    element: $field
                });
            }
        },

        // --- Public methods ---

        /**
         * Retrieve the field elements by given name
         *
         * @param {String} field The field name
         * @returns {null|jQuery[]}
         */
        getFieldElements: function(field) {
            if (!this._cacheFields[field]) {
                this._cacheFields[field] = (this.options.fields[field] && this.options.fields[field].selector)
                                         ? $(this.options.fields[field].selector)
                                         : this.$form.find('[name="' + field + '"]');
            }

            return this._cacheFields[field];
        },

        /**
         * Disable/enable submit buttons
         *
         * @param {Boolean} disabled Can be true or false
         * @returns {BootstrapValidator}
         */
        disableSubmitButtons: function(disabled) {
            if (!disabled) {
                this.$form.find(this.options.submitButtons).removeAttr('disabled');
            } else if (this.options.live != 'disabled') {
                // Don't disable if the live validating mode is disabled
                this.$form.find(this.options.submitButtons).attr('disabled', 'disabled');
            }

            return this;
        },

        /**
         * Validate the form
         *
         * @returns {BootstrapValidator}
         */
        validate: function() {
            if (!this.options.fields) {
                return this;
            }
            this.disableSubmitButtons(true);

            for (var field in this.options.fields) {
                this.validateField(field);
            }

            this._submit();

            return this;
        },

        /**
         * Validate given field
         *
         * @param {String|jQuery} field The field name or field element
         * @returns {BootstrapValidator}
         */
        validateField: function(field) {
            var fields = $([]), type;
            switch (typeof field) {
                case 'object':
                    fields = field;
                    field  = field.attr('data-bv-field');
                    break;
                case 'string':
                    fields = this.getFieldElements(field);
                    break;
                default:
                    break;
            }

            if (this.options.fields[field] && this.options.fields[field]['enabled'] == false) {
                return this;
            }

            var that       = this,
                type       = fields.attr('type'),
                total      = ('radio' == type || 'checkbox' == type) ? 1 : fields.length,
                updateAll  = ('radio' == type || 'checkbox' == type),
                validators = this.options.fields[field].validators,
                validatorName,
                validateResult;

            for (var i = 0; i < total; i++) {
                var $field = fields.eq(i);
                if (this._isExcluded($field)) {
                    continue;
                }

                for (validatorName in validators) {
                    if ($field.data('bv.dfs.' + validatorName)) {
                        $field.data('bv.dfs.' + validatorName).reject();
                    }

                    // Don't validate field if it is already done
                    var result = $field.data('bv.result.' + validatorName);
                    if (result == this.STATUS_VALID || result == this.STATUS_INVALID) {
                        this._onFieldValidated($field, validatorName);
                        continue;
                    }

                    $field.data('bv.result.' + validatorName, this.STATUS_VALIDATING);
                    validateResult = $.fn.bootstrapValidator.validators[validatorName].validate(this, $field, validators[validatorName]);

                    // validateResult can be a $.Deferred object ...
                    if ('object' == typeof validateResult) {
                        this.updateStatus(updateAll ? field : $field, this.STATUS_VALIDATING, validatorName);
                        $field.data('bv.dfs.' + validatorName, validateResult);

                        validateResult.done(function($f, v, isValid, message) {
                            // v is validator name
                            $f.removeData('bv.dfs.' + v);
                            if (message) {
                                // Update the error message
                                $field.data('bv.messages').find('.help-block[data-bv-validator="' + v + '"][data-bv-for="' + $f.attr('data-bv-field') + '"]').html(message);
                            }

                            that.updateStatus(updateAll ? $f.attr('data-bv-field') : $f, isValid ? that.STATUS_VALID : that.STATUS_INVALID, v);

                            if (isValid && that._submitIfValid == true) {
                                // If a remote validator returns true and the form is ready to submit, then do it
                                that._submit();
                            }
                        });
                    }
                    // ... or a boolean value
                    else if ('boolean' == typeof validateResult) {
                        this.updateStatus(updateAll ? field : $field, validateResult ? this.STATUS_VALID : this.STATUS_INVALID, validatorName);
                    }
                }
            }

            return this;
        },

        /**
         * Update all validating results of field
         *
         * @param {String|jQuery} field The field name or field element
         * @param {String} status The status. Can be 'NOT_VALIDATED', 'VALIDATING', 'INVALID' or 'VALID'
         * @param {String} [validatorName] The validator name. If null, the method updates validity result for all validators
         * @returns {BootstrapValidator}
         */
        updateStatus: function(field, status, validatorName) {
            var fields = $([]), type;
            switch (typeof field) {
                case 'object':
                    fields = field;
                    field  = field.attr('data-bv-field');
                    break;
                case 'string':
                    fields = this.getFieldElements(field);
                    break;
                default:
                    break;
            }

            var that  = this,
                type  = fields.attr('type'),
                total = ('radio' == type || 'checkbox' == type) ? 1 : fields.length;

            for (var i = 0; i < total; i++) {
                var $field       = fields.eq(i),
                    $parent      = $field.parents('.form-group'),
                    $message     = $field.data('bv.messages'),
                    $allErrors   = $message.find('.help-block[data-bv-validator][data-bv-for="' + field + '"]'),
                    $errors      = validatorName ? $allErrors.filter('[data-bv-validator="' + validatorName + '"]') : $allErrors,
                    $icon        = $parent.find('.form-control-feedback[data-bv-icon-for="' + field + '"]'),
                    container    = this.options.fields[field].container || this.options.container,
                    isValidField = null;

                // Update status
                if (validatorName) {
                    $field.data('bv.result.' + validatorName, status);
                } else {
                    for (var v in this.options.fields[field].validators) {
                        $field.data('bv.result.' + v, status);
                    }
                }

                // Show/hide error elements and feedback icons
                $errors.attr('data-bv-result', status);

                // Determine the tab containing the element
                var $tabPane = $field.parents('.tab-pane'),
                    tabId, $tab;
                if ($tabPane && (tabId = $tabPane.attr('id'))) {
                    $tab = $('a[href="#' + tabId + '"][data-toggle="tab"]').parent();
                }

                switch (status) {
                    case this.STATUS_VALIDATING:
                        isValidField = null;
                        this.disableSubmitButtons(true);
                        $parent.removeClass('has-success').removeClass('has-error');
                        if ($icon) {
                            $icon.removeClass(this.options.feedbackIcons.valid).removeClass(this.options.feedbackIcons.invalid).addClass(this.options.feedbackIcons.validating).show();
                        }
                        if ($tab) {
                            $tab.removeClass('bv-tab-success').removeClass('bv-tab-error');
                        }
                        break;

                    case this.STATUS_INVALID:
                        isValidField = false;
                        this.disableSubmitButtons(true);
                        $parent.removeClass('has-success').addClass('has-error');
                        if ($icon) {
                            $icon.removeClass(this.options.feedbackIcons.valid).removeClass(this.options.feedbackIcons.validating).addClass(this.options.feedbackIcons.invalid).show();
                        }
                        if ($tab) {
                            $tab.removeClass('bv-tab-success').addClass('bv-tab-error');
                        }
                        break;

                    case this.STATUS_VALID:
                        // If the field is valid (passes all validators)
                        isValidField = ($allErrors.filter('[data-bv-result="' + this.STATUS_NOT_VALIDATED +'"]').length == 0)
                                     ? ($allErrors.filter('[data-bv-result="' + this.STATUS_VALID +'"]').length == $allErrors.length)   // All validators are completed
                                     : null;                                                                                            // There are some validators that have not done
                        if (isValidField != null) {
                            this.disableSubmitButtons(this.$submitButton ? !this.isValid() : !isValidField);
                            if ($icon) {
                                $icon
                                    .removeClass(this.options.feedbackIcons.invalid).removeClass(this.options.feedbackIcons.validating).removeClass(this.options.feedbackIcons.valid)
                                    .addClass(isValidField ? this.options.feedbackIcons.valid : this.options.feedbackIcons.invalid)
                                    .show();
                            }
                        }

                        $parent.removeClass('has-error has-success').addClass(this.isValidContainer($parent) ? 'has-success' : 'has-error');
                        if ($tab) {
                            $tab.removeClass('bv-tab-success').removeClass('bv-tab-error').addClass(this.isValidContainer($tabPane) ? 'bv-tab-success' : 'bv-tab-error');
                        }
                        break;

                    case this.STATUS_NOT_VALIDATED:
                    default:
                        isValidField = null;
                        this.disableSubmitButtons(false);
                        $parent.removeClass('has-success').removeClass('has-error');
                        if ($icon) {
                            $icon.removeClass(this.options.feedbackIcons.valid).removeClass(this.options.feedbackIcons.invalid).removeClass(this.options.feedbackIcons.validating).hide();
                        }
                        if ($tab) {
                            $tab.removeClass('bv-tab-success').removeClass('bv-tab-error');
                        }
                        break;
                }

                switch (true) {
                    // Only show the first error message if it is placed inside a tooltip ...
                    case ($icon && 'tooltip' == container):
                        (isValidField === false)
                                ? $icon.css('cursor', 'pointer').tooltip('destroy').tooltip({
                                    html: true,
                                    placement: 'top',
                                    title: $allErrors.filter('[data-bv-result="' + that.STATUS_INVALID + '"]').eq(0).html()
                                })
                                : $icon.css('cursor', '').tooltip('destroy');
                        break;
                    // ... or popover
                    case ($icon && 'popover' == container):
                        (isValidField === false)
                                ? $icon.css('cursor', 'pointer').popover('destroy').popover({
                                    content: $allErrors.filter('[data-bv-result="' + that.STATUS_INVALID + '"]').eq(0).html(),
                                    html: true,
                                    placement: 'top',
                                    trigger: 'hover click'
                                })
                                : $icon.css('cursor', '').popover('destroy');
                        break;
                    default:
                        (status == this.STATUS_INVALID) ? $errors.show() : $errors.hide();
                        break;
                }

                // Trigger an event
                this.$form.trigger($.Event('status.field.bv'), {
                    field: field,
                    element: $field,
                    status: status
                });
                this._onFieldValidated($field, validatorName);
            }

            return this;
        },

        /**
         * Check the form validity
         *
         * @returns {Boolean}
         */
        isValid: function() {
            for (var field in this.options.fields) {
                if (!this.isValidField(field)) {
                    return false;
                }
            }

            return true;
        },

        /**
         * Check if the field is valid or not
         *
         * @param {String|jQuery} field The field name or field element
         * @returns {Boolean}
         */
        isValidField: function(field) {
            var fields = $([]);
            switch (typeof field) {
                case 'object':
                    fields = field;
                    field  = field.attr('data-bv-field');
                    break;
                case 'string':
                    fields = this.getFieldElements(field);
                    break;
                default:
                    break;
            }
            if (fields.length == 0 || this.options.fields[field] == null || this.options.fields[field]['enabled'] == false) {
                return true;
            }

            var type  = fields.attr('type'),
                total = ('radio' == type || 'checkbox' == type) ? 1 : fields.length,
                $field, validatorName, status;
            for (var i = 0; i < total; i++) {
                $field = fields.eq(i);
                if (this._isExcluded($field)) {
                    continue;
                }

                for (validatorName in this.options.fields[field].validators) {
                    status = $field.data('bv.result.' + validatorName);
                    if (status != this.STATUS_VALID) {
                        return false;
                    }
                }
            }

            return true;
        },

        /**
         * Check if all fields inside a given container are valid.
         * It's useful when working with a wizard-like such as tab, collapse
         *
         * @param {jQuery} $container The container element
         * @returns {Boolean}
         */
        isValidContainer: function($container) {
            var that = this, map = {};
            $container.find('[data-bv-field]').each(function() {
                var field = $(this).attr('data-bv-field');
                if (!map[field]) {
                    map[field] = $(this);
                }
            });

            for (var field in map) {
                var $f = map[field];
                if ($f.data('bv.messages')
                      .find('.help-block[data-bv-validator][data-bv-for="' + field + '"]')
                      .filter(function() {
                          var v = $(this).attr('data-bv-validator');
                          return ($f.data('bv.result.' + v) && $f.data('bv.result.' + v) != that.STATUS_VALID);
                      })
                      .length != 0)
                {
                    // The field is not valid
                    return false;
                }
            }

            return true;
        },

        /**
         * Submit the form using default submission.
         * It also does not perform any validations when submitting the form
         *
         * It might be used when you want to submit the form right inside the submitHandler()
         */
        defaultSubmit: function() {
            if (this.$submitButton) {
                // Create hidden input to send the submit buttons
                $('<input/>')
                    .attr('type', 'hidden')
                    .attr('data-bv-submit-hidden', '')
                    .attr('name', this.$submitButton.attr('name'))
                    .val(this.$submitButton.val())
                    .appendTo(this.$form);
            }
            // Submit form
            this.$form.off('submit.bv').submit();
        },

        // Useful APIs which aren't used internally

        /**
         * Get the list of invalid fields
         *
         * @returns {jQuery[]}
         */
        getInvalidFields: function() {
            return this.$invalidFields;
        },

        /**
         * Returns the clicked submit button
         *
         * @returns {jQuery}
         */
        getSubmitButton: function() {
            return this.$submitButton;
        },

        /**
         * Get the error messages
         *
         * @param {String|jQuery} [field] The field name or field element
         * If the field is not defined, the method returns all error messages of all fields
         * @returns {String[]}
         */
        getErrors: function(field) {
            var that     = this,
                messages = [],
                $fields  = $([]);

            switch (true) {
                case (field && 'object' == typeof field):
                    $fields = field;
                    break;
                case (field && 'string' == typeof field):
                    var f = this.getFieldElements(field);
                    if (f.length > 0) {
                        var type = f.attr('type');
                        $fields = ('radio' == type || 'checkbox' == type) ? f.eq(0) : f;
                    }
                    break;
                default:
                    $fields = this.$invalidFields;
                    break;
            }

            $fields.each(function() {
                messages = messages.concat(
                    $(this)
                        .data('bv.messages')
                        .find('.help-block[data-bv-for="' + $(this).attr('data-bv-field') + '"][data-bv-result="' + that.STATUS_INVALID + '"]')
                        .map(function() {
                            return $(this).html()
                        })
                        .get()
                );
            });

            return messages;
        },

        /**
         * Add a new field
         *
         * @param {String|jQuery} field The field name or field element
         * @param {Object} [options] The validator rules
         * @returns {BootstrapValidator}
         */
        addField: function(field, options) {
            var fields = $([]);
            switch (typeof field) {
                case 'object':
                    fields = field;
                    field  = field.attr('data-bv-field') || field.attr('name');
                    break;
                case 'string':
                    delete this._cacheFields[field];
                    fields = this.getFieldElements(field);
                    break;
                default:
                    break;
            }

            fields.attr('data-bv-field', field);

            var type  = fields.attr('type'),
                total = ('radio' == type || 'checkbox' == type) ? 1 : fields.length;

            for (var i = 0; i < total; i++) {
                var $field = fields.eq(i);

                // Try to parse the options from HTML attributes
                var opts = this._parseOptions($field);
                opts = (opts == null) ? options : $.extend(true, options, opts);

                this.options.fields[field] = $.extend(true, this.options.fields[field], opts);

                // Update the cache
                this._cacheFields[field] = this._cacheFields[field] ? this._cacheFields[field].add($field) : $field;

                // Init the element
                this._initField(('checkbox' == type || 'radio' == type) ? field : $field);
            }

            this.disableSubmitButtons(false);
            // Trigger an event
            this.$form.trigger($.Event('added.field.bv'), {
                field: field,
                element: fields,
                options: this.options.fields[field]
            });

            return this;
        },

        /**
         * Remove a given field
         *
         * @param {String|jQuery} field The field name or field element
         * @returns {BootstrapValidator}
         */
        removeField: function(field) {
            var fields = $([]);
            switch (typeof field) {
                case 'object':
                    fields = field;
                    field  = field.attr('data-bv-field') || field.attr('name');
                    fields.attr('data-bv-field', field);
                    break;
                case 'string':
                    fields = this.getFieldElements(field);
                    break;
                default:
                    break;
            }

            if (fields.length == 0) {
                return this;
            }

            var type  = fields.attr('type'),
                total = ('radio' == type || 'checkbox' == type) ? 1 : fields.length;

            for (var i = 0; i < total; i++) {
                var $field = fields.eq(i);

                // Remove from the list of invalid fields
                this.$invalidFields = this.$invalidFields.not($field);

                // Update the cache
                this._cacheFields[field] = this._cacheFields[field].not($field);
            }

            if (!this._cacheFields[field] || this._cacheFields[field].length == 0) {
                delete this.options.fields[field];
            }
            if ('checkbox' == type || 'radio' == type) {
                this._initField(field);
            }

            this.disableSubmitButtons(false);
            // Trigger an event
            this.$form.trigger($.Event('removed.field.bv'), {
                field: field,
                element: fields
            });

            return this;
        },

        /**
         * Reset the form
         *
         * @param {Boolean} [resetFormData] Reset current form data
         * @returns {BootstrapValidator}
         */
        resetForm: function(resetFormData) {
            var field, fields, total, type, validator;
            for (field in this.options.fields) {
                fields = this.getFieldElements(field);
                total  = fields.length;

                for (var i = 0; i < total; i++) {
                    for (validator in this.options.fields[field].validators) {
                        fields.eq(i).removeData('bv.dfs.' + validator);
                    }
                }

                // Mark field as not validated yet
                this.updateStatus(field, this.STATUS_NOT_VALIDATED);

                if (resetFormData) {
                    type = fields.attr('type');
                    ('radio' == type || 'checkbox' == type) ? fields.removeAttr('checked').removeAttr('selected') : fields.val('');
                }
            }

            this.$invalidFields = $([]);
            this.$submitButton  = null;

            // Enable submit buttons
            this.disableSubmitButtons(false);

            return this;
        },

        /**
         * Enable/Disable all validators to given field
         *
         * @param {String} field The field name
         * @param {Boolean} enabled Enable/Disable field validators
         * @returns {BootstrapValidator}
         */
        enableFieldValidators: function(field, enabled) {
            if (this.options.fields[field]['enabled'] != enabled) {
                this.options.fields[field]['enabled'] = enabled;
                this.updateStatus(field, this.STATUS_NOT_VALIDATED);
            }

            return this;
        },

        /**
         * Destroy the plugin
         * It will remove all error messages, feedback icons and turn off the events
         */
        destroy: function() {
            var field, fields, $field, validator, $icon, container;
            for (field in this.options.fields) {
                fields    = this.getFieldElements(field);
                container = this.options.fields[field].container || this.options.container;
                for (var i = 0; i < fields.length; i++) {
                    $field = fields.eq(i);
                    $field
                        // Remove all error messages
                        .data('bv.messages')
                            .find('.help-block[data-bv-validator][data-bv-for="' + field + '"]').remove().end()
                            .end()
                        .removeData('bv.messages')
                        // Remove feedback classes
                        .parents('.form-group')
                            .removeClass('has-feedback has-error has-success')
                            .end()
                        // Turn off events
                        .off('.bv')
                        .removeAttr('data-bv-field');

                    // Remove feedback icons, tooltip/popover container
                    $icon = $field.parents('.form-group').find('i[data-bv-icon-for="' + field + '"]');
                    if ($icon) {
                        switch (container) {
                            case 'tooltip':
                                $icon.tooltip('destroy').remove();
                                break;
                            case 'popover':
                                $icon.popover('destroy').remove();
                                break;
                            default:
                                $icon.remove();
                                break;
                        }
                    }

                    for (validator in this.options.fields[field].validators) {
                        $field.removeData('bv.result.' + validator).removeData('bv.dfs.' + validator);
                    }
                }
            }

            // Enable submit buttons
            this.disableSubmitButtons(false);

            this.$form
                .removeClass(this.options.elementClass)
                .off('.bv')
                .removeData('bootstrapValidator')
                // Remove generated hidden elements
                .find('[data-bv-submit-hidden]').remove();
        }
    };

    // Plugin definition
    $.fn.bootstrapValidator = function(option) {
        var params = arguments;
        return this.each(function() {
            var $this   = $(this),
                data    = $this.data('bootstrapValidator'),
                options = 'object' == typeof option && option;
            if (!data) {
                data = new BootstrapValidator(this, options);
                $this.data('bootstrapValidator', data);
            }

            // Allow to call plugin method
            if ('string' == typeof option) {
                data[option].apply(data, Array.prototype.slice.call(params, 1));
            }
        });
    };

    // Available validators
    $.fn.bootstrapValidator.validators = {};

    $.fn.bootstrapValidator.Constructor = BootstrapValidator;

    // Helper methods, which can be used in validator class
    $.fn.bootstrapValidator.helpers = {
        /**
         * Validate a date
         *
         * @param {Number} year The full year in 4 digits
         * @param {Number} month The month number
         * @param {Number} day The day number
         * @param {Boolean} [notInFuture] If true, the date must not be in the future
         * @returns {Boolean}
         */
        date: function(year, month, day, notInFuture) {
            if (isNaN(year) || isNaN(month) || isNaN(day)) {
                return false;
            }

            if (year < 1000 || year > 9999 || month == 0 || month > 12) {
                return false;
            }
            var numDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
            // Update the number of days in Feb of leap year
            if (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0)) {
                numDays[1] = 29;
            }

            // Check the day
            if (day < 0 || day > numDays[month - 1]) {
                return false;
            }

            if (notInFuture === true) {
                var currentDate  = new Date(),
                    currentYear  = currentDate.getFullYear(),
                    currentMonth = currentDate.getMonth(),
                    currentDay   = currentDate.getDate();
                return (year < currentYear
                        || (year == currentYear && month - 1 < currentMonth)
                        || (year == currentYear && month - 1 == currentMonth && day < currentDay));
            }

            return true;
        },

        /**
         * Implement Luhn validation algorithm
         * Credit to https://gist.github.com/ShirtlessKirk/2134376
         *
         * @see http://en.wikipedia.org/wiki/Luhn
         * @param {String} value
         * @returns {Boolean}
         */
        luhn: function(value) {
            var length  = value.length,
                mul     = 0,
                prodArr = [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9], [0, 2, 4, 6, 8, 1, 3, 5, 7, 9]],
                sum     = 0;

            while (length--) {
                sum += prodArr[mul][parseInt(value.charAt(length), 10)];
                mul ^= 1;
            }

            return (sum % 10 === 0 && sum > 0);
        },

        /**
         * Implement modulus 11, 10 (ISO 7064) algorithm
         *
         * @param {String} value
         * @returns {Boolean}
         */
        mod_11_10: function(value) {
            var check  = 5,
                length = value.length;
            for (var i = 0; i < length; i++) {
                check = (((check || 10) * 2) % 11 + parseInt(value.charAt(i), 10)) % 10;
            }
            return (check == 1);
        },

        /**
         * Implements Mod 37, 36 (ISO 7064) algorithm
         * Usages:
         * mod_37_36('A12425GABC1234002M')
         * mod_37_36('002006673085', '0123456789')
         *
         * @param {String} value
         * @param {String} alphabet
         * @returns {Boolean}
         */
        mod_37_36: function(value, alphabet) {
            alphabet = alphabet || '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            var modulus = alphabet.length,
                length  = value.length,
                check   = Math.floor(modulus / 2);
            for (var i = 0; i < length; i++) {
                check = (((check || modulus) * 2) % (modulus + 1) + alphabet.indexOf(value.charAt(i))) % modulus;
            }
            return (check == 1);
        }
    };


    /* Plugin notEmpty */
    $.fn.bootstrapValidator.validators.notEmpty = {
        enableByHtml5: function($field) {
            var required = $field.attr('required') + '';
            return ('required' == required || 'true' == required);
        },

        /**
         * Check if input value is empty or not
         *
         * @param {BootstrapValidator} validator The validator plugin instance
         * @param {jQuery} $field Field element
         * @param {Object} options
         * @returns {Boolean}
         */
        validate: function(validator, $field, options) {
            var type = $field.attr('type');
            if ('radio' == type || 'checkbox' == type) {
                return validator
                            .getFieldElements($field.attr('data-bv-field'))
                            .filter(':checked')
                            .length > 0;
            }

            return $.trim($field.val()) != '';
        }
    };
    /* End Plugin notEmpty */

   /* Plugin URI */
   $.fn.bootstrapValidator.validators.uri = {
      html5Attributes: {
         message: 'message',
         allowlocal: 'allowLocal'
      },

      enableByHtml5: function ($field) {
         return ('url' == $field.attr('type'));
      },

      /**
       * Return true if the input value is a valid URL
       *
       * @param {BootstrapValidator} validator The validator plugin instance
       * @param {jQuery} $field Field element
       * @param {Object} options
       * - message: The error message
       * - allowLocal: Allow the private and local network IP. Default to false
       * @returns {Boolean}
       */
      validate: function (validator, $field, options) {
         var value = $field.val();
         if (value == '') {
            return true;
         }

         // Credit to https://gist.github.com/dperini/729294
         //
         // Regular Expression for URL validation
         //
         // Author: Diego Perini
         // Updated: 2010/12/05
         //
         // the regular expression composed & commented
         // could be easily tweaked for RFC compliance,
         // it was expressly modified to fit & satisfy
         // these test for an URL shortener:
         //
         //   http://mathiasbynens.be/demo/url-regex
         //
         // Notes on possible differences from a standard/generic validation:
         //
         // - utf-8 char class take in consideration the full Unicode range
         // - TLDs have been made mandatory so single names like "localhost" fails
         // - protocols have been restricted to ftp, http and https only as requested
         //
         // Changes:
         //
         // - IP address dotted notation validation, range: 1.0.0.0 - 223.255.255.255
         //   first and last IP address of each class is considered invalid
         //   (since they are broadcast/network addresses)
         //
         // - Added exclusion of private, reserved and/or local networks ranges
         //
         var allowLocal = options.allowLocal == true || options.allowLocal == 'true',
            urlExp = new RegExp(
               "^" +
               // protocol identifier
               "(?:(?:https?|ftp)://)" +
               // user:pass authentication
               "(?:\\S+(?::\\S*)?@)?" +
               "(?:" +
               // IP address exclusion
               // private & local networks
               (allowLocal ? '' : ("(?!(?:10|127)(?:\\.\\d{1,3}){3})" +
                  "(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})" +
                  "(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})")) +
               // IP address dotted notation octets
               // excludes loopback network 0.0.0.0
               // excludes reserved space >= 224.0.0.0
               // excludes network & broadcast addresses
               // (first & last IP address of each class)
               "(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])" +
               "(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}" +
               "(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))" +
               "|" +
               // host name
               "(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)" +
               // domain name
               "(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*" +
               // TLD identifier
               "(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))" +
               ")" +
               // port number
               "(?::\\d{2,5})?" +
               // resource path
               "(?:/[^\\s]*)?" +
               "$", "i"
            );

         return urlExp.test(value);
      }
   };
   /* End Plugin URI */

   /* Plugin Email */
   $.fn.bootstrapValidator.validators.emailAddress = {
      enableByHtml5: function ($field) {
         return ('email' == $field.attr('type'));
      },

      /**
       * Return true if and only if the input value is a valid email address
       *
       * @param {BootstrapValidator} validator Validate plugin instance
       * @param {jQuery} $field Field element
       * @param {Object} options
       * @returns {Boolean}
       */
      validate: function (validator, $field, options) {
         var value = $field.val();
         if (value == '') {
            return true;
         }

         // Email address regular expression
         // http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
         var emailRegExp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
         return emailRegExp.test(value);
      }
   }
   /* End Plugin Email */

   /* Plugin Test */
   /* End Plugin Test */
}(window.jQuery));
/********************************* End Template Valid */

/**
 * Template Growl
***/
/*
;(function($, window, document, undefined) {

	var bootstrap_growl_remove = [];

	$.growl = function(content, options) {
		var message = null,
			title = null,
			icon = null,
			$growl, growlClass, css, offsetAmount;

		if (Object.prototype.toString.call(content) == "[object Object]") {
			message = content.message;
			title = " "+content.title+" ";
			icon = content.icon;
		}else{
			message = content;
		}

		if (options.position) {
			if (options.position.from === undefined) {
				options.position.from = $.growl.default_options.position.from;
			}
			if (options.position.align === undefined) {
				options.position.align = $.growl.default_options.position.align;
			}
		}
		if (options.template) {
			if (options.template.icon_type === undefined) {
				options.template.icon_type = $.growl.default_options.template.icon_type;
			}
			if (options.template.container === undefined) {
				options.template.container = $.growl.default_options.template.container;
			}
			if (options.template.dismiss === undefined) {
				options.template.dismiss = $.growl.default_options.template.dismiss;
			}
			if (options.template.title === undefined) {
				options.template.title = $.growl.default_options.template.title;
			}
		}

		options = $.extend({}, $.growl.default_options, options);

		if (options.template.icon_type === 'class') {
			options.template.icon = '<span class="">';
		}else{
			options.template.icon = '<img src="" />';
		}

		growlClass = "bootstrap-growl-" + options.position.from + "-" + options.position.align;
		$growl = $(options.template.container); $growl.addClass(growlClass);
		if (options.type) {
			$growl.addClass("alert-" + options.type);
		} else {
			$growl.addClass("alert-info");
		}
		if (options.allow_dismiss) {
			$growl.append($(options.template.dismiss));
		}
		if (icon) {
			if (options.template.icon) {
				if (options.template.icon_type == "class") {
					$growl.append($(options.template.icon).addClass(icon));
				}else{
					$growl.append($(options.template.icon).attr('src',icon));
				}
			}else{
				$growl.append(icon);
			}
		}
		if (title) {
			if (options.template.title) {
				$growl.append($(options.template.title).html(title));
			}else{
				$growl.append(title);
			}
			$growl.append(options.template.title_divider);
		}
		if (options.template.message) {
			$growl.append($(options.template.message).html(message));
		}else{
			$growl.append(message);
		}

		offsetAmount = options.offset;
		$("."+growlClass).each(function() {
			return offsetAmount = Math.max(offsetAmount, parseInt($(this).css(options.position.from)) + $(this).outerHeight() + options.spacing);
		});
		css = {
			"position": (options.ele === "body" ? "fixed" : "absolute"),
			"margin": 0,
			"z-index": options.z_index,
			"display": "none"
		};
		css[options.position.from] = offsetAmount + "px";
		$growl.css(css);
		$(options.ele).append($growl);
		switch (options.position.align) {
			case "center":
				$growl.css({
					"left": "50%",
					"marginLeft": -($growl.outerWidth() / 2) + "px"
				});
				break;
			case "left":
				$growl.css("left", options.offset + "px");
				break;
			default:
				$growl.css("right", options.offset + "px");
		}

		if (options.onGrowlFadeInStart != null) {
			return options.onGrowlFadeInStart;
		}
		$growl.fadeIn(options.fade_in, function() {
			if (options.onGrowlFadeInComplete != null) {
				return options.onGrowlFadeInComplete;
			}

			if (options.delay > 0) {
				if (options.pause_on_mouseover == true) {
					$growl.on('mouseover', function() {
						clearTimeout(bootstrap_growl_remove[$growl.index()]);
					}).on('mouseleave', function() {
						bootstrap_growl_remove[$growl.index()] = setTimeout(function() {
							return $growl.alert("close");
						}, options.delay);
					});
				}

				bootstrap_growl_remove[$growl.index()] = setTimeout(function() {
					return $growl.alert("close");
				}, options.delay);
			}
		});

		$growl.bind('close.bs.alert', function () {
			if (options.onGrowlClose) {
				return options.onGrowlClose;
			}
		});

		$growl.bind('closed.bs.alert', function () {
			var pos = $(this).css(options.position.from);
			$(this).nextAll('.'+growlClass).each(function() {
				$(this).css(options.position.from , pos);
				pos = (parseInt(pos)+(options.spacing*2)) + $(this).height() + (options.spacing*2);
			});
			if (options.onGrowlClosed) {
				return options.onGrowlClosed;
			}
		});

	};

	$.growl.default_options = {
		ele: "body",
		type: "info",
		allow_dismiss: true,
		position: {
			from: "top",
			align: "right"
		},
		offset: 20,
		spacing: 10,
		z_index: 1031,
		fade_in: 400,
		delay: 5000,
		pause_on_mouseover: false,
		onGrowlFadeInStart: null,
		onGrowlFadeInComplete: null,
		onGrowlClose: null,
		onGrowlClosed: null,
		template: {
			icon_type: 'class',
			container: '<div class="col-xs-10 col-sm-10 col-md-3 alert">',
			dismiss: '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>',
			title: '<strong>',
			title_divider: '',
			message: ''
		}
	};

})(jQuery, window, document);
*/
/********************************* End Template Growl */

/**
 * Template Arrow
***/
(function( $ ){

  $.fn.bootstrapArrows = function() {

    return this.each(function() {

      var $this = $(this);

	  var angle = $this.data('angle');

	  $this.css('-webkit-transform','rotate('+angle+'deg)');
	  $this.css('-moz-transform','rotate('+angle+'deg)');
	  $this.css('-o-transform','rotate('+angle+'deg)');
	  $this.css('-ms-transform','rotate('+angle+'deg)');
	  $this.css('transform','rotate('+angle+'deg)');

    });

  };
})( jQuery );
/********************************* End Template Arrow */

/**
 * Template Max Length
***/
(function ($) {
   'use strict';
   /**
    * We need an event when the elements are destroyed
    * because if an input is remvoed, we have to remove the
    * maxlength object associated (if any).
    * From:
    * http://stackoverflow.com/questions/2200494/jquery-trigger-event-when-an-element-is-removed-from-the-dom
    */
   if (!$.event.special.destroyed) {
      $.event.special.destroyed = {
         remove: function (o) {
            if (o.handler) {
               o.handler();
            }
         }
      };
   }


   $.fn.extend({
      maxlength: function (options, callback) {

         var documentBody = $('body'),
            defaults = {
               showOnReady: false, // true to always show when indicator is ready
               alwaysShow: false, // if true the indicator it's always shown.
               threshold: 10, // Represents how many chars left are needed to show up the counter
               warningClass: 'label label-success',
               limitReachedClass: 'label label-important',
               separator: ' / ',
               preText: '',
               postText: '',
               showMaxLength: true,
               placement: 'bottom',
               showCharsTyped: true, // show the number of characters typed and not the number of characters remaining
               validate: false, // if the browser doesn't support the maxlength attribute, attempt to type more than
               // the indicated chars, will be prevented.
               utf8: false, // counts using bytesize rather than length.  eg: '£' is counted as 2 characters.

               appendToParent: false // append the indicator to the input field's parent instead of body
            };

         if ($.isFunction(options) && !callback) {
            callback = options;
            options = {};
         }
         options = $.extend(defaults, options);

         /**
          * Return the length of the specified input.
          *
          * @param input
          * @return {number}
          */
         function inputLength(input) {
            var text = input.val();

            // Remove all double-character (\r\n) linebreaks, so they're counted only once.
            text = text.replace(new RegExp('\r?\n', 'g'), '\n');
            // var matches = text.match(/\n/g);

            var currentLength = 0;

            if (options.utf8) {
               currentLength = utf8Length(input.val());
            } else {
               currentLength = input.val().length;
            }
            return currentLength;
         }

         /**
          * Return the length of the specified input in UTF8 encoding.
          *
          * @param input
          * @return {number}
          */
         function utf8Length(string) {
            var utf8length = 0;
            for (var n = 0; n < string.length; n++) {
               var c = string.charCodeAt(n);
               if (c < 128) {
                  utf8length++;
               } else if ((c > 127) && (c < 2048)) {
                  utf8length = utf8length + 2;
               } else {
                  utf8length = utf8length + 3;
               }
            }
            return utf8length;
         }

         /**
          * Return true if the indicator should be showing up.
          *
          * @param input
          * @param thereshold
          * @param maxlength
          * @return {number}
          */
         function charsLeftThreshold(input, thereshold, maxlength) {
            var output = true;
            if (!options.alwaysShow && (maxlength - inputLength(input) > thereshold)) {
               output = false;
            }
            return output;
         }

         /**
          * Returns how many chars are left to complete the fill up of the form.
          *
          * @param input
          * @param maxlength
          * @return {number}
          */
         function remainingChars(input, maxlength) {
            var length = maxlength - inputLength(input);
            return length;
         }

         /**
          * When called displays the indicator.
          *
          * @param indicator
          */
         function showRemaining(indicator) {
            indicator.css({
               display: 'block'
            });
         }

         /**
          * When called shows the indicator.
          *
          * @param indicator
          */
         function hideRemaining(indicator) {
            indicator.css({
               display: 'none'
            });
         }

         /**
          * This function updates the value in the indicator
          *
          * @param maxLengthThisInput
          * @param typedChars
          * @return String
          */
         function updateMaxLengthHTML(maxLengthThisInput, typedChars) {
            var output = '';
            if (options.message) {
               output = options.message.replace('%charsTyped%', typedChars)
                  .replace('%charsRemaining%', maxLengthThisInput - typedChars)
                  .replace('%charsTotal%', maxLengthThisInput);
            } else {
               if (options.preText) {
                  output += options.preText;
               }
               if (!options.showCharsTyped) {
                  output += maxLengthThisInput - typedChars;
               } else {
                  output += typedChars;
               }
               if (options.showMaxLength) {
                  output += options.separator + maxLengthThisInput;
               }
               if (options.postText) {
                  output += options.postText;
               }
            }
            return output;
         }

         /**
          * This function updates the value of the counter in the indicator.
          * Wants as parameters: the number of remaining chars, the element currently managed,
          * the maxLength for the current input and the indicator generated for it.
          *
          * @param remaining
          * @param currentInput
          * @param maxLengthCurrentInput
          * @param maxLengthIndicator
          */
         function manageRemainingVisibility(remaining, currentInput, maxLengthCurrentInput, maxLengthIndicator) {
            maxLengthIndicator.html(updateMaxLengthHTML(maxLengthCurrentInput, (maxLengthCurrentInput - remaining)));

            if (remaining > 0) {
               if (charsLeftThreshold(currentInput, options.threshold, maxLengthCurrentInput)) {
                  showRemaining(maxLengthIndicator.removeClass(options.limitReachedClass).addClass(options.warningClass));
               } else {
                  hideRemaining(maxLengthIndicator);
               }
            } else {
               showRemaining(maxLengthIndicator.removeClass(options.warningClass).addClass(options.limitReachedClass));
            }
         }

         /**
          * This function returns an object containing all the
          * informations about the position of the current input
          *
          *  @param currentInput
          *  @return object {bottom height left right top  width}
          *
          */
         function getPosition(currentInput) {
            var el = currentInput[0];
            return $.extend({}, (typeof el.getBoundingClientRect === 'function') ? el.getBoundingClientRect() : {
               width: el.offsetWidth,
               height: el.offsetHeight
            }, currentInput.offset());
         }

         /**
          *  This function places the maxLengthIndicator at the
          *  top / bottom / left / right of the currentInput
          *
          *  @param currentInput
          *  @param maxLengthIndicator
          *  @return null
          *
          */
         function place(currentInput, maxLengthIndicator) {
            var pos = getPosition(currentInput),
               inputOuter = currentInput.outerWidth(),
               outerWidth = maxLengthIndicator.outerWidth(),
               actualWidth = maxLengthIndicator.width(),
               actualHeight = maxLengthIndicator.height();

            // get the right position if the indicator is appended to the input's parent
            if (options.appendToParent) {
               pos.top -= currentInput.parent().offset().top;
               pos.left -= currentInput.parent().offset().left;
            };

            switch (options.placement) {
            case 'bottom':
               maxLengthIndicator.css({
                  top: pos.top + pos.height,
                  left: pos.left + pos.width / 2 - actualWidth / 2
               });
               break;
            case 'top':
               maxLengthIndicator.css({
                  top: pos.top - actualHeight,
                  left: pos.left + pos.width / 2 - actualWidth / 2
               });
               break;
            case 'left':
               maxLengthIndicator.css({
                  top: pos.top + pos.height / 2 - actualHeight / 2,
                  left: pos.left - actualWidth
               });
               break;
            case 'right':
               maxLengthIndicator.css({
                  top: pos.top + pos.height / 2 - actualHeight / 2,
                  left: pos.left + pos.width
               });
               break;
            case 'bottom-right':
               maxLengthIndicator.css({
                  top: pos.top + pos.height,
                  left: pos.left + pos.width
               });
               break;
            case 'top-right':
               maxLengthIndicator.css({
                  top: pos.top - actualHeight,
                  left: pos.left + inputOuter
               });
               break;
            case 'top-left':
               maxLengthIndicator.css({
                  top: pos.top - actualHeight,
                  left: pos.left - outerWidth
               });
               break;
            case 'bottom-left':
               maxLengthIndicator.css({
                  top: pos.top + currentInput.outerHeight(),
                  left: pos.left - outerWidth
               });
               break;
            case 'centered-right':
               maxLengthIndicator.css({
                  top: pos.top + (actualHeight / 2),
                  left: pos.left + inputOuter - outerWidth - 3
               });
               break;

               // Some more options for placements
            case 'bottom-right-inside':
               maxLengthIndicator.css({
                  top: pos.top + pos.height,
                  left: pos.left + pos.width - outerWidth
               });
               break;
            case 'top-right-inside':
               maxLengthIndicator.css({
                  top: pos.top - actualHeight,
                  left: pos.left + inputOuter - outerWidth
               });
               break;
            case 'top-left-inside':
               maxLengthIndicator.css({
                  top: pos.top - actualHeight,
                  left: pos.left
               });
               break;
            case 'bottom-left-inside':
               maxLengthIndicator.css({
                  top: pos.top + currentInput.outerHeight(),
                  left: pos.left
               });
               break;
            }
         }

         /**
          *  This function retrieves the maximum length of currentInput
          *
          *  @param currentInput
          *  @return {number}
          *
          */
         function getMaxLength(currentInput) {
            return currentInput.attr('maxlength') || currentInput.attr('size');
         }

         return this.each(function () {

            var currentInput = $(this),
               maxLengthCurrentInput,
               maxLengthIndicator;

            $(window).resize(function () {
               if (maxLengthIndicator) {
                  place(currentInput, maxLengthIndicator);
               }
            });

            function firstInit() {
               var maxlengthContent = updateMaxLengthHTML(maxLengthCurrentInput, '0');
               maxLengthCurrentInput = getMaxLength(currentInput);

               if (!maxLengthIndicator) {
                  maxLengthIndicator = $('<span class="bootstrap-maxlength"></span>').css({
                     display: 'none',
                     position: 'absolute',
                     whiteSpace: 'nowrap',
                     zIndex: 1099
                  }).html(maxlengthContent);
               }

               // We need to detect resizes if we are dealing with a textarea:
               if (currentInput.is('textarea')) {
                  currentInput.data('maxlenghtsizex', currentInput.outerWidth());
                  currentInput.data('maxlenghtsizey', currentInput.outerHeight());

                  currentInput.mouseup(function () {
                     if (currentInput.outerWidth() !== currentInput.data('maxlenghtsizex') || currentInput.outerHeight() !== currentInput.data('maxlenghtsizey')) {
                        place(currentInput, maxLengthIndicator);
                     }

                     currentInput.data('maxlenghtsizex', currentInput.outerWidth());
                     currentInput.data('maxlenghtsizey', currentInput.outerHeight());
                  });
               }

               if (options.appendToParent) {
                  currentInput.parent().append(maxLengthIndicator);
                  currentInput.parent().css('position', 'relative');
               } else {
                  documentBody.append(maxLengthIndicator);
               };

               var remaining = remainingChars(currentInput, getMaxLength(currentInput));
               manageRemainingVisibility(remaining, currentInput, maxLengthCurrentInput, maxLengthIndicator);
               place(currentInput, maxLengthIndicator);
            };

            if (options.showOnReady) {
               currentInput.ready(function () {
                  firstInit();
               });
            } else {
               currentInput.focus(function () {
                  firstInit();
               });
            };

            currentInput.on('destroyed', function () {
               if (maxLengthIndicator) {
                  maxLengthIndicator.remove();
               };
            });

            currentInput.on('blur', function () {
               if (maxLengthIndicator && !options.showOnReady) {
                  maxLengthIndicator.remove();
               };
            });

            currentInput.keyup(function () {
               var remaining = remainingChars(currentInput, getMaxLength(currentInput)),
                  output = true;
               if (options.validate && remaining < 0) {
                  output = false;
               } else {
                  manageRemainingVisibility(remaining, currentInput, maxLengthCurrentInput, maxLengthIndicator);
               }

               //reposition the indicator if placement "bottom-right-inside" & "top-right-inside" is used
               if (options.placement == "bottom-right-inside" || options.placement == "top-right-inside") {
                  place(currentInput, maxLengthIndicator);
               };

               return output;
            });
         });
      }
   });
}(jQuery));
/********************************* End Template Max Length */

/**
 * Template Test
***/
/********************************* End Template Test */