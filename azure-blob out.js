module.exports = function(RED) {

    if (false) { // Test for nodes compatibilities
        throw "Info : not compatible";
    }

    function NodeConstructor(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        node.azure = RED.nodes.getNode(config.azure);
        // console.log(RED.nodes.getFlows()[3].id);
        // setTimeout(function() {
        //     RED.nodes.getNode(RED.nodes.getFlows()[3].id).on("input", function() { console.log("HEEEE") });
        // }, 2000);

        node.on("input", function(msg) {
            if(!!msg.blob && typeof(msg.blob) !== "object") {
                node.error("msg.blob has to be an object");
            }

            var containerName = msg.blob.containerName || config.containerName;
            var blobService = node.azure.blob.service;
            blobService.createContainerIfNotExists(containerName, {
                publicAccessLevel: "blob"
            }, function(error, result, response) {
                if (!!error) {
                    node.error("Unable to create the blob container : " + containerName, msg);
                }
                else {
                    if(msg.blob.name === null || msg.blob.name === undefined || msg.blob.name === "") {
                        node.error("msg.blob.name has to be set", msg);
                    }
                    else {
                        blobService.createBlockBlobFromText(containerName, msg.blob.name, msg.payload, msg.blob.config || {},
                            function(error, result, response){
                                if (error) {
                                    node.error("Unable to create blob : " + msg.blob.name, msg);
                                } else {
                                    msg.blob.url = blobService.getUrl(containerName, msg.blob.name, null, node.azure.blob.hostName);
                                    node.send(msg);
                                }
                        });
                    }
                }
            });
            node.send(msg);
        });
        node.on("close", function() {
        });
    };
    RED.nodes.registerType("azure-blob out", NodeConstructor);
}