var azure = require('azure-storage');
module.exports = function(RED) {

    if (false) { // Test for nodes compatibilities
        throw "Info : not compatible";
    }

    function NodeConstructor(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        node.blob = {};
        node.blob.hostName = "https://" + config.accountName + ".blob.core.windows.net";
        node.blob.service = azure.createBlobService(config.accountName, config.accountKey);
    };
    RED.nodes.registerType("azure-config", NodeConstructor);
}