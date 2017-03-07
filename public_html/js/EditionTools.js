/* jshint -W089*/
/*global define, console, document, window, navigator */
define([
    'CommandStatus',
    'knockout',
    'model/Layer',
    'stack/CommandStack',
    'tools/export/ExportToKMLTool',
    'tools/insert/InsertLineTool',
    'tools/insert/InsertPointTool',
    'tools/insert/InsertPolygonTool',
    'tools/ToolHelper'
], function (
    CommandStatus,
    ko,
    Layer,
    CommandStack,
    ExportToKMLTool,
    InsertLineTool,
    InsertPointTool,
    InsertPolygonTool,
    ToolHelper
) {
    'use strict';

    var EditionTools = function () {
        this.tools = ko.observableArray();
    };

    var instance = null;

    /**
     * Gest the singlenton's instance
     * @returns {*}
     */
    EditionTools.getInstance = function() {
        if (instance === null) {
            instance = new EditionTools()
        }
        return instance;
    };

    /**
     * Initialize the singleton. It needs the Cesium's viewer
     * @param viewer the viewer
     */
    EditionTools.prototype.initialize = function(viewer) {
        this.viewer = viewer;
        this.selectedTool = null;
        this.clicksNumber = 0;
        this.commandStack = CommandStack.getInstance();
        this.toolHelper = new ToolHelper(this.viewer);

        // In this first version, create just one layer
        this.layer = new Layer(viewer);

        //this.addTools(document.getElementById(toolBarContainerName));
        this.addMouseEvents();
    };

    /**
     * Add the managed mouse events
     */
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
         this.tools.push(new ExportToKMLTool(this.viewer));
    };

    /**
     * Select the current tool
     * @param tool the tool to select
     */
    EditionTools.prototype.selectTool = function(tool) {
        this.selectedTool = tool;
        this.clicksNumber = 0;
        this.selectedTool.selectTool(this.layer);
    };

    /**
     * Checks the reply of a tool and takes an action if necessary
     * @param command the returned command
     */
    EditionTools.prototype.checkActionReply = function(command) {
        if (command.status === CommandStatus.DONE) {
            this.selectedTool = null;
            this.commandStack.addCommand(command);
        }
    };

    /**
     * Manage the mouse move event
     * @param event the mouse event
     */
    EditionTools.prototype.mouseMove = function(event) {
        var ray,
            position;

        if (this.selectedTool === null || this.selectedTool.mouseMove === undefined) {
            return;
        }

        ray = this.viewer.camera.getPickRay(event.endPosition);
        position = viewer.scene.globe.pick(ray, this.viewer.scene);

        this.checkActionReply(this.selectedTool.mouseMove(position));
    };

    /**
     * Manage the mouse left click event
     * @param event the mouse event
     */
    EditionTools.prototype.mouseLeftClick = function(event) {
        var ray,
            position;

        if (this.selectedTool === null || this.selectedTool.mouseLeftClick === undefined) {
            return;
        }

        ray = this.viewer.camera.getPickRay(event.position);
        position = viewer.scene.globe.pick(ray, this.viewer.scene);

        this.clicksNumber++;
        this.checkActionReply(this.selectedTool.mouseLeftClick(position, this.clicksNumber));
    };

    /**
     * Manage the mouse left down event
     * @param event the mouse event
     */
    EditionTools.prototype.mouseLeftDown = function(event) {
        var ray,
            position;

        if (this.selectedTool === null || this.selectedTool.mouseLeftDown === undefined) {
            return;
        }

        ray = this.viewer.camera.getPickRay(event.position);
        position = viewer.scene.globe.pick(ray, this.viewer.scene);

        this.checkActionReply(this.selectedTool.mouseLeftDown(position));
    };

    /**
     * Manage the mouse double click event
     * @param event the mouse event
     */
    EditionTools.prototype.mouseLeftDoubleClick = function(event) {
        var ray,
            position;

        if (this.selectedTool === null || this.selectedTool.mouseLeftDoubleClick === undefined) {
            return;
        }

        ray = this.viewer.camera.getPickRay(event.position);
        position = viewer.scene.globe.pick(ray, this.viewer.scene);

        this.checkActionReply(this.selectedTool.mouseLeftDoubleClick(position));
    };

    return EditionTools;
});
