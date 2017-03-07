/* jshint -W089*/
/*global define, console, document, window, navigator */
define([

], function (

) {
    'use strict';

    var ToolHelper = function (viewer) {
       this.viewer = viewer;
       this.pointer = null;
    };

    ToolHelper.NEW_GEOMETRY_COLOR = Cesium.Color.WHITE;
    ToolHelper.SELECTION_COLOR = Cesium.Color.ORANGE.withAlpha(0.2);
    ToolHelper.SELECTION_OUTLINE_COLOR = Cesium.Color.ORANGE;

    ToolHelper.prototype.addPointer = function() {
        this.pointer = this.viewer.entities.add({
            billboard: {
                image: 'images/add_point'
            }
        });
    };

    ToolHelper.prototype.removePointer = function () {
        this.viewer.entities.remove(this.pointer);
    };

    ToolHelper.prototype.movePointer = function (position) {
        this.pointer.position = position;
    };

    ToolHelper.prototype.addNewPoint = function (layer) {
        return layer.add({
            point : {
                pixelSize : 10,
                color : ToolHelper.NEW_GEOMETRY_COLOR
            }
        });
    };

    ToolHelper.prototype.addNewHighlightedPoint = function (position) {
        return this.viewer.entities.add({
            position: position,
            point : {
                pixelSize : 15,
                color : ToolHelper.SELECTION_COLOR,
                outlineColor: ToolHelper.SELECTION_OUTLINE_COLOR,
                outlineWidth: 1.5
            }
        });
    };

    ToolHelper.prototype.addNewPolyline = function(layer) {
        var pointPositions = new Cesium.CallbackProperty(
            function () {
                return this.positions;
            },
            false
        );
        pointPositions.positions = [];

        return layer.add({
            polyline: {
                positions: pointPositions,
                width : 2,
                color : ToolHelper.NEW_GEOMETRY_COLOR
            }
        });
    };

    ToolHelper.prototype.addNewHighlightedPolyline = function (positions) {
        return this.viewer.entities.add({
            polyline: {
                positions: positions,
                width : 10,
                material : new Cesium.PolylineOutlineMaterialProperty({
                    color : ToolHelper.SELECTION_COLOR,
                    outlineColor: ToolHelper.SELECTION_OUTLINE_COLOR,
                    outlineWidth: 1.5
                })
            }
        });
    };

    ToolHelper.prototype.addNewPolygon = function(layer) {
        var pointPositions = new Cesium.CallbackProperty(
            function () {
                return this.positions;
            },
            false
        );
        pointPositions.positions = [];

        return layer.add({
            polygon: {
                hierarchy: pointPositions,
                width : 2,
                material : ToolHelper.NEW_GEOMETRY_COLOR
            }
        });
    };

    ToolHelper.prototype.addNewPolygonFromPolyline = function(oldEntity, layer) {
        var newEntity,
            i;

        // Remove the line
        layer.remove(oldEntity);

        // Add the polygon
        newEntity = this.addNewPolygon(layer);

        // Copy the geometries
        for (i=0 ; i<=1 ; i++) {
            newEntity.polygon.hierarchy.positions.push(oldEntity.polyline.positions.positions[i]);
        }
        return newEntity;
    };

    ToolHelper.prototype.addNewHighlightedPolygon = function (positions) {
        return this.viewer.entities.add({
            polygon: {
                hierarchy: positions,
                width : 10,
                material : ToolHelper.SELECTION_COLOR,
                outline: true,
                outlineColor: ToolHelper.SELECTION_OUTLINE_COLOR,
                outlineWidth: 50,
                height: 0
            }
        });
    };

    return ToolHelper;
});
