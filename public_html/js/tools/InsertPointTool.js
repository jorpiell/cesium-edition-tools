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

    InsertPointTool.prototype.selectTool = function() {
        console.log("Adding point");
        this.entity = this.toolHelper.addNewPoint();

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
            self = this;

        this.entity = null;
        this.toolHelper.removePointer();
        return {
            status: CommandStatus.DONE,
            name: "Insert point",
            undo: function() {
                self.viewer.entities.remove(entity);
            },
            redo: function() {
                self.viewer.entities.add(entity);
            },
            highlight: function() {
                this.highlightedEntity = self.toolHelper.addNewHighlightedPoint(entity.position);
            },
            endHighlight: function() {
                self.viewer.entities.remove(this.highlightedEntity);
            }
        }
    };

    InsertPointTool.prototype.mouseLeftDown = function(position) {
        return {
            status: CommandStatus.CONTINUE
        }
    };


    return InsertPointTool;
});
