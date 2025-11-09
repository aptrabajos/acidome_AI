/**
 * Plots Generator - Generate technical drawings for beams, panels, and connectors
 *
 * This module generates technical drawings as:
 * - SVG (vector graphics)
 * - JSON (geometric data for custom rendering)
 *
 * Outputs can be used for:
 * - Preview in web browser
 * - 3D CAD software import
 * - Manufacturing/CNC
 * - PDF generation
 */

export interface PlotDimensions {
  width: number
  height: number
  padding: number
}

export interface SVGElement {
  type: 'line' | 'rect' | 'circle' | 'polygon' | 'text'
  x?: number
  y?: number
  x1?: number
  y1?: number
  x2?: number
  y2?: number
  width?: number
  height?: number
  r?: number
  points?: string
  text?: string
  stroke?: string
  fill?: string
  strokeWidth?: number
}

export interface PlotData {
  type: string      // 'beam', 'panel', 'connector'
  title: string
  dimensions: PlotDimensions
  scale: number
  elements: SVGElement[]
  svg: string       // SVG as string
  json: object      // Geometric data
}

/**
 * Generate technical drawing for a beam/strut
 */
export function generateBeamPlot(
  length: number,
  width: number,
  thickness: number,
  scale: number = 1
): PlotData {
  const padding = 20
  const scaledLength = (length / 1000) * scale * 100  // mm to cm to screen
  const scaledWidth = (width / 1000) * scale * 100
  const scaledThickness = (thickness / 1000) * scale * 100

  const plotWidth = scaledLength + padding * 2
  const plotHeight = Math.max(scaledWidth, scaledThickness) + padding * 2

  // Create SVG elements
  const elements: SVGElement[] = [
    // Main beam outline (top view)
    {
      type: 'rect',
      x: padding,
      y: padding,
      width: scaledLength,
      height: scaledWidth,
      stroke: 'black',
      fill: 'none',
      strokeWidth: 2,
    },
    // Dimension lines
    {
      type: 'line',
      x1: padding,
      y1: padding + scaledWidth + 10,
      x2: padding + scaledLength,
      y2: padding + scaledWidth + 10,
      stroke: 'red',
      strokeWidth: 1,
    },
    {
      type: 'line',
      x1: padding,
      y1: padding - 10,
      x2: padding,
      y2: padding + scaledWidth + 10,
      stroke: 'red',
      strokeWidth: 1,
    },
    // Dimension text
    {
      type: 'text',
      x: padding + scaledLength / 2,
      y: padding + scaledWidth + 20,
      text: `${length} mm`,
      stroke: 'red',
    },
  ]

  // Generate SVG string
  const svg = generateSVG({
    width: plotWidth,
    height: plotHeight,
    elements,
  })

  return {
    type: 'beam',
    title: `Beam/Strut ${length}mm × ${width}mm × ${thickness}mm`,
    dimensions: {
      width: plotWidth,
      height: plotHeight,
      padding,
    },
    scale,
    elements,
    svg,
    json: {
      type: 'beam',
      length,
      width,
      thickness,
      unit: 'mm',
      profile: 'rectangular',
      sections: [
        { axis: 'length', value: length },
        { axis: 'width', value: width },
        { axis: 'thickness', value: thickness },
      ],
    },
  }
}

/**
 * Generate technical drawing for a triangular panel
 */
export function generatePanelPlot(
  sideLength: number,
  scale: number = 1
): PlotData {
  const padding = 20
  // Equilateral triangle
  const scaledSide = (sideLength / 1000) * scale * 100  // mm to cm to screen
  const height = (scaledSide * Math.sqrt(3)) / 2

  const plotWidth = scaledSide + padding * 2
  const plotHeight = height + padding * 2

  // Triangle vertices
  const x1 = padding + scaledSide / 2
  const y1 = padding
  const x2 = padding
  const y2 = padding + height
  const x3 = padding + scaledSide
  const y3 = padding + height

  const elements: SVGElement[] = [
    // Triangle outline
    {
      type: 'polygon',
      points: `${x1},${y1} ${x2},${y2} ${x3},${y3}`,
      stroke: 'black',
      fill: 'none',
      strokeWidth: 2,
    },
    // Dimension lines
    {
      type: 'line',
      x1: x2,
      y1: y2 + 10,
      x2: x3,
      y2: y3 + 10,
      stroke: 'red',
      strokeWidth: 1,
    },
    // Dimension text
    {
      type: 'text',
      x: padding + scaledSide / 2,
      y: padding + height + 25,
      text: `${sideLength} mm`,
      stroke: 'red',
    },
  ]

  const svg = generateSVG({
    width: plotWidth,
    height: plotHeight,
    elements,
  })

  return {
    type: 'panel',
    title: `Triangular Panel ${sideLength}mm`,
    dimensions: {
      width: plotWidth,
      height: plotHeight,
      padding,
    },
    scale,
    elements,
    svg,
    json: {
      type: 'triangle',
      sideLength,
      height: Math.round(height * 10) / 10,
      area: Math.round(((sideLength * height) / 2) * 10) / 10,
      unit: 'mm',
      vertices: [
        { x: 0, y: 0 },
        { x: sideLength, y: 0 },
        { x: sideLength / 2, y: Math.round(height * 10) / 10 },
      ],
    },
  }
}

/**
 * Generate technical drawing for a connector node
 */
export function generateConnectorPlot(
  type: string,
  convergences: number,
  scale: number = 1
): PlotData {
  const padding = 20
  const radius = 30 * scale
  const plotSize = radius * 2 + padding * 2

  const elements: SVGElement[] = [
    // Central circle (connector body)
    {
      type: 'circle',
      x: padding + radius,
      y: padding + radius,
      r: radius,
      stroke: 'black',
      fill: 'lightgray',
      strokeWidth: 2,
    },
  ]

  // Draw connection points around circle
  const angleStep = (2 * Math.PI) / convergences
  for (let i = 0; i < convergences; i++) {
    const angle = angleStep * i
    const x = padding + radius + radius * Math.cos(angle)
    const y = padding + radius + radius * Math.sin(angle)

    elements.push({
      type: 'circle',
      x,
      y,
      r: 3,
      stroke: 'black',
      fill: 'black',
    })

    // Line from center to connection point
    elements.push({
      type: 'line',
      x1: padding + radius,
      y1: padding + radius,
      x2: x,
      y2: y,
      stroke: 'gray',
      strokeWidth: 1,
    })
  }

  // Type label
  elements.push({
    type: 'text',
    x: padding + radius,
    y: plotSize - 10,
    text: `${type} (${convergences}-way)`,
    stroke: 'black',
  })

  const svg = generateSVG({
    width: plotSize,
    height: plotSize,
    elements,
  })

  return {
    type: 'connector',
    title: `${type} Connector - ${convergences}-way`,
    dimensions: {
      width: plotSize,
      height: plotSize,
      padding,
    },
    scale,
    elements,
    svg,
    json: {
      type: 'connector',
      connectorType: type,
      convergences,
      angles: Array.from({ length: convergences }, (_, i) =>
        Math.round(((360 / convergences) * i) * 10) / 10
      ),
    },
  }
}

/**
 * Generate SVG string from elements
 */
function generateSVG(options: {
  width: number
  height: number
  elements: SVGElement[]
}): string {
  const { width, height, elements } = options

  let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">\n`
  svg += `  <rect width="${width}" height="${height}" fill="white" stroke="black" stroke-width="1"/>\n`

  for (const el of elements) {
    switch (el.type) {
      case 'line':
        svg += `  <line x1="${el.x1}" y1="${el.y1}" x2="${el.x2}" y2="${el.y2}" stroke="${el.stroke || 'black'}" stroke-width="${el.strokeWidth || 1}"/>\n`
        break
      case 'rect':
        svg += `  <rect x="${el.x}" y="${el.y}" width="${el.width}" height="${el.height}" stroke="${el.stroke || 'black'}" fill="${el.fill || 'none'}" stroke-width="${el.strokeWidth || 1}"/>\n`
        break
      case 'circle':
        svg += `  <circle cx="${el.x}" cy="${el.y}" r="${el.r}" stroke="${el.stroke || 'black'}" fill="${el.fill || 'none'}" stroke-width="${el.strokeWidth || 1}"/>\n`
        break
      case 'polygon':
        svg += `  <polygon points="${el.points}" stroke="${el.stroke || 'black'}" fill="${el.fill || 'none'}" stroke-width="${el.strokeWidth || 1}"/>\n`
        break
      case 'text':
        svg += `  <text x="${el.x}" y="${el.y}" font-size="12" fill="${el.stroke || 'black'}">${el.text}</text>\n`
        break
    }
  }

  svg += `</svg>`
  return svg
}

/**
 * Generate a complete assembly drawing (all components)
 */
export function generateAssemblyPlot(beams: number, panels: number, connectors: number, scale: number = 0.5): PlotData {
  const padding = 30
  const itemWidth = 150
  const itemHeight = 150
  const cols = 3
  const rows = Math.ceil((beams + panels + connectors) / cols)

  const plotWidth = itemWidth * cols + padding * 2
  const plotHeight = itemHeight * rows + padding * 2

  const elements: SVGElement[] = [
    // Title
    {
      type: 'text',
      x: padding,
      y: padding / 2,
      text: `Assembly Drawing (Beams: ${beams}, Panels: ${panels}, Connectors: ${connectors})`,
      stroke: 'black',
    },
  ]

  const svg = generateSVG({
    width: plotWidth,
    height: plotHeight,
    elements,
  })

  return {
    type: 'assembly',
    title: 'Assembly Drawing',
    dimensions: {
      width: plotWidth,
      height: plotHeight,
      padding,
    },
    scale,
    elements,
    svg,
    json: {
      type: 'assembly',
      components: {
        beams,
        panels,
        connectors,
      },
      layout: {
        columns: cols,
        rows,
      },
    },
  }
}
