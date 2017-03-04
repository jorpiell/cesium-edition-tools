/* jshint -W089*/
/*global define, console, document, window, navigator */
define([
    'datatables',
    'jquery',
    'stack/CommandStack'
], function (
    Datatables,
    jQuery,
    CommandStack
) {
    'use strict';

    var CommandStackUI = function (commandStackContainerName) {
        this.commands = [];
        this.initialize(document.getElementById(commandStackContainerName));

        CommandStack.getInstance().addCommandListener(this);
    };

    CommandStackUI.prototype.initialize = function(commandStackContainer) {
        var self = this,
            rawButton,
            buttonIndex = 1;

        this.table = document.createElement('table');
        this.table.id = 'commandsTable';
        this.table.className = 'display';

        rawButton = "<div><image src='images/remove.png'></image></div>";

        $(document).ready(function() {
            var table = $('#commandsTable').DataTable({
                data: [],
                columns: [
                    {title: "Command"},
                    {title: "Del"}
                ],
                scrollY: '200px',
                scrollCollapse: true,
                paging: false,
                searching: false,
                columnDefs: [ {
                    targets: -1,
                    data: null,
                    defaultContent: rawButton
                }]
            });

            $('#commandsTable tbody').on( 'click', 'div', function () {
                var row = table.row($(this).parents('tr'));
                if (undefined !== row.data()) {
                    row.data()[buttonIndex].undo();
                    row.data()[buttonIndex].endHighlight();
                    row.remove().draw();
                }
            });

            $('#commandsTable tbody').on( 'mouseenter', 'td', function () {
                var row = table.row($(this).parents('tr'));
                if (undefined !== row.data()) {
                    row.data()[buttonIndex].highlight();
                }
            });

            $('#commandsTable tbody').on( 'mouseleave', 'td', function () {
                var row = table.row($(this).parents('tr'));
                if (undefined !== row.data()) {
                    row.data()[buttonIndex].endHighlight();
                }
            });
        });


        commandStackContainer.appendChild(this.table);
    };

    CommandStackUI.prototype.addCommand = function(command) {
        $('#commandsTable').DataTable().row.add([command.name, command]).draw();
    };

    return CommandStackUI;
});
