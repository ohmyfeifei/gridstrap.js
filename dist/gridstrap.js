(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports['default'] = {
  DATA_GRIDSTRAP: 'gridstrap',
  DATA_HIDDEN_CELL: 'gridstrap-hidden-cell',
  DATA_VISIBLE_CELL: 'gridstrap-visible-cell',
  DATA_MOUSEDOWN_CELL_POSITION: 'gridstrap-mousedown-cell-position',
  DATA_MOUSEDOWN_PAGE_POSITION: 'gridstrap-mousedown-screen-position',
  DATA_CELL_POSITION_AND_SIZE: 'gridstrap-position-size',
  EVENT_DRAGSTART: 'dragstart',
  EVENT_MOUSEDOWN: 'mousedown',
  EVENT_MOUSEOVER: 'mouseover',
  EVENT_MOUSEMOVE: 'mousemove',
  EVENT_MOUSEUP: 'mouseup',
  EVENT_RESIZE: 'resize',
  EVENT_CELL_RESIZE: 'cellresize',
  ERROR_MISSING_JQUERY: 'Requires jQuery v?',
  ERROR_INVALID_ATTACH_ELEMENT: 'Cannot attach element that is not a child of gridstrap parent'
};
module.exports = exports['default'];

},{}],2:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _constants = require('./constants');

var _constants2 = _interopRequireDefault(_constants);

var _utils = require('./utils');

var _handlers = require('./handlers');

var _setup = require('./setup');

var _internal = require('./internal');

var _methods = require('./methods');

(function ($, window, document) {
  $.Gridstrap = function (el, options) {

    if (typeof jQuery == 'undefined') {
      throw new Error(_constants2['default'].ERROR_MISSING_JQUERY);
    }

    // To avoid scope issues, use 'context' instead of 'this'
    // to reference this class from internal events and functions.
    var context = this;

    // Access to jQuery and DOM versions of element
    context.$el = $(el);
    context.el = el;
    context.constants = _constants2['default'];
    context.options = $.extend({}, $.Gridstrap.defaultOptions, options);

    // Do nothing if it's already been done before.
    var existingInitialisation = context.$el.data(_constants2['default'].DATA_GRIDSTRAP);
    if (existingInitialisation) {
      if (context.options.debug) {
        console.log('Gridstrap already initialised for element: ' + context.el.nodeName);
      }
      return;
    }

    // Add a reverse reference to the DOM object
    context.$el.data(_constants2['default'].DATA_GRIDSTRAP, context);

    var setup = new _setup.Setup($, window, document, context.$el, context);
    var internal = new _internal.Internal(setup);
    var eventHandlers = new _handlers.Handlers(setup, internal);
    var methods = new _methods.Methods(setup, internal, eventHandlers);

    // copy methods from Methods to context.
    for (var _iterator = Object.getOwnPropertyNames(Object.getPrototypeOf(methods)), _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
      var _ref;

      if (_isArray) {
        if (_i >= _iterator.length) break;
        _ref = _iterator[_i++];
      } else {
        _i = _iterator.next();
        if (_i.done) break;
        _ref = _i.value;
      }

      var _name = _ref;

      var method = methods[_name];
      // skip constructor
      if (!(method instanceof Function) || method === _methods.Methods) continue;

      context[_name] = method.bind(methods);
    }

    internal.InitOriginalCells();
    internal.InitEventHandlers(eventHandlers);

    if (context.options.debug) {
      console.log('Gridstrap initialised for element: ' + context.el.nodeName);
    }
    // initialised :).
  };

  $.Gridstrap.defaultOptions = {
    gridCellSelector: '>*', // relative to parent element
    hiddenCellClass: 'gridstrap-cell-hidden',
    visibleCellClass: 'gridstrap-cell-visible',
    dragCellHandleSelector: '*', // relative to and including cell element.
    dragCellClass: 'gridstrap-cell-drag',
    resizeCellClass: 'gridstrap-cell-resize',
    mouseMoveSelector: 'body', // detect mousemouse and mouseup events within this element.
    visibleCellContainerParentSelector: null, // null by default, use Jquery parent element.
    visibleCellContainerClass: 'gridstrap-container',
    nonContiguousPlaceholderCellClass: 'gridstack-noncontiguous',
    getAbsolutePositionAndSizeOfCell: function getAbsolutePositionAndSizeOfCell($cell) {
      if (this.options.debug && !$cell.is(':visible')) {
        console.log('Grid cell is invisible. Gridstrap should not initialise an invisible grid. (' + this.el.nodeName + ': ' + $cell[0].nodeName + ')');
      }
      var position = $cell.position();
      var w = $cell.outerWidth();
      var h = $cell.outerHeight();
      return {
        x: position.left,
        y: position.top,
        w: w,
        h: h
      };
    },
    getHtmlOfSourceCell: function getHtmlOfSourceCell($cell) {
      return $cell[0].outerHTML;
    },
    setPositionOfDraggedCell: function setPositionOfDraggedCell(originalMouseDownCellPosition, originalMouseDownScreenPosition, $cell, mouseEvent) {
      var left = mouseEvent.pageX + originalMouseDownCellPosition.x - originalMouseDownScreenPosition.x;
      var top = mouseEvent.pageY + originalMouseDownCellPosition.y - originalMouseDownScreenPosition.y;
      $cell.css('left', left);
      $cell.css('top', top);
    },
    mouseMoveDragCallback: function mouseMoveDragCallback($cell, mouseEvent) {
      // do whatever you want.
      // return false to prevent normal operation.
    },
    enableDragging: true,
    rearrangeWhileDragging: true,
    swapMode: false,
    nonContiguousOptions: {
      selector: null,
      getHtml: function getHtml() {
        return null;
      }
    },
    updateCoordinatesOnWindowResize: true,
    debug: false,
    dragMouseoverThrottle: 500, //used for detecting which unique element is mouse-over.
    windowResizeDebounce: 50,
    resizeHandleSelector: null, // does not resize by default. Relative to cell.
    resizeOnDrag: true
  };

  $.fn.gridstrap = function (options) {
    return this.each(function () {
      new $.Gridstrap(this, options);
    });
  };
})(jQuery, window, document);

},{"./constants":1,"./handlers":3,"./internal":4,"./methods":5,"./setup":6,"./utils":7}],3:[function(require,module,exports){
'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _constants = require('./constants');

var _constants2 = _interopRequireDefault(_constants);

var _utils = require('./utils');

var Handlers = (function () {
  function Handlers(setup, internal) {
    _classCallCheck(this, Handlers);

    this.setup = setup;
    this.internal = internal;
  }

  Handlers.prototype.onDragstart = function onDragstart(mouseEvent, $cell, gridstrapContext) {
    var context = this.setup.Context;

    if (gridstrapContext === context) {
      mouseEvent.preventDefault();
    }
  };

  Handlers.prototype.onMousedown = function onMousedown(mouseEvent, $cell, gridstrapContext) {
    var $ = this.setup.jQuery;
    var context = this.setup.Context;
    var options = this.setup.Options;

    if (gridstrapContext !== context) {
      return;
    }

    if (options.resizeHandleSelector && $(mouseEvent.target).closest(options.resizeHandleSelector).length) {
      // is resizing, not dragging.
      if (!$cell.hasClass(options.resizeCellClass)) {
        $cell.addClass(options.resizeCellClass);

        this.internal.SetMouseDownData(mouseEvent, $cell);
      }

      return;
    }

    if (options.enableDragging && !$cell.hasClass(options.dragCellClass)) {

      this.internal.SetMouseDownData(mouseEvent, $cell);

      $cell.addClass(options.dragCellClass);

      this.internal.MoveDraggedCell(mouseEvent, $cell);
    }
  };

  Handlers.prototype.onMouseover = function onMouseover(mouseEvent, $cell, gridstrapContext) {
    var $ = this.setup.jQuery;
    var context = this.setup.Context;
    var options = this.setup.Options;

    // clear initially.
    this.internal.LastMouseOverCellTarget = null;

    if (!gridstrapContext.options.enableDragging) {
      return;
    }

    var $draggedCell = this.internal.$GetDraggingCell();
    if ($draggedCell.length) {
      // Is currently dragging.
      if ($cell.length && !$draggedCell.closest($cell).length) {
        // make sure you're not mouseover-ing the dragged cell itself.
        // css' 'pointer-events', 'none' should do this job, but this double checks.

        this.internal.LastMouseOverCellTarget = $cell;

        if (!_utils.Utils.IsElementThrottled($, $cell, options.dragMouseoverThrottle)) {
          // do not move two cells that have recently already moved.

          if (gridstrapContext.options.rearrangeWhileDragging) {

            this.internal.MoveCell($draggedCell, $cell, gridstrapContext);

            // fix dual broen
            hrthis.internal.SetMouseDownData(mouseEvent, $draggedCell);

            // reset dragged object to mouse pos, not pos of hidden cells.
            this.internal.MoveDraggedCell(mouseEvent, $draggedCell);
          }
        }
      }
    }
  };

  Handlers.prototype.onMousemove = function onMousemove(mouseEvent) {
    var $ = this.setup.jQuery;
    var context = this.setup.Context;
    var options = this.setup.Options;

    var $resizedCell = $(this.setup.ResizeCellSelector);
    if ($resizedCell.length) {
      // is resizing

      var originalMouseDownCellPosition = $resizedCell.data(_constants2['default'].DATA_MOUSEDOWN_CELL_POSITION);
      var originalMouseDownPagePosition = $resizedCell.data(_constants2['default'].DATA_MOUSEDOWN_PAGE_POSITION);

      var newW = originalMouseDownCellPosition.w + mouseEvent.pageX - originalMouseDownPagePosition.x;
      var newH = originalMouseDownCellPosition.h + mouseEvent.pageY - originalMouseDownPagePosition.y;

      $resizedCell.css('width', newW);
      $resizedCell.css('height', newH);

      if (options.resizeOnDrag) {
        this.internal.ResizeCell($resizedCell, newW, newH);
      }
    } else {

      var $draggedCell = this.internal.$GetDraggingCell();
      if ($draggedCell.length) {
        // should just be one.

        this.internal.MoveDraggedCell(mouseEvent, $draggedCell);

        // ATTEMPT TO GET NONCONTIG WOKING...
        ////////not overlapping any existing managed cell while dragging.
        var nonContiguousOptions = options.nonContiguousOptions;
        var nonContiguousSelector = nonContiguousOptions.selector;
        if (nonContiguousSelector && nonContiguousSelector.length) {

          var $hiddenCells = this.base.getHiddenCells();

          var lastHiddenCellPositionAndSize = options.getAbsolutePositionAndSizeOfCell.call(this.base, $hiddenCells.last());
          var draggedCellPositionAndSize = options.getAbsolutePositionAndSizeOfCell.call(this.base, $draggedCell);

          while (draggedCellPositionAndSize.y + draggedCellPositionAndSize.h > lastHiddenCellPositionAndSize.y) {
            // if mouse beyond or getting near end of static hidden element, then make some placeholder ones.
            // insert dummy cells if cursor is beyond where the cells finish.
            var $insertedCell = this.base.insertCell(nonContiguousOptions.getHtml(), $hiddenCells.length);
            $insertedCell.addClass(options.nonContiguousPlaceholderCellClass);
            var $insertedHiddenCell = $insertedCell.data(_constants2['default'].DATA_HIDDEN_CELL);

            // might have to keep adding them.
            lastHiddenCellPositionAndSize = options.getAbsolutePositionAndSizeOfCell.call(this.base, $insertedHiddenCell);
            draggedCellPositionAndSize = options.getAbsolutePositionAndSizeOfCell.call(this.base, $draggedCell);

            $hiddenCells = $hiddenCells.add($insertedHiddenCell);
          }
          // remove ones at end when we have too much.
          // THIS PART FIXINFG BELOW BPLEASE.l
          var $lastHiddenCell = $hiddenCells.last();
          while (draggedCellPositionAndSize.y + draggedCellPositionAndSize.h < lastHiddenCellPositionAndSize.y && $lastHiddenCell.data(_constants2['default'].DATA_VISIBLE_CELL).hasClass(options.nonContiguousPlaceholderCellClass)) {

            $hiddenCells = $hiddenCells.not($lastHiddenCell);

            this.base.RemoveCell($lastHiddenCell.data(_constants2['default'].DATA_VISIBLE_CELL));

            $lastHiddenCell = $hiddenCells.last();

            lastHiddenCellPositionAndSize = options.getAbsolutePositionAndSizeOfCell.call(this.base, $lastHiddenCell);
            var draggedCellPositionAndSize = options.getAbsolutePositionAndSizeOfCell.call(this.base, $draggedCell);
          }
        }
      }
    }
  };

  Handlers.prototype.onMouseup = function onMouseup(mouseEvent) {
    var $ = this.setup.jQuery;
    var context = this.setup.Context;
    var options = this.setup.Options;

    if (!options.enableDragging) {
      return;
    }

    var $resizedCell = $(this.setup.ResizeCellSelector);
    if (options.resizeHandleSelector && $resizedCell.length) {
      if (!options.resizeOnDrag) {
        var originalMouseDownCellPosition = $resizedCell.data(_constants2['default'].DATA_MOUSEDOWN_CELL_POSITION);
        var originalMouseDownPagePosition = $resizedCell.data(_constants2['default'].DATA_MOUSEDOWN_PAGE_POSITION);

        var newW = originalMouseDownCellPosition.w + mouseEvent.pageX - originalMouseDownPagePosition.x;
        var newH = originalMouseDownCellPosition.h + mouseEvent.pageY - originalMouseDownPagePosition.y;

        this.internal.ResizeCell($resizedCell, newW, newH);
      }

      $resizedCell.removeClass(options.resizeCellClass);
      $resizedCell.removeData(_constants2['default'].DATA_MOUSEDOWN_PAGE_POSITION);

      return;
    }

    var $draggedCell = this.internal.$GetDraggingCell();
    if ($draggedCell.length > 0) {

      // no more dragging.
      $draggedCell.removeClass(options.dragCellClass);
      $draggedCell.removeData(_constants2['default'].DATA_MOUSEDOWN_PAGE_POSITION);

      var cellOriginalPosition = $draggedCell.data(_constants2['default'].DATA_CELL_POSITION_AND_SIZE);
      context.setCellAbsolutePositionAndSize($draggedCell, cellOriginalPosition);

      if (this.internal.LastMouseOverCellTarget && !options.rearrangeWhileDragging) {
        // else just rearrange on mouseup
        this.internal.MoveCell($draggedCell, this.internal.LastMouseOverCellTarget, context);
      }
    }
  };

  return Handlers;
})();

exports.Handlers = Handlers;

},{"./constants":1,"./utils":7}],4:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _constants = require('./constants');

var _constants2 = _interopRequireDefault(_constants);

var _utils = require('./utils');

var Internal = (function () {
  function Internal(setup) {
    _classCallCheck(this, Internal);

    this.setup = setup;
    this.document = document;

    this.cellsArray = [];
  }

  Internal.prototype.InitOriginalCells = function InitOriginalCells() {
    var self = this;
    var $ = self.setup.jQuery;

    self.cellsArray = [];

    self.setup.$OriginalCells.each(function (e) {
      self.InitCellsHiddenCopyAndSetAbsolutePosition($(this));
    });
  };

  Internal.prototype.InitEventHandlers = function InitEventHandlers(eventHandlers) {
    var window = this.setup.Window;
    var context = this.setup.Context;
    var options = this.setup.Options;

    var appendNamespace = function appendNamespace(eventName) {
      return eventName + '.gridstrap';
    };

    this.HandleCellMouseEvent(context, '' + appendNamespace(_constants2['default'].EVENT_DRAGSTART), true, eventHandlers.onDragstart.bind(eventHandlers));

    this.HandleCellMouseEvent(context, '' + appendNamespace(_constants2['default'].EVENT_MOUSEDOWN), true, eventHandlers.onMousedown.bind(eventHandlers));
    // pass false as param because we need to do non-contiguous stuff in there.
    this.HandleCellMouseEvent(context, '' + appendNamespace(_constants2['default'].EVENT_MOUSEOVER), false, eventHandlers.onMouseover.bind(eventHandlers));

    // it is not appropriate to confine the events to the visible cell wrapper.
    $(options.mouseMoveSelector).on('' + appendNamespace(_constants2['default'].EVENT_MOUSEMOVE), eventHandlers.onMousemove.bind(eventHandlers)).on('' + appendNamespace(_constants2['default'].EVENT_MOUSEUP), eventHandlers.onMouseup.bind(eventHandlers));

    if (options.updateCoordinatesOnWindowResize) {
      $(window).on('' + appendNamespace(_constants2['default'].EVENT_RESIZE), _utils.Utils.Debounce(context.updateVisibleCellCoordinates, options.mouseMoveDebounce));
    }
  };

  Internal.prototype.InitCellsHiddenCopyAndSetAbsolutePosition = function InitCellsHiddenCopyAndSetAbsolutePosition($cell) {
    var $ = this.setup.jQuery;
    var context = this.setup.Context;
    var options = this.setup.Options;

    this.ModifyCellsArray(function (array) {
      return array.push($cell);
    });

    // Create html clone to take place of original $cell.
    // Treat it as the 'hidden' cell, and turn the original $cell
    // into the visible/absolute cell.

    var htmlOfOriginal = options.getHtmlOfSourceCell.call(context, $cell);
    var positionNSize = options.getAbsolutePositionAndSizeOfCell.call(context, $cell);

    $cell.before(htmlOfOriginal);
    var $hiddenClone = $cell.prev();

    $hiddenClone.addClass(options.hiddenCellClass);
    $cell.addClass(options.visibleCellClass);

    // make it ref hidden cloned cell, both ways.
    $cell.data(_constants2['default'].DATA_HIDDEN_CELL, $hiddenClone);
    $hiddenClone.data(_constants2['default'].DATA_VISIBLE_CELL, $cell);

    // put absolute $cell in container.
    $(this.setup.VisibleCellContainerSelector).append($cell.detach());

    context.setCellAbsolutePositionAndSize($cell, positionNSize);
  };

  Internal.prototype.HandleCellMouseEvent = function HandleCellMouseEvent(context, eventName, onlyCallWhenTargetsCell, callback) {
    // only call event if occured on one of managed cells that has been initialised.
    var draggableSelector = context.options.gridCellSelector + ' ' + context.options.dragCellHandleSelector;
    if (context.options.dragCellHandleSelector === $.Gridstrap.defaultOptions.dragCellHandleSelector || eventName === _constants2['default'].EVENT_MOUSEOVER) {
      // If the default settings apply for drag handle mouse events,
      // or if mouseover, then we want the event to be lenient as to what triggers it.
      // Prepend selector with grid cell itself as an OR/, selector.
      // To become the cell itself OR any dragCellHandleSelector within the cell.
      draggableSelector = context.options.gridCellSelector + ',' + draggableSelector;
    }

    $(context.options.visibleCellContainerParentSelector).on(eventName, draggableSelector, function (mouseEvent) {
      // user clicked on perhaps child element of draggable element.
      var $managedCell = context.$getCellOfElement(mouseEvent.target);

      if (onlyCallWhenTargetsCell && !$managedCell.length) {
        // do nothing if mouse is not interacting with a cell
        // and we're not meant to do anything unless it is.
        return;
      }
      // $managedCell may be null, callback needs to take care of that.
      callback(mouseEvent, $managedCell, context);
    });
  };

  Internal.prototype.SetMouseDownData = function SetMouseDownData(mouseEvent, $cell) {
    var context = this.setup.Context;
    var options = this.setup.Options;

    $cell.data(_constants2['default'].DATA_MOUSEDOWN_PAGE_POSITION, {
      x: mouseEvent.pageX,
      y: mouseEvent.pageY
    });
    $cell.data(_constants2['default'].DATA_MOUSEDOWN_CELL_POSITION, options.getAbsolutePositionAndSizeOfCell.call(context, $cell));
  };

  Internal.prototype.MoveDraggedCell = function MoveDraggedCell(mouseEvent, $cell) {
    var $ = this.setup.jQuery;
    var context = this.setup.Context;
    var options = this.setup.Options;
    var document = this.setup.Document;

    // TODO MAKE THIS AN EVENT.
    // user can do something custom for dragging if they want.
    var callbackResult = options.mouseMoveDragCallback.call(context, $cell, mouseEvent);
    if (!callbackResult && typeof callbackResult === 'boolean') {
      return;
    }

    var originalMouseDownCellPosition = $cell.data(_constants2['default'].DATA_MOUSEDOWN_CELL_POSITION);
    var originalMouseDownScreenPosition = $cell.data(_constants2['default'].DATA_MOUSEDOWN_PAGE_POSITION);

    options.setPositionOfDraggedCell.call(context, originalMouseDownCellPosition, originalMouseDownScreenPosition, $cell, mouseEvent);

    //now remove mouse events from dragged cell, because we need to test for overlap of underneath things.
    var oldPointerEvents = $cell.css('pointer-events');
    $cell.css('pointer-events', 'none');

    var triggerMouseOverEvent = function triggerMouseOverEvent($element) {
      $element.trigger($.Event(_constants2['default'].EVENT_MOUSEOVER, {
        pageX: mouseEvent.pageX,
        pageY: mouseEvent.pageY,
        target: $element[0]
      }));
    };
    var element = document.elementFromPoint(mouseEvent.clientX, mouseEvent.clientY);
    var cellAndIndex = this.GetCellAndInternalIndex(element);
    if (cellAndIndex) {
      // have to create event here like this other mouse coords are missing.
      triggerMouseOverEvent(cellAndIndex.$cell);
    } else {
      // have dragged over non-managed cell.
      // might be from a linked 'additional' gridstrap.
      if (this.AdditionalGridstrapDragTargetSelector) {
        $(this.AdditionalGridstrapDragTargetSelector).each(function () {

          var additionalContext = $(this).data(_constants2['default'].DATA_GRIDSTRAP);
          if (additionalContext) {
            // $getCellOfElement is a 'public' method.
            var $additionalContextCell = additionalContext.$getCellOfElement(element);
            if ($additionalContextCell.length) {
              // have to create event here like this other mouse coords are missing.
              triggerMouseOverEvent($additionalContextCell);
            }
          }
        });
      }
    }

    // restore pointer-events css.
    $cell.css('pointer-events', oldPointerEvents);
  };

  Internal.prototype.GetCellAndInternalIndex = function GetCellAndInternalIndex(element) {
    // element or jquery selector, child of cell or cell itself.

    var $ = this.setup.jQuery;
    var context = this.setup.Context;
    var options = this.setup.Options;

    if (!element) {
      return null;
    }

    var $visibleCellElement = $(element);

    var visibleCellAndIndex = null;
    // visibleCellAndIndex.$cell might be a child element/control perhaps of $visibleCell (found in the managed array).
    for (var i = 0; i < this.CellsArray.length && !visibleCellAndIndex; i++) {
      var $closestManagedCell = $visibleCellElement.closest(this.CellsArray[i]);
      if ($closestManagedCell.length > 0) {

        var $closestGridstrap = this.$GetClosestGridstrap($visibleCellElement);

        if ($closestGridstrap.is(context.$el)) {
          visibleCellAndIndex = {
            index: i,
            $cell: this.CellsArray[i]
          };
        }
      }
    }

    return visibleCellAndIndex;

    // I DONT THINK THIS IS NECESSARY?
    // check if linked hidden element is NOT in parent element.
    // let $linkedHiddenCell = visibleCellAndIndex.$cell.data(Constants.DATA_HIDDEN_CELL);
    // if (!$linkedHiddenCell.closest(base.$el).is(base.$el)) {
    //   return noCell;
    // }
  };

  Internal.prototype.$GetClosestGridstrap = function $GetClosestGridstrap(element) {
    // looks up the tree to find the closest instantiated gridstap instance. May not be this one in the case of nested grids.
    var $ = this.setup.jQuery;

    var dataExistsInSelector = function dataExistsInSelector(selector) {
      return $(selector).filter(function () {
        return !!$(this).data(_constants2['default'].DATA_GRIDSTRAP);
      });
    };
    // a little strange that we can;t select parents() and include element itself in the order desired, so we have to do it like this.
    var $currentElement = dataExistsInSelector(element);
    if ($currentElement.length) {
      return $currentElement.first();
    }
    return dataExistsInSelector($(element).parents()).first();
  };

  Internal.prototype.$GetDraggingCell = function $GetDraggingCell() {
    var $ = this.setup.jQuery;
    var context = this.setup.Context;
    var options = this.setup.Options;

    var $draggedCell = $(this.setup.DragCellSelector);
    if (!$draggedCell.length) {
      return $(); //empty set
    }
    // closest gridstrap must be this one - could be nested, we don't want to pick that up.
    var $closestGridstrap = this.$GetClosestGridstrap($draggedCell);
    if (!$closestGridstrap.is(context.$el)) {
      return $(); //empty set
    }

    return $draggedCell;
  };

  Internal.prototype.MoveCell = function MoveCell($movingVisibleCell, $targetVisibleCell, gridstrapContext) {
    var $ = this.setup.jQuery;
    var context = this.setup.Context;
    var options = this.setup.Options;

    var $hiddenDragged = $movingVisibleCell.data(_constants2['default'].DATA_HIDDEN_CELL);
    var $hiddenTarget = $targetVisibleCell.data(_constants2['default'].DATA_HIDDEN_CELL);

    if ($hiddenDragged.is($hiddenTarget)) {
      return;
    }

    if (gridstrapContext !== context) {
      // moving between different gridstraps.
      if (this.AdditionalGridstrapDragTargetSelector) {
        // moving cells from this gridstrap to another (targetGridstrap).
        // target must be within specified options at init.
        var $targetGridstrap = $(this.AdditionalGridstrapDragTargetSelector).filter(function () {
          return $(this).data(_constants2['default'].DATA_GRIDSTRAP) === gridstrapContext;
        }).first();

        if ($targetGridstrap.length) {
          if (options.swapMode) {

            var preDetachPositionTarget = gridstrapContext.options.getAbsolutePositionAndSizeOfCell.call(gridstrapContext, $targetVisibleCell);
            var preDetachPositionMoving = options.getAbsolutePositionAndSizeOfCell.call(context, $movingVisibleCell);

            var $detachedTargetOriginalCell = gridstrapContext.detachCell($targetVisibleCell);
            var $detachedMovingOriginalCell = context.detachCell($movingVisibleCell);
            var wasDragging = $detachedMovingOriginalCell.hasClass(options.dragCellClass);
            if (wasDragging) {
              $detachedMovingOriginalCell.removeClass(options.dragCellClass);
            }

            swapJQueryElements($detachedMovingOriginalCell, $detachedTargetOriginalCell);

            //re attach in opposing grids.
            var $reattachedMovingCell = gridstrapContext.attachCell($detachedMovingOriginalCell);
            var $reattachedTargetCell = context.attachCell($detachedTargetOriginalCell);

            // have to remove visibleCellClass that these two would now have
            // as that should have the css transition animation in it,
            // and we want to bypass that, set position, then apply it, set position again.
            $reattachedMovingCell.removeClass(options.visibleCellClass);
            $reattachedTargetCell.removeClass(options.visibleCellClass);

            gridstrapContext.setCellAbsolutePositionAndSize($reattachedMovingCell, preDetachPositionTarget);
            context.setCellAbsolutePositionAndSize($reattachedTargetCell, preDetachPositionMoving);

            $reattachedMovingCell.addClass(options.visibleCellClass);
            $reattachedTargetCell.addClass(options.visibleCellClass);

            if (wasDragging) {
              $reattachedMovingCell.addClass(options.dragCellClass);
            }

            gridstrapContext.updateVisibleCellCoordinates();
            context.updateVisibleCellCoordinates();
          } else {

            // insert mode.
            var preDetachPositionMoving = options.getAbsolutePositionAndSizeOfCell.call(context, $movingVisibleCell);

            var $detachedMovingOriginalCell = context.detachCell($movingVisibleCell);
            var wasDragging = $detachedMovingOriginalCell.hasClass(options.dragCellClass);
            if (wasDragging) {
              $detachedMovingOriginalCell.removeClass(options.dragCellClass);
            }

            _utils.Utils.DetachAndInsertInPlaceJQueryElement($detachedMovingOriginalCell, $hiddenTarget);

            var $reattachedMovingCell = gridstrapContext.attachCell($detachedMovingOriginalCell);

            // have to remove visibleCellClass that these two would now have
            // as that should have the css transition animation in it,
            // and we want to bypass that, set position, then apply it, set position again.
            $reattachedMovingCell.removeClass(options.visibleCellClass);

            gridstrapContext.setCellAbsolutePositionAndSize($reattachedMovingCell, preDetachPositionMoving);

            $reattachedMovingCell.addClass(options.visibleCellClass);

            if (wasDragging) {
              $reattachedMovingCell.addClass(options.dragCellClass);
            }

            gridstrapContext.updateVisibleCellCoordinates();
            context.updateVisibleCellCoordinates();
          }
        }
      }
    } else {
      // regular internal movement
      if (options.swapMode) {
        _utils.Utils.SwapJQueryElements($hiddenDragged, $hiddenTarget);
      } else {
        _utils.Utils.DetachAndInsertInPlaceJQueryElement($hiddenDragged, $hiddenTarget);
      }

      context.updateVisibleCellCoordinates();
    }
  };

  //~moveCell

  Internal.prototype.ResizeCell = function ResizeCell($cell, width, height) {
    var $ = this.setup.jQuery;
    var context = this.setup.Context;
    var $element = this.setup.$Element;

    var event = $.Event(_constants2['default'].EVENT_CELL_RESIZE, {
      width: width,
      height: height,
      target: $cell[0]
    });
    $element.trigger(event);

    if (event.isDefaultPrevented()) {
      return;
    }

    var $hiddenCell = $cell.data(_constants2['default'].DATA_HIDDEN_CELL);
    $hiddenCell.css('width', width);
    $hiddenCell.css('height', height);

    context.updateVisibleCellCoordinates();
  };

  Internal.prototype.$GetHiddenCellsInElementOrder = function $GetHiddenCellsInElementOrder() {
    var $ = this.setup.jQuery;
    var $element = this.setup.$Element;
    var self = this;

    // Get all hidden cloned cells, then see if their linked visible cells are managed. Base their returned order off hidden cell html order.

    // just find all children and work from there, can't rely on selcting via base.hiddenCellClass because later elements may have been added.
    var $attachedHiddenCells = $element.find('*').filter(function () {
      var $linkedVisibleCell = $(this).data(_constants2['default'].DATA_VISIBLE_CELL);
      if (!$linkedVisibleCell || !$linkedVisibleCell.length) {
        return false;
      }
      for (var i = 0; i < self.CellsArray.length; i++) {
        if (self.CellsArray[i].is($linkedVisibleCell)) {
          return true;
        }
      }
      return false;
    });

    return $attachedHiddenCells;
  };

  Internal.prototype.ModifyCellsArray = function ModifyCellsArray(callback) {
    callback(this.cellsArray);
  };

  _createClass(Internal, [{
    key: 'AdditionalGridstrapDragTargetSelector',
    get: function get() {
      return this.additionalGridstrapDragTargetSelector;
    },
    set: function set(value) {
      this.additionalGridstrapDragTargetSelector = value;
    }
  }, {
    key: 'LastMouseOverCellTarget',
    get: function get() {
      return this.lastMouseOverCellTarget;
    },
    set: function set(value) {
      this.lastMouseOverCellTarget = value;
    }
  }, {
    key: 'CellsArray',
    get: function get() {
      return this.cellsArray;
    }
  }]);

  return Internal;
})();

exports.Internal = Internal;

},{"./constants":1,"./utils":7}],5:[function(require,module,exports){
'use strict';

exports.__esModule = true;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _constants = require('./constants');

var _constants2 = _interopRequireDefault(_constants);

var _utils = require('./utils');

var _utils2 = _interopRequireDefault(_utils);

var Methods = (function () {
  function Methods(setup, internal, handlers) {
    _classCallCheck(this, Methods);

    this.setup = setup;
    this.internal = internal;
    this.handlers = handlers;
  }

  // initCellsHiddenCopyAndSetAbsolutePosition($cell){

  // }

  Methods.prototype.$getCellOfElement = function $getCellOfElement(element) {
    // could be selector
    var $ = this.setup.jQuery;
    var context = this.setup.Context;
    var options = this.setup.Options;

    var found = this.internal.GetCellAndInternalIndex(element);
    if (!found) {
      return $();
    }
    return found.$cell;
  };

  Methods.prototype.setCellAbsolutePositionAndSize = function setCellAbsolutePositionAndSize($cell, positionAndSize) {
    // relied upon when drag-stop.
    $cell.data(_constants2['default'].DATA_CELL_POSITION_AND_SIZE, positionAndSize);

    $cell.css('left', positionAndSize.x);
    $cell.css('top', positionAndSize.y);
    $cell.css('width', positionAndSize.w);
    $cell.css('height', positionAndSize.h);
  };

  Methods.prototype.updateVisibleCellCoordinates = function updateVisibleCellCoordinates() {
    var $ = this.setup.jQuery;
    var context = this.setup.Context;
    var options = this.setup.Options;

    for (var i = 0; i < this.internal.CellsArray.length; i++) {
      var $this = this.internal.CellsArray[i];

      var $hiddenClone = $this.data(_constants2['default'].DATA_HIDDEN_CELL);

      var positionNSizeOfHiddenClone = options.getAbsolutePositionAndSizeOfCell.call(context, $hiddenClone);

      this.setCellAbsolutePositionAndSize($this, positionNSizeOfHiddenClone);
    }
    // need to also update the first child gristrap - one that might exist within this one - it is then obviously recursive.
    for (var i = 0; i < this.internal.CellsArray.length; i++) {
      var $nestedGridstrap = this.internal.CellsArray[i].find('*').filter(function () {
        return !!$(this).data(_constants2['default'].DATA_GRIDSTRAP);
      });

      if ($nestedGridstrap.length) {
        $nestedGridstrap.first().data(_constants2['default'].DATA_GRIDSTRAP).updateVisibleCellCoordinates();
      }
    }
  };

  // returns jquery object of new cell.
  // index is optional.

  Methods.prototype.insertCell = function insertCell(cellHtml, index) {
    var $ = this.setup.jQuery;
    var $element = this.setup.$Element;

    var $existingHiddenCells = this.internal.$GetHiddenCellsInElementOrder();
    if (typeof index === 'undefined') {
      index = $existingHiddenCells.length; // insert at end.
    }

    var $insertedCell;
    if (index === $existingHiddenCells.length) {
      if ($existingHiddenCells.length === 0) {
        // the grid is empty.
        $insertedCell = $(cellHtml).appendTo($element);
      } else {
        $insertedCell = $(cellHtml).insertAfter($existingHiddenCells.last());
      }
    } else {
      $insertedCell = $(cellHtml).insertBefore($existingHiddenCells.eq(index));
    }

    this.attachCell($insertedCell);

    return $insertedCell;
  };

  Methods.prototype.attachCell = function attachCell(selector) {
    var $ = this.setup.jQuery;
    var options = this.setup.Options;
    var $element = this.setup.$Element;

    if (!$(selector).closest($element).is($element)) {
      throw new Error(_constants2['default'].ERROR_INVALID_ATTACH_ELEMENT);
    }

    this.internal.InitCellsHiddenCopyAndSetAbsolutePosition(selector);

    this.updateVisibleCellCoordinates();

    return $(selector);
  };

  Methods.prototype.detachCell = function detachCell(selector) {
    var options = this.setup.Options;

    var cellNIndex = this.internal.GetCellAndInternalIndex(selector);

    var $hiddenClone = cellNIndex.$cell.data(_constants2['default'].DATA_HIDDEN_CELL);

    var $detachedVisibleCell = cellNIndex.$cell.detach();

    // remove 'visible' things, and put the cell back where it came from.
    $detachedVisibleCell.css('top', '');
    $detachedVisibleCell.css('left', '');
    $detachedVisibleCell.css('width', '');
    $detachedVisibleCell.css('height', '');
    $detachedVisibleCell.removeData(_constants2['default'].DATA_HIDDEN_CELL);
    $detachedVisibleCell.removeClass(options.visibleCellClass);

    var $reattachedOriginalCell = $detachedVisibleCell.insertAfter($hiddenClone);

    // remove hidden clone.
    $hiddenClone.remove();

    // finally remove from managed array
    this.internal.ModifyCellsArray(function (array) {
      return array.splice(cellNIndex.index, 1);
    });

    return $reattachedOriginalCell;
  };

  Methods.prototype.removeCell = function removeCell(selector) {
    var $detachedCell = this.detachCell(selector);

    $detachedCell.remove();

    this.updateVisibleCellCoordinates();
  };

  Methods.prototype.moveCell = function moveCell(selector, toIndex, targetGridstrap) {
    var cellNIndex = this.internal.GetCellAndInternalIndex(selector);

    var $existingVisibleCells = this.$getCells();

    this.internal.MoveCell(cellNIndex.$cell, $existingVisibleCells.eq(toIndex));
  };

  Methods.prototype.moveCellToCoordinates = function moveCellToCoordinates(selector, x, y, targetGridstrap) {
    // TODO, use document.getlement at blah
  };

  Methods.prototype.$getCells = function $getCells() {
    var $ = this.setup.jQuery;

    var $attachedHiddenCells = this.internal.$GetHiddenCellsInElementOrder();

    var attachedVisibleCellElements = $attachedHiddenCells.map(function () {
      return $(this).data(_constants2['default'].DATA_VISIBLE_CELL)[0]; // TODO is this correct [0] ?
    });

    return $(attachedVisibleCellElements);
  };

  Methods.prototype.$getHiddenCells = function $getHiddenCells() {

    return this.internal.$GetHiddenCellsInElementOrder();
  };

  Methods.prototype.getCellContainer = function getCellContainer() {
    var $ = this.setup.jQuery;

    return $(this.setup.VisibleCellContainerSelector);
  };

  Methods.prototype.updateOptions = function updateOptions(newOptions) {
    var $ = this.setup.jQuery;
    var options = this.setup.Options;

    this.setup.Options = $.extend({}, options, newOptions);
  };

  Methods.prototype.getCellIndexOfElement = function getCellIndexOfElement(element) {
    // could be selector
    var $cell = this.$getCellOfElement(element);

    var $cells = this.$getCells();

    return $cells.index($cell);
  };

  Methods.prototype.setAdditionalGridstrapDragTarget = function setAdditionalGridstrapDragTarget(selector) {
    var $ = this.setup.jQuery;
    var eventHandlers = this.handlers;

    var self = this;
    var mouseOverAdditionalEventName = _constants2['default'].EVENT_MOUSEOVER + '.gridstrap-additional-' + this.setup.IdPrefix;

    if (self.internal.AdditionalGridstrapDragTargetSelector) {
      $(self.internal.AdditionalGridstrapDragTargetSelector).each(function () {
        var $visibleCellContainer = $($(this).data(_constants2['default'].DATA_GRIDSTRAP).options.visibleCellContainerParentSelector);

        // remove any old handlers.
        // have to prefix it to prevent clashes with other gridstraphs,
        $visibleCellContainer.off(mouseOverAdditionalEventName);
      });
    }

    self.internal.AdditionalGridstrapDragTargetSelector = selector;

    // handle certain mouse event for potential other gridstraps.
    if (self.internal.AdditionalGridstrapDragTargetSelector) {
      $(self.internal.AdditionalGridstrapDragTargetSelector).each(function () {

        self.internal.HandleCellMouseEvent($(this).data(_constants2['default'].DATA_GRIDSTRAP), mouseOverAdditionalEventName, false, eventHandlers.onMouseover.bind(eventHandlers));
      });
    }
  };

  Methods.prototype.modifyCell = function modifyCell(cellIndex, callback) {
    var context = this.setup.Context;

    var $visibleCell = this.$getCells().eq(cellIndex);
    var $hiddenCell = $visibleCell.data(_constants2['default'].DATA_HIDDEN_CELL);

    var getVisibleCellCalled = false,
        getHiddenCellCalled = false;

    callback.call(context, function () {
      getVisibleCellCalled = true;
      return $visibleCell;
    }, function () {
      getHiddenCellCalled = true;
      return $hiddenCell;
    });

    if (getVisibleCellCalled) {
      // copy contents to hidden cell.
      $hiddenCell.html($visibleCell.html());
    }

    this.updateVisibleCellCoordinates();
  };

  return Methods;
})();

exports.Methods = Methods;

},{"./constants":1,"./utils":7}],6:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _utils = require('./utils');

var Setup = (function () {
  function Setup($, window, document, $el, context) {
    _classCallCheck(this, Setup);

    var options = context.options;

    // must pick cells before potentially adding child wrapper to selection.
    this.$originalCells = $el.find(options.gridCellSelector);

    this.idPrefix = _utils.Utils.GenerateRandomId();

    var wrapperGeneratedId = 'gridstrap-' + this.idPrefix;
    this.visibleCellContainerSelector = '#' + wrapperGeneratedId;

    // drag selector must be within wrapper div. Turn class name/list into selector.
    this.dragCellSelector = this.visibleCellContainerSelector + ' ' + _utils.Utils.ConvertCssClassToJQuerySelector(options.dragCellClass) + ':first';
    this.resizeCellSelector = this.visibleCellContainerSelector + ' ' + _utils.Utils.ConvertCssClassToJQuerySelector(options.resizeCellClass) + ':first';
    // visibleCellContainerClassSelector just contains a .class selector, dont prfix with id. Important. Refactor this.
    this.visibleCellContainerClassSelector = _utils.Utils.ConvertCssClassToJQuerySelector(options.visibleCellContainerClass) + ':first';

    // if option not specified, use JQuery element as parent for wrapper.
    options.visibleCellContainerParentSelector = options.visibleCellContainerParentSelector || $el;
    $(options.visibleCellContainerParentSelector).append('<div id="' + wrapperGeneratedId + '" class="' + options.visibleCellContainerClass + '"></div>');

    this.window = window;
    this.document = document;
    this.$ = $;
    this.$el = $el;
    this.context = context;
  }

  _createClass(Setup, [{
    key: 'Window',
    get: function get() {
      return this.window;
    }
  }, {
    key: 'Document',
    get: function get() {
      return this.document;
    }
  }, {
    key: 'jQuery',
    get: function get() {
      return this.$;
    }
  }, {
    key: 'Options',
    get: function get() {
      return this.context.options;
    },
    set: function set(value) {
      this.context.options = value;
    }
  }, {
    key: '$Element',
    get: function get() {
      return this.$el;
    }

    // Only used for assigning context when calling options' methods.
  }, {
    key: 'Context',
    get: function get() {
      return this.context;
    }
  }, {
    key: '$OriginalCells',
    get: function get() {
      return this.$originalCells;
    }
  }, {
    key: 'IdPrefix',
    get: function get() {
      return this.idPrefix;
    }
  }, {
    key: 'VisibleCellContainerSelector',
    get: function get() {
      return this.visibleCellContainerSelector;
    }
  }, {
    key: 'DragCellSelector',
    get: function get() {
      return this.dragCellSelector;
    }
  }, {
    key: 'ResizeCellSelector',
    get: function get() {
      return this.resizeCellSelector;
    }
  }, {
    key: 'VisibleCellContainerClassSelector',
    get: function get() {
      return this.visibleCellContainerClassSelector;
    }
  }]);

  return Setup;
})();

exports.Setup = Setup;

},{"./utils":7}],7:[function(require,module,exports){
'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Utils = (function () {
  function Utils() {
    _classCallCheck(this, Utils);
  }

  Utils.GenerateRandomId = function GenerateRandomId() {
    return Math.random().toString(36).substr(2, 5) + Math.round(Math.random() * 1000).toString();
  };

  Utils.ConvertCssClassToJQuerySelector = function ConvertCssClassToJQuerySelector(cssClass) {
    return cssClass.replace(/(^ *| +)/g, '.');
  };

  Utils.Debounce = function Debounce(callback, milliseconds, leading) {
    var timeout = undefined;
    return function () {
      var context = this;
      var args = arguments;
      var later = function later() {
        timeout = null;
        if (!leading) {
          callback.apply(context, args);
        }
      };
      var callNow = leading && !milliseconds;
      clearTimeout(timeout);
      timeout = setTimeout(later, milliseconds);
      if (callNow) {
        callback.apply(context, args);
      }
    };
  };

  Utils.IsElementThrottled = function IsElementThrottled($, element, milliseconds) {

    Utils.recentDragMouseOvers = Utils.recentDragMouseOvers || [];

    var d = new Date();
    var n = d.getTime();
    for (var i = 0; i < Utils.recentDragMouseOvers.length; i++) {
      if (Utils.recentDragMouseOvers[i].n + milliseconds < n) {
        // expired.
        Utils.recentDragMouseOvers.splice(i, 1);
      }
      if (i < Utils.recentDragMouseOvers.length && $(Utils.recentDragMouseOvers[i].e).is(element)) {
        return true;
      }
    }
    Utils.recentDragMouseOvers.push({
      n: n,
      e: element
    });
    return false;
  };

  Utils.SwapJQueryElements = function SwapJQueryElements($a, $b) {
    var getInPlaceFunction = function getInPlaceFunction($element) {
      var $other = $a.is($element) ? $b : $a;
      var $next = $element.next();
      var $prev = $element.prev();
      var $parent = $element.parent();
      // cannot swap a with b exactly if there are no other siblings.
      if ($next.length > 0 && !$next.is($other)) {
        return function ($newElement) {
          $next.before($newElement);
        };
      } else if ($prev.length > 0 && !$prev.is($other)) {
        return function ($newElement) {
          $prev.after($newElement);
        };
      } else {
        // no siblings, so can just use append
        return function ($newElement) {
          $parent.append($newElement);
        };
      }
    };

    var aInPlaceFunc = getInPlaceFunction($a);
    var bInPlaceFunc = getInPlaceFunction($b);
    var $aDetached = $a.detach();
    var $bDetached = $b.detach();
    // swap finally.
    bInPlaceFunc($aDetached);
    aInPlaceFunc($bDetached);
  };

  Utils.DetachAndInsertInPlaceJQueryElement = function DetachAndInsertInPlaceJQueryElement($detachElement, $inPlaceElement) {
    var inPlaceElementIndex = $inPlaceElement.index();
    var detachElementIndex = $detachElement.index();

    var $detachedElement = $detachElement.detach();

    if (inPlaceElementIndex < detachElementIndex) {
      $inPlaceElement.before($detachedElement);
    } else {
      $inPlaceElement.after($detachedElement);
    }
  };

  return Utils;
})();

exports.Utils = Utils;

},{}]},{},[2]);
