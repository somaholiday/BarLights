#!/usr/bin/env python

spacing = 0.1
row_height = 0.5
lines = []
for r in range(3):
  for c in range(-14, 15):
    x, y, z = -c*spacing, r*row_height, 0
    lines.append('  {"point": [%.2f, %.2f, %.2f]}' % (x, y, z))
print '[\n' + ',\n'.join(lines) + '\n]'
