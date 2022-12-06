'use strict';
(function () {
    var OSG = window.OSG;
    var osg = OSG.osg;
    var osgDB = OSG.osgDB;
    var ExampleOSGJS = window.ExampleOSGJS;

    var Example = function () {
        ExampleOSGJS.call(this);
    };

    Example.prototype = osg.objectInherit(ExampleOSGJS.prototype, {
        run: function () {
            ExampleOSGJS.prototype.run.call(this);
            Promise.all([
                readFile('../../../assets/mini_darth_vader/scene.bin'),
                readFile('../../../assets/mini_darth_vader/scene.gltf'),
                readFile('../../../assets/mini_darth_vader/beltBuckleFT_baseColor.png'),
                readFile('../../../assets/mini_darth_vader/beltSides_baseColor.png'),
                readFile('../../../assets/mini_darth_vader/chestArmor_baseColor.png'),
                readFile('../../../assets/mini_darth_vader/chestPieceButtons_baseColor.png'),
                readFile('../../../assets/mini_darth_vader/legs_baseColor.png'),
                readFile('../../../assets/mini_darth_vader/shldArmor_baseColor.png'),
                readFile('../../../assets/mini_darth_vader/stepLights_emissive.png'),
                readFile('../../../assets/mini_darth_vader/torso_baseColor.png')
            ]).then((res) => {
                let fileList = {
                    0: res[0],
                    1: res[1],
                    2: res[2],
                    3: res[3],
                    4: res[4],
                    5: res[5],
                    6: res[6],
                    7: res[7],
                    8: res[8],
                    9: res[9],
                    length: 10
                };
                Example.prototype.handleDroppedFiles.call(this, fileList)
            })
        },

        createScene: function () {
            // Forr gltf download testing
            // var self = this;
            // osgDB.readNodeURL( 'microphone/Microphone.gltf' ).then( function ( node ) {
            //     self.getRootNode().addChild( node );
            //     self._viewer.getManipulator().computeHomePosition();
            // } );
        },

        handleDroppedFiles: function (files) {
            var self = this;
            //$( '#loading' ).show();
            var filesMap = {};
            filesMap[files[0].name] = files[0];
            osgDB.fileHelper.readFileList(files).then(function (node) {
                window.root = node;
                decodeOSGJS(node);
                self.getRootNode().addChild(node);
                self._viewer.getManipulator().computeHomePosition();
            });
        }
    });

    var dragOverEvent = function (evt) {
        evt.stopPropagation();
        evt.preventDefault();
        evt.dataTransfer.dropEffect = 'copy';
    };

    var dropEvent = function (evt) {
        evt.stopPropagation();
        evt.preventDefault();

        var files = evt.dataTransfer.files;
        if (files.length) this.handleDroppedFiles(files);
    };
    window.addEventListener(
        'load',
        function () {
            var example = new Example();
            example.run();
            window.example = example;
            // Drag'n drop events
            window.addEventListener('dragover', dragOverEvent.bind(example), false);
            window.addEventListener('drop', dropEvent.bind(example), false);

        },
        true
    );

    var readFile = function (url) {
        return new Promise((resolve, reject) => {
            fetch(url).then(res => res.arrayBuffer())
                .then(async ab => {
                    let fileName = url.split("/").pop();
                    let ext = fileName.split(".").pop();
                    let blob = new Blob([ab],
                        { type: ext == "png" ? "image/png" : "application/octet-stream" }
                    )
                    let file = await new File([blob], fileName)
                    resolve(file)
                })
        })
    }


})();
