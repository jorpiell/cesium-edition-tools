/* jshint -W089*/
/*global define, console, document, window, navigator */
define([
    'CommandStatus'
], function (
    CommandStatus
) {
    'use strict';

    var InsertLineTool = function (viewer, toolHelper) {
        this.viewer = viewer;
        this.toolHelper = toolHelper;
        this.initialize();
    };

    InsertLineTool.prototype.initialize = function() {
        this.entity = null;
        this.positions = null;
    };

    InsertLineTool.prototype.getImage = function() {
        return "images/polyline";
    };

    InsertLineTool.prototype.getToolTip = function() {
        return "Insert line";
    };

    InsertLineTool.prototype.selectTool = function(layer) {
        console.log("Adding line");
        this.layer = layer;

        this.entity = this.toolHelper.addNewPolyline(layer);
        this.positions = this.entity.polyline.positions.positions;

        // enable the Pointer
        this.toolHelper.addPointer();
    };

    InsertLineTool.prototype.mouseMove = function(position) {
        this.toolHelper.movePointer(position);
        if (this.positions.length > 0) {
            this.positions[this.positions.length-1] = position;
        }
        return {
            status: CommandStatus.CONTINUE
        }
    };

    InsertLineTool.prototype.mouseLeftClick = function(position, clicksNumber) {
        this.positions.push(position);

        if (clicksNumber === 1) {
            this.positions.push(position);
        }

        return {
            status: CommandStatus.CONTINUE
        }
    };

    InsertLineTool.prototype.mouseLeftDoubleClick = function(position) {
        var entity = this.entity,
            self = this,
            layer = self.layer,
            positions = this.entity.polyline.positions.positions;

        this.entity = null;
        this.positions = null;
        this.toolHelper.removePointer();
        this.initialize();
        return {
            status: CommandStatus.DONE,
            name: "Insert polyline",
            undo: function() {
                layer.remove(entity);
            },
            redo: function() {
                layer.add(entity);
            },
            highlight: function() {
                this.highlightedEntity = self.toolHelper.addNewHighlightedPolyline(positions);
            },
            endHighlight: function() {
                self.viewer.entities.remove(this.highlightedEntity);
            }
        }
    };

    return InsertLineTool;
});
