/* jshint -W089*/
/*global define, console, document, window, navigator */
define([

], function (

) {
    'use strict';

    var ExportToKMLTool = function (viewer) {
        this.viewer = viewer;
    };

    ExportToKMLTool.prototype.selectTool = function(layer) {
        console.log("Export to KML");
        this.layer = layer;

        this.export();
    };

    ExportToKMLTool.prototype.getImage = function() {
        return "images/export_kml";
    };

    ExportToKMLTool.prototype.getToolTip = function() {
        return "Export to KML line";
    };

    /**
     * Export the entities of the current layer to a KML file
     */
    ExportToKMLTool.prototype.export = function () {
        var kml = '',
            link,
            i,
            l,
            entity;

        kml += '<?xml version="1.0" encoding="UTF-8"?>';
        kml += '<kml xmlns="http://www.opengis.net/kml/2.2">';
        kml += '	<Document>';
        kml += '		<name>My KML</name>';
        kml += '		<description>Just a nice KML</description>';
        for (i=0 , l=this.layer.entities.length ; i<l ; i++) {
            entity = this.layer.entities[i];
            kml += '		<Placemark id="' + entity.id + '">';
            kml += this.entityToKML(entity);
            kml += '		</Placemark>';
        }
        kml += '	</Document>';
        kml += '</kml>';

        var filename = 'out.kml';

        kml = 'data:text/xml;charset=utf-8,' + encodeURIComponent(kml);

        link = document.createElement('a');
        link.setAttribute('href', kml);
        link.setAttribute('download', filename);
        link.style.display = 'none';

        // Without this line, Firefox is not able to open the CSV
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    /**
     * Exports a Cesium's entity to a KML representation
     * @param entity the Cesium's entity
     * @returns {string} the KML string
     */
    ExportToKMLTool.prototype.entityToKML = function (entity) {
        if (undefined !== entity.point) {
            return this.pointToKML(entity);
        } else if (undefined !== entity.polyline) {
            return this.polylineToKML(entity);
        } else if (undefined !== entity.polygon) {
            return this.polygonToKML(entity);
        }
    };

    /**
     * Exports a point to a KML polygon
     * @param entity the Cesium's entity that contains a point
     * @returns {string} a KML point
     */
    ExportToKMLTool.prototype.pointToKML = function (entity) {
        var point,
            kml;

        point = viewer.scene.globe.ellipsoid.cartesianToCartographic(entity.position._value);
        kml += '<Point>';
        kml += '    <coordinates>' + Cesium.Math.toDegrees(point.longitude) + ',' + Cesium.Math.toDegrees(point.latitude) + ',0</coordinates>';
        kml += '</Point>';
        return kml;
    };

    /**
     * Exports a polyline to a KML polygon
     * @param entity the Cesium's entity that contains a polyline
     * @returns {string} a KML polyline
     */
    ExportToKMLTool.prototype.polylineToKML = function (entity) {
        var points,
            kml,
            i,
            l;

        points = viewer.scene.globe.ellipsoid.cartesianArrayToCartographicArray(entity.polyline.positions.positions);
        kml += '<LineString>';
        kml += '    <coordinates>';
        for (i=0 , l=points.length ; i<l ; i++) {
            kml += Cesium.Math.toDegrees(points[i].longitude) + ',' + Cesium.Math.toDegrees(points[i].latitude) + ',0 ';
        }
        kml += '    </coordinates>';
        kml += '</LineString>';
        return kml;
    };

    /**
     * Exports a polygon to a KML polygon
     * @param entity the Cesium's entity that contains a polygon
     * @returns {string} a KML polygon
     */
    ExportToKMLTool.prototype.polygonToKML = function (entity) {
        var points,
            kml,
            i,
            l;

        points = viewer.scene.globe.ellipsoid.cartesianArrayToCartographicArray(entity.polygon.hierarchy.positions);
        kml += '<Polygon>';
        kml += '    <outerBoundaryIs>';
        kml += '        <LinearRing>';
        kml += '            <coordinates>';
        for (i=0 , l=points.length ; i<l ; i++) {
            kml += Cesium.Math.toDegrees(points[i].longitude) + ',' + Cesium.Math.toDegrees(points[i].latitude) + ',0 ';
        }
        kml += '            </coordinates>';
        kml += '        </LinearRing>';
        kml += '    </outerBoundaryIs>';
        kml += '</Polygon>';
        return kml;
    };

    return ExportToKMLTool;
});

