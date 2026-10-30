/* October 29, 2026: shared gameplay surface traversal extracted from the retained October 14 authoring implementation. Runtime exports must not depend on the excluded prop editor. */
(/* @function placementSurface.install — Inputs: browser namespace. Publishes a read-only on-demand room/model/terrain ray query. No per-frame traversal, authored mutation or background work. */ function(root){

/* @function placementSurface.surface1525 — Inputs: normalized world ray and live game. Returns nearest real surface with XYZ metres, viewer-facing unit normal and distance, or null. Traverses triangles only on explicit placement; bounded terrain sampling prevents infinite rays. Uses the locked render camera; exceptions leave inventory untouched. */
    function surface1525(ray, game) {

      let nearest = null;

      for (const face of root.FrontierAuthorView?.faces(
        game,
        root.FrontierRender.camera(game),
        root.FrontierInterior.data(game.sourceWorld)?.faces || [],
      ) ||
        root.FrontierInterior.data(game.sourceWorld)?.faces ||
        []) {

        for (let i = 1; i < face.points.length - 1; i++) {

          const distance = root.FrontierModelScene.rayTriangle(
            ray.origin,
            ray.direction,
            [face.points[0], face.points[i], face.points[i + 1]],
          );

          if (
            distance === null ||
            distance < 0.01 ||
            (nearest && distance >= nearest.distance)
          )
            continue;

          const a = face.points[0],
            b = face.points[i],
            c = face.points[i + 1],
            u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]],
            v = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];

          const normal = [
              u[1] * v[2] - u[2] * v[1],
              u[2] * v[0] - u[0] * v[2],
              u[0] * v[1] - u[1] * v[0],
            ],
            length = Math.hypot(...normal);

          if (length < 1e-8) continue;

          const facing =
            normal[0] * ray.direction[0] +
              normal[1] * ray.direction[1] +
              normal[2] * ray.direction[2] >
            0
              ? -1
              : 1;

          for (let k = 0; k < 3; k++) normal[k] = (normal[k] / length) * facing;

          nearest = {

            distance,
            normal,
            parentId: face.id,
            point: ray.origin.map(
              /* @function propEditor.surfacePoint — Inputs: ray-origin component and axis. Returns: world intersection component. No mutation. */ function (
                value,
                k,
              ) {

                return value + ray.direction[k] * distance;


          },
            ),

        };


      }


    }

      // Imported surfaces are traversed only on placement clicks. Their real
      // triangle normals and shared transforms govern the fit, never bounds.
      for (const host of game.sourceWorld.events || []) {

        if (host.spatial?.visual !== "model") continue;

        const model = root.FrontierModelLibrary.get(host.spatial.modelId);

        if (!model?.scene) continue;

        const elevation =
          root.FrontierTerrain.height(game.sourceWorld, host.x, host.y) +
          (host.heightOffset ?? (host.elevation || 0) * 0.3);

        const matrix = root.FrontierModelEvents.matrix({

          ...host,
          z: elevation,

      });

        root.FrontierModelScene.triangles(
          model,
          model.scene,
          matrix,
          /* @function propEditor.importedSurface — Inputs: world-space triangle points. Returns: nothing. Retains closest real model hit and viewer-facing unit normal for placement. Runs on author clicks only; does not change model data or allocate a render cache. */ function (
            points,
          ) {

            const distance = root.FrontierModelScene.rayTriangle(
              ray.origin,
              ray.direction,
              points,
            );

            if (
              distance === null ||
              distance < 0.01 ||
              (nearest && distance >= nearest.distance)
            )
              return;

            const a = points[0],
              b = points[1],
              c = points[2],
              ux = b[0] - a[0],
              uy = b[1] - a[1],
              uz = b[2] - a[2],
              vx = c[0] - a[0],
              vy = c[1] - a[1],
              vz = c[2] - a[2],
              normal = [
                uy * vz - uz * vy,
                uz * vx - ux * vz,
                ux * vy - uy * vx,
              ],
              length = Math.hypot(...normal);

            if (length < 1e-8) return;

            const facing =
              normal[0] * ray.direction[0] +
                normal[1] * ray.direction[1] +
                normal[2] * ray.direction[2] >
              0
                ? -1
                : 1;

            for (let i = 0; i < 3; i++) normal[i] *= facing / length;

            const point = [];

            for (let i = 0; i < 3; i++)
              point.push(ray.origin[i] + ray.direction[i] * distance);

            nearest = {

              distance,
              normal,
              parentId: host.id,
              parentKind: "model",
              point,

        };


      },
        );


    }

      // Outdoor terrain is sampled with a bounded bracket and then bisected.
      // Interior holes do not fall back to an invisible terrain placement plane.
      if ((!game.sourceWorld.interior || game.sourceWorld.interior.outdoor) && ray.direction[2] < 0) {

        let previous = 0.01;

        for (
          let distance = 0.5;
          distance < Math.min(nearest?.distance || 100, 100);
          distance += 0.5
        ) {

          const x = ray.origin[0] + ray.direction[0] * distance,
            y = ray.origin[1] + ray.direction[1] * distance,
            z = ray.origin[2] + ray.direction[2] * distance;

          if (
            x < 0.5 ||
            y < 0.5 ||
            x > game.sourceWorld.width - 0.5 ||
            y > game.sourceWorld.height - 0.5
          ) {

            previous = distance;

            continue;


        }

          if (z > root.FrontierTerrain.height(game.sourceWorld, x, y)) {

            previous = distance;

            continue;


        }

          let low = previous,
            high = distance;

          for (let i = 0; i < 20; i++) {

            const middle = (low + high) / 2,
              mx = ray.origin[0] + ray.direction[0] * middle,
              my = ray.origin[1] + ray.direction[1] * middle,
              mz = ray.origin[2] + ray.direction[2] * middle;

            if (mz > root.FrontierTerrain.height(game.sourceWorld, mx, my))
              low = middle;

            else high = middle;


        }

          const point = [];

          for (let i = 0; i < 3; i++)
            point.push(ray.origin[i] + ray.direction[i] * high);

          nearest = {

            distance: high,
            normal: [0, 0, 1],
            parentId: null,
            parentKind: "terrain",
            point,

        };

          break;


      }


    }

      return nearest;


  }

root.FrontierPlacementSurface={
    surface:surface1525
  };


})(window);
