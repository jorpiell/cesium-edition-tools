/* jshint -W089*/
/*global define, console, document, window, navigator */
define([

], function (

) {
    'use strict';

    var Layer = function (viewer) {
        this.viewer = viewer;
        this.entities = [];
    };

    Layer.prototype.add = function(entity) {
        var addedEntity = this.viewer.entities.add(entity);
        this.entities.push(addedEntity);
        return addedEntity;
    };

    Layer.prototype.remove = function(entity) {
        var index = this.entities.indexOf(entity);
        this.entities.splice(index, 1);
        this.viewer.entities.remove(entity);
    };

    return Layer;
});
