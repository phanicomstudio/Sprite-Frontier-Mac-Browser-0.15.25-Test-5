# 0.15.15 — stairs and landing recovery

This complete iteration corrects the real Screaming Head Low building collision cases reported in 0.15.14. The actual user-supplied 1459-triangle GLB is included as a portable regression fixture in assets/models/runtime/screaming-head-low/ with metadata. It does not replace bundled test maps.

Support now clips triangles against the complete player footprint instead of sampling nine points. This prevents uneven ledges from snapping feet into unsampled high spots. Vertical contact keeps a small separation. Already-overlapping contacts allow movement toward separation, while incoming swept wall collisions remain blocking. Step placement searches forward by at most one body radius, checks upward/head clearance and the raised horizontal path, then commits position and elevation together after other blockers pass.

Reduced stair meshes may encode treads as ramps. Supported slope limit is now 60 degrees; steeper surfaces remain blocking. Default automatic step height is 0.6 world units (editable in project parameters, maximum 1.5). Existing explicitly authored values remain respected. Scaling geometry does not scale the player or step-height setting. Larger steps may require jumping or a deliberately authored step-height value.

Validation: actual imported building stairs traversed using W and E; landing followed by continued movement at scales 1/1/1, .7/.7/.7, 1.5/1.5/1.5 and 1.3/.8/1. Physics source cases retain roof/ceiling/headroom, thin walls and transformed collision checks. See test-artifacts logs in source for current regression results.

Static model limitations remain: no deforming/moving-platform physics, no full PBR, NPC vertical stair/navigation is not implemented. Independent interaction zones and invisible events remain available. Native 0.15.14 startup is user-confirmed; 0.15.15 Windows and Mac native/browser platform checks remain unverified here. Browser download finalization remains an environment gate; prior exact exported Blob import verified serialization independently.
