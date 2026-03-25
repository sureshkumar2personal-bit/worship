import bpy


SOURCE_PATH = "/home/seechan5/suresh/worship/Images/coco.stl"
OUTPUT_PATH = "/home/seechan5/suresh/worship/public/Images/coco_half.glb"


bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.wm.stl_import(filepath=SOURCE_PATH)

for obj in bpy.data.objects:
    if obj.type == "MESH":
        bpy.context.view_layer.objects.active = obj
        obj.select_set(True)
        bpy.ops.object.shade_smooth()

bpy.ops.export_scene.gltf(
    filepath=OUTPUT_PATH,
    export_format="GLB",
    use_selection=False,
)

print(f"Exported {OUTPUT_PATH}")
