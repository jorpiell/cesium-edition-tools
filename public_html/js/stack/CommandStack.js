/* jshint -W089*/
/*global define, console, document, window, navigator */
define([

], function (

) {
    'use strict';

    var CommandStack = function () {
        this.commands = [];
        this.listeners = [];
    };

    var instance = null;

    CommandStack.getInstance = function() {
        if (instance === null) {
            instance = new CommandStack();
        }
        return instance;
    };

    CommandStack.prototype.addCommandListener = function(commandListener) {
        this.listeners.push(commandListener);
    };

    CommandStack.prototype.addCommand = function(command) {
        var i,
            l;

        this.commands.push(command);
        for (i=0 , l=this.listeners.length ; i<l ; i++) {
            this.listeners[i].addCommand(command);
        }
    };

    return CommandStack;
});
