/* jshint -W089*/
/*global define, console, document, window, navigator */
define([
    'CommandStatus',
    'stack/CommandStack',
    'tools/InsertLineTool',
    'tools/InsertPointTool',
    'tools/InsertPolygonTool',
    'tools/ToolHelper'
], function (
    CommandStatus,
    CommandStack,
    InsertLineTool,
    InsertPointTool,
    InsertPolygonTool,
    ToolHelper
) {
    'use strict';

    var EditionTools = function (toolBarContainerName, viewer) {
        this.viewer = viewer;
        this.selectedTool = null;
        this.clicksNumber = 0;
        this.commandStack = CommandStack.getInstance();

        this.addTools(document.getElementById(toolBarContainerName));
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
     * Add the tools to the tool br container
     * @param toolBarContainer the tool bar container
     */
    EditionTools.prototype.addTools = function(toolBarContainer) {
        var toolHelper = new ToolHelper(this.viewer);

        this.addTool(toolBarContainer, new InsertPointTool(this.viewer, toolHelper));
        this.addTool(toolBarContainer, new InsertLineTool(this.viewer, toolHelper));
        this.addTool(toolBarContainer, new InsertPolygonTool(this.viewer, toolHelper));
    };

    /**
     * Add a tool to the toolbar
     * @param toolBarContainer the tool bar contgainer
     * @param tool the tool to add
     */
    EditionTools.prototype.addTool = function(toolBarContainer, tool) {
        var self = this,
            button = document.createElement("div");

        button.className = "toolBarButton";
        button.title = tool.getToolTip();
        button.onclick = function() {
            self.selectedTool = tool;
            self.clicksNumber = 0;
            self.selectedTool.selectTool();
        };

        // Add the image
        var span = document.createElement('span');
        button.appendChild(span);
        var image = document.createElement('img');
        image.src = tool.getImage();
        span.appendChild(image);

        //Append the button to the toolbar
        toolBarContainer.appendChild(button);
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
