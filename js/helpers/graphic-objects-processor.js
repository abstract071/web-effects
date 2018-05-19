const GraphicObjectsProcessor = (() => {
    let gObjects = [];
    let light = null;

    let render = () => {
        // Start the loop
        requestAnimationFrame(() => { render(); });

        gObjects.forEach((gObject) => {
            let elementTransform = GraphicObjectsProcessor.getTransform(gObject.assembly),
                lightTransform = GraphicObjectsProcessor.getTransform(light),
                lightPosition = Vect3.rotate(lightTransform.translate, Vect3.muls(elementTransform.rotate, -1));

            gObject.facesData.forEach((face) => {
                let direction = Vect3.normalize(Vect3.sub(lightPosition, face.center));
                let amount = 1 - Math.max(0, Vect3.dot(face.normal, direction)).toFixed(2);
                if (face.light !== amount) {
                    face.light = amount;
                    face.element.style.backgroundImage = "linear-gradient(rgba(0,0,0," + amount + "),rgba(0,0,0," + amount + "))";
                }
            });
        });
    };

    return {
        initialize(assemblyElements, lightElement) {
            light = lightElement;

            for (let assembly of assemblyElements) {
                gObjects.push(new GraphicObject(assembly));
            }

            render();
        },

        /* Returns corners' vertices of an element
         ---------------------------------------------------------------- */
        computeVerticesData(element) {
            let xCenterPoint = element.offsetWidth / 2,
                yCenterPoint = element.offsetHeight / 2,
                verticesCoordinates = {
                    topLeft: {x: -xCenterPoint, y: -yCenterPoint, z: 0},
                    topRight: {x: xCenterPoint, y: -yCenterPoint, z: 0},
                    bottomRight: {x: xCenterPoint, y: yCenterPoint, z: 0},
                    bottomLeft: {x: -xCenterPoint, y: yCenterPoint, z: 0}
                },
                transform = null;

            // Walk up the DOM and apply parent element transforms to each vertex
            while (element.nodeType === 1) {
                transform = this.getTransform(element);
                verticesCoordinates.topLeft = Vect3.add(Vect3.rotate(verticesCoordinates.topLeft, transform.rotate), transform.translate);
                verticesCoordinates.topRight = Vect3.add(Vect3.rotate(verticesCoordinates.topRight, transform.rotate), transform.translate);
                verticesCoordinates.bottomRight = Vect3.add(Vect3.rotate(verticesCoordinates.bottomRight, transform.rotate), transform.translate);
                verticesCoordinates.bottomLeft = Vect3.add(Vect3.rotate(verticesCoordinates.bottomLeft, transform.rotate), transform.translate);
                element = element.parentNode;
            }

            return verticesCoordinates;
        },

        /* Returns the rotation and translation components of an element
         ---------------------------------------------------------------- */
        getTransform(element) {
            let matrix = this.parseMatrix(getComputedStyle(element, null).transform),
                rotateY = Math.asin(-matrix.m13),
                rotateX,
                rotateZ;

            if (Math.cos(rotateY) !== 0) {
                rotateX = Math.atan2(matrix.m23, matrix.m33);
                rotateZ = Math.atan2(matrix.m12, matrix.m11);
            } else {
                rotateX = Math.atan2(-matrix.m31, matrix.m22);
                rotateZ = 0;
            }
            return {
                rotate: {x: rotateX, y: rotateY, z: rotateZ},
                translate: {x: matrix.m41, y: matrix.m42, z: matrix.m43}
            };
        },

        /* Parses a matrix string and returns a 4x4 matrix
         ---------------------------------------------------------------- */
        parseMatrix(matrixString) {
            let c = matrixString.split(/\s*[(),]\s*/).slice(1, -1),
                matrix;

            if (c.length === 6) {
                // 'matrix()' (3x2)
                matrix = {
                    m11: +c[0], m21: +c[2], m31: 0, m41: +c[4],
                    m12: +c[1], m22: +c[3], m32: 0, m42: +c[5],
                    m13: 0, m23: 0, m33: 1, m43: 0,
                    m14: 0, m24: 0, m34: 0, m44: 1
                };
            } else if (c.length === 16) {
                // matrix3d() (4x4)
                matrix = {
                    m11: +c[0], m21: +c[4], m31: +c[8], m41: +c[12],
                    m12: +c[1], m22: +c[5], m32: +c[9], m42: +c[13],
                    m13: +c[2], m23: +c[6], m33: +c[10], m43: +c[14],
                    m14: +c[3], m24: +c[7], m34: +c[11], m44: +c[15]
                };

            } else {
                // handle 'none' or invalid values.
                matrix = {
                    m11: 1, m21: 0, m31: 0, m41: 0,
                    m12: 0, m22: 1, m32: 0, m42: 0,
                    m13: 0, m23: 0, m33: 1, m43: 0,
                    m14: 0, m24: 0, m34: 0, m44: 1
                };
            }
            return matrix;
        }
    }
})();