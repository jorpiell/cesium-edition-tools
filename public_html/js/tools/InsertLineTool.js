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

    InsertLineTool.prototype.selectTool = function() {
        console.log("Adding line");

        this.entity = this.toolHelper.addNewPolyline();
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

    InsertLineTool.prototype.mouseLeftDown = function(position) {
        return {
            status: CommandStatus.CONTINUE
        }
    };

    InsertLineTool.prototype.mouseLeftDoubleClick = function(position) {
        var entity = this.entity,
            self = this,
            positions = this.entity.polyline.positions.positions;

        this.entity = null;
        this.positions = null;
        this.toolHelper.removePointer();
        this.initialize();
        return {
            status: CommandStatus.DONE,
            name: "Insert polyline",
            undo: function() {
                self.viewer.entities.remove(entity);
            },
            redo: function() {
                self.viewer.entities.add(entity);
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
