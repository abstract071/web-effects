class GraphicObject {
    constructor(assembly) {
        this._assembly = assembly;
        this._facesData = null;

        this.initialize();
    }

    /**
     * TODO: .face class is hardcoded
     */
    initialize() {
        // Precalculate the normals and centres for each face
        this._facesData = Array.prototype.slice.call(this._assembly.querySelectorAll(".face")).map(function (face) {
            let vertices = GraphicObjectsProcessor.computeVerticesData(face);
            return {
                vertices: vertices,
                normal: Vect3.normalize(Vect3.cross(Vect3.sub(vertices.topRight, vertices.topLeft), Vect3.sub(vertices.bottomRight, vertices.topLeft))),
                center: Vect3.divs(Vect3.sub(vertices.bottomRight, vertices.topLeft), 2),
                element: face
            };
        });
    }

    get assembly() {
        return this._assembly;
    }

    get facesData() {
        return this._facesData;
    }
}