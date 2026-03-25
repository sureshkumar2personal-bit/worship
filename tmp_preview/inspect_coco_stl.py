import bpy


bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.wm.stl_import(filepath="/home/seechan5/suresh/worship/Images/coco.stl")

for obj in bpy.data.objects:
    if obj.type != "MESH":
        continue
    print(
        obj.name,
        "dims",
        tuple(round(v, 4) for v in obj.dimensions),
        "verts",
        len(obj.data.vertices),
        "faces",
        len(obj.data.polygons),
    )
