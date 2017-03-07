/* jshint -W089*/
/*global define, console, document, window, navigator */
define([
    'CommandStatus'
], function (
    CommandStatus
) {
    'use strict';

    var InsertPointTool = function (viewer, toolHelper) {
        this.viewer = viewer;
        this.toolHelper = toolHelper;
        this.entity = null;
    };

    InsertPointTool.prototype.getImage = function() {
        return "images/point";
    };

    InsertPointTool.prototype.getToolTip = function() {
        return "Insert point";
    };

    InsertPointTool.prototype.selectTool = function(layer) {
        console.log("Adding point");
        this.layer = layer;
        this.entity = this.toolHelper.addNewPoint(layer);

        // enable the Pointer
        this.toolHelper.addPointer();
    };

    InsertPointTool.prototype.mouseMove = function(position) {
        this.entity.position = position;
        this.toolHelper.movePointer(position);
        return {
            status: CommandStatus.CONTINUE
        }
    };

    InsertPointTool.prototype.mouseLeftClick = function(position, clicksNumber) {
        var entity = this.entity,
            self = this,
            layer = self.layer;

        this.entity = null;
        this.toolHelper.removePointer();
        return {
            status: CommandStatus.DONE,
            name: "Insert point",
            undo: function() {
                layer.remove(entity);
            },
            redo: function() {
                layer.add(entity);
            },
            highlight: function() {
                this.highlightedEntity = self.toolHelper.addNewHighlightedPoint(entity.position);
            },
            endHighlight: function() {
                self.viewer.entities.remove(this.highlightedEntity);
            }
        }
    };

    return InsertPointTool;
});
