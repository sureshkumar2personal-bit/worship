import bpy
import bmesh


for obj in bpy.data.objects:
    if obj.type != "MESH":
        continue

    bm = bmesh.new()
    bm.from_mesh(obj.data)
    bm.verts.ensure_lookup_table()

    unvisited = set(v.index for v in bm.verts)
    components = []

    while unvisited:
        start_index = next(iter(unvisited))
        stack = [bm.verts[start_index]]
        seen = set()
        while stack:
            vert = stack.pop()
            if vert.index in seen:
                continue
            seen.add(vert.index)
            if vert.index in unvisited:
                unvisited.remove(vert.index)
            for edge in vert.link_edges:
                other = edge.other_vert(vert)
                if other.index not in seen:
                    stack.append(other)
        components.append(sorted(seen))

    print(obj.name, "components", len(components))
    for index, comp in enumerate(sorted(components, key=len, reverse=True), start=1):
        pts = [obj.matrix_world @ bm.verts[i].co for i in comp]
        mins = tuple(round(min(p[i] for p in pts), 4) for i in range(3))
        maxs = tuple(round(max(p[i] for p in pts), 4) for i in range(3))
        center = tuple(round(sum(p[i] for p in pts) / len(pts), 4) for i in range(3))
        print("component", index, "verts", len(comp), "min", mins, "max", maxs, "center", center)

    bm.free()
