import bpy
import bmesh
from mathutils import Vector


SOURCE_PATH = "/home/seechan5/Downloads/bell2.stl"
OUTPUT_PATH = "/home/seechan5/suresh/worship/bell2_right_side.stl"


def find_target_component_indices(obj):
    bm = bmesh.new()
    bm.from_mesh(obj.data)
    bm.verts.ensure_lookup_table()
    bm.faces.ensure_lookup_table()

    unvisited = set(v.index for v in bm.verts)
    target = None

    while unvisited:
        start_index = next(iter(unvisited))
        stack = [bm.verts[start_index]]
        seen = set()
        face_indices = set()

        while stack:
            vert = stack.pop()
            if vert.index in seen:
                continue
            seen.add(vert.index)
            unvisited.discard(vert.index)
            for face in vert.link_faces:
                face_indices.add(face.index)
            for edge in vert.link_edges:
                other = edge.other_vert(vert)
                if other.index not in seen:
                    stack.append(other)

        points = [obj.matrix_world @ bm.verts[i].co for i in seen]
        center = Vector(
            (
                sum(p.x for p in points) / len(points),
                sum(p.y for p in points) / len(points),
                sum(p.z for p in points) / len(points),
            )
        )

        # The decorative head is the small loose component at the very top.
        if len(seen) == 15 and center.z > 1.8:
            target = (sorted(seen), sorted(face_indices))
            break

    bm.free()
    if target is None:
        raise RuntimeError("Could not find the top decorative component to mirror.")
    return target


def mirror_component_to_opposite_side(obj):
    mesh = obj.data
    bm = bmesh.new()
    bm.from_mesh(mesh)
    bm.verts.ensure_lookup_table()
    bm.faces.ensure_lookup_table()

    vert_indices, face_indices = find_target_component_indices(obj)

    original_verts = [bm.verts[i] for i in vert_indices]
    original_faces = [bm.faces[i] for i in face_indices]

    dup_geom = bmesh.ops.duplicate(bm, geom=original_verts + original_faces)["geom"]
    dup_verts = [elem for elem in dup_geom if isinstance(elem, bmesh.types.BMVert)]
    dup_faces = [elem for elem in dup_geom if isinstance(elem, bmesh.types.BMFace)]

    for vert in dup_verts:
        vert.co.y *= -1.0

    for face in dup_faces:
        face.normal_update()
        face.normal_flip()

    bm.normal_update()
    bm.to_mesh(mesh)
    mesh.update()
    bm.free()


bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.wm.stl_import(filepath=SOURCE_PATH)

mesh_objects = [obj for obj in bpy.data.objects if obj.type == "MESH"]
for obj in list(mesh_objects):
    if obj.name != "bell2":
        bpy.data.objects.remove(obj, do_unlink=True)

target = bpy.data.objects["bell2"]
mirror_component_to_opposite_side(target)

bpy.ops.object.select_all(action="DESELECT")
target.select_set(True)
bpy.context.view_layer.objects.active = target
bpy.ops.wm.stl_export(filepath=OUTPUT_PATH, export_selected_objects=True)

print(f"Exported {OUTPUT_PATH}")
