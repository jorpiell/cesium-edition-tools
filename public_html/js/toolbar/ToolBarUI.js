/* jshint -W089*/
/*global define, console, document, window, navigator */
define([
    'EditionTools'
], function (
    EditionTools
) {
    'use strict';

    var ToolBarUI = function (toolBarContainerName) {
        var self = this;

        this.toolBarContainer = document.getElementById(toolBarContainerName);
        this.editionTools = EditionTools.getInstance();

        // Add the initial registered tools
        this.addDefaultTools();

        // If new tools are added, just add them to the tool bar
        this.editionTools.tools.subscribe(function(changes) {
            changes.forEach(function(change) {
                if (change.status === 'added') {
                    self.addTool(change.value);
                }
            });

        }, null, "arrayChange");
    };

    /**
     * Add the tools to the tool br container
     * @param toolBarContainer the tool bar container
     */
    ToolBarUI.prototype.addDefaultTools = function(toolBarContainer) {
        var i,
            l;

        for (i= 0 , l=this.editionTools.tools().length; i<l ; i++) {
            this.addTool(this.editionTools.tools()[i]);
        }
    };

    /**
     * Add a tool to the toolbar
     * @param tool the tool to add
     */
    ToolBarUI.prototype.addTool = function(tool) {
        var self = this,
            button = document.createElement("div");

        button.className = "toolBarButton";
        button.title = tool.getToolTip();
        button.onclick = function() {
            self.editionTools.selectTool(tool);
        };

        // Add the image
        var span = document.createElement('span');
        button.appendChild(span);
        var image = document.createElement('img');
        image.src = tool.getImage();
        span.appendChild(image);

        //Append the button to the toolbar
        this.toolBarContainer.appendChild(button);
    };

    return ToolBarUI;
});
