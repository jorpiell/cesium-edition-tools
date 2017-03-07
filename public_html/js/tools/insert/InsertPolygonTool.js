/* jshint -W089*/
/*global define, console, document, window, navigator */
define([
    'CommandStatus'
], function (
    CommandStatus
) {
    'use strict';

    var InsertPolygonTool = function (viewer, toolHelper) {
        this.viewer = viewer;
        this.toolHelper = toolHelper;
        this.initialize();
    };

    InsertPolygonTool.prototype.initialize = function() {
        this.entity = null;
        this.positions = null;
    };

    InsertPolygonTool.prototype.getImage = function() {
        return "images/polygon";
    };

    InsertPolygonTool.prototype.getToolTip = function() {
        return "Insert polygon";
    };

    InsertPolygonTool.prototype.selectTool = function(layer) {
        console.log("Adding polygon");
        this.layer = layer;

        this.entity = this.toolHelper.addNewPolyline(layer);
        this.positions = this.entity.polyline.positions.positions;

        // enable the Pointer
        this.toolHelper.addPointer();
    };

    InsertPolygonTool.prototype.mouseMove = function(position) {
        this.toolHelper.movePointer(position);
        if (this.positions.length > 0) {
            this.positions[this.positions.length-1] = position;
        }
        return {
            status: CommandStatus.CONTINUE
        }
    };

    InsertPolygonTool.prototype.mouseLeftClick = function(position, clicksNumber) {
        var i;

        this.positions.push(position);

        if (clicksNumber === 1) {
            this.positions.push(position);
        }
        if (clicksNumber === 2) {
            // Add the polygon
            this.entity = this.toolHelper.addNewPolygonFromPolyline(this.entity, this.layer);
            this.positions = this.entity.polygon.hierarchy.positions;
            this.positions.push(this.positions[0]);
        }

        return {
            status: CommandStatus.CONTINUE
        }
    };

    InsertPolygonTool.prototype.mouseLeftDoubleClick = function(position) {
        var entity = this.entity,
            self = this,
            layer = self.layer,
            positions = this.entity.polygon.hierarchy.positions;

        this.entity = null;
        this.positions = null;
        this.toolHelper.removePointer();
        this.initialize();
        return {
            status: CommandStatus.DONE,
            name: "Insert polygon",
            undo: function() {
                layer.remove(entity);
            },
            redo: function() {
                layer.add(entity);
            },
            highlight: function() {
                this.highlightedEntity = self.toolHelper.addNewHighlightedPolygon(positions);
            },
            endHighlight: function() {
                self.viewer.entities.remove(this.highlightedEntity);
            }
        }
    };

    return InsertPolygonTool;
});
