import bpy


for obj in bpy.data.objects:
    if obj.type != "MESH":
        continue
    points = [obj.matrix_world @ v.co for v in obj.data.vertices]
    mins = tuple(round(min(p[i] for p in points), 4) for i in range(3))
    maxs = tuple(round(max(p[i] for p in points), 4) for i in range(3))
    center = tuple(round(sum(p[i] for p in points) / len(points), 4) for i in range(3))
    print(obj.name, "min", mins, "max", maxs, "center", center)
