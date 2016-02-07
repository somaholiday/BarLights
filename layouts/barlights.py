#!/usr/bin/env python

spacing = 0.15
row_height = 1.2
lines = []
for r in range(3):
  pixel_count = 0
  for c in range(-14, 15):
    x, y, z = -c*spacing, r*row_height, 0
    lines.append('  {"point": [%.2f, %.2f, %.2f]}' % (x, y, z))
    pixel_count = pixel_count + 1

  for d in range(pixel_count, 64):
    lines.append('  {"point": [%.2f, %.2f, %.2f]}' % (999, 999, 999))

print '[\n' + ',\n'.join(lines) + '\n]'
