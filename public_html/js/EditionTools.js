/* jshint -W089*/
/*global define, console, document, window, navigator */
define([
    'CommandStatus',
    'knockout',
    'stack/CommandStack',
    'tools/InsertLineTool',
    'tools/InsertPointTool',
    'tools/InsertPolygonTool',
    'tools/ToolHelper'
], function (
    CommandStatus,
    ko,
    CommandStack,
    InsertLineTool,
    InsertPointTool,
    InsertPolygonTool,
    ToolHelper
) {
    'use strict';

    var EditionTools = function () {
        this.tools = ko.observableArray();
    };

    var instance;

    EditionTools.getInstance = function() {
        if (instance === undefined) {
            instance = new EditionTools()
        }
        return instance;
    };

    EditionTools.prototype.initialize = function(viewer) {
        this.viewer = viewer;
        this.selectedTool = null;
        this.clicksNumber = 0;
        this.commandStack = CommandStack.getInstance();
        this.toolHelper = new ToolHelper(this.viewer);

        //this.addTools(document.getElementById(toolBarContainerName));
        this.addMouseEvents();
    };

    EditionTools.prototype.addMouseEvents = function() {
        var self = this;

        this.viewer.screenSpaceEventHandler.setInputAction(function(position) {
            self.mouseMove(position);
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        this.viewer.screenSpaceEventHandler.setInputAction(function(position) {
            self.mouseLeftClick(position);
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
        this.viewer.screenSpaceEventHandler.setInputAction(function(position) {
            self.mouseLeftDown(position);
        }, Cesium.ScreenSpaceEventType.LEFT_DOWN);
        this.viewer.screenSpaceEventHandler.setInputAction(function(position) {
            self.mouseLeftDoubleClick(position);
        }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    };

    /**
     * Adds the default set of tools
     */
    EditionTools.prototype.addDefaultTools = function() {
         this.tools.push(new InsertPointTool(this.viewer, this.toolHelper));
         this.tools.push(new InsertLineTool(this.viewer, this.toolHelper));
         this.tools.push(new InsertPolygonTool(this.viewer, this.toolHelper));
    };

    EditionTools.prototype.selectTool = function(tool) {
        this.selectedTool = tool;
        this.clicksNumber = 0;
        this.selectedTool.selectTool();
    };

    EditionTools.prototype.checkActionReply = function(command) {
        if (command.status === CommandStatus.DONE) {
            this.selectedTool = null;
            this.commandStack.addCommand(command);
        }
    };

    EditionTools.prototype.mouseMove = function(event) {
        var ray,
            position;

        if (this.selectedTool === null) {
            return;
        }

        ray = this.viewer.camera.getPickRay(event.endPosition);
        position = viewer.scene.globe.pick(ray, this.viewer.scene);

        this.checkActionReply(this.selectedTool.mouseMove(position));
    };

    EditionTools.prototype.mouseLeftClick = function(event) {
        var ray,
            position;

        if (this.selectedTool === null) {
            return;
        }

        ray = this.viewer.camera.getPickRay(event.position);
        position = viewer.scene.globe.pick(ray, this.viewer.scene);

        this.clicksNumber++;
        this.checkActionReply(this.selectedTool.mouseLeftClick(position, this.clicksNumber));
    };

    EditionTools.prototype.mouseLeftDown = function(event) {
        var ray,
            position;

        if (this.selectedTool === null) {
            return;
        }

        ray = this.viewer.camera.getPickRay(event.position);
        position = viewer.scene.globe.pick(ray, this.viewer.scene);

        this.checkActionReply(this.selectedTool.mouseLeftDown(position));
    };

    EditionTools.prototype.mouseLeftDoubleClick = function(event) {
        var ray,
            position;

        if (this.selectedTool === null) {
            return;
        }

        ray = this.viewer.camera.getPickRay(event.position);
        position = viewer.scene.globe.pick(ray, this.viewer.scene);

        this.checkActionReply(this.selectedTool.mouseLeftDoubleClick(position));
    };

    return EditionTools;
});
